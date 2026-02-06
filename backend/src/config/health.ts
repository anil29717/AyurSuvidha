import axios from 'axios';
import type { Connection } from 'mongoose';
import type { RedisClientType } from 'redis';
import { env } from './env';

export interface ServiceStatus {
  status: 'healthy' | 'warning' | 'down';
  detail?: string;
  latencyMs?: number;
  extra?: Record<string, unknown>;
}

export interface HealthSnapshot {
  backend: ServiceStatus;
  ai: ServiceStatus;
  mongo?: ServiceStatus;
  redis?: ServiceStatus;
}

export async function checkAiService(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const res = await axios.get(`${env.aiServiceUrl}/api/v1/ai/model-status`, { timeout: 1500 });
    const latencyMs = Date.now() - start;
    return {
      status: 'healthy',
      latencyMs,
      extra: {
        vectors: res.data?.vectors,
        embeddings_model: res.data?.embeddings_model,
        llm_provider: res.data?.llm_provider,
        llm_connected: res.data?.llm_connected
      }
    };
  } catch (err: any) {
    return {
      status: 'down',
      detail: err?.message || 'AI service unreachable'
    };
  }
}

export async function checkMongo(conn?: Connection): Promise<ServiceStatus> {
  if (!conn) {
    return { status: 'down', detail: 'Mongo connection not configured' };
  }
  const start = Date.now();
  try {
    if (!conn.db) {
      return { status: 'down', detail: 'Mongo DB instance not available' };
    }
    await conn.db.admin().ping();
    const latencyMs = Date.now() - start;
    return { status: 'healthy', latencyMs };
  } catch (err: any) {
    return { status: 'down', detail: err?.message || 'Mongo ping failed' };
  }
}

export async function checkRedis(client?: RedisClientType): Promise<ServiceStatus> {
  if (!client) {
    return { status: 'down', detail: 'Redis client not configured' };
  }
  const start = Date.now();
  try {
    const pong = await client.ping();
    const latencyMs = Date.now() - start;
    return {
      status: pong === 'PONG' ? 'healthy' : 'warning',
      latencyMs
    };
  } catch (err: any) {
    return { status: 'down', detail: err?.message || 'Redis ping failed' };
  }
}

