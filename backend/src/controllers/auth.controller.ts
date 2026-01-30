import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { io } from '../socket';
import { logAudit } from '../services/audit.service';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, age, gender, healthGoals } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      age,
      gender,
      healthGoals
    });

    await user.save();

    // Notify admins
    if (io) {
      io.to('admin_room').emit('new_user', {
        name: user.name,
        email: user.email,
        timestamp: new Date().toISOString()
      });
    }

    // Audit Log
    logAudit({
      action: 'SIGNUP',
      actor: { id: user._id.toString(), email: user.email, role: user.role, ip: req.ip },
      target: `User: ${user.email}`,
      details: { name: user.name }
    });

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        dosha: user.dosha
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Audit Log
    logAudit({
      action: 'LOGIN',
      actor: { id: user._id.toString(), email: user.email, role: user.role, ip: req.ip },
      target: `User: ${user.email}`,
      details: { method: 'email_password' }
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        dosha: user.dosha
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
