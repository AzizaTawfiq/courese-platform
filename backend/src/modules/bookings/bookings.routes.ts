import { Router } from 'express';

const bookingsRouter = Router();

bookingsRouter.get('/', (_req, res) => {
  res.status(501).json({ message: 'Bookings endpoint not implemented yet.' });
});

export default bookingsRouter;
