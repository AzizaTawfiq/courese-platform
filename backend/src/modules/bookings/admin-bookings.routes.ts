import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';
import {
  cancelBookingHandler,
  listAdminBookingsHandler,
} from './bookings.controller.js';

const adminBookingsRouter = Router();

adminBookingsRouter.use(authMiddleware, requireRole('ADMIN', 'SUPER_ADMIN'));
adminBookingsRouter.get('/', listAdminBookingsHandler);
adminBookingsRouter.delete('/:id', cancelBookingHandler);

export default adminBookingsRouter;
