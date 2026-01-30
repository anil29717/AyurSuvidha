import axios from 'axios';
import { env } from '../config/env';

export async function queryRag(message: string) {
  const url = `${env.aiServiceUrl}/api/v1/ai/rag-query`;
  const res = await axios.post(url, {
    query: message,
    user_context: null,
    top_k: 5
  });
  return res.data;
}

