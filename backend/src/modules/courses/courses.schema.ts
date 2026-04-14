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
