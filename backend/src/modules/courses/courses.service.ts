import { BookingStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { cacheService } from '../../services/cache.service.js';

const CACHE_TTL_SECONDS = 60 * 5;

type ListCourseFilters = {
  categoryId?: string;
  programSlug?: string;
  page: number;
  limit: number;
};

const serializeCourse = (
  course: {
    id: string;
    slug: string;
    categoryId: string;
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
    durationHours: number;
    price: { toString(): string };
    currency: string;
    seoTitleAr: string;
    seoTitleEn: string;
    seoDescAr: string;
    seoDescEn: string;
    updatedAt: Date;
    schedules: Array<{ id: string }>;
  },
) => ({
  id: course.id,
  slug: course.slug,
  categoryId: course.categoryId,
  nameAr: course.nameAr,
  nameEn: course.nameEn,
  descriptionAr: course.descriptionAr,
  descriptionEn: course.descriptionEn,
  durationHours: course.durationHours,
  price: course.price.toString(),
  currency: course.currency,
  seoTitleAr: course.seoTitleAr,
  seoTitleEn: course.seoTitleEn,
  seoDescAr: course.seoDescAr,
  seoDescEn: course.seoDescEn,
  updatedAt: course.updatedAt.toISOString(),
  upcomingScheduleCount: course.schedules.length,
});

export const listCourses = async (filters: ListCourseFilters) => {
  const cacheKey = `cache:list:courses:${filters.categoryId ?? 'all'}:${filters.programSlug ?? 'all'}:${filters.page}:${filters.limit}`;
  const cached = await cacheService.get<{
    data: ReturnType<typeof serializeCourse>[];
    total: number;
    page: number;
    limit: number;
  }>(cacheKey);

  if (cached) {
    return cached;
  }

  const where = {
    isActive: true,
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(filters.programSlug
      ? { category: { program: { slug: filters.programSlug, isActive: true } } }
      : {}),
  };

  const [total, courses] = await Promise.all([
    prisma.course.count({ where }),
    prisma.course.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
      include: {
        schedules: {
          where: { isActive: true },
          select: { id: true },
        },
      },
    }),
  ]);

  const payload = {
    data: courses.map(serializeCourse),
    total,
    page: filters.page,
    limit: filters.limit,
  };

  await cacheService.set(cacheKey, payload, CACHE_TTL_SECONDS);

  return payload;
};

export const getCourseBySlug = async (slug: string) => {
  const cacheKey = `cache:entity:course:${slug}`;
  const cached = await cacheService.get<{
    type: 'course';
    data: {
      id: string;
      slug: string;
      categoryId: string;
      nameAr: string;
      nameEn: string;
      descriptionAr: string;
      descriptionEn: string;
      durationHours: number;
      price: string;
      currency: string;
      seoTitleAr: string;
      seoTitleEn: string;
      seoDescAr: string;
      seoDescEn: string;
      updatedAt: string;
      category: {
        id: string;
        nameAr: string;
        nameEn: string;
        program: {
          slug: string;
          nameAr: string;
          nameEn: string;
        };
      };
      schedules: Array<{
        id: string;
        startDate: string;
        endDate: string;
        location: string | null;
        maxCapacity: number;
        confirmedBookings: number;
        availableSeats: number;
      }>;
    };
  }>(cacheKey);

  if (cached) {
    return cached;
  }

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      category: {
        include: {
          program: {
            select: {
              slug: true,
              nameAr: true,
              nameEn: true,
              isActive: true,
            },
          },
        },
      },
      schedules: {
        where: { isActive: true },
        orderBy: { startDate: 'asc' },
        include: {
          bookings: {
            where: { status: BookingStatus.CONFIRMED },
            select: { id: true },
          },
        },
      },
    },
  });

  if (
    !course ||
    !course.isActive ||
    !course.category.isActive ||
    !course.category.program.isActive
  ) {
    const redirect = await prisma.slugRedirect.findUnique({
      where: {
        oldSlug_entityType: {
          oldSlug: slug,
          entityType: 'course',
        },
      },
    });

    if (redirect) {
      return {
        type: 'redirect' as const,
        statusCode: 301,
        newSlug: redirect.newSlug,
        location: `/api/v1/courses/${redirect.newSlug}`,
      };
    }

    return null;
  }

  const payload = {
    type: 'course' as const,
    data: {
      id: course.id,
      slug: course.slug,
      categoryId: course.categoryId,
      nameAr: course.nameAr,
      nameEn: course.nameEn,
      descriptionAr: course.descriptionAr,
      descriptionEn: course.descriptionEn,
      durationHours: course.durationHours,
      price: course.price.toString(),
      currency: course.currency,
      seoTitleAr: course.seoTitleAr,
      seoTitleEn: course.seoTitleEn,
      seoDescAr: course.seoDescAr,
      seoDescEn: course.seoDescEn,
      updatedAt: course.updatedAt.toISOString(),
      category: {
        id: course.category.id,
        nameAr: course.category.nameAr,
        nameEn: course.category.nameEn,
        program: {
          slug: course.category.program.slug,
          nameAr: course.category.program.nameAr,
          nameEn: course.category.program.nameEn,
        },
      },
      schedules: course.schedules.map((schedule) => {
        const confirmedBookings = schedule.bookings.length;
        return {
          id: schedule.id,
          startDate: schedule.startDate.toISOString(),
          endDate: schedule.endDate.toISOString(),
          location: schedule.location,
          maxCapacity: schedule.maxCapacity,
          confirmedBookings,
          availableSeats: Math.max(
            schedule.maxCapacity - confirmedBookings,
            0,
          ),
        };
      }),
    },
  };

  await cacheService.set(cacheKey, payload, CACHE_TTL_SECONDS);

  return payload;
};
