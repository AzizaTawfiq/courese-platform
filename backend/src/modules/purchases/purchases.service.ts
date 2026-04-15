import {
  BookingStatus,
  Prisma,
  PurchaseStatus,
} from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { AuthError } from '../auth/auth.service.js';

const PAYMENT_WEBHOOK_SECRET =
  process.env.PAYMENT_WEBHOOK_SECRET ?? 'dev-webhook-secret';

const createPaymentIntent = (purchaseId: string) =>
  `pi_${purchaseId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20)}_secret_dev`;

const createBookingReference = async (tx: Prisma.TransactionClient = prisma) => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const dateStamp = `${year}${month}${day}`;
  const startOfDay = new Date(Date.UTC(year, now.getUTCMonth(), now.getUTCDate()));
  const endOfDay = new Date(
    Date.UTC(year, now.getUTCMonth(), now.getUTCDate() + 1),
  );
  const count = await tx.booking.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });

  return `BK-${dateStamp}-${String(count + 1).padStart(4, '0')}`;
};

const isUniqueConstraintError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2002';

export const verifyWebhookSignature = (signature: string | undefined) => {
  if (!signature || signature !== PAYMENT_WEBHOOK_SECRET) {
    throw new AuthError('Invalid webhook signature.', 401);
  }
};

export const createPurchase = async (userId: string, scheduleId: string) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      course: {
        include: {
          category: {
            include: {
              program: true,
            },
          },
        },
      },
      bookings: {
        where: {
          status: BookingStatus.CONFIRMED,
        },
        select: { id: true, userId: true },
      },
    },
  });

  if (
    !schedule ||
    !schedule.isActive ||
    !schedule.course.isActive ||
    !schedule.course.category.isActive ||
    !schedule.course.category.program.isActive
  ) {
    throw new AuthError('Schedule not found.', 404);
  }

  const confirmedBookings = schedule.bookings.length;
  if (confirmedBookings >= schedule.maxCapacity) {
    throw new AuthError('Schedule is fully booked.', 409);
  }

  const existingBooking = await prisma.booking.findFirst({
    where: {
      userId,
      scheduleId,
      status: BookingStatus.CONFIRMED,
    },
    select: { id: true },
  });

  if (existingBooking) {
    throw new AuthError(
      'You already have a confirmed booking for this schedule.',
      409,
    );
  }

  const purchase = await prisma.purchase.create({
    data: {
      userId,
      scheduleId,
      amount: schedule.course.price,
      currency: schedule.course.currency,
      status: PurchaseStatus.PENDING,
    },
  });

  const paymentIntent = createPaymentIntent(purchase.id);
  await prisma.purchase.update({
    where: { id: purchase.id },
    data: {
      paymentRef: paymentIntent,
    },
  });

  return {
    purchaseId: purchase.id,
    amount: purchase.amount.toString(),
    currency: purchase.currency,
    status: purchase.status,
    paymentIntent,
  };
};

export const processPurchaseWebhook = async (
  purchaseId: string,
  status: 'success' | 'failure',
) => {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: {
      booking: true,
      schedule: {
        include: {
          bookings: {
            where: { status: BookingStatus.CONFIRMED },
            select: { id: true },
          },
        },
      },
    },
  });

  if (!purchase) {
    throw new AuthError('Purchase not found.', 404);
  }

  if (status === 'failure') {
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { status: PurchaseStatus.FAILED },
    });

    return { received: true, reference: null };
  }

  if (purchase.booking) {
    if (purchase.status !== PurchaseStatus.PAID) {
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: PurchaseStatus.PAID },
      });
    }

    return { received: true, reference: purchase.booking.reference };
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const result = await prisma.$transaction(
        async (tx) => {
          const freshPurchase = await tx.purchase.findUnique({
            where: { id: purchase.id },
            include: {
              booking: true,
            },
          });

          if (!freshPurchase) {
            throw new AuthError('Purchase not found.', 404);
          }

          if (freshPurchase.booking) {
            if (freshPurchase.status !== PurchaseStatus.PAID) {
              await tx.purchase.update({
                where: { id: freshPurchase.id },
                data: { status: PurchaseStatus.PAID },
              });
            }

            return { received: true, reference: freshPurchase.booking.reference };
          }

          const [confirmedSeats, existingConfirmedBooking] = await Promise.all([
            tx.booking.count({
              where: {
                scheduleId: freshPurchase.scheduleId,
                status: BookingStatus.CONFIRMED,
              },
            }),
            tx.booking.findFirst({
              where: {
                userId: freshPurchase.userId,
                scheduleId: freshPurchase.scheduleId,
                status: BookingStatus.CONFIRMED,
              },
              select: { reference: true },
            }),
          ]);

          if (existingConfirmedBooking) {
            await tx.purchase.update({
              where: { id: freshPurchase.id },
              data: { status: PurchaseStatus.FAILED },
            });

            throw new AuthError(
              'You already have a confirmed booking for this schedule.',
              409,
            );
          }

          const freshSchedule = await tx.schedule.findUnique({
            where: { id: freshPurchase.scheduleId },
            select: { maxCapacity: true, isActive: true },
          });

          if (!freshSchedule || !freshSchedule.isActive) {
            throw new AuthError('Schedule not found.', 404);
          }

          if (confirmedSeats >= freshSchedule.maxCapacity) {
            throw new AuthError('Schedule is fully booked.', 409);
          }

          const reference = await createBookingReference(tx);

          await tx.purchase.update({
            where: { id: freshPurchase.id },
            data: { status: PurchaseStatus.PAID },
          });

          await tx.booking.create({
            data: {
              userId: freshPurchase.userId,
              scheduleId: freshPurchase.scheduleId,
              purchaseId: freshPurchase.id,
              reference,
              status: BookingStatus.CONFIRMED,
            },
          });

          return { received: true, reference };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );

      return result;
    } catch (error) {
      if (isUniqueConstraintError(error) && attempt < 2) {
        continue;
      }

      throw error;
    }
  }

  throw new AuthError('Could not confirm booking.', 409);
};

export const confirmPurchaseForUser = async (
  userId: string,
  purchaseId: string,
  status: 'success' | 'failure',
) => {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!purchase) {
    throw new AuthError('Purchase not found.', 404);
  }

  if (purchase.userId !== userId) {
    throw new AuthError('Forbidden', 403);
  }

  return processPurchaseWebhook(purchaseId, status);
};
