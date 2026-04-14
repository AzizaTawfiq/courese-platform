import { Router } from 'express';
import { authRateLimiter } from '../../middleware/rateLimiter.js';

const authRouter = Router();

authRouter.post('/register', authRateLimiter, (_req, res) => {
  res.status(501).json({ message: 'Register endpoint not implemented yet.' });
});

authRouter.post('/login', authRateLimiter, (_req, res) => {
  res.status(501).json({ message: 'Login endpoint not implemented yet.' });
});

authRouter.post('/refresh', authRateLimiter, (_req, res) => {
  res.status(501).json({ message: 'Refresh endpoint not implemented yet.' });
});

authRouter.post('/logout', (_req, res) => {
  res.status(501).json({ message: 'Logout endpoint not implemented yet.' });
});

authRouter.get('/me', (_req, res) => {
  res.status(501).json({ message: 'Profile endpoint not implemented yet.' });
});

export default authRouter;
