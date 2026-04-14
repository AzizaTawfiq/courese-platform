import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { getCourseHandler, listCoursesHandler } from './courses.controller.js';
import { getCourseSchema, listCoursesSchema } from './courses.schema.js';

const coursesRouter = Router();

coursesRouter.get('/', validate(listCoursesSchema), listCoursesHandler);
coursesRouter.get('/:slug', validate(getCourseSchema), getCourseHandler);

export default coursesRouter;
