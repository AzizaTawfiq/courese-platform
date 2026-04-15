import type { Request, Response } from 'express';
import { AuthError } from '../auth/auth.service.js';
import {
  createCategory,
  deleteCategory,
  getAdminCategoryById,
  getCategoryById,
  listAdminCategories,
  listCategories,
  updateCategory,
} from './categories.service.js';

const handleError = (error: unknown, res: Response) => {
  if (error instanceof AuthError) {
    if (error.statusCode === 409) {
      res.status(409).json({ warning: error.message });
      return;
    }

    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: 'Internal server error.' });
};

export const listCategoriesHandler = async (
  req: Request<{ programSlug: string }>,
  res: Response,
) => {
  const categories = await listCategories(req.params.programSlug);

  if (!categories) {
    res.status(404).json({ message: 'Program not found.' });
    return;
  }

  res.json(categories);
};

export const getCategoryHandler = async (
  req: Request<{ programSlug: string; id: string }>,
  res: Response,
) => {
  const category = await getCategoryById(req.params.programSlug, req.params.id);

  if (!category) {
    res.status(404).json({ message: 'Category not found.' });
    return;
  }

  res.json(category);
};

export const createCategoryHandler = async (
  req: Request<{ programSlug: string }>,
  res: Response,
) => {
  try {
    const category = await createCategory(req.params.programSlug, req.body);
    res.status(201).json(category);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateCategoryHandler = async (
  req: Request<{ programSlug: string; id: string }>,
  res: Response,
) => {
  try {
    const category = await updateCategory(
      req.params.programSlug,
      req.params.id,
      req.body,
    );
    res.json(category);
  } catch (error) {
    handleError(error, res);
  }
};

export const deleteCategoryHandler = async (
  req: Request<{ programSlug: string; id: string }, unknown, unknown, { confirm?: string }>,
  res: Response,
) => {
  try {
    await deleteCategory(
      req.params.programSlug,
      req.params.id,
      req.query.confirm === 'true',
    );
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};

export const listAdminCategoriesHandler = async (
  _req: Request,
  res: Response,
) => {
  try {
    const categories = await listAdminCategories();
    res.json(categories);
  } catch (error) {
    handleError(error, res);
  }
};

export const getAdminCategoryHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const category = await getAdminCategoryById(req.params.id);
    res.json(category);
  } catch (error) {
    handleError(error, res);
  }
};
