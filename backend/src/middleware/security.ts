/**
 * Security Middleware - Protection against common attacks
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Rate limiting map: IP -> {count, resetTime}
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limit: 100 requests per 15 minutes per IP
const RATE_LIMIT = 100;
const RATE_WINDOW = 15 * 60 * 1000; // 15 minutes

/**
 * Rate Limiting Middleware
 */
export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  let rateData = rateLimitMap.get(ip);

  // Reset if window expired
  if (!rateData || now > rateData.resetTime) {
    rateData = { count: 0, resetTime: now + RATE_WINDOW };
    rateLimitMap.set(ip, rateData);
  }

  rateData.count++;

  if (rateData.count > RATE_LIMIT) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
    });
  }

  next();
}

/**
 * Input Sanitization - Prevent XSS attacks
 */
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove potentially dangerous characters
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim()
      .slice(0, 10000); // Max length protection
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const key in input) {
      sanitized[key] = sanitizeInput(input[key]);
    }
    return sanitized;
  }

  return input;
}

/**
 * SQL Injection Protection - Validate input
 */
export function validateInput(req: Request, res: Response, next: NextFunction) {
  try {
    // Sanitize body
    if (req.body) {
      req.body = sanitizeInput(req.body);
    }

    // Sanitize query params
    if (req.query) {
      req.query = sanitizeInput(req.query);
    }

    // Check for SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
      /(;|\-\-|\/\*|\*\/|xp_|sp_)/i,
      /(UNION|OR|AND)\s+\d+\s*=\s*\d+/i,
    ];

    const checkForSQLInjection = (value: any): boolean => {
      if (typeof value === 'string') {
        return sqlPatterns.some(pattern => pattern.test(value));
      }
      if (Array.isArray(value)) {
        return value.some(checkForSQLInjection);
      }
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(checkForSQLInjection);
      }
      return false;
    };

    if (checkForSQLInjection(req.body) || checkForSQLInjection(req.query)) {
      logger.warn('SQL injection attempt detected', {
        ip: req.ip,
        path: req.path,
        body: req.body,
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid input detected',
      });
    }

    next();
  } catch (error) {
    logger.error('Input validation error', { error });
    next(error);
  }
}

/**
 * CSRF Protection - Validate origin
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Skip for GET requests
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // In production, validate against allowed origins
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL,
  ].filter(Boolean);

  const isValidOrigin = allowedOrigins.some(allowed => 
    origin?.startsWith(allowed || '') || referer?.startsWith(allowed || '')
  );

  if (!isValidOrigin && origin) {
    logger.warn('CSRF attempt detected', {
      origin,
      referer,
      ip: req.ip,
      path: req.path,
    });
    return res.status(403).json({
      success: false,
      message: 'Invalid request origin',
    });
  }

  next();
}

/**
 * Security Headers
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );

  next();
}

/**
 * Validate Email Format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Validate Password Strength
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (password.length > 128) {
    return { valid: false, message: 'Password must be less than 128 characters' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain lowercase letter' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain uppercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain number' };
  }
  return { valid: true };
}

/**
 * Clean up rate limit map periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 60000); // Clean up every minute
