import { z } from 'zod';

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const listCategoriesSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    programSlug: slugSchema,
  }),
  query: z.object({}).default({}),
});

export const getCategorySchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    programSlug: slugSchema,
    id: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});

const categoryBodySchema = z.object({
  nameAr: z.string().trim().min(1),
  nameEn: z.string().trim().min(1),
  descriptionAr: z.string().trim().min(1),
  descriptionEn: z.string().trim().min(1),
  isActive: z.boolean().optional().default(true),
});

export const createCategorySchema = z.object({
  body: categoryBodySchema,
  params: z.object({
    programSlug: slugSchema,
  }),
  query: z.object({}).default({}),
});

export const updateCategorySchema = z.object({
  body: categoryBodySchema,
  params: z.object({
    programSlug: slugSchema,
    id: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});

export const deleteCategorySchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    programSlug: slugSchema,
    id: z.string().trim().min(1),
  }),
  query: z.object({
    confirm: z.enum(['true', 'false']).optional(),
  }),
});
