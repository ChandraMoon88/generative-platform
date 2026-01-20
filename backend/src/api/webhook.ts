/**
 * Webhook System - Send user-built apps to admin's local machine
 * This runs on Vercel and sends app data to your local webhook receiver
 */

import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { getDatabase } from '../db/database';

export const webhookRouter = Router();

/**
 * Send app build data to admin's local machine
 */
async function sendToAdmin(appData: any): Promise<boolean> {
  try {
    const adminWebhookUrl = process.env.ADMIN_WEBHOOK_URL;
    
    if (!adminWebhookUrl) {
      logger.warn('Admin webhook URL not configured');
      return false;
    }

    const response = await fetch(adminWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.WEBHOOK_SECRET || 'default-secret',
      },
      body: JSON.stringify(appData),
    });

    if (response.ok) {
      logger.info(`App sent to admin: ${appData.appId}`);
      return true;
    } else {
      logger.error(`Failed to send to admin: ${response.status}`);
      return false;
    }
  } catch (error) {
    logger.error('Error sending to admin', { error });
    return false;
  }
}

/**
 * POST /api/webhook/app-built
 * Called when a user builds an app on Vercel
 */
webhookRouter.post('/app-built', async (req: Request, res: Response) => {
  try {
    const { userId, projectId, appName, files, metadata } = req.body;

    if (!userId || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'userId and projectId are required',
      });
    }

    const db = getDatabase();

    // Get user info
    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?')
      .get(userId) as any;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get project info
    const project = db.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?')
      .get(projectId, userId) as any;

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Prepare data to send to admin
    const appData = {
      timestamp: Date.now(),
      appId: projectId,
      appName: appName || project.name,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
      },
      files: files || {},
      metadata: metadata || {},
      source: 'vercel',
    };

    // Send to admin's local machine
    const sent = await sendToAdmin(appData);

    // Store build record
    const buildId = `build_${Date.now()}_${userId}`;
    db.prepare(`
      INSERT INTO app_builds (id, user_id, project_id, sent_to_admin, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(buildId, userId, projectId, sent ? 1 : 0, Date.now());

    res.json({
      success: true,
      message: 'App build recorded',
      buildId,
      sentToAdmin: sent,
    });
  } catch (error) {
    logger.error('App built webhook failed', { error });
    res.status(500).json({
      success: false,
      message: 'Failed to process app build',
    });
  }
});

/**
 * GET /api/webhook/pending-apps
 * Admin polls this to get apps that failed to sync
 */
webhookRouter.get('/pending-apps', async (req: Request, res: Response) => {
  try {
    // Verify admin access (simple check - improve in production)
    const adminSecret = req.headers['x-admin-secret'];
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const db = getDatabase();

    // Get builds that weren't sent to admin
    const pendingBuilds = db.prepare(`
      SELECT 
        ab.*,
        p.name as project_name,
        p.description as project_description,
        p.generated_files,
        u.name as user_name,
        u.email as user_email
      FROM app_builds ab
      JOIN projects p ON ab.project_id = p.id
      JOIN users u ON ab.user_id = u.id
      WHERE ab.sent_to_admin = 0
      AND ab.created_at > ?
      ORDER BY ab.created_at DESC
      LIMIT 100
    `).all(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days

    res.json({
      success: true,
      count: pendingBuilds.length,
      builds: pendingBuilds,
    });
  } catch (error) {
    logger.error('Failed to fetch pending apps', { error });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending apps',
    });
  }
});

/**
 * POST /api/webhook/mark-synced
 * Admin calls this after successfully syncing an app
 */
webhookRouter.post('/mark-synced', async (req: Request, res: Response) => {
  try {
    const adminSecret = req.headers['x-admin-secret'];
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { buildId } = req.body;

    if (!buildId) {
      return res.status(400).json({
        success: false,
        message: 'buildId is required',
      });
    }

    const db = getDatabase();
    db.prepare('UPDATE app_builds SET sent_to_admin = 1 WHERE id = ?').run(buildId);

    res.json({
      success: true,
      message: 'Build marked as synced',
    });
  } catch (error) {
    logger.error('Failed to mark build as synced', { error });
    res.status(500).json({
      success: false,
      message: 'Failed to update build status',
    });
  }
});
