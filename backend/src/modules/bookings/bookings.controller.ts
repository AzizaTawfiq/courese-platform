import { BookingStatus } from '@prisma/client';
import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../types.js';
import { AuthError } from '../auth/auth.service.js';
import {
  cancelBooking,
  getBookingByReference,
  listAdminBookings,
  listCustomerBookings,
} from './bookings.service.js';

const handleError = (error: unknown, res: Response) => {
  if (error instanceof AuthError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: 'Internal server error.' });
};

export const listCustomerBookingsHandler = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await listCustomerBookings(req.user.id);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};

export const getBookingByReferenceHandler = async (
  req: AuthenticatedRequest & { params: { reference: string } },
  res: Response,
) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const booking = await getBookingByReference(
      req.params.reference,
      req.user.id,
      req.user.role,
    );
    res.json(booking);
  } catch (error) {
    handleError(error, res);
  }
};

export const listAdminBookingsHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const page = Number(req.query.page ?? '1');
    const limit = Number(req.query.limit ?? '20');
    const status =
      typeof req.query.status === 'string' &&
      ['PENDING', 'CONFIRMED', 'CANCELLED'].includes(req.query.status)
        ? (req.query.status as BookingStatus)
        : undefined;
    const result = await listAdminBookings({
      scheduleId:
        typeof req.query.scheduleId === 'string'
          ? req.query.scheduleId
          : undefined,
      status,
      page: Number.isFinite(page) && page > 0 ? page : 1,
      limit: Number.isFinite(limit) && limit > 0 ? limit : 20,
    });

    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};

export const cancelBookingHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const result = await cancelBooking(req.params.id);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};
