import { Router } from 'express';

const categoriesRouter = Router({ mergeParams: true });

categoriesRouter.get('/', (_req, res) => {
  res.status(501).json({ message: 'Categories endpoint not implemented yet.' });
});

export default categoriesRouter;
