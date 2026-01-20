/**
 * EcoSphere API Routes
 * Handles environmental entity data for EcoSphere game
 */

import express from 'express';
import { getDatabase } from '../db/database';
import { logger } from '../utils/logger';

export const ecosphereRouter = express.Router();

// Get all water sources for a project
ecosphereRouter.get('/water-sources/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const db = getDatabase();
    
    const sources = db.prepare(`
      SELECT * FROM water_sources WHERE project_id = ?
    `).all(projectId);
    
    res.json(sources);
  } catch (error) {
    logger.error('Error fetching water sources:', error);
    res.status(500).json({ error: 'Failed to fetch water sources' });
  }
});

// Create water source
ecosphereRouter.post('/water-sources', async (req, res) => {
  try {
    const { projectId, name, overallHealth } = req.body;
    const db = getDatabase();
    
    const id = `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    
    db.prepare(`
      INSERT INTO water_sources (id, project_id, name, overall_health, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, projectId, name, overallHealth || 'polluted', now, now);
    
    res.json({ id, projectId, name, overallHealth, created_at: now, updated_at: now });
  } catch (error) {
    logger.error('Error creating water source:', error);
    res.status(500).json({ error: 'Failed to create water source' });
  }
});

// Get water sections for a source
ecosphereRouter.get('/water-sections/:waterSourceId', async (req, res) => {
  try {
    const { waterSourceId } = req.params;
    const db = getDatabase();
    
    const sections = db.prepare(`
      SELECT * FROM water_sections WHERE water_source_id = ? ORDER BY section_number
    `).all(waterSourceId);
    
    res.json(sections);
  } catch (error) {
    logger.error('Error fetching water sections:', error);
    res.status(500).json({ error: 'Failed to fetch water sections' });
  }
});

// Create water section
ecosphereRouter.post('/water-sections', async (req, res) => {
  try {
    const { 
      waterSourceId, 
      sectionNumber, 
      temperature, 
      ph, 
      dissolvedOxygen, 
      turbidity, 
      pollutantLevel,
      latitude,
      longitude 
    } = req.body;
    const db = getDatabase();
    
    const id = `sect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    
    db.prepare(`
      INSERT INTO water_sections (
        id, water_source_id, section_number, temperature, ph, 
        dissolved_oxygen, turbidity, pollutant_level, latitude, longitude, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, waterSourceId, sectionNumber, temperature, ph, 
      dissolvedOxygen, turbidity, pollutantLevel, latitude, longitude, now
    );
    
    res.json({ 
      id, waterSourceId, sectionNumber, temperature, ph, 
      dissolvedOxygen, turbidity, pollutantLevel, latitude, longitude, created_at: now 
    });
  } catch (error) {
    logger.error('Error creating water section:', error);
    res.status(500).json({ error: 'Failed to create water section' });
  }
});

// Get pollution sources for a project
ecosphereRouter.get('/pollution-sources/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const db = getDatabase();
    
    const sources = db.prepare(`
      SELECT * FROM pollution_sources WHERE project_id = ? ORDER BY priority DESC
    `).all(projectId);
    
    res.json(sources);
  } catch (error) {
    logger.error('Error fetching pollution sources:', error);
    res.status(500).json({ error: 'Failed to fetch pollution sources' });
  }
});

// Create pollution source
ecosphereRouter.post('/pollution-sources', async (req, res) => {
  try {
    const { 
      projectId, 
      name, 
      sourceType, 
      severity, 
      frequency, 
      pollutants,
      responsibility,
      accessibility,
      priority 
    } = req.body;
    const db = getDatabase();
    
    const id = `ps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    
    db.prepare(`
      INSERT INTO pollution_sources (
        id, project_id, name, source_type, severity, frequency,
        pollutants, responsibility, accessibility, priority, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, projectId, name, sourceType, severity, frequency,
      JSON.stringify(pollutants), responsibility, accessibility, priority || 0, now
    );
    
    res.json({ 
      id, projectId, name, sourceType, severity, frequency,
      pollutants, responsibility, accessibility, priority, created_at: now 
    });
  } catch (error) {
    logger.error('Error creating pollution source:', error);
    res.status(500).json({ error: 'Failed to create pollution source' });
  }
});

// Get restoration plans for a project
ecosphereRouter.get('/restoration-plans/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const db = getDatabase();
    
    const plans = db.prepare(`
      SELECT * FROM restoration_plans WHERE project_id = ?
    `).all(projectId);
    
    res.json(plans);
  } catch (error) {
    logger.error('Error fetching restoration plans:', error);
    res.status(500).json({ error: 'Failed to fetch restoration plans' });
  }
});

// Create restoration plan
ecosphereRouter.post('/restoration-plans', async (req, res) => {
  try {
    const { projectId, name, approach, totalBudget, totalDuration } = req.body;
    const db = getDatabase();
    
    const id = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    
    db.prepare(`
      INSERT INTO restoration_plans (
        id, project_id, name, approach, total_budget, total_duration, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, projectId, name, approach, totalBudget, totalDuration, now);
    
    res.json({ id, projectId, name, approach, totalBudget, totalDuration, created_at: now });
  } catch (error) {
    logger.error('Error creating restoration plan:', error);
    res.status(500).json({ error: 'Failed to create restoration plan' });
  }
});

// Get workflow steps for a plan
ecosphereRouter.get('/workflow-steps/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const db = getDatabase();
    
    const steps = db.prepare(`
      SELECT * FROM workflow_steps WHERE plan_id = ? ORDER BY created_at
    `).all(planId);
    
    res.json(steps);
  } catch (error) {
    logger.error('Error fetching workflow steps:', error);
    res.status(500).json({ error: 'Failed to fetch workflow steps' });
  }
});

// Create workflow step
ecosphereRouter.post('/workflow-steps', async (req, res) => {
  try {
    const { 
      planId, 
      name, 
      description, 
      actionType, 
      estimatedDuration, 
      estimatedCost,
      prerequisites,
      successCriteria,
      riskFactors,
      status 
    } = req.body;
    const db = getDatabase();
    
    const id = `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    
    db.prepare(`
      INSERT INTO workflow_steps (
        id, plan_id, name, description, action_type, estimated_duration,
        estimated_cost, prerequisites, success_criteria, risk_factors, status, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, planId, name, description, actionType, estimatedDuration,
      estimatedCost, JSON.stringify(prerequisites), JSON.stringify(successCriteria), 
      JSON.stringify(riskFactors), status || 'planned', now
    );
    
    res.json({ 
      id, planId, name, description, actionType, estimatedDuration,
      estimatedCost, prerequisites, successCriteria, riskFactors, status, created_at: now 
    });
  } catch (error) {
    logger.error('Error creating workflow step:', error);
    res.status(500).json({ error: 'Failed to create workflow step' });
  }
});

// Get team members for a project
ecosphereRouter.get('/team-members/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const db = getDatabase();
    
    const members = db.prepare(`
      SELECT * FROM team_members WHERE project_id = ?
    `).all(projectId);
    
    res.json(members);
  } catch (error) {
    logger.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Create team member
ecosphereRouter.post('/team-members', async (req, res) => {
  try {
    const { 
      projectId, 
      name, 
      role, 
      specialty, 
      skills,
      costPerMonth,
      availability,
      personalityTraits,
      experience,
      morale 
    } = req.body;
    const db = getDatabase();
    
    const id = `tm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    
    db.prepare(`
      INSERT INTO team_members (
        id, project_id, name, role, specialty, skills, cost_per_month,
        availability, personality_traits, experience, morale, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, projectId, name, role, specialty, JSON.stringify(skills), costPerMonth,
      availability, JSON.stringify(personalityTraits), experience || 0, morale || 100, now
    );
    
    res.json({ 
      id, projectId, name, role, specialty, skills, costPerMonth,
      availability, personalityTraits, experience, morale, created_at: now 
    });
  } catch (error) {
    logger.error('Error creating team member:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

// Update workflow step status
ecosphereRouter.patch('/workflow-steps/:stepId/status', async (req, res) => {
  try {
    const { stepId } = req.params;
    const { status } = req.body;
    const db = getDatabase();
    
    db.prepare(`
      UPDATE workflow_steps SET status = ? WHERE id = ?
    `).run(status, stepId);
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Error updating workflow step:', error);
    res.status(500).json({ error: 'Failed to update workflow step' });
  }
});

// Update water source health
ecosphereRouter.patch('/water-sources/:sourceId/health', async (req, res) => {
  try {
    const { sourceId } = req.params;
    const { overallHealth } = req.body;
    const db = getDatabase();
    
    const now = Date.now();
    db.prepare(`
      UPDATE water_sources SET overall_health = ?, updated_at = ? WHERE id = ?
    `).run(overallHealth, now, sourceId);
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Error updating water source:', error);
    res.status(500).json({ error: 'Failed to update water source' });
  }
});
