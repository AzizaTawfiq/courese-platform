import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';
import { validate } from '../../middleware/validate.js';
import {
  createProgramHandler,
  deleteProgramHandler,
  getAdminProgramHandler,
  getProgramHandler,
  listAdminProgramsHandler,
  listProgramsHandler,
  updateProgramHandler,
} from './programs.controller.js';
import {
  createAdminProgramSchema,
  deleteProgramSchema,
  getAdminProgramSchema,
  getProgramSchema,
  updateProgramSchema,
} from './programs.schema.js';

const programsRouter = Router();

programsRouter.get(
  '/admin/list',
  authMiddleware,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  listAdminProgramsHandler,
);
programsRouter.get(
  '/admin/:id',
  authMiddleware,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  validate(getAdminProgramSchema),
  getAdminProgramHandler,
);
programsRouter.get('/', listProgramsHandler);
programsRouter.get('/:slug', validate(getProgramSchema), getProgramHandler);
programsRouter.post(
  '/',
  authMiddleware,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  validate(createAdminProgramSchema),
  createProgramHandler,
);
programsRouter.put(
  '/:id',
  authMiddleware,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  validate(updateProgramSchema),
  updateProgramHandler,
);
programsRouter.delete(
  '/:id',
  authMiddleware,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  validate(deleteProgramSchema),
  deleteProgramHandler,
);

export default programsRouter;
