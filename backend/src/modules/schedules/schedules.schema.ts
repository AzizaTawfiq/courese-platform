import { z } from 'zod';

const scheduleBodySchema = z
  .object({
    courseId: z.string().trim().min(1),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    location: z.string().trim().optional().or(z.literal('')),
    maxCapacity: z.coerce.number().int().positive(),
    isActive: z.boolean().optional().default(true),
  })
  .refine((value) => value.endDate > value.startDate, {
    message: 'End date must be after start date.',
    path: ['endDate'],
  });

export const createScheduleSchema = z.object({
  body: scheduleBodySchema,
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const updateScheduleSchema = z.object({
  body: scheduleBodySchema,
  params: z.object({
    id: z.string().trim().min(1),
  }),
  query: z.object({}).default({}),
});

export const deleteScheduleSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    id: z.string().trim().min(1),
  }),
  query: z.object({
    confirm: z.enum(['true', 'false']).optional(),
  }),
});

export const listAdminSchedulesSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    courseId: z.string().trim().optional(),
    from: z.string().trim().optional(),
    to: z.string().trim().optional(),
  }),
});
