import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';
import { validate } from '../../middleware/validate.js';
import {
  confirmPurchaseHandler,
  createPurchaseHandler,
  purchaseWebhookHandler,
} from './purchases.controller.js';
import {
  confirmPurchaseSchema,
  createPurchaseSchema,
  purchaseWebhookSchema,
} from './purchases.schema.js';

const purchasesRouter = Router();
const customerPurchaseGuard = requireRole('CUSTOMER');

purchasesRouter.post(
  '/',
  authMiddleware,
  customerPurchaseGuard,
  validate(createPurchaseSchema),
  createPurchaseHandler,
);
purchasesRouter.post(
  '/:purchaseId/confirm',
  authMiddleware,
  customerPurchaseGuard,
  validate(confirmPurchaseSchema),
  confirmPurchaseHandler,
);
purchasesRouter.post(
  '/webhook',
  validate(purchaseWebhookSchema),
  purchaseWebhookHandler,
);

export default purchasesRouter;
