import { Router } from 'express';
import { chatRouter } from './chat.routes';
import { adminRouter } from './admin.routes';
import { authRouter } from './auth.routes';
import { aiRouter } from './ai.routes';

export const router = Router();

router.get('/status', (_req, res) => {
  res.json({
    ok: true,
    services: {
      backend: { status: 'healthy' }
    }
  });
});

router.use('/auth', authRouter);
router.use('/ai', aiRouter);
router.use('/chat', chatRouter);
router.use('/admin', adminRouter);

