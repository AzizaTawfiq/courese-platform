import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import {
  getCategoryHandler,
  listCategoriesHandler,
} from './categories.controller.js';
import {
  getCategorySchema,
  listCategoriesSchema,
} from './categories.schema.js';

const categoriesRouter = Router({ mergeParams: true });

categoriesRouter.get('/', validate(listCategoriesSchema), listCategoriesHandler);
categoriesRouter.get('/:id', validate(getCategorySchema), getCategoryHandler);

export default categoriesRouter;
