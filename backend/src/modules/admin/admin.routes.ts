import { Router } from 'express';
import {
  checkSlugAvailabilityHandler,
  getScheduleFileDownloadHandler,
} from './admin.controller.js';

const adminRouter = Router();

adminRouter.get('/schedule-file/download', getScheduleFileDownloadHandler);
adminRouter.get('/admin/slugs/check', checkSlugAvailabilityHandler);

export default adminRouter;
