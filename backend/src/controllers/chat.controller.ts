import { Request, Response } from 'express';
import { Message } from '../models/Message';

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const messages = await Message.find({ userId }).sort({ timestamp: 1 });
    
    // Transform to frontend format
    const formatted = messages.map(m => ({
      id: m._id.toString(),
      sender: m.sender,
      content: m.content,
      citations: m.citations,
      timestamp: m.timestamp.toISOString()
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Chat History Error:', error);
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
};
