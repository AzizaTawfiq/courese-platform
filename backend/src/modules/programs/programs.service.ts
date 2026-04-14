import { prisma } from '../../lib/prisma.js';
import { cacheService } from '../../services/cache.service.js';

const PROGRAMS_LIST_CACHE_KEY = 'cache:list:programs';
const PROGRAM_CACHE_PREFIX = 'cache:entity:program:';
const CACHE_TTL_SECONDS = 60 * 5;

const serializeProgram = (
  program: {
    id: string;
    slug: string;
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
    seoTitleAr: string;
    seoTitleEn: string;
    seoDescAr: string;
    seoDescEn: string;
    seoKeywordsAr: string | null;
    seoKeywordsEn: string | null;
    updatedAt: Date;
    categories: Array<{ id: string }>;
  },
) => ({
  id: program.id,
  slug: program.slug,
  nameAr: program.nameAr,
  nameEn: program.nameEn,
  descriptionAr: program.descriptionAr,
  descriptionEn: program.descriptionEn,
  seoTitleAr: program.seoTitleAr,
  seoTitleEn: program.seoTitleEn,
  seoDescAr: program.seoDescAr,
  seoDescEn: program.seoDescEn,
  seoKeywordsAr: program.seoKeywordsAr,
  seoKeywordsEn: program.seoKeywordsEn,
  updatedAt: program.updatedAt.toISOString(),
  categoryCount: program.categories.length,
});

const serializeProgramCategory = (
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

export const listPrograms = async () => {
  const cached = await cacheService.get<{
    data: ReturnType<typeof serializeProgram>[];
    total: number;
  }>(PROGRAMS_LIST_CACHE_KEY);

  if (cached) {
    return cached;
  }

  const programs = await prisma.program.findMany({
    where: { isActive: true },
    orderBy: { updatedAt: 'desc' },
    include: {
      categories: {
        where: { isActive: true },
        select: { id: true },
      },
    },
  });

  const payload = {
    data: programs.map(serializeProgram),
    total: programs.length,
  };

  await cacheService.set(PROGRAMS_LIST_CACHE_KEY, payload, CACHE_TTL_SECONDS);

  return payload;
};

export const getProgramBySlug = async (slug: string) => {
  const cacheKey = `${PROGRAM_CACHE_PREFIX}${slug}`;
  const cached = await cacheService.get<{
    type: 'program';
    data: ReturnType<typeof serializeProgram> & {
      categories: ReturnType<typeof serializeProgramCategory>[];
    };
  }>(cacheKey);

  if (cached) {
    return cached;
  }

  const program = await prisma.program.findUnique({
    where: { slug },
    include: {
      categories: {
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
        include: {
          courses: {
            where: { isActive: true },
            select: { id: true },
          },
        },
      },
    },
  });

  if (!program || !program.isActive) {
    const redirect = await prisma.slugRedirect.findUnique({
      where: {
        oldSlug_entityType: {
          oldSlug: slug,
          entityType: 'program',
        },
      },
    });

    if (redirect) {
      return {
        type: 'redirect' as const,
        statusCode: 301,
        newSlug: redirect.newSlug,
        location: `/api/v1/programs/${redirect.newSlug}`,
      };
    }

    return null;
  }

  const payload = {
    type: 'program' as const,
    data: {
      ...serializeProgram(program),
      categories: program.categories.map(serializeProgramCategory),
    },
  };

  await cacheService.set(cacheKey, payload, CACHE_TTL_SECONDS);

  return payload;
};
