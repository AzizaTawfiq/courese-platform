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
    if (this.client.status === 'wait') {
      await this.client.connect();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async set(key: string, value: unknown, ttlSeconds?: number) {
    const payload = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.set(key, payload, 'EX', ttlSeconds);
      return;
    }

    await this.client.set(key, payload);
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async invalidatePrefix(prefix: string) {
    const keys = await this.client.keys(`${prefix}*`);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }
}

export const cacheService = new CacheService();
