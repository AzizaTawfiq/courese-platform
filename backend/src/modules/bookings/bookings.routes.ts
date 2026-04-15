import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';
import {
  getBookingByReferenceHandler,
  listCustomerBookingsHandler,
} from './bookings.controller.js';

const bookingsRouter = Router();

bookingsRouter.use(authMiddleware);
bookingsRouter.get('/', requireRole('CUSTOMER'), listCustomerBookingsHandler);
bookingsRouter.get(
  '/:reference',
  requireRole('CUSTOMER', 'ADMIN', 'SUPER_ADMIN'),
  getBookingByReferenceHandler,
);

export default bookingsRouter;
