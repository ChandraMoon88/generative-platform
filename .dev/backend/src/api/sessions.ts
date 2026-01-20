/**
 * Sessions API Routes
 * Manages user sessions for event grouping
 */

import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database';
import { logger } from '../utils/logger';

export const sessionsRouter = Router();

/**
 * GET /api/sessions
 * List all sessions with pagination
 */
sessionsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      startTime,
      endTime,
      limit = '50',
      offset = '0',
    } = req.query;
    
    const db = getDatabase();
    
    let query = 'SELECT * FROM sessions WHERE 1=1';
    const params: unknown[] = [];
    
    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }
    
    if (startTime) {
      query += ' AND start_time >= ?';
      params.push(Number(startTime));
    }
    
    if (endTime) {
      query += ' AND start_time <= ?';
      params.push(Number(endTime));
    }
    
    query += ' ORDER BY start_time DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    
    const sessions = db.prepare(query).all(...params);
    
    // Parse metadata for each session
    const parsedSessions = sessions.map((session: Record<string, unknown>) => ({
      ...session,
      metadata: session.metadata ? JSON.parse(session.metadata as string) : null,
    }));
    
    res.json({
      sessions: parsedSessions,
      count: parsedSessions.length,
      offset: Number(offset),
      limit: Number(limit),
    });
  } catch (error) {
    logger.error('Failed to fetch sessions', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch sessions',
    });
  }
});

/**
 * GET /api/sessions/:id
 * Get a single session with its events
 */
sessionsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { includeEvents = 'false' } = req.query;
    
    const db = getDatabase();
    
    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    
    if (!session) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Session not found',
      });
    }
    
    const result: Record<string, unknown> = {
      ...session,
      metadata: session.metadata ? JSON.parse(session.metadata as string) : null,
    };
    
    if (includeEvents === 'true') {
      const events = db.prepare(`
        SELECT * FROM events 
        WHERE session_id = ? 
        ORDER BY timestamp ASC
      `).all(id);
      
      result.events = events.map((e: Record<string, unknown>) => ({
        ...e,
        data: JSON.parse(e.data as string),
      }));
    }
    
    // Get patterns for this session
    const patterns = db.prepare(`
      SELECT * FROM patterns 
      WHERE session_id = ?
      ORDER BY start_time ASC
    `).all(id);
    
    result.patterns = patterns.map((p: Record<string, unknown>) => ({
      ...p,
      event_ids: JSON.parse(p.event_ids as string),
      metadata: p.metadata ? JSON.parse(p.metadata as string) : null,
    }));
    
    res.json(result);
  } catch (error) {
    logger.error('Failed to fetch session', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch session',
    });
  }
});

/**
 * POST /api/sessions/:id/analyze
 * Trigger pattern analysis for a session
 */
sessionsRouter.post('/:id/analyze', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(id);
    
    if (!session) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Session not found',
      });
    }
    
    // Get all events for this session
    const events = db.prepare(`
      SELECT * FROM events 
      WHERE session_id = ? 
      ORDER BY timestamp ASC
    `).all(id);
    
    // Trigger pattern recognition (to be implemented)
    // For now, just return placeholder
    
    res.json({
      message: 'Analysis queued',
      sessionId: id,
      eventCount: (events as unknown[]).length,
    });
  } catch (error) {
    logger.error('Failed to analyze session', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to analyze session',
    });
  }
});

/**
 * DELETE /api/sessions/:id
 * Delete a session and its events
 */
sessionsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const deleteTransaction = db.transaction(() => {
      // Delete patterns first
      db.prepare('DELETE FROM patterns WHERE session_id = ?').run(id);
      
      // Delete events
      db.prepare('DELETE FROM events WHERE session_id = ?').run(id);
      
      // Delete session
      const result = db.prepare('DELETE FROM sessions WHERE id = ?').run(id);
      
      return result.changes;
    });
    
    const changes = deleteTransaction();
    
    if (changes === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Session not found',
      });
    }
    
    res.status(204).send();
  } catch (error) {
    logger.error('Failed to delete session', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete session',
    });
  }
});

/**
 * GET /api/sessions/stats/summary
 * Get session statistics
 */
sessionsRouter.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    
    const totalSessions = db.prepare('SELECT COUNT(*) as count FROM sessions').get() as { count: number };
    
    const avgEventsPerSession = db.prepare(`
      SELECT AVG(event_count) as avg 
      FROM sessions
    `).get() as { avg: number };
    
    const sessionsByDate = db.prepare(`
      SELECT 
        date(start_time / 1000, 'unixepoch') as date,
        COUNT(*) as count
      FROM sessions
      GROUP BY date
      ORDER BY date DESC
      LIMIT 30
    `).all();
    
    res.json({
      totalSessions: totalSessions.count,
      avgEventsPerSession: avgEventsPerSession.avg || 0,
      sessionsByDate,
    });
  } catch (error) {
    logger.error('Failed to fetch session stats', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch session stats',
    });
  }
});
