import type { Request, Response } from 'express';
import { AuthError } from '../auth/auth.service.js';
import {
  createProgram,
  deleteProgram,
  getAdminProgramById,
  getProgramBySlug,
  listAdminPrograms,
  listPrograms,
  updateProgram,
} from './programs.service.js';

const handleError = (error: unknown, res: Response) => {
  if (error instanceof AuthError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: 'Internal server error.' });
};

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

export const listAdminProgramsHandler = async (_req: Request, res: Response) => {
  try {
    const programs = await listAdminPrograms();
    res.json({
      data: programs.map((program) => ({
        id: program.id,
        slug: program.slug,
        nameAr: program.nameAr,
        nameEn: program.nameEn,
        descriptionAr: program.descriptionAr,
        descriptionEn: program.descriptionEn,
        seoTitleAr: program.seoTitleAr,
        seoTitleEn: program.seoTitleEn,
        seoDescAr: program.seoDescAr,
        seoDescEn: program.seoDescEn,
        seoKeywordsAr: program.seoKeywordsAr,
        seoKeywordsEn: program.seoKeywordsEn,
        updatedAt: program.updatedAt.toISOString(),
        categoryCount: program.categories.length,
        isActive: program.isActive,
      })),
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getAdminProgramHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const program = await getAdminProgramById(req.params.id);
    res.json(program);
  } catch (error) {
    handleError(error, res);
  }
};

export const createProgramHandler = async (req: Request, res: Response) => {
  try {
    const program = await createProgram(req.body);
    res.status(201).json(program);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateProgramHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const program = await updateProgram(req.params.id, req.body);
    res.json(program);
  } catch (error) {
    handleError(error, res);
  }
};

export const deleteProgramHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    await deleteProgram(req.params.id);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};
