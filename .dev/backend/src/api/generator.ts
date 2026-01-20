/**
 * Code Generation API Routes
 * Generates application code from models
 */

import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database';
import { getCodeGenerator } from '../services/codeGenerator';
import { logger } from '../utils/logger';

export const generatorRouter = Router();

/**
 * POST /api/generate
 * Generate code from a model
 */
generatorRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { modelId, outputDir } = req.body;
    
    if (!modelId) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Required field: modelId',
      });
    }
    
    const db = getDatabase();
    
    // Get the model
    const model = db.prepare('SELECT * FROM app_models WHERE id = ?').get(modelId) as Record<string, unknown> | undefined;
    
    if (!model) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Model not found',
      });
    }
    
    const modelData = JSON.parse(model.data as string);
    const fullModel = {
      id: model.id as string,
      name: model.name as string,
      entities: modelData.entities || [],
      screens: modelData.screens || [],
      workflows: modelData.workflows || [],
      navigation: modelData.navigation || { type: 'sidebar', items: [] },
    };
    
    // Generate code
    const generator = getCodeGenerator(outputDir);
    const files = generator.generate(fullModel);
    
    logger.info(`Generated ${files.length} files for model ${modelId}`);
    
    res.json({
      modelId,
      modelName: model.name,
      files: files.map(f => ({
        path: f.path,
        type: f.type,
        size: f.content.length,
      })),
      totalFiles: files.length,
    });
  } catch (error) {
    logger.error('Failed to generate code', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate code',
    });
  }
});

/**
 * POST /api/generate/preview
 * Preview generated code without saving
 */
generatorRouter.post('/preview', async (req: Request, res: Response) => {
  try {
    const { modelId, fileTypes } = req.body;
    
    if (!modelId) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Required field: modelId',
      });
    }
    
    const db = getDatabase();
    
    // Get the model
    const model = db.prepare('SELECT * FROM app_models WHERE id = ?').get(modelId) as Record<string, unknown> | undefined;
    
    if (!model) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Model not found',
      });
    }
    
    const modelData = JSON.parse(model.data as string);
    const fullModel = {
      id: model.id as string,
      name: model.name as string,
      entities: modelData.entities || [],
      screens: modelData.screens || [],
      workflows: modelData.workflows || [],
      navigation: modelData.navigation || { type: 'sidebar', items: [] },
    };
    
    // Generate code
    const generator = getCodeGenerator();
    let files = generator.generate(fullModel);
    
    // Filter by file types if specified
    if (fileTypes && Array.isArray(fileTypes)) {
      files = files.filter(f => fileTypes.includes(f.type));
    }
    
    // Return full content for preview
    res.json({
      modelId,
      modelName: model.name,
      files: files.map(f => ({
        path: f.path,
        type: f.type,
        content: f.content,
      })),
      totalFiles: files.length,
    });
  } catch (error) {
    logger.error('Failed to preview code', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to preview code',
    });
  }
});

/**
 * GET /api/generate/templates
 * List available code generation templates
 */
generatorRouter.get('/templates', async (req: Request, res: Response) => {
  res.json({
    templates: [
      {
        id: 'nextjs-app',
        name: 'Next.js App Router',
        description: 'Full-stack Next.js application with App Router',
        outputs: ['pages', 'components', 'api-routes', 'types', 'store'],
      },
      {
        id: 'react-spa',
        name: 'React SPA',
        description: 'Single-page React application with React Router',
        outputs: ['pages', 'components', 'types', 'store'],
      },
      {
        id: 'api-only',
        name: 'API Only',
        description: 'Express.js REST API',
        outputs: ['routes', 'controllers', 'models', 'types'],
      },
    ],
  });
});

/**
 * POST /api/generate/export
 * Export generated code as a zip file
 */
generatorRouter.post('/export', async (req: Request, res: Response) => {
  try {
    const { modelId } = req.body;
    
    if (!modelId) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Required field: modelId',
      });
    }
    
    const db = getDatabase();
    
    // Get the model
    const model = db.prepare('SELECT * FROM app_models WHERE id = ?').get(modelId) as Record<string, unknown> | undefined;
    
    if (!model) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Model not found',
      });
    }
    
    const modelData = JSON.parse(model.data as string);
    const fullModel = {
      id: model.id as string,
      name: model.name as string,
      entities: modelData.entities || [],
      screens: modelData.screens || [],
      workflows: modelData.workflows || [],
      navigation: modelData.navigation || { type: 'sidebar', items: [] },
    };
    
    // Generate code
    const generator = getCodeGenerator();
    const files = generator.generate(fullModel);
    
    // In a full implementation, this would create a zip file
    // For now, return file list with content
    res.json({
      modelId,
      modelName: model.name,
      files,
      message: 'Export ready. In production, this would return a zip download.',
    });
  } catch (error) {
    logger.error('Failed to export code', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to export code',
    });
  }
});
