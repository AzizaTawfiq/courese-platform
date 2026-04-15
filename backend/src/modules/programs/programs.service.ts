import { prisma } from '../../lib/prisma.js';
import { cacheService } from '../../services/cache.service.js';
import { AuthError } from '../auth/auth.service.js';

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

const invalidateProgramCaches = async (slugs: string[] = []) => {
  await Promise.all([
    cacheService.invalidatePrefix(PROGRAMS_LIST_CACHE_KEY),
    cacheService.invalidatePrefix('cache:list:categories:'),
    cacheService.del('cache:sitemap'),
    ...slugs.map((slug) => cacheService.del(`${PROGRAM_CACHE_PREFIX}${slug}`)),
  ]);
};

export const listAdminPrograms = async () =>
  prisma.program.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      categories: {
        select: { id: true },
      },
    },
  });

export const getAdminProgramById = async (id: string) => {
  const program = await prisma.program.findUnique({
    where: { id },
    include: {
      categories: {
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          nameAr: true,
          nameEn: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!program) {
    throw new AuthError('Program not found.', 404);
  }

  return {
    ...serializeProgram(program),
    isActive: program.isActive,
    categories: program.categories.map((category) => ({
      id: category.id,
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      updatedAt: category.updatedAt.toISOString(),
    })),
  };
};

type ProgramPayload = {
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  seoTitleAr: string;
  seoTitleEn: string;
  seoDescAr: string;
  seoDescEn: string;
  seoKeywordsAr?: string;
  seoKeywordsEn?: string;
  isActive?: boolean;
};

export const createProgram = async (payload: ProgramPayload) => {
  const program = await prisma.program.create({
    data: {
      ...payload,
      slug: payload.slug.trim(),
      seoKeywordsAr: payload.seoKeywordsAr || null,
      seoKeywordsEn: payload.seoKeywordsEn || null,
      isActive: payload.isActive ?? true,
    },
    include: {
      categories: {
        select: { id: true },
      },
    },
  });

  await invalidateProgramCaches([program.slug]);

  return {
    ...serializeProgram(program),
    isActive: program.isActive,
  };
};

export const updateProgram = async (id: string, payload: ProgramPayload) => {
  const existingProgram = await prisma.program.findUnique({
    where: { id },
  });

  if (!existingProgram) {
    throw new AuthError('Program not found.', 404);
  }

  const program = await prisma.$transaction(async (tx) => {
    const updatedProgram = await tx.program.update({
      where: { id },
      data: {
        ...payload,
        slug: payload.slug.trim(),
        seoKeywordsAr: payload.seoKeywordsAr || null,
        seoKeywordsEn: payload.seoKeywordsEn || null,
        isActive: payload.isActive ?? existingProgram.isActive,
      },
      include: {
        categories: {
          select: { id: true },
        },
      },
    });

    if (existingProgram.slug !== updatedProgram.slug) {
      await tx.slugRedirect.upsert({
        where: {
          oldSlug_entityType: {
            oldSlug: existingProgram.slug,
            entityType: 'program',
          },
        },
        update: {
          newSlug: updatedProgram.slug,
          entityId: updatedProgram.id,
        },
        create: {
          oldSlug: existingProgram.slug,
          newSlug: updatedProgram.slug,
          entityType: 'program',
          entityId: updatedProgram.id,
        },
      });
    }

    return updatedProgram;
  });

  await invalidateProgramCaches([existingProgram.slug, program.slug]);

  return {
    ...serializeProgram(program),
    isActive: program.isActive,
  };
};

export const deleteProgram = async (id: string) => {
  const existingProgram = await prisma.program.findUnique({
    where: { id },
    select: { slug: true },
  });

  if (!existingProgram) {
    throw new AuthError('Program not found.', 404);
  }

  await prisma.program.delete({
    where: { id },
  });

  await invalidateProgramCaches([existingProgram.slug]);
};
