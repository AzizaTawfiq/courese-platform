import { BookingStatus, Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { cacheService } from '../../services/cache.service.js';
import { AuthError } from '../auth/auth.service.js';

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
    category: {
      isActive: true,
      program: {
        isActive: true,
        ...(filters.programSlug ? { slug: filters.programSlug } : {}),
      },
    },
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
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

const serializeAdminCourse = (
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
    seoKeywordsAr: string | null;
    seoKeywordsEn: string | null;
    updatedAt: Date;
    isActive: boolean;
    category: {
      nameAr: string;
      nameEn: string;
      program: {
        id: string;
        nameAr: string;
        nameEn: string;
      };
    };
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
  seoKeywordsAr: course.seoKeywordsAr,
  seoKeywordsEn: course.seoKeywordsEn,
  updatedAt: course.updatedAt.toISOString(),
  programId: course.category.program.id,
  programNameAr: course.category.program.nameAr,
  programNameEn: course.category.program.nameEn,
  categoryNameAr: course.category.nameAr,
  categoryNameEn: course.category.nameEn,
  scheduleCount: course.schedules.length,
  isActive: course.isActive,
});

const invalidateCourseCaches = async (slugs: string[]) => {
  await Promise.all([
    cacheService.invalidatePrefix('cache:list:courses:'),
    cacheService.del('cache:sitemap'),
    ...slugs.map((slug) => cacheService.del(`cache:entity:course:${slug}`)),
  ]);
};

export const listAdminCourses = async () => {
  const courses = await prisma.course.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      category: {
        include: {
          program: true,
        },
      },
      schedules: {
        select: { id: true },
      },
    },
  });

  return {
    data: courses.map(serializeAdminCourse),
    total: courses.length,
  };
};

export const getAdminCourseById = async (id: string) => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      category: {
        include: {
          program: true,
        },
      },
      schedules: {
        select: { id: true },
      },
    },
  });

  if (!course) {
    throw new AuthError('Course not found.', 404);
  }

  return serializeAdminCourse(course);
};

type CoursePayload = {
  categoryId: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  durationHours: number;
  price: number;
  currency: string;
  seoTitleAr: string;
  seoTitleEn: string;
  seoDescAr: string;
  seoDescEn: string;
  seoKeywordsAr?: string;
  seoKeywordsEn?: string;
  isActive?: boolean;
};

export const createCourse = async (payload: CoursePayload) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
    select: { id: true },
  });

  if (!category) {
    throw new AuthError('Category not found.', 404);
  }

  const course = await prisma.course.create({
    data: {
      ...payload,
      price: new Prisma.Decimal(payload.price),
      seoKeywordsAr: payload.seoKeywordsAr || null,
      seoKeywordsEn: payload.seoKeywordsEn || null,
      isActive: payload.isActive ?? true,
    },
    include: {
      category: {
        include: {
          program: true,
        },
      },
      schedules: {
        select: { id: true },
      },
    },
  });

  await invalidateCourseCaches([course.slug]);

  return serializeAdminCourse(course);
};

export const updateCourse = async (id: string, payload: CoursePayload) => {
  const existingCourse = await prisma.course.findUnique({
    where: { id },
  });

  if (!existingCourse) {
    throw new AuthError('Course not found.', 404);
  }

  const course = await prisma.$transaction(async (tx) => {
    const updatedCourse = await tx.course.update({
      where: { id },
      data: {
        ...payload,
        price: new Prisma.Decimal(payload.price),
        seoKeywordsAr: payload.seoKeywordsAr || null,
        seoKeywordsEn: payload.seoKeywordsEn || null,
        isActive: payload.isActive ?? existingCourse.isActive,
      },
      include: {
        category: {
          include: {
            program: true,
          },
        },
        schedules: {
          select: { id: true },
        },
      },
    });

    if (existingCourse.slug !== updatedCourse.slug) {
      await tx.slugRedirect.upsert({
        where: {
          oldSlug_entityType: {
            oldSlug: existingCourse.slug,
            entityType: 'course',
          },
        },
        update: {
          newSlug: updatedCourse.slug,
          entityId: updatedCourse.id,
        },
        create: {
          oldSlug: existingCourse.slug,
          newSlug: updatedCourse.slug,
          entityType: 'course',
          entityId: updatedCourse.id,
        },
      });
    }

    return updatedCourse;
  });

  await invalidateCourseCaches([existingCourse.slug, course.slug]);

  return serializeAdminCourse(course);
};

export const deleteCourse = async (id: string, confirm: boolean) => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      schedules: {
        include: {
          bookings: {
            where: {
              status: BookingStatus.CONFIRMED,
            },
            select: { id: true },
          },
        },
      },
    },
  });

  if (!course) {
    throw new AuthError('Course not found.', 404);
  }

  const activeBookings = course.schedules.reduce(
    (count, schedule) => count + schedule.bookings.length,
    0,
  );

  if (activeBookings > 0 && !confirm) {
    throw new AuthError(
      `This course has ${activeBookings} active booking(s). Pass confirm=true to proceed.`,
      409,
    );
  }

  await prisma.course.delete({
    where: { id },
  });

  await invalidateCourseCaches([course.slug]);
};
