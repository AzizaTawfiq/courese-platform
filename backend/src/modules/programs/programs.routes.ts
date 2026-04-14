import { Router } from 'express';

const programsRouter = Router();

programsRouter.get('/', (_req, res) => {
  res.status(501).json({ message: 'Programs endpoint not implemented yet.' });
});

export default programsRouter;
