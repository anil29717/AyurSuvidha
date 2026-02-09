import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { router } from './routes';

export function createApp() {
  const app = express();

  const frontendUrl = process.env.FRONTEND_URL;
  const allowedOrigins: string[] = [
    'http://localhost:2020', 
    'http://localhost:5173',
    'https://ayursuvidha.in'
  ];

  if (frontendUrl) {
    allowedOrigins.push(frontendUrl);
    try {
      if (frontendUrl.startsWith('http')) {
        const url = new URL(frontendUrl);
        const hostname = url.hostname;
        if (hostname.startsWith('www.')) {
          allowedOrigins.push(frontendUrl.replace('www.', ''));
        } else {
          allowedOrigins.push(frontendUrl.replace('://', '://www.'));
        }
      }
    } catch (e) {
      // ignore invalid URLs
    }
  }

  app.use(
    cors({
      origin: allowedOrigins,
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

