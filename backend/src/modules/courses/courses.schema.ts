import { z } from 'zod';

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const listCoursesSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    categoryId: z.string().trim().optional(),
    programSlug: slugSchema.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(20),
  }),
});

export const getCourseSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    slug: slugSchema,
  }),
  query: z.object({}).default({}),
});

const courseBodySchema = z.object({
  categoryId: z.string().trim().min(1),
  slug: slugSchema,
  nameAr: z.string().trim().min(1),
  nameEn: z.string().trim().min(1),
  descriptionAr: z.string().trim().min(1),
  descriptionEn: z.string().trim().min(1),
  durationHours: z.coerce.number().int().positive(),
  price: z.coerce.number().nonnegative(),
  currency: z.string().trim().min(1),
  seoTitleAr: z.string().trim().min(1).max(60),
  seoTitleEn: z.string().trim().min(1).max(60),
  seoDescAr: z.string().trim().min(1).max(160),
  seoDescEn: z.string().trim().min(1).max(160),
  seoKeywordsAr: z.string().trim().optional(),
  seoKeywordsEn: z.string().trim().optional(),
  isActive: z.boolean().optional().default(true),
});

export const createCourseSchema = z.object({
  body: courseBodySchema,
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const updateCourseSchema = z.object({
  body: courseBodySchema,
  params: z.object({
    id: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});

export const deleteCourseSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    id: z.string().trim().min(1),
  }),
  query: z.object({
    confirm: z.enum(['true', 'false']).optional(),
  }),
});
