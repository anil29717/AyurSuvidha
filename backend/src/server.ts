import 'dotenv/config';
import http from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { connectMongo } from './config/mongo';
import { connectRedis } from './config/redis';
import { initSocket } from './socket';

async function bootstrap() {
  try {
    await Promise.all([connectMongo(), connectRedis()]);
    const app = createApp();
    const server = http.createServer(app);
    
    // Initialize Socket.IO
    initSocket(server);

    server.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend server running on http://localhost:${env.port}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start backend server', err);
    process.exit(1);
  }
}

bootstrap();

