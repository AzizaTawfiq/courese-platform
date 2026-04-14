import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'node:path';
import apiRouter from './routes/index.js';

export const createApp = () => {
  const app = express();
  const publicDir = path.resolve(process.cwd(), 'public');
  const corsOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .filter(Boolean);
  const uploadDir = path.resolve(
    process.cwd(),
    process.env.UPLOAD_DIR ?? 'uploads',
  );

  app.use(
    cors({
      origin: corsOrigins.length > 0 ? corsOrigins : true,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use('/uploads', express.static(uploadDir));
  app.get('/robots.txt', (_req, res) => {
    res.sendFile(path.join(publicDir, 'robots.txt'));
  });
  app.use('/public', express.static(publicDir));
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  app.use('/api/v1', apiRouter);

  return app;
};
