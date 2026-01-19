/**
 * Backend Server Entry Point
 * Handles API routes for authentication, projects, events, and asset management
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { eventsRouter } from './api/events';
import { sessionsRouter } from './api/sessions';
import { authRouter } from './api/auth';
import { projectsRouter } from './api/projects';
import { assetsRouter } from './api/assets';
import { webhookRouter } from './api/webhook';
import { initPostgresPool, initializeSchema } from './db/postgres';
import { logger } from './utils/logger';
import { 
  rateLimiter, 
  validateInput, 
  csrfProtection, 
  securityHeaders 
} from './middleware/security';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware (FIRST)
app.use(securityHeaders);
app.use(rateLimiter);

// Core middleware
app.use(helmet());
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL, process.env.VERCEL_URL].filter((url): url is string => Boolean(url))
  : ['http://localhost:3000', 'http://localhost:3002'];
  
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '1mb' })); // Reduced from 10mb for security

// Input validation and CSRF protection
app.use(validateInput);
// Temporarily disable CSRF for testing
// app.use(csrfProtection);

// Initialize PostgreSQL for serverless
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      initPostgresPool();
      await initializeSchema();
      dbInitialized = true;
      logger.info('PostgreSQL initialized for serverless request');
    } catch (error) {
      logger.error('Database initialization failed:', error);
      return res.status(500).json({ error: 'Database initialization failed' });
    }
  }
  next();
});

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: Date.now() });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/webhook', webhookRouter);
app.use('/api/events', eventsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/assets', assetsRouter);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
async function start() {
  try {
    // Initialize database
    await initDatabase();
    logger.info('Database initialized');
    
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.info('Event collection ready');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// For local development
if (require.main === module) {
  start();
}

// For Vercel serverless deployment
export default app;
