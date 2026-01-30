export const env = {
  port: Number(process.env.PORT) || 2021,
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ayurai',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
};

