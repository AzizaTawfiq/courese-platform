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
