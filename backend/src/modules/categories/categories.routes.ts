import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';
import { validate } from '../../middleware/validate.js';
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategoryHandler,
  listCategoriesHandler,
  updateCategoryHandler,
} from './categories.controller.js';
import {
  createCategorySchema,
  deleteCategorySchema,
  getCategorySchema,
  listCategoriesSchema,
  updateCategorySchema,
} from './categories.schema.js';

const categoriesRouter = Router({ mergeParams: true });

categoriesRouter.get('/', validate(listCategoriesSchema), listCategoriesHandler);
categoriesRouter.get('/:id', validate(getCategorySchema), getCategoryHandler);
categoriesRouter.post(
  '/',
  authMiddleware,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  validate(createCategorySchema),
  createCategoryHandler,
);
categoriesRouter.put(
  '/:id',
  authMiddleware,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  validate(updateCategorySchema),
  updateCategoryHandler,
);
categoriesRouter.delete(
  '/:id',
  authMiddleware,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  validate(deleteCategorySchema),
  deleteCategoryHandler,
);

export default categoriesRouter;
