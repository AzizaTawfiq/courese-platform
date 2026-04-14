import { Router } from 'express';
import adminRouter from '../modules/admin/admin.routes.js';
import authRouter from '../modules/auth/auth.routes.js';
import bookingsRouter from '../modules/bookings/bookings.routes.js';
import categoriesRouter from '../modules/categories/categories.routes.js';
import coursesRouter from '../modules/courses/courses.routes.js';
import programsRouter from '../modules/programs/programs.routes.js';
import purchasesRouter from '../modules/purchases/purchases.routes.js';
import schedulesRouter from '../modules/schedules/schedules.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/programs', programsRouter);
apiRouter.use('/programs/:programSlug/categories', categoriesRouter);
apiRouter.use('/courses', coursesRouter);
apiRouter.use('/purchases', purchasesRouter);
apiRouter.use('/bookings', bookingsRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/admin/schedules', schedulesRouter);

export default apiRouter;
