import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Hash password with salt
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const useSalt = salt || crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, useSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: useSalt };
}

// Validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
function isValidPassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true, message: 'Valid password' };
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordCheck = isValidPassword(password);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { success: false, message: passwordCheck.message },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create user (default role is 'client')
    const userId = uuidv4();
    const { hash, salt } = hashPassword(password);
    const createdAt = Date.now();
    const userRole = role === 'admin' ? 'admin' : 'client';

    await pool.query(`
      INSERT INTO users (id, name, email, password, salt, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [userId, name, email, hash, salt, userRole, createdAt, createdAt]);

    // Generate simple token
    const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      token,
      userId,
      user: {
        id: userId,
        name,
        email,
        role: userRole,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
