import { Redis } from 'ioredis';

class CacheService {
  private readonly client: Redis;

  constructor() {
    const url = process.env.REDIS_URL;
    this.client = new Redis(url ?? 'redis://localhost:6379', {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
  }

  async connect() {
    try {
      if (this.client.status === 'wait') {
        await this.client.connect();
      }
    } catch {
      // Redis is optional during local development.
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number) {
    try {
      const payload = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.set(key, payload, 'EX', ttlSeconds);
        return;
      }

      await this.client.set(key, payload);
    } catch {
      // Ignore cache write failures and keep the primary response path healthy.
    }
  }

  async del(key: string) {
    try {
      await this.client.del(key);
    } catch {
      // Ignore cache delete failures.
    }
  }

  async invalidatePrefix(prefix: string) {
    try {
      const keys = await this.client.keys(`${prefix}*`);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch {
      // Ignore cache invalidation failures.
    }
  }
}

export const cacheService = new CacheService();
