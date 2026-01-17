/**
 * Backend Server Entry Point
 * Handles event collection, pattern recognition, and model building
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { eventsRouter } from './api/events';
import { patternsRouter } from './api/patterns';
import { modelsRouter } from './api/models';
import { sessionsRouter } from './api/sessions';
import { generatorRouter } from './api/generator';
import { authRouter } from './api/auth';
import { assetsRouter } from './api/assets';
import { initDatabase } from './db/database';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));

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
app.use('/api/events', eventsRouter);
app.use('/api/patterns', patternsRouter);
app.use('/api/models', modelsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/generate', generatorRouter);
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

start();
