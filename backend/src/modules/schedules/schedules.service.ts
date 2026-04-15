import { BookingStatus, Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { cacheService } from '../../services/cache.service.js';
import { AuthError } from '../auth/auth.service.js';

const invalidateScheduleCaches = async (courseSlug: string) => {
  await Promise.all([
    cacheService.del(`cache:entity:course:${courseSlug}`),
    cacheService.invalidatePrefix('cache:list:courses:'),
    cacheService.del('cache:sitemap'),
  ]);
};

const serializeSchedule = (
  schedule: Prisma.ScheduleGetPayload<{
    include: {
      course: true;
      bookings: {
        select: {
          id: true;
        };
      };
    };
  }>,
) => {
  const confirmedBookings = schedule.bookings.length;
  return {
    id: schedule.id,
    courseId: schedule.courseId,
    courseNameEn: schedule.course.nameEn,
    courseNameAr: schedule.course.nameAr,
    startDate: schedule.startDate.toISOString(),
    endDate: schedule.endDate.toISOString(),
    location: schedule.location,
    maxCapacity: schedule.maxCapacity,
    confirmedBookings,
    availableSeats: Math.max(schedule.maxCapacity - confirmedBookings, 0),
    isActive: schedule.isActive,
  };
};

type SchedulePayload = {
  courseId: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  maxCapacity: number;
  isActive?: boolean;
};

export const listAdminSchedules = async (filters: {
  courseId?: string;
  from?: string;
  to?: string;
}) => {
  const schedules = await prisma.schedule.findMany({
    where: {
      ...(filters.courseId ? { courseId: filters.courseId } : {}),
      ...(filters.from || filters.to
        ? {
            startDate: {
              ...(filters.from ? { gte: new Date(filters.from) } : {}),
              ...(filters.to ? { lte: new Date(filters.to) } : {}),
            },
          }
        : {}),
    },
    orderBy: { startDate: 'asc' },
    include: {
      course: true,
      bookings: {
        where: { status: BookingStatus.CONFIRMED },
        select: { id: true },
      },
    },
  });

  return {
    data: schedules.map(serializeSchedule),
  };
};

export const createSchedule = async (payload: SchedulePayload) => {
  const course = await prisma.course.findUnique({
    where: { id: payload.courseId },
    select: { id: true, slug: true },
  });

  if (!course) {
    throw new AuthError('Course not found.', 404);
  }

  const schedule = await prisma.schedule.create({
    data: {
      courseId: payload.courseId,
      startDate: payload.startDate,
      endDate: payload.endDate,
      location: payload.location || null,
      maxCapacity: payload.maxCapacity,
      isActive: payload.isActive ?? true,
    },
    include: {
      course: true,
      bookings: {
        where: { status: BookingStatus.CONFIRMED },
        select: { id: true },
      },
    },
  });

  await invalidateScheduleCaches(course.slug);

  return serializeSchedule(schedule);
};

export const updateSchedule = async (id: string, payload: SchedulePayload) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: {
      course: {
        select: { slug: true },
      },
      bookings: {
        where: { status: BookingStatus.CONFIRMED },
        select: { id: true },
      },
    },
  });

  if (!schedule) {
    throw new AuthError('Schedule not found.', 404);
  }

  if (payload.maxCapacity < schedule.bookings.length) {
    throw new AuthError(
      'Max capacity cannot be lower than confirmed bookings.',
      422,
    );
  }

  const updatedSchedule = await prisma.schedule.update({
    where: { id },
    data: {
      courseId: payload.courseId,
      startDate: payload.startDate,
      endDate: payload.endDate,
      location: payload.location || null,
      maxCapacity: payload.maxCapacity,
      isActive: payload.isActive ?? schedule.isActive,
    },
    include: {
      course: true,
      bookings: {
        where: { status: BookingStatus.CONFIRMED },
        select: { id: true },
      },
    },
  });

  await invalidateScheduleCaches(schedule.course.slug);
  if (schedule.course.slug !== updatedSchedule.course.slug) {
    await invalidateScheduleCaches(updatedSchedule.course.slug);
  }

  return serializeSchedule(updatedSchedule);
};

export const deleteSchedule = async (id: string, confirm: boolean) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: {
      course: {
        select: { slug: true },
      },
      bookings: {
        where: { status: BookingStatus.CONFIRMED },
        select: { id: true },
      },
    },
  });

  if (!schedule) {
    throw new AuthError('Schedule not found.', 404);
  }

  if (schedule.bookings.length > 0 && !confirm) {
    throw new AuthError(
      `Schedule has ${schedule.bookings.length} confirmed booking(s). Pass confirm=true to proceed.`,
      409,
    );
  }

  await prisma.schedule.delete({
    where: { id },
  });

  await invalidateScheduleCaches(schedule.course.slug);
};
