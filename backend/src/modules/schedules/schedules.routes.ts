import { Router } from 'express';

const schedulesRouter = Router();

schedulesRouter.get('/', (_req, res) => {
  res.status(501).json({ message: 'Schedules endpoint not implemented yet.' });
});

export default schedulesRouter;
