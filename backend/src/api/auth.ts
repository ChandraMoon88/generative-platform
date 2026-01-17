/**
 * Authentication API Routes
 * Handles user registration and login for client server
 */

import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { isValidEmail, isValidPassword } from '../middleware/security';

export const authRouter = Router();

// Secure password hashing with salt
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const useSalt = salt || crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, useSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: useSalt };
}

// Verify password
function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: newHash } = hashPassword(password, salt);
  return hash === newHash;
}

/**
 * POST /api/auth/register
 * Register a new user (defaults to 'client' role)
 */
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const db = getDatabase();

    // Check if user already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create user (default role is 'client', only allow 'admin' if explicitly set)
    const userId = uuidv4();
    const hashedPassword = hashPassword(password);
    const createdAt = Date.now();
    const userRole = role === 'admin' ? 'admin' : 'client';

    db.prepare(`
      INSERT INTO users (id, name, email, password, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, name, email, hashedPassword, userRole, createdAt, createdAt);

    // Generate simple token (userId:timestamp)
    const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64');

    logger.info(`User registered: ${email} (role: ${userRole})`);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      userId,
      token,
      user: { id: userId, name, email, role: userRole },
    });
  } catch (error) {
    logger.error('Registration failed', { error });
    res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
});

/**
 * POST /api/auth/login
 * Login existing user
 */
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const db = getDatabase();
    const hashedPassword = hashPassword(password);

    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?')
      .get(email, hashedPassword) as Record<string, unknown> | undefined;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    // Update last login
    db.prepare('UPDATE users SET updated_at = ? WHERE id = ?')
      .run(Date.now(), user.id);

    logger.info(`User logged in: ${email} (role: ${user.role})`);

    res.json({
      success: true,
      message: 'Login successful',
      userId: user.id,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Login failed', { error });
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
authRouter.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const decoded = Buffer.from(token, 'base64').toString();
    const [userId] = decoded.split(':');

    const db = getDatabase();
    const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?')
      .get(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    logger.error('Get user failed', { error });
    res.status(500).json({ success: false, message: 'Failed to get user info' });
  }
});
