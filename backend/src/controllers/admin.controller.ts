import { Request, Response, NextFunction } from 'express';
import { getMongoConnection } from '../config/mongo';
import { getRedisClient } from '../config/redis';
import { checkAiService, checkMongo, checkRedis, type HealthSnapshot } from '../config/health';
import { User } from '../models/User';
import { Message } from '../models/Message';
import { logAudit } from '../services/audit.service';
import { AuditLog } from '../models/AuditLog';

export async function getSystemStatus(_req: Request, res: Response, next: NextFunction) {
  try {
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

    return res.json({
      ok: true,
      snapshot,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return next(err);
  }
}

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    logAudit({
      action: 'UPDATE_ROLE',
      actor: { id: (req as any).user.userId, role: (req as any).user.role, ip: req.ip },
      target: `User: ${user.email}`,
      details: { oldRole: 'unknown', newRole: role }
    });

    res.json({ message: 'Role updated', user });
  } catch (err) {
    next(err);
  }
}

export async function getChatLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const logs = await Message.find()
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(logs);
  } catch (err) {
    next(err);
  }
}

export async function getAuditLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const logs = await AuditLog.find()
      .sort({ timestamp: -1 })
      .limit(200);
    res.json(logs);
  } catch (err) {
    next(err);
  }
}

