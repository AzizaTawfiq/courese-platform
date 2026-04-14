import type { Request, Response } from 'express';
import { getCourseBySlug, listCourses } from './courses.service.js';

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
