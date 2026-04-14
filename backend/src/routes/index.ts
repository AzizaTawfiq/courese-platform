import { Router } from 'express';
import adminRouter from '../modules/admin/admin.routes.js';
import authRouter from '../modules/auth/auth.routes.js';
import bookingsRouter from '../modules/bookings/bookings.routes.js';
import categoriesRouter from '../modules/categories/categories.routes.js';
import coursesRouter from '../modules/courses/courses.routes.js';
import programsRouter from '../modules/programs/programs.routes.js';
import purchasesRouter from '../modules/purchases/purchases.routes.js';
import schedulesRouter from '../modules/schedules/schedules.routes.js';
import { cacheService } from '../services/cache.service.js';
import { generateSitemapXml } from '../services/sitemap.service.js';

const rootRouter = Router();
const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/programs', programsRouter);
apiRouter.use('/programs/:programSlug/categories', categoriesRouter);
apiRouter.use('/courses', coursesRouter);
apiRouter.use('/purchases', purchasesRouter);
apiRouter.use('/bookings', bookingsRouter);
apiRouter.use('/', adminRouter);
apiRouter.use('/admin/schedules', schedulesRouter);

rootRouter.get('/sitemap.xml', async (_req, res) => {
  const cacheKey = 'cache:sitemap';
  const cached = await cacheService.get<string>(cacheKey);

  if (cached) {
    res.type('application/xml').send(cached);
    return;
  }

  const xml = await generateSitemapXml();
  await cacheService.set(cacheKey, xml, 60 * 60);
  res.type('application/xml').send(xml);
});

rootRouter.use('/api/v1', apiRouter);

export default rootRouter;
