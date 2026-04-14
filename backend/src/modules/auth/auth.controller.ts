import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../types.js';
import {
  AuthError,
  login,
  logout,
  me,
  refresh,
  register,
} from './auth.service.js';
import { refreshTokenMaxAgeMs } from './auth.config.js';

const REFRESH_COOKIE_NAME = '__rt';
const REFRESH_COOKIE_PATH = '/api/v1/auth';

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  path: REFRESH_COOKIE_PATH,
  maxAge: refreshTokenMaxAgeMs,
});

const clearRefreshCookie = (res: Response) => {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    ...getRefreshCookieOptions(),
    maxAge: undefined,
  });
};

const handleAuthError = (error: unknown, res: Response) => {
  if (error instanceof AuthError) {
    res.status(error.statusCode).json({ message: error.message });
    return true;
  }

  return false;
};

export const registerHandler = async (
  req: Request<
    Record<string, never>,
    unknown,
    {
      fullName: string;
      companyName: string;
      email: string;
      password: string;
    }
  >,
  res: Response,
) => {
  try {
    const result = await register(req.body);
    res
      .cookie(REFRESH_COOKIE_NAME, result.refreshToken, getRefreshCookieOptions())
      .status(201)
      .json({
        accessToken: result.accessToken,
        user: result.user,
      });
  } catch (error) {
    if (!handleAuthError(error, res)) {
      throw error;
    }
  }
};

export const loginHandler = async (
  req: Request<
    Record<string, never>,
    unknown,
    {
      email: string;
      password: string;
    }
  >,
  res: Response,
) => {
  try {
    const result = await login(req.body);
    res
      .cookie(REFRESH_COOKIE_NAME, result.refreshToken, getRefreshCookieOptions())
      .status(200)
      .json({
        accessToken: result.accessToken,
        user: result.user,
      });
  } catch (error) {
    if (!handleAuthError(error, res)) {
      throw error;
    }
  }
};

export const refreshHandler = async (req: Request, res: Response) => {
  try {
    const result = await refresh(req.cookies?.[REFRESH_COOKIE_NAME] as string);
    res
      .cookie(REFRESH_COOKIE_NAME, result.refreshToken, getRefreshCookieOptions())
      .status(200)
      .json({
        accessToken: result.accessToken,
      });
  } catch (error) {
    clearRefreshCookie(res);
    if (!handleAuthError(error, res)) {
      throw error;
    }
  }
};

export const logoutHandler = async (req: AuthenticatedRequest, res: Response) => {
  await logout(req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined);
  clearRefreshCookie(res);
  res.status(204).send();
};

export const meHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await me(req.user.id);
    res.json(user);
  } catch (error) {
    if (!handleAuthError(error, res)) {
      throw error;
    }
  }
};
