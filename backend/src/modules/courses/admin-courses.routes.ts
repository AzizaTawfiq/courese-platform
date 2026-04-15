import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';
import { validate } from '../../middleware/validate.js';
import {
  createCourseHandler,
  deleteCourseHandler,
  getAdminCourseHandler,
  listAdminCoursesHandler,
  updateCourseHandler,
} from './courses.controller.js';
import {
  createCourseSchema,
  deleteCourseSchema,
  updateCourseSchema,
} from './courses.schema.js';

const adminCoursesRouter = Router();

adminCoursesRouter.use(authMiddleware, requireRole('ADMIN', 'SUPER_ADMIN'));
adminCoursesRouter.get('/', listAdminCoursesHandler);
adminCoursesRouter.get('/:id', getAdminCourseHandler);
adminCoursesRouter.post('/', validate(createCourseSchema), createCourseHandler);
adminCoursesRouter.put('/:id', validate(updateCourseSchema), updateCourseHandler);
adminCoursesRouter.delete(
  '/:id',
  validate(deleteCourseSchema),
  deleteCourseHandler,
);

export default adminCoursesRouter;
