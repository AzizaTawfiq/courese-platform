import type { Request, Response } from 'express';
import {
  getCategoryById,
  listCategories,
} from './categories.service.js';

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
