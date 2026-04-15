import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';
import { validate } from '../../middleware/validate.js';
import {
  createScheduleHandler,
  deleteScheduleHandler,
  listAdminSchedulesHandler,
  updateScheduleHandler,
} from './schedules.controller.js';
import {
  createScheduleSchema,
  deleteScheduleSchema,
  listAdminSchedulesSchema,
  updateScheduleSchema,
} from './schedules.schema.js';

const schedulesRouter = Router();

schedulesRouter.use(authMiddleware, requireRole('ADMIN', 'SUPER_ADMIN'));
schedulesRouter.get('/', validate(listAdminSchedulesSchema), listAdminSchedulesHandler);
schedulesRouter.post('/', validate(createScheduleSchema), createScheduleHandler);
schedulesRouter.put('/:id', validate(updateScheduleSchema), updateScheduleHandler);
schedulesRouter.delete('/:id', validate(deleteScheduleSchema), deleteScheduleHandler);

export default schedulesRouter;
