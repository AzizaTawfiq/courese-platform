import { Router } from 'express';

const adminRouter = Router();

adminRouter.get('/slugs/check', (_req, res) => {
  res.status(501).json({ message: 'Slug check endpoint not implemented yet.' });
});

export default adminRouter;
