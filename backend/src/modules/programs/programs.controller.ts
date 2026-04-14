import type { Request, Response } from 'express';
import { getProgramBySlug, listPrograms } from './programs.service.js';

export const listProgramsHandler = async (_req: Request, res: Response) => {
  const programs = await listPrograms();
  res.json(programs);
};

export const getProgramHandler = async (
  req: Request<{ slug: string }>,
  res: Response,
) => {
  const result = await getProgramBySlug(req.params.slug);

  if (!result) {
    res.status(404).json({ message: 'Program not found.' });
    return;
  }

  if (result.type === 'redirect') {
    res
      .status(301)
      .location(result.location)
      .json({ redirectTo: `/programs/${result.newSlug}` });
    return;
  }

  res.json(result.data);
};
