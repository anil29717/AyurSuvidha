import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { router } from './routes';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:2020',
      credentials: true
    })
  );
  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(morgan('dev'));

  app.use('/api/v1', router);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'backend', version: '0.1.0' });
  });

  return app;
}

