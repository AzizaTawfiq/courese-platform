import 'dotenv/config';
import { createApp } from './app.js';
import { cacheService } from './services/cache.service.js';

const port = Number(process.env.PORT ?? 3000);
const app = createApp();

async function bootstrap() {
  try {
    await cacheService.connect();
  } catch (error) {
    console.warn(
      'Redis connection failed, continuing without warm cache.',
      error,
    );
  }

  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});
