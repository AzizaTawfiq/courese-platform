import type { Request, Response } from 'express';
import { AuthError } from '../auth/auth.service.js';
import {
  createSchedule,
  deleteSchedule,
  listAdminSchedules,
  updateSchedule,
} from './schedules.service.js';

const handleError = (error: unknown, res: Response) => {
  if (error instanceof AuthError) {
    if (error.statusCode === 409) {
      res.status(409).json({ warning: error.message });
      return;
    }

    if (error.statusCode === 422) {
      res.status(422).json({ message: error.message });
      return;
    }

    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: 'Internal server error.' });
};

export const listAdminSchedulesHandler = async (
  req: Request<Record<string, never>, unknown, unknown, { courseId?: string; from?: string; to?: string }>,
  res: Response,
) => {
  try {
    const schedules = await listAdminSchedules(req.query);
    res.json(schedules);
  } catch (error) {
    handleError(error, res);
  }
};

export const createScheduleHandler = async (req: Request, res: Response) => {
  try {
    const schedule = await createSchedule(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateScheduleHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const schedule = await updateSchedule(req.params.id, req.body);
    res.json(schedule);
  } catch (error) {
    handleError(error, res);
  }
};

export const deleteScheduleHandler = async (
  req: Request<{ id: string }, unknown, unknown, { confirm?: string }>,
  res: Response,
) => {
  try {
    await deleteSchedule(req.params.id, req.query.confirm === 'true');
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};
