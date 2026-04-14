import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { authRateLimiter } from '../../middleware/rateLimiter.js';
import { validate } from '../../middleware/validate.js';
import {
  loginHandler,
  logoutHandler,
  meHandler,
  refreshHandler,
  registerHandler,
} from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.schema.js';

const authRouter = Router();

authRouter.post('/register', authRateLimiter, validate(registerSchema), registerHandler);
authRouter.post('/login', authRateLimiter, validate(loginSchema), loginHandler);
authRouter.post('/refresh', authRateLimiter, refreshHandler);
authRouter.post('/logout', logoutHandler);
authRouter.get('/me', authMiddleware, meHandler);

export default authRouter;
