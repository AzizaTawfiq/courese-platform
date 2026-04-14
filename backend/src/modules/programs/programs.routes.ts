import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { getProgramHandler, listProgramsHandler } from './programs.controller.js';
import { getProgramSchema } from './programs.schema.js';

const programsRouter = Router();

programsRouter.get('/', listProgramsHandler);
programsRouter.get('/:slug', validate(getProgramSchema), getProgramHandler);

export default programsRouter;
