/**
 * Events API Routes
 * Handles incoming events from frontend instrumentation
 */

import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export const eventsRouter = Router();

interface IncomingEvent {
  id?: string;
  sessionId: string;
  userId?: string;
  type: string;
  timestamp: number;
  [key: string]: unknown;
}

interface BatchEventsRequest {
  events: IncomingEvent[];
}

/**
 * POST /api/events
 * Receive a batch of events from the frontend
 */
eventsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { events }: BatchEventsRequest = req.body;
    
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Expected array of events',
      });
    }
    
    const db = getDatabase();
    const insertEvent = db.prepare(`
      INSERT INTO events (id, session_id, user_id, type, timestamp, data)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const updateSession = db.prepare(`
      INSERT INTO sessions (id, user_id, start_time, event_count)
      VALUES (?, ?, ?, 1)
      ON CONFLICT(id) DO UPDATE SET
        event_count = event_count + 1,
        end_time = ?
    `);
    
    // Process events (sql.js doesn't support transactions, process sequentially)
    const processedIds: string[] = [];
    
    for (const event of events) {
      const eventId = event.id || uuidv4();
      const { sessionId, userId, type, timestamp, ...data } = event;
      
      // Store event
      insertEvent.run(
        eventId,
        sessionId,
        userId || null,
        type,
        timestamp,
        JSON.stringify(data)
      );
      
      // Update session
      updateSession.run(sessionId, userId || null, timestamp, timestamp);
      
      processedIds.push(eventId);
    }
    
    logger.debug(`Processed ${processedIds.length} events`);
    
    res.status(201).json({
      success: true,
      count: processedIds.length,
      ids: processedIds,
    });
  } catch (error) {
    logger.error('Failed to process events', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process events',
    });
  }
});

/**
 * GET /api/events
 * Query events with optional filters
 */
eventsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const {
      sessionId,
      type,
      startTime,
      endTime,
      limit = '100',
      offset = '0',
    } = req.query;
    
    const db = getDatabase();
    
    let query = 'SELECT * FROM events WHERE 1=1';
    const params: unknown[] = [];
    
    if (sessionId) {
      query += ' AND session_id = ?';
      params.push(sessionId);
    }
    
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    
    if (startTime) {
      query += ' AND timestamp >= ?';
      params.push(Number(startTime));
    }
    
    if (endTime) {
      query += ' AND timestamp <= ?';
      params.push(Number(endTime));
    }
    
    query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    
    const events = db.prepare(query).all(...params);
    
    // Parse JSON data for each event
    const parsedEvents = events.map((event: Record<string, unknown>) => ({
      ...event,
      data: JSON.parse(event.data as string),
    }));
    
    res.json({
      events: parsedEvents,
      count: parsedEvents.length,
      offset: Number(offset),
      limit: Number(limit),
    });
  } catch (error) {
    logger.error('Failed to fetch events', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch events',
    });
  }
});

/**
 * GET /api/events/:id
 * Get a single event by ID
 */
eventsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    
    if (!event) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Event not found',
      });
    }
    
    res.json({
      ...event,
      data: JSON.parse(event.data as string),
    });
  } catch (error) {
    logger.error('Failed to fetch event', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch event',
    });
  }
});

/**
 * DELETE /api/events/:id
 * Delete an event by ID
 */
eventsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const result = db.prepare('DELETE FROM events WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Event not found',
      });
    }
    
    res.status(204).send();
  } catch (error) {
    logger.error('Failed to delete event', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete event',
    });
  }
});

/**
 * GET /api/events/stats/summary
 * Get event statistics
 */
eventsRouter.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    
    const totalEvents = db.prepare('SELECT COUNT(*) as count FROM events').get() as { count: number };
    const eventsByType = db.prepare(`
      SELECT type, COUNT(*) as count 
      FROM events 
      GROUP BY type 
      ORDER BY count DESC
    `).all();
    const recentEvents = db.prepare(`
      SELECT * FROM events 
      ORDER BY timestamp DESC 
      LIMIT 10
    `).all();
    
    res.json({
      totalEvents: totalEvents.count,
      eventsByType,
      recentEvents: recentEvents.map((e: Record<string, unknown>) => ({
        ...e,
        data: JSON.parse(e.data as string),
      })),
    });
  } catch (error) {
    logger.error('Failed to fetch event stats', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch event stats',
    });
  }
});
