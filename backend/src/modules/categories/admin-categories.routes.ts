import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';
import {
  getAdminCategoryHandler,
  listAdminCategoriesHandler,
} from './categories.controller.js';

const adminCategoriesRouter = Router();

adminCategoriesRouter.use(authMiddleware, requireRole('ADMIN', 'SUPER_ADMIN'));
adminCategoriesRouter.get('/', listAdminCategoriesHandler);
adminCategoriesRouter.get('/:id', getAdminCategoryHandler);

export default adminCategoriesRouter;
