import { Router } from 'express';
import { getChatHistory } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';

export const chatRouter = Router();

// Used for fetching history (protected)
chatRouter.get('/history', authenticate, getChatHistory);

