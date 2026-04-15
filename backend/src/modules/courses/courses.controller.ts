import type { Request, Response } from 'express';
import { AuthError } from '../auth/auth.service.js';
import {
  createCourse,
  deleteCourse,
  getAdminCourseById,
  getCourseBySlug,
  listAdminCourses,
  listCourses,
  updateCourse,
} from './courses.service.js';

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

export const listCoursesHandler = async (
  req: Request<
    Record<string, never>,
    unknown,
    unknown,
    {
      categoryId?: string;
      programSlug?: string;
      page?: string | number;
      limit?: string | number;
    }
  >,
  res: Response,
) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);

  const courses = await listCourses({
    categoryId: req.query.categoryId,
    programSlug: req.query.programSlug,
    page,
    limit,
  });

  res.json(courses);
};

export const getCourseHandler = async (
  req: Request<{ slug: string }>,
  res: Response,
) => {
  const result = await getCourseBySlug(req.params.slug);

  if (!result) {
    res.status(404).json({ message: 'Course not found.' });
    return;
  }

  if (result.type === 'redirect') {
    res
      .status(301)
      .location(result.location)
      .json({ redirectTo: `/courses/${result.newSlug}` });
    return;
  }

  res.json(result.data);
};

export const listAdminCoursesHandler = async (_req: Request, res: Response) => {
  try {
    const courses = await listAdminCourses();
    res.json(courses);
  } catch (error) {
    handleError(error, res);
  }
};

export const getAdminCourseHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const course = await getAdminCourseById(req.params.id);
    res.json(course);
  } catch (error) {
    handleError(error, res);
  }
};

export const createCourseHandler = async (req: Request, res: Response) => {
  try {
    const course = await createCourse(req.body);
    res.status(201).json(course);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateCourseHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const course = await updateCourse(req.params.id, req.body);
    res.json(course);
  } catch (error) {
    handleError(error, res);
  }
};

export const deleteCourseHandler = async (
  req: Request<{ id: string }, unknown, unknown, { confirm?: string }>,
  res: Response,
) => {
  try {
    await deleteCourse(req.params.id, req.query.confirm === 'true');
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};
