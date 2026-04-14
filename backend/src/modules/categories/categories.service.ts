import { prisma } from '../../lib/prisma.js';
import { cacheService } from '../../services/cache.service.js';

const CACHE_TTL_SECONDS = 60 * 5;

const serializeCategory = (
  category: {
    id: string;
    programId: string;
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
    updatedAt: Date;
    courses: Array<{ id: string }>;
  },
) => ({
  id: category.id,
  programId: category.programId,
  nameAr: category.nameAr,
  nameEn: category.nameEn,
  descriptionAr: category.descriptionAr,
  descriptionEn: category.descriptionEn,
  updatedAt: category.updatedAt.toISOString(),
  courseCount: category.courses.length,
});

const serializeCategoryCourse = (
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

export const listCategories = async (programSlug: string) => {
  const cacheKey = `cache:list:categories:${programSlug}`;
  const cached = await cacheService.get<{
    data: ReturnType<typeof serializeCategory>[];
    total: number;
  }>(cacheKey);

  if (cached) {
    return cached;
  }

  const program = await prisma.program.findUnique({
    where: { slug: programSlug },
    select: { id: true, isActive: true },
  });

  if (!program || !program.isActive) {
    return null;
  }

  const categories = await prisma.category.findMany({
    where: {
      programId: program.id,
      isActive: true,
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      courses: {
        where: { isActive: true },
        select: { id: true },
      },
    },
  });

  const payload = {
    data: categories.map(serializeCategory),
    total: categories.length,
  };

  await cacheService.set(cacheKey, payload, CACHE_TTL_SECONDS);

  return payload;
};

export const getCategoryById = async (programSlug: string, id: string) => {
  const cacheKey = `cache:entity:category:${id}`;
  const cached = await cacheService.get<{
    programSlug: string;
    data: ReturnType<typeof serializeCategory> & {
      program: {
        slug: string;
        nameAr: string;
        nameEn: string;
      };
      courses: ReturnType<typeof serializeCategoryCourse>[];
    };
  }>(cacheKey);

  if (cached?.programSlug === programSlug) {
    return cached.data;
  }

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      program: {
        select: {
          slug: true,
          isActive: true,
          nameAr: true,
          nameEn: true,
        },
      },
      courses: {
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
        include: {
          schedules: {
            where: { isActive: true },
            select: { id: true },
          },
        },
      },
    },
  });

  if (
    !category ||
    !category.isActive ||
    !category.program.isActive ||
    category.program.slug !== programSlug
  ) {
    return null;
  }

  const payload = {
    ...serializeCategory(category),
    program: {
      slug: category.program.slug,
      nameAr: category.program.nameAr,
      nameEn: category.program.nameEn,
    },
    courses: category.courses.map(serializeCategoryCourse),
  };

  await cacheService.set(
    cacheKey,
    { programSlug, data: payload },
    CACHE_TTL_SECONDS,
  );

  return payload;
};
