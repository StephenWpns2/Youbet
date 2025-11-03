import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private subscriber: Redis;
  private publisher: Redis;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const config = {
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    };

    this.client = new Redis(config);
    this.subscriber = new Redis(config);
    this.publisher = new Redis(config);

    this.client.on('connect', () => console.log('✅ Redis connected'));
    this.client.on('error', (err) => console.error('❌ Redis error:', err));
  }

  async onModuleDestroy() {
    await this.client.quit();
    await this.subscriber.quit();
    await this.publisher.quit();
    console.log('🔌 Redis disconnected');
  }

  // ============================================================================
  // KEY-VALUE OPERATIONS
  // ============================================================================

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, serialized);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  // ============================================================================
  // HASH OPERATIONS
  // ============================================================================

  async hset(key: string, field: string, value: any): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    await this.client.hset(key, field, serialized);
  }

  async hget<T>(key: string, field: string): Promise<T | null> {
    const value = await this.client.hget(key, field);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  async hgetall<T>(key: string): Promise<Record<string, T>> {
    const values = await this.client.hgetall(key);
    const result: Record<string, T> = {};
    
    for (const [field, value] of Object.entries(values)) {
      try {
        result[field] = JSON.parse(value) as T;
      } catch {
        result[field] = value as T;
      }
    }
    
    return result;
  }

  async hdel(key: string, field: string): Promise<void> {
    await this.client.hdel(key, field);
  }

  // ============================================================================
  // SORTED SET OPERATIONS (for leaderboards)
  // ============================================================================

  async zadd(key: string, score: number, member: string): Promise<void> {
    await this.client.zadd(key, score, member);
  }

  async zrevrange(key: string, start: number, stop: number, withScores = false): Promise<string[]> {
    if (withScores) {
      return this.client.zrevrange(key, start, stop, 'WITHSCORES');
    }
    return this.client.zrevrange(key, start, stop);
  }

  async zrank(key: string, member: string): Promise<number | null> {
    return this.client.zrank(key, member);
  }

  async zscore(key: string, member: string): Promise<number | null> {
    const score = await this.client.zscore(key, member);
    return score ? parseFloat(score) : null;
  }

  async zrem(key: string, member: string): Promise<void> {
    await this.client.zrem(key, member);
  }

  async zcard(key: string): Promise<number> {
    return this.client.zcard(key);
  }

  // ============================================================================
  // LIST OPERATIONS (for feeds)
  // ============================================================================

  async lpush(key: string, ...values: string[]): Promise<void> {
    await this.client.lpush(key, ...values);
  }

  async rpush(key: string, ...values: string[]): Promise<void> {
    await this.client.rpush(key, ...values);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.client.lrange(key, start, stop);
  }

  async ltrim(key: string, start: number, stop: number): Promise<void> {
    await this.client.ltrim(key, start, stop);
  }

  async llen(key: string): Promise<number> {
    return this.client.llen(key);
  }

  // ============================================================================
  // PUB/SUB OPERATIONS
  // ============================================================================

  async publish(channel: string, message: any): Promise<void> {
    const serialized = typeof message === 'string' ? message : JSON.stringify(message);
    await this.publisher.publish(channel, serialized);
  }

  async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
    await this.subscriber.subscribe(channel);
    
    this.subscriber.on('message', (ch, msg) => {
      if (ch === channel) {
        try {
          callback(JSON.parse(msg));
        } catch {
          callback(msg);
        }
      }
    });
  }

  async unsubscribe(channel: string): Promise<void> {
    await this.subscriber.unsubscribe(channel);
  }

  // ============================================================================
  // RATE LIMITING
  // ============================================================================

  async incrementRateLimit(key: string, windowSeconds: number): Promise<number> {
    const current = await this.client.incr(key);
    
    if (current === 1) {
      await this.client.expire(key, windowSeconds);
    }
    
    return current;
  }

  async getRateLimit(key: string): Promise<number> {
    const value = await this.client.get(key);
    return value ? parseInt(value, 10) : 0;
  }

  // ============================================================================
  // CACHE INVALIDATION PATTERNS
  // ============================================================================

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  // ============================================================================
  // ATOMIC OPERATIONS
  // ============================================================================

  async setNX(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    
    if (ttlSeconds) {
      const result = await this.client.set(key, serialized, 'EX', ttlSeconds, 'NX');
      return result === 'OK';
    }
    
    const result = await this.client.setnx(key, serialized);
    return result === 1;
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async decr(key: string): Promise<number> {
    return this.client.decr(key);
  }

  // ============================================================================
  // BATCH OPERATIONS
  // ============================================================================

  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    const values = await this.client.mget(...keys);
    return values.map(v => {
      if (!v) return null;
      try {
        return JSON.parse(v) as T;
      } catch {
        return v as T;
      }
    });
  }

  async mset(entries: Array<{ key: string; value: any }>): Promise<void> {
    const args: string[] = [];
    for (const { key, value } of entries) {
      args.push(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
    await this.client.mset(...args);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  getClient(): Redis {
    return this.client;
  }

  getSubscriber(): Redis {
    return this.subscriber;
  }

  getPublisher(): Redis {
    return this.publisher;
  }
}

