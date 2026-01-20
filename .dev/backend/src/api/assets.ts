/**
 * User Assets API
 * Handles custom assets uploaded by users
 * Stores images, colors, data, and custom components
 */

import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export const assetsRouter = Router();

/**
 * POST /api/assets
 * Store a user asset
 */
assetsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { sessionId, asset } = req.body;

    if (!sessionId || !asset) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'sessionId and asset are required',
      });
    }

    const db = getDatabase();
    const assetId = asset.id || uuidv4();

    // Store asset
    db.prepare(`
      INSERT OR REPLACE INTO user_assets (
        id, session_id, type, name, data, url, metadata, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      assetId,
      sessionId,
      asset.type,
      asset.name,
      JSON.stringify(asset.data),
      asset.url || null,
      JSON.stringify(asset.metadata),
      Date.now()
    );

    logger.info('User asset stored', {
      assetId,
      sessionId,
      type: asset.type,
      context: asset.metadata.context,
    });

    res.json({
      success: true,
      assetId,
    });
  } catch (error) {
    logger.error('Failed to store user asset', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to store asset',
    });
  }
});

/**
 * GET /api/assets/:sessionId
 * Get all assets for a session
 */
assetsRouter.get('/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { type, context } = req.query;

    const db = getDatabase();

    let query = 'SELECT * FROM user_assets WHERE session_id = ?';
    const params: any[] = [sessionId];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (context) {
      query += ' AND json_extract(metadata, "$.context") = ?';
      params.push(context);
    }

    query += ' ORDER BY created_at DESC';

    const rows = db.prepare(query).all(...params);

    const assets = rows.map((row: any) => ({
      id: row.id,
      type: row.type,
      name: row.name,
      data: JSON.parse(row.data),
      url: row.url,
      metadata: JSON.parse(row.metadata),
      createdAt: row.created_at,
    }));

    res.json({
      success: true,
      assets,
    });
  } catch (error) {
    logger.error('Failed to get user assets', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get assets',
    });
  }
});

/**
 * PUT /api/assets/:assetId/use
 * Increment usage count for an asset
 */
assetsRouter.put('/:assetId/use', async (req: Request, res: Response) => {
  try {
    const { assetId } = req.params;
    const { context } = req.body;

    const db = getDatabase();

    // Get current metadata
    const row: any = db.prepare('SELECT metadata FROM user_assets WHERE id = ?').get(assetId);

    if (!row) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Asset not found',
      });
    }

    const metadata = JSON.parse(row.metadata);
    metadata.usedCount = (metadata.usedCount || 0) + 1;

    // Update metadata
    db.prepare('UPDATE user_assets SET metadata = ? WHERE id = ?').run(
      JSON.stringify(metadata),
      assetId
    );

    logger.info('Asset usage recorded', { assetId, context, usedCount: metadata.usedCount });

    res.json({
      success: true,
      usedCount: metadata.usedCount,
    });
  } catch (error) {
    logger.error('Failed to record asset usage', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to record usage',
    });
  }
});

/**
 * DELETE /api/assets/:assetId
 * Delete a user asset
 */
assetsRouter.delete('/:assetId', async (req: Request, res: Response) => {
  try {
    const { assetId } = req.params;

    const db = getDatabase();

    db.prepare('DELETE FROM user_assets WHERE id = ?').run(assetId);

    logger.info('User asset deleted', { assetId });

    res.json({
      success: true,
    });
  } catch (error) {
    logger.error('Failed to delete user asset', { error });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete asset',
    });
  }
});
