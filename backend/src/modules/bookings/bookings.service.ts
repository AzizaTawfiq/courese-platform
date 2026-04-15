import { BookingStatus, Prisma, type Role } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { AuthError } from '../auth/auth.service.js';

const bookingInclude = {
  purchase: true,
  schedule: {
    include: {
      course: true,
    },
  },
} satisfies Prisma.BookingInclude;

const serializeBooking = (
  booking: Prisma.BookingGetPayload<{ include: typeof bookingInclude }>,
) => ({
  id: booking.id,
  reference: booking.reference,
  status: booking.status,
  courseNameAr: booking.schedule.course.nameAr,
  courseNameEn: booking.schedule.course.nameEn,
  scheduleStartDate: booking.schedule.startDate.toISOString(),
  scheduleEndDate: booking.schedule.endDate.toISOString(),
  amount: booking.purchase.amount.toString(),
  currency: booking.purchase.currency,
  createdAt: booking.createdAt.toISOString(),
});

export const listCustomerBookings = async (userId: string) => {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: bookingInclude,
    orderBy: { createdAt: 'desc' },
  });

  return {
    data: bookings.map(serializeBooking),
    total: bookings.length,
  };
};

export const getBookingByReference = async (
  reference: string,
  userId: string,
  role: Role | string,
) => {
  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: bookingInclude,
  });

  if (!booking) {
    throw new AuthError('Booking not found.', 404);
  }

  if (role === 'CUSTOMER' && booking.userId !== userId) {
    throw new AuthError('Forbidden', 403);
  }

  return serializeBooking(booking);
};

type AdminBookingFilters = {
  scheduleId?: string;
  status?: BookingStatus;
  page: number;
  limit: number;
};

export const listAdminBookings = async (filters: AdminBookingFilters) => {
  const where: Prisma.BookingWhereInput = {
    ...(filters.scheduleId ? { scheduleId: filters.scheduleId } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  };

  const [total, bookings] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      include: {
        ...bookingInclude,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            companyName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    }),
  ]);

  return {
    data: bookings.map((booking) => ({
      ...serializeBooking(booking),
      user: booking.user,
    })),
    total,
    page: filters.page,
    limit: filters.limit,
  };
};

export const cancelBooking = async (id: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!booking) {
    throw new AuthError('Booking not found.', 404);
  }

  if (booking.status !== BookingStatus.CANCELLED) {
    await prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
  }

  return { status: BookingStatus.CANCELLED };
};
