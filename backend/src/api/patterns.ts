/**
 * Patterns API Routes
 * Manages recognized patterns from user interactions
 */

import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database';
import { logger } from '../utils/logger';
import { PatternRecognitionEngine } from '../services/patternRecognition';

export const patternsRouter = Router();
let patternEngine: PatternRecognitionEngine | null = null;

// Initialize pattern engine lazily
function getPatternEngine(): PatternRecognitionEngine {
  if (!patternEngine) {
    patternEngine = new PatternRecognitionEngine();
  }
  return patternEngine;
}

/**
 * GET /api/patterns
 * List all recognized patterns
 */
patternsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const {
      sessionId,
      type,
      minConfidence = '0',
      limit = '100',
      offset = '0',
    } = req.query;
    
    const db = getDatabase();
    
    let query = 'SELECT * FROM patterns WHERE 1=1';
    const params: unknown[] = [];
    
    if (sessionId) {
      query += ' AND session_id = ?';
      params.push(sessionId);
    }
    
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    
    if (minConfidence) {
      query += ' AND confidence >= ?';
      params.push(Number(minConfidence));
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    
    const patterns = db.prepare(query).all(...params);
    
    // Parse JSON fields
    const parsedPatterns = patterns.map((pattern: Record<string, unknown>) => ({
      ...pattern,
      event_ids: JSON.parse(pattern.event_ids as string),
      metadata: pattern.metadata ? JSON.parse(pattern.metadata as string) : null,
    }));
    
    res.json({
      patterns: parsedPatterns,
      count: parsedPatterns.length,
      offset: Number(offset),
      limit: Number(limit),
    });
  } catch (error) {
    logger.error('Failed to fetch patterns', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch patterns',
    });
  }
});

/**
 * GET /api/patterns/definitions
 * Get all pattern definitions
 */
patternsRouter.get('/definitions', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    
    const definitions = db.prepare(`
      SELECT * FROM pattern_definitions 
      ORDER BY name ASC
    `).all();
    
    // Parse rules JSON
    const parsedDefinitions = definitions.map((def: Record<string, unknown>) => ({
      ...def,
      rules: JSON.parse(def.rules as string),
      is_active: Boolean(def.is_active),
    }));
    
    res.json({
      definitions: parsedDefinitions,
      count: parsedDefinitions.length,
    });
  } catch (error) {
    logger.error('Failed to fetch pattern definitions', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch pattern definitions',
    });
  }
});

/**
 * POST /api/patterns/definitions
 * Create a new pattern definition
 */
patternsRouter.post('/definitions', async (req: Request, res: Response) => {
  try {
    const { id, name, description, type, rules } = req.body;
    
    if (!id || !name || !type || !rules) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Required fields: id, name, type, rules',
      });
    }
    
    const db = getDatabase();
    
    const stmt = db.prepare(`
      INSERT INTO pattern_definitions (id, name, description, type, rules)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, name, description || null, type, JSON.stringify(rules));
    
    res.status(201).json({
      id,
      name,
      description,
      type,
      rules,
      is_active: true,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Pattern definition with this ID already exists',
      });
    }
    
    logger.error('Failed to create pattern definition', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create pattern definition',
    });
  }
});

/**
 * PUT /api/patterns/definitions/:id
 * Update a pattern definition
 */
patternsRouter.put('/definitions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, type, rules, is_active } = req.body;
    
    const db = getDatabase();
    
    const existing = db.prepare('SELECT * FROM pattern_definitions WHERE id = ?').get(id);
    
    if (!existing) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Pattern definition not found',
      });
    }
    
    const stmt = db.prepare(`
      UPDATE pattern_definitions 
      SET name = ?, description = ?, type = ?, rules = ?, is_active = ?, updated_at = ?
      WHERE id = ?
    `);
    
    stmt.run(
      name || (existing as Record<string, unknown>).name,
      description !== undefined ? description : (existing as Record<string, unknown>).description,
      type || (existing as Record<string, unknown>).type,
      rules ? JSON.stringify(rules) : (existing as Record<string, unknown>).rules,
      is_active !== undefined ? (is_active ? 1 : 0) : (existing as Record<string, unknown>).is_active,
      Date.now(),
      id
    );
    
    const updated = db.prepare('SELECT * FROM pattern_definitions WHERE id = ?').get(id) as Record<string, unknown>;
    
    res.json({
      ...updated,
      rules: JSON.parse(updated.rules as string),
      is_active: Boolean(updated.is_active),
    });
  } catch (error) {
    logger.error('Failed to update pattern definition', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update pattern definition',
    });
  }
});

/**
 * DELETE /api/patterns/definitions/:id
 * Delete a pattern definition
 */
patternsRouter.delete('/definitions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const result = db.prepare('DELETE FROM pattern_definitions WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Pattern definition not found',
      });
    }
    
    res.status(204).send();
  } catch (error) {
    logger.error('Failed to delete pattern definition', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete pattern definition',
    });
  }
});

/**
 * GET /api/patterns/:id
 * Get a single pattern with its events
 */
patternsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const pattern = db.prepare('SELECT * FROM patterns WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    
    if (!pattern) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Pattern not found',
      });
    }
    
    const eventIds = JSON.parse(pattern.event_ids as string) as string[];
    
    // Get the events that make up this pattern
    const events = db.prepare(`
      SELECT * FROM events 
      WHERE id IN (${eventIds.map(() => '?').join(',')})
      ORDER BY timestamp ASC
    `).all(...eventIds);
    
    res.json({
      ...pattern,
      event_ids: eventIds,
      metadata: pattern.metadata ? JSON.parse(pattern.metadata as string) : null,
      events: events.map((e: Record<string, unknown>) => ({
        ...e,
        data: JSON.parse(e.data as string),
      })),
    });
  } catch (error) {
    logger.error('Failed to fetch pattern', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch pattern',
    });
  }
});

/**
 * POST /api/patterns/analyze/:sessionId
 * Analyze a session for patterns
 */
patternsRouter.post('/analyze/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    logger.info(`Analyzing session ${sessionId} for patterns`);
    const patterns = getPatternEngine().analyzeSession(sessionId);
    
    res.json({
      success: true,
      sessionId,
      patternsFound: patterns.length,
      patterns,
    });
  } catch (error) {
    logger.error('Failed to analyze session', { error, sessionId: req.params.sessionId });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to analyze session',
    });
  }
});

/**
 * GET /api/patterns/stats/summary
 * Get pattern statistics
 */
patternsRouter.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    
    const totalPatterns = db.prepare('SELECT COUNT(*) as count FROM patterns').get() as { count: number };
    
    const patternsByType = db.prepare(`
      SELECT type, COUNT(*) as count, AVG(confidence) as avg_confidence
      FROM patterns
      GROUP BY type
      ORDER BY count DESC
    `).all();
    
    const avgConfidence = db.prepare(`
      SELECT AVG(confidence) as avg FROM patterns
    `).get() as { avg: number };
    
    res.json({
      totalPatterns: totalPatterns.count,
      patternsByType,
      avgConfidence: avgConfidence.avg || 0,
    });
  } catch (error) {
    logger.error('Failed to fetch pattern stats', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch pattern stats',
    });
  }
});
