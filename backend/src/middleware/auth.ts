import type { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthenticatedRequest, AuthenticatedUser } from '../types.js';
import { authConfig } from '../modules/auth/auth.config.js';

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(
      token,
      authConfig.accessTokenSecret,
    ) as AuthenticatedUser;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
