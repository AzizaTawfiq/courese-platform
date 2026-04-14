import type { Request } from 'express';

export type AppRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: AppRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}
