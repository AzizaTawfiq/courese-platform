import type { NextFunction, Response } from 'express';
import type { AppRole, AuthenticatedRequest } from '../types.js';

export const requireRole = (...roles: AppRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next();
  };
};
