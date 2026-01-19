/**
 * Logger Utility
 * Centralized logging with Winston
 */

import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

// Transports configuration - only file logging in development
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat
    ),
  })
];

// Only add file transports in development (not in serverless/production)
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  );
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports,
});

// Create logs directory if it doesn't exist (only in development)
if (process.env.NODE_ENV !== 'production') {
  import('fs').then(({ mkdirSync, existsSync }) => {
    if (!existsSync('logs')) {
      mkdirSync('logs');
    }
  }).catch(() => {
    // Ignore errors in production
  });
}
