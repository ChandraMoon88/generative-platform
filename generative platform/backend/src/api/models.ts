/**
 * Models API Routes
 * Manages synthesized application models
 */

import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export const modelsRouter = Router();

/**
 * GET /api/models
 * List all application models
 */
modelsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const {
      minConfidence = '0',
      limit = '50',
      offset = '0',
    } = req.query;
    
    const db = getDatabase();
    
    let query = 'SELECT * FROM app_models WHERE 1=1';
    const params: unknown[] = [];
    
    if (minConfidence) {
      query += ' AND (confidence >= ? OR confidence IS NULL)';
      params.push(Number(minConfidence));
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    
    const models = db.prepare(query).all(...params);
    
    // Parse JSON fields
    const parsedModels = models.map((model: Record<string, unknown>) => ({
      ...model,
      data: JSON.parse(model.data as string),
      pattern_ids: model.pattern_ids ? JSON.parse(model.pattern_ids as string) : null,
    }));
    
    res.json({
      models: parsedModels,
      count: parsedModels.length,
      offset: Number(offset),
      limit: Number(limit),
    });
  } catch (error) {
    logger.error('Failed to fetch models', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch models',
    });
  }
});

/**
 * POST /api/models
 * Create a new application model
 */
modelsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, data, patternIds, confidence } = req.body;
    
    if (!name || !data) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Required fields: name, data',
      });
    }
    
    const db = getDatabase();
    const id = uuidv4();
    const version = '1.0.0';
    
    const stmt = db.prepare(`
      INSERT INTO app_models (id, version, name, description, data, pattern_ids, confidence)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      version,
      name,
      description || null,
      JSON.stringify(data),
      patternIds ? JSON.stringify(patternIds) : null,
      confidence || null
    );
    
    res.status(201).json({
      id,
      version,
      name,
      description,
      data,
      pattern_ids: patternIds || null,
      confidence: confidence || null,
    });
  } catch (error) {
    logger.error('Failed to create model', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create model',
    });
  }
});

/**
 * GET /api/models/:id
 * Get a single application model
 */
modelsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { includePatterns = 'false' } = req.query;
    
    const db = getDatabase();
    
    const model = db.prepare('SELECT * FROM app_models WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    
    if (!model) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Model not found',
      });
    }
    
    const result: Record<string, unknown> = {
      ...model,
      data: JSON.parse(model.data as string),
      pattern_ids: model.pattern_ids ? JSON.parse(model.pattern_ids as string) : null,
    };
    
    if (includePatterns === 'true' && result.pattern_ids) {
      const patternIds = result.pattern_ids as string[];
      const patterns = db.prepare(`
        SELECT * FROM patterns 
        WHERE id IN (${patternIds.map(() => '?').join(',')})
      `).all(...patternIds);
      
      result.patterns = patterns.map((p: Record<string, unknown>) => ({
        ...p,
        event_ids: JSON.parse(p.event_ids as string),
        metadata: p.metadata ? JSON.parse(p.metadata as string) : null,
      }));
    }
    
    res.json(result);
  } catch (error) {
    logger.error('Failed to fetch model', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch model',
    });
  }
});

/**
 * PUT /api/models/:id
 * Update an application model (creates new version)
 */
modelsRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, data, patternIds, confidence } = req.body;
    
    const db = getDatabase();
    
    const existing = db.prepare('SELECT * FROM app_models WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    
    if (!existing) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Model not found',
      });
    }
    
    // Increment version
    const currentVersion = existing.version as string;
    const versionParts = currentVersion.split('.');
    versionParts[2] = String(Number(versionParts[2]) + 1);
    const newVersion = versionParts.join('.');
    
    const stmt = db.prepare(`
      UPDATE app_models 
      SET version = ?, name = ?, description = ?, data = ?, pattern_ids = ?, confidence = ?
      WHERE id = ?
    `);
    
    stmt.run(
      newVersion,
      name || existing.name,
      description !== undefined ? description : existing.description,
      data ? JSON.stringify(data) : existing.data,
      patternIds ? JSON.stringify(patternIds) : existing.pattern_ids,
      confidence !== undefined ? confidence : existing.confidence,
      id
    );
    
    const updated = db.prepare('SELECT * FROM app_models WHERE id = ?').get(id) as Record<string, unknown>;
    
    res.json({
      ...updated,
      data: JSON.parse(updated.data as string),
      pattern_ids: updated.pattern_ids ? JSON.parse(updated.pattern_ids as string) : null,
    });
  } catch (error) {
    logger.error('Failed to update model', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update model',
    });
  }
});

/**
 * DELETE /api/models/:id
 * Delete an application model
 */
modelsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const result = db.prepare('DELETE FROM app_models WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Model not found',
      });
    }
    
    res.status(204).send();
  } catch (error) {
    logger.error('Failed to delete model', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete model',
    });
  }
});

/**
 * POST /api/models/synthesize
 * Synthesize a new model from patterns
 */
modelsRouter.post('/synthesize', async (req: Request, res: Response) => {
  try {
    const { sessionId, name, description } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Required field: sessionId',
      });
    }
    
    const db = getDatabase();
    
    // Get patterns for the session
    const patterns = db.prepare(`
      SELECT * FROM patterns 
      WHERE session_id = ?
      ORDER BY start_time ASC
    `).all(sessionId);
    
    if ((patterns as unknown[]).length === 0) {
      return res.status(400).json({
        error: 'No patterns',
        message: 'No patterns found for the specified session',
      });
    }
    
    // Extract pattern types and build basic model
    const patternTypes = [...new Set((patterns as Record<string, unknown>[]).map(p => p.type))];
    const patternIds = (patterns as Record<string, unknown>[]).map(p => p.id as string);
    
    // Calculate average confidence
    const avgConfidence = (patterns as Record<string, unknown>[]).reduce(
      (sum, p) => sum + (p.confidence as number),
      0
    ) / (patterns as unknown[]).length;
    
    // Build initial application model structure
    const modelData = {
      entities: extractEntities(patterns as Record<string, unknown>[]),
      screens: extractScreens(patterns as Record<string, unknown>[]),
      workflows: extractWorkflows(patterns as Record<string, unknown>[]),
      patternSummary: {
        types: patternTypes,
        count: (patterns as unknown[]).length,
      },
    };
    
    // Create the model
    const id = uuidv4();
    const version = '1.0.0';
    const modelName = name || `Model_${new Date().toISOString().split('T')[0]}`;
    
    const stmt = db.prepare(`
      INSERT INTO app_models (id, version, name, description, data, pattern_ids, confidence)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      version,
      modelName,
      description || `Auto-synthesized from session ${sessionId}`,
      JSON.stringify(modelData),
      JSON.stringify(patternIds),
      avgConfidence
    );
    
    res.status(201).json({
      id,
      version,
      name: modelName,
      description: description || `Auto-synthesized from session ${sessionId}`,
      data: modelData,
      pattern_ids: patternIds,
      confidence: avgConfidence,
    });
  } catch (error) {
    logger.error('Failed to synthesize model', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to synthesize model',
    });
  }
});

/**
 * Extract entities from patterns
 */
function extractEntities(patterns: Record<string, unknown>[]): unknown[] {
  const entities: Map<string, Record<string, unknown>> = new Map();
  
  for (const pattern of patterns) {
    const metadata = pattern.metadata ? JSON.parse(pattern.metadata as string) : {};
    const entityName = metadata.entityName || metadata.entity;
    
    if (entityName) {
      if (!entities.has(entityName)) {
        entities.set(entityName, {
          name: entityName,
          operations: new Set(),
          fields: new Set(),
        });
      }
      
      const entity = entities.get(entityName)!;
      const type = pattern.type as string;
      
      // Add operation based on pattern type
      if (type.includes('create')) (entity.operations as Set<string>).add('create');
      if (type.includes('read')) (entity.operations as Set<string>).add('read');
      if (type.includes('update')) (entity.operations as Set<string>).add('update');
      if (type.includes('delete')) (entity.operations as Set<string>).add('delete');
      if (type.includes('list')) (entity.operations as Set<string>).add('list');
      
      // Extract fields if available
      if (metadata.fields) {
        for (const field of metadata.fields) {
          (entity.fields as Set<string>).add(field);
        }
      }
    }
  }
  
  // Convert Sets to arrays
  return Array.from(entities.values()).map(entity => ({
    name: entity.name,
    operations: Array.from(entity.operations as Set<string>),
    fields: Array.from(entity.fields as Set<string>),
  }));
}

/**
 * Extract screens from patterns
 */
function extractScreens(patterns: Record<string, unknown>[]): unknown[] {
  const screens: Map<string, Record<string, unknown>> = new Map();
  
  for (const pattern of patterns) {
    const metadata = pattern.metadata ? JSON.parse(pattern.metadata as string) : {};
    const screenPath = metadata.path || metadata.screen;
    
    if (screenPath) {
      if (!screens.has(screenPath)) {
        screens.set(screenPath, {
          path: screenPath,
          components: new Set(),
          actions: new Set(),
        });
      }
      
      const screen = screens.get(screenPath)!;
      const type = pattern.type as string;
      
      // Add actions based on pattern type
      (screen.actions as Set<string>).add(type);
      
      // Add components if available
      if (metadata.components) {
        for (const component of metadata.components) {
          (screen.components as Set<string>).add(component);
        }
      }
    }
  }
  
  // Convert Sets to arrays
  return Array.from(screens.values()).map(screen => ({
    path: screen.path,
    components: Array.from(screen.components as Set<string>),
    actions: Array.from(screen.actions as Set<string>),
  }));
}

/**
 * Extract workflows from patterns
 */
function extractWorkflows(patterns: Record<string, unknown>[]): unknown[] {
  const workflowPatterns = patterns.filter(p => 
    (p.type as string).includes('workflow')
  );
  
  return workflowPatterns.map(pattern => {
    const metadata = pattern.metadata ? JSON.parse(pattern.metadata as string) : {};
    return {
      id: pattern.id,
      name: metadata.name || 'Unknown Workflow',
      steps: metadata.steps || [],
      duration: (pattern.end_time as number) - (pattern.start_time as number),
    };
  });
}
