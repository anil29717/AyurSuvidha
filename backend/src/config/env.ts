export const env = {
  port: Number(process.env.PORT) || 2021,
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://ayursuvidha:ayursuvidha@ayursuvidha.c797abb.mongodb.net/?appName=ayursuvidha',
  redisUrl: process.env.REDIS_URL || 'redis://default:bqt2MSIzRO0ciyOgelIOzX3OVrJDd0ql@redis-14439.c90.us-east-1-3.ec2.cloud.redislabs.com:14439'
};

