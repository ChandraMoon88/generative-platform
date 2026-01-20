/**
 * Projects API Routes
 * Handles user projects with ownership and admin access
 */

import { Router, Request, Response } from 'express';
import { query } from '../db/postgres';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export const projectsRouter = Router();

// Middleware to extract and validate user from token
async function authenticateUser(req: Request, res: Response, next: Function) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const decoded = Buffer.from(token, 'base64').toString();
    const [userId] = decoded.split(':');

    const result = await query('SELECT id, role FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    (req as any).user = result.rows[0];
    next();
  } catch (error) {
    logger.error('Authentication failed:', error);
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
}

/**
 * GET /api/projects
 * Get all projects (filtered by user role)
 * - Clients see only their own projects
 * - Admins see ALL projects from ALL users
 */
projectsRouter.get('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    let result: any;
    
    if (user.role === 'admin') {
      // Admin sees ALL projects from ALL users
      result = await query(`
        SELECT p.*, u.name as user_name, u.email as user_email
        FROM projects p
        LEFT JOIN users u ON p.user_id = u.id
        ORDER BY p.updated_at DESC
      `);
      
      logger.info(`Admin ${user.id} accessed all projects (${result.rows.length} total)`);
    } else {
      // Clients see only their own projects
      result = await query(`
        SELECT * FROM projects 
        WHERE user_id = $1
        ORDER BY updated_at DESC
      `, [user.id]);
      
      logger.info(`User ${user.id} accessed their projects (${result.rows.length} total)`);
    }
    
    // Parse JSON fields
    const projects = result.rows.map((p: any) => ({
      ...p,
      config: p.config ? JSON.parse(p.config) : null,
      generated_files: p.generated_files ? JSON.parse(p.generated_files) : null,
    }));
    
    res.json({
      success: true,
      projects,
      isAdmin: user.role === 'admin',
      totalProjects: projects.length,
    });
  } catch (error) {
    logger.error('Failed to fetch projects', { error });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
    });
  }
});

/**
 * GET /api/projects/:id
 * Get a specific project
 * - Clients can only access their own projects
 * - Admins can access ANY project
 */
projectsRouter.get('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    
    const result = await query(`
      SELECT p.*, u.name as user_name, u.email as user_email
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    
    const project = result.rows[0];
    
    // Access control: clients can only see their own projects
    if (user.role !== 'admin' && project.user_id !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }
    
    // Parse JSON fields
    project.config = project.config ? JSON.parse(project.config) : null;
    project.generated_files = project.generated_files ? JSON.parse(project.generated_files) : null;
    
    logger.info(`User ${user.id} (${user.role}) accessed project ${id}`);
    
    res.json({
      success: true,
      project,
    });
  } catch (error) {
    logger.error('Failed to fetch project', { error });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
    });
  }
});

/**
 * POST /api/projects
 * Create a new project
 * - Project is automatically owned by the authenticated user
 */
projectsRouter.post('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { name, description, modelId, config } = req.body;
    const user = (req as any).user;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required',
      });
    }
    
    const projectId = uuidv4();
    const now = Date.now();
    
    await query(`
      INSERT INTO projects (id, user_id, name, description, app_model_id, status, config, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, 'draft', $6, $7, $8)
    `, [
      projectId,
      user.id,
      name,
      description || null,
      modelId || null,
      config ? JSON.stringify(config) : null,
      now,
      now
    ]);
    
    logger.info(`User ${user.id} created project ${projectId}: ${name}`);
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      projectId,
      project: {
        id: projectId,
        user_id: user.id,
        name,
        description,
        model_id: modelId,
        status: 'draft',
        config: config || null,
        created_at: now,
        updated_at: now,
      },
    });
  } catch (error) {
    logger.error('Failed to create project', { error });
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
    });
  }
});

/**
 * PUT /api/projects/:id
 * Update a project
 * - Clients can only update their own projects
 * - Admins can update ANY project (for monitoring/debugging)
 */
projectsRouter.put('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, status, config, generatedFiles } = req.body;
    const user = (req as any).user;
    
    const result = await query('SELECT * FROM projects WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    
    const project = result.rows[0];
    
    // Access control: clients can only update their own projects
    if (user.role !== 'admin' && project.user_id !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }
    
    const updates: string[] = ['updated_at = $1'];
    const values: any[] = [Date.now()];
    let paramIndex = 2;
    
    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }
    if (config !== undefined) {
      updates.push(`config = $${paramIndex++}`);
      values.push(JSON.stringify(config));
    }
    if (generatedFiles !== undefined) {
      updates.push(`generated_files = $${paramIndex++}`);
      values.push(JSON.stringify(generatedFiles));
    }
    
    values.push(id);
    
    await query(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      values
    );
    
    logger.info(`User ${user.id} (${user.role}) updated project ${id}`);
    
    res.json({
      success: true,
      message: 'Project updated successfully',
    });
  } catch (error) {
    logger.error('Failed to update project', { error });
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
    });
  }
});

/**
 * DELETE /api/projects/:id
 * Delete a project
 * - Clients can only delete their own projects
 * - Admins can delete ANY project
 */
projectsRouter.delete('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    
    const result = await query('SELECT * FROM projects WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    
    const project = result.rows[0];
    
    // Access control: clients can only delete their own projects
    if (user.role !== 'admin' && project.user_id !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }
    
    await query('DELETE FROM projects WHERE id = $1', [id]);
    
    logger.info(`User ${user.id} (${user.role}) deleted project ${id}`);
    
    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    logger.error('Failed to delete project', { error });
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
    });
  }
});

/**
 * GET /api/projects/user/:userId
 * Admin-only: Get all projects for a specific user
 */
projectsRouter.get('/user/:userId', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = (req as any).user;
    
    // Only admins can view other users' projects
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }
    
    const result = await query(`
      SELECT p.*, u.name as user_name, u.email as user_email
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1
      ORDER BY p.updated_at DESC
    `, [userId]);
    
    logger.info(`Admin ${user.id} accessed projects for user ${userId}`);
    
    res.json({
      success: true,
      projects: result.rows.map((p: any) => ({
        ...p,
        config: (p as any).config ? JSON.parse((p as any).config) : null,
        generated_files: (p as any).generated_files ? JSON.parse((p as any).generated_files) : null,
      })),
      userId,
      totalProjects: projects.length,
    });
  } catch (error) {
    logger.error('Failed to fetch user projects', { error });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user projects',
    });
  }
});

/**
 * GET /api/projects/stats/overview
 * Admin-only: Get overview statistics
 */
projectsRouter.get('/stats/overview', authenticateUser, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }
    
    const db = getDatabase();
    
    const totalProjects = db.prepare('SELECT COUNT(*) as count FROM projects').get() as any;
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "client"').get() as any;
    const projectsByStatus = db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM projects 
      GROUP BY status
    `).all();
    const recentProjects = db.prepare(`
      SELECT p.*, u.name as user_name, u.email as user_email
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 10
    `).all();
    
    logger.info(`Admin ${user.id} accessed overview statistics`);
    
    res.json({
      success: true,
      stats: {
        totalProjects: totalProjects.count,
        totalUsers: totalUsers.count,
        projectsByStatus,
        recentProjects: recentProjects.map(p => ({
          ...p,
          config: (p as any).config ? JSON.parse((p as any).config) : null,
        })),
      },
    });
  } catch (error) {
    logger.error('Failed to fetch overview stats', { error });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
    });
  }
});
