import { z } from 'zod';

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const programBodySchema = z.object({
  slug: slugSchema,
  nameAr: z.string().trim().min(1),
  nameEn: z.string().trim().min(1),
  descriptionAr: z.string().trim().min(1),
  descriptionEn: z.string().trim().min(1),
  seoTitleAr: z.string().trim().min(1).max(60),
  seoTitleEn: z.string().trim().min(1).max(60),
  seoDescAr: z.string().trim().min(1).max(160),
  seoDescEn: z.string().trim().min(1).max(160),
  seoKeywordsAr: z.string().trim().optional(),
  seoKeywordsEn: z.string().trim().optional(),
  isActive: z.boolean().optional().default(true),
});

export const createProgramSchema = z.object({
  body: programBodySchema,
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const getProgramSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    slug: slugSchema,
  }),
  query: z.object({}).default({}),
});

export const createAdminProgramSchema = createProgramSchema;

export const updateProgramSchema = z.object({
  body: programBodySchema,
  params: z.object({
    id: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});

export const deleteProgramSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    id: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});

export const getAdminProgramSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    id: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});
