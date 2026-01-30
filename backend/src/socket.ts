import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import axios from 'axios';
import { Message } from './models/Message';
import { checkAiService, checkMongo, checkRedis, type HealthSnapshot } from './config/health';
import { getMongoConnection } from './config/mongo';
import { getRedisClient } from './config/redis';
import { env } from './config/env';

export let io: Server;
let activeUsers = 0;

export function initSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:2020',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Health Broadcasting Loop (Every 5 seconds)
  setInterval(async () => {
    const mongoConn = getMongoConnection();
    const redisClient = getRedisClient();

    const [ai, mongo, redis] = await Promise.all([
      checkAiService(),
      checkMongo(mongoConn),
      checkRedis(redisClient || undefined)
    ]);

    const snapshot: HealthSnapshot = {
      backend: { status: 'healthy' },
      ai,
      mongo,
      redis
    };

    io.to('admin_room').emit('system_status', {
      snapshot,
      timestamp: new Date().toISOString()
    });
  }, 5000);

  io.on('connection', (socket: Socket) => {
    activeUsers++;
    console.log(`Socket connected: ${socket.id}. Active users: ${activeUsers}`);
    
    // Broadcast active user count
    io.emit('active_users', { count: activeUsers });

    socket.on('join_admin', () => {
      socket.join('admin_room');
    });

    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('send_message', async (data: any) => {
      console.log('Message received:', data);
      const { content, userId } = data;

      // Save User Message
      if (userId) {
        try {
          await Message.create({
            userId,
            sender: 'user',
            content
          });
        } catch (err) {
          console.error('Failed to save user message:', err);
        }
      }
      
      // Simulate typing delay
      socket.emit('typing', { sender: 'bot' });
      
      try {
        // Call AI Service
        const aiResponse = await axios.post(`${env.aiServiceUrl}/api/v1/ai/rag-query`, {
          query: content,
          top_k: 3
        });

        const answer = aiResponse.data.answer;
        const citations = aiResponse.data.citations || [];

        // Save Bot Message
        if (userId) {
          try {
            await Message.create({
              userId,
              sender: 'bot',
              content: answer,
              citations
            });
          } catch (err) {
            console.error('Failed to save bot message:', err);
          }
        }

        socket.emit('stop_typing', { sender: 'bot' });
        
        // Emit back to sender
        socket.emit('receive_message', {
          id: Date.now().toString(),
          sender: 'bot',
          content: answer,
          citations: citations,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('AI Service Error:', error);
        socket.emit('stop_typing', { sender: 'bot' });
        socket.emit('receive_message', {
          id: Date.now().toString(),
          sender: 'bot',
          content: "I'm having trouble connecting to my Ayurvedic knowledge base right now. Please try again later.",
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('disconnect', () => {
      activeUsers--;
      io.emit('active_users', { count: activeUsers });
      console.log(`Socket disconnected: ${socket.id}. Active users: ${activeUsers}`);
    });
  });

  return io;
}
