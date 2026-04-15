import { z } from 'zod';

export const createPurchaseSchema = z.object({
  body: z.object({
    scheduleId: z.string().trim().min(1),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const purchaseWebhookSchema = z.object({
  body: z.object({
    purchaseId: z.string().trim().min(1),
    status: z.enum(['success', 'failure']),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const confirmPurchaseSchema = z.object({
  body: z.object({
    status: z.enum(['success', 'failure']).default('success'),
  }),
  params: z.object({
    purchaseId: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});
