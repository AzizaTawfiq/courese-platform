import { Router } from 'express';

const purchasesRouter = Router();

purchasesRouter.post('/', (_req, res) => {
  res.status(501).json({ message: 'Purchases endpoint not implemented yet.' });
});

export default purchasesRouter;
