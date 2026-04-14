import { z } from 'zod';

const emailSchema = z.string().trim().email();

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2),
    companyName: z.string().trim().min(2),
    email: emailSchema,
    password: z.string().min(8),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(8),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});
