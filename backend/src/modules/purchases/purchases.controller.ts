import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../types.js';
import { AuthError } from '../auth/auth.service.js';
import {
  confirmPurchaseForUser,
  createPurchase,
  processPurchaseWebhook,
  verifyWebhookSignature,
} from './purchases.service.js';

const handleError = (error: unknown, res: Response) => {
  if (error instanceof AuthError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: 'Internal server error.' });
};

export const createPurchaseHandler = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const purchase = await createPurchase(req.user.id, req.body.scheduleId);
    res.status(201).json(purchase);
  } catch (error) {
    handleError(error, res);
  }
};

export const purchaseWebhookHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    verifyWebhookSignature(req.header('x-webhook-signature'));

    const result = await processPurchaseWebhook(
      req.body.purchaseId,
      req.body.status,
    );
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};

export const confirmPurchaseHandler = async (
  req: AuthenticatedRequest & {
    params: { purchaseId: string };
    body: { status: 'success' | 'failure' };
  },
  res: Response,
) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await confirmPurchaseForUser(
      req.user.id,
      req.params.purchaseId,
      req.body.status,
    );
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};
