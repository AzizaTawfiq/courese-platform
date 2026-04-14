import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';

export const checkSlugAvailabilityHandler = (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Slug check endpoint not implemented yet.' });
};

export const getScheduleFileDownloadHandler = async (
  _req: Request,
  res: Response,
) => {
  const latestScheduleFile = await prisma.scheduleFile.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!latestScheduleFile) {
    res.status(404).json({ message: 'No schedule file found.' });
    return;
  }

  res.redirect(302, latestScheduleFile.fileUrl);
};
