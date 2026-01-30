import { createClient, type RedisClientType } from 'redis';
import { env } from './env';

let client: RedisClientType | null = null;

export async function connectRedis() {
  if (client) return client;

  client = createClient({
    url: env.redisUrl
  });

  client.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('Redis Client Error', err);
  });

  await client.connect();
  return client;
}

export function getRedisClient(): RedisClientType | null {
  return client;
}

