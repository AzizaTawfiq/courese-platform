import { Router } from 'express';

const coursesRouter = Router();

coursesRouter.get('/', (_req, res) => {
  res.status(501).json({ message: 'Courses endpoint not implemented yet.' });
});

export default coursesRouter;
