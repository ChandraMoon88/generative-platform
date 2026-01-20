/**
 * Pattern Recognition Engine
 * Analyzes user interactions to identify application patterns
 */

import { EventData } from '../types';
import { Database } from '../db/database';
import logger from '../utils/logger';

export interface Pattern {
  id: string;
  name: string;
  confidence: number;
  components: string[];
  interactions: string[];
  metadata: Record<string, any>;
}

export interface ApplicationPattern {
  type: string;
  name: string;
  description: string;
  requiredComponents: string[];
  indicators: {
    componentUsage: Record<string, number>;
    actionPatterns: string[];
    dataFlow: string[];
  };
}

export class PatternRecognitionEngine {
  private db: Database | null = null;
  private patterns: ApplicationPattern[] = [
    // E-commerce patterns
    {
      type: 'ecommerce',
      name: 'E-Commerce Store',
      description: 'Online shopping platform with products, cart, and checkout',
      requiredComponents: ['CardGrid', 'DetailView', 'Form', 'Button'],
      indicators: {
        componentUsage: { CardGrid: 3, DetailView: 2, Form: 1, Button: 5 },
        actionPatterns: ['view_product', 'add_to_cart', 'checkout'],
        dataFlow: ['browse', 'select', 'purchase'],
      },
    },
    // Project management patterns
    {
      type: 'project_management',
      name: 'Project Management',
      description: 'Task tracking with kanban boards and timelines',
      requiredComponents: ['KanbanBoard', 'Timeline', 'Form', 'DataTable'],
      indicators: {
        componentUsage: { KanbanBoard: 2, Timeline: 1, Form: 2, DataTable: 1 },
        actionPatterns: ['drag_card', 'update_status', 'filter_tasks'],
        dataFlow: ['create_task', 'organize', 'track_progress'],
      },
    },
    // CRM patterns
    {
      type: 'crm',
      name: 'Customer Relationship Management',
      description: 'Contact management with interactions and pipelines',
      requiredComponents: ['DataTable', 'DetailView', 'Form', 'Timeline', 'KanbanBoard'],
      indicators: {
        componentUsage: { DataTable: 3, DetailView: 2, Form: 2, Timeline: 1 },
        actionPatterns: ['view_contact', 'log_interaction', 'move_stage'],
        dataFlow: ['list_contacts', 'view_details', 'update_info'],
      },
    },
    // Content management patterns
    {
      type: 'cms',
      name: 'Content Management System',
      description: 'Document and content organization with rich editing',
      requiredComponents: ['TreeView', 'RichTextEditor', 'FileUpload', 'List'],
      indicators: {
        componentUsage: { TreeView: 2, RichTextEditor: 3, FileUpload: 2 },
        actionPatterns: ['create_content', 'organize_hierarchy', 'publish'],
        dataFlow: ['navigate', 'edit', 'save'],
      },
    },
    // Analytics dashboard patterns
    {
      type: 'analytics',
      name: 'Analytics Dashboard',
      description: 'Data visualization and reporting platform',
      requiredComponents: ['LineChart', 'BarChart', 'PieChart', 'MetricCard', 'FilterPanel'],
      indicators: {
        componentUsage: { LineChart: 2, BarChart: 2, MetricCard: 4, FilterPanel: 1 },
        actionPatterns: ['filter_data', 'view_metric', 'export_report'],
        dataFlow: ['filter', 'visualize', 'analyze'],
      },
    },
    // Booking system patterns
    {
      type: 'booking',
      name: 'Booking System',
      description: 'Appointment and reservation management',
      requiredComponents: ['MonthCalendar', 'TimeSlotPicker', 'Form', 'DetailView'],
      indicators: {
        componentUsage: { MonthCalendar: 2, TimeSlotPicker: 2, Form: 1 },
        actionPatterns: ['select_date', 'choose_time', 'confirm_booking'],
        dataFlow: ['browse_availability', 'select_slot', 'book'],
      },
    },
    // Social platform patterns
    {
      type: 'social',
      name: 'Social Platform',
      description: 'User interactions with posts, comments, and sharing',
      requiredComponents: ['List', 'CommentThread', 'UserPresence', 'ShareDialog'],
      indicators: {
        componentUsage: { List: 3, CommentThread: 2, UserPresence: 2 },
        actionPatterns: ['post_content', 'comment', 'share', 'mention'],
        dataFlow: ['view_feed', 'interact', 'share'],
      },
    },
    // Admin panel patterns
    {
      type: 'admin',
      name: 'Admin Panel',
      description: 'System administration with settings and permissions',
      requiredComponents: ['DataTable', 'SettingsPanel', 'PermissionManager', 'UserPreferences'],
      indicators: {
        componentUsage: { DataTable: 2, SettingsPanel: 2, PermissionManager: 1 },
        actionPatterns: ['manage_users', 'configure_settings', 'set_permissions'],
        dataFlow: ['list_entities', 'configure', 'save_settings'],
      },
    },
    // Learning platform patterns
    {
      type: 'learning',
      name: 'Learning Management System',
      description: 'Course delivery with lessons and progress tracking',
      requiredComponents: ['Wizard', 'ProgressTracker', 'RichTextEditor', 'List', 'DetailView'],
      indicators: {
        componentUsage: { Wizard: 2, ProgressTracker: 2, List: 2 },
        actionPatterns: ['start_lesson', 'complete_step', 'track_progress'],
        dataFlow: ['browse_courses', 'learn', 'complete'],
      },
    },
    // Workflow automation patterns
    {
      type: 'workflow',
      name: 'Workflow Automation',
      description: 'Process automation with multi-step workflows',
      requiredComponents: ['Wizard', 'KanbanBoard', 'Form', 'ProgressTracker'],
      indicators: {
        componentUsage: { Wizard: 3, KanbanBoard: 1, ProgressTracker: 2 },
        actionPatterns: ['configure_workflow', 'trigger_action', 'monitor_progress'],
        dataFlow: ['design', 'execute', 'monitor'],
      },
    },
  ];

  constructor() {
    // Lazy initialization - don't access DB in constructor
  }

  private async getDb(): Promise<Database> {
    if (!this.db) {
      const { getDatabase } = await import('../db/database');
      this.db = await getDatabase();
    }
    return this.db;
  }

  /**
   * Analyze events to detect application patterns
   */
  async analyzePatterns(sessionId: string): Promise<Pattern[]> {
    try {
      const db = await this.getDb();
      const events = await db.getEventsBySession(sessionId);

      if (events.length < 5) {
        logger.info(`Not enough events to analyze patterns (${events.length} events)`);
        return [];
      }

      // Count component usage
      const componentUsage: Record<string, number> = {};
      const actionPatterns: Record<string, number> = {};

      for (const event of events) {
        const data = JSON.parse(event.data) as EventData;
        componentUsage[data.componentType] = (componentUsage[data.componentType] || 0) + 1;
        actionPatterns[data.action] = (actionPatterns[data.action] || 0) + 1;
      }

      // Match against known patterns
      const detectedPatterns: Pattern[] = [];

      for (const pattern of this.patterns) {
        let score = 0;
        let matchedComponents = 0;

        // Check component usage
        for (const [component, requiredCount] of Object.entries(pattern.indicators.componentUsage)) {
          const actualCount = componentUsage[component] || 0;
          if (actualCount > 0) {
            matchedComponents++;
            score += Math.min(actualCount / requiredCount, 1) * 10;
          }
        }

        // Check action patterns
        for (const action of pattern.indicators.actionPatterns) {
          if (actionPatterns[action]) {
            score += 5;
          }
        }

        // Calculate confidence
        const requiredComponentCount = pattern.requiredComponents.length;
        const componentConfidence = matchedComponents / requiredComponentCount;
        const confidence = (score / 100) * componentConfidence;

        if (confidence > 0.3) {
          detectedPatterns.push({
            id: pattern.type,
            name: pattern.name,
            confidence,
            components: Object.keys(componentUsage),
            interactions: Object.keys(actionPatterns),
            metadata: {
              description: pattern.description,
              componentUsage,
              actionPatterns,
            },
          });
        }
      }

      // Sort by confidence
      detectedPatterns.sort((a, b) => b.confidence - a.confidence);

      logger.info(`Detected ${detectedPatterns.length} patterns for session ${sessionId}`);
      return detectedPatterns;
    } catch (error) {
      logger.error('Error analyzing patterns:', error);
      return [];
    }
  }

  /**
   * Get the most likely application type based on patterns
   */
  async predictApplicationType(sessionId: string): Promise<ApplicationPattern | null> {
    const patterns = await this.analyzePatterns(sessionId);

    if (patterns.length === 0) {
      return null;
    }

    const topPattern = patterns[0];
    const matchedPattern = this.patterns.find((p) => p.type === topPattern.id);

    return matchedPattern || null;
  }

  /**
   * Get component recommendations based on current usage
   */
  async getRecommendations(sessionId: string): Promise<string[]> {
    try {
      const db = await this.getDb();
      const events = await db.getEventsBySession(sessionId);

      if (events.length === 0) {
        return ['DataTable', 'Form', 'Button']; // Default recommendations
      }

      const componentUsage: Record<string, number> = {};
      for (const event of events) {
        const data = JSON.parse(event.data) as EventData;
        componentUsage[data.componentType] = (componentUsage[data.componentType] || 0) + 1;
      }

      // Find patterns that match current usage
      const recommendations = new Set<string>();

      for (const pattern of this.patterns) {
        let matches = 0;
        for (const component of pattern.requiredComponents) {
          if (componentUsage[component]) {
            matches++;
          }
        }

        // If we match some components, recommend the missing ones
        if (matches > 0 && matches < pattern.requiredComponents.length) {
          for (const component of pattern.requiredComponents) {
            if (!componentUsage[component]) {
              recommendations.add(component);
            }
          }
        }
      }

      return Array.from(recommendations).slice(0, 5);
    } catch (error) {
      logger.error('Error getting recommendations:', error);
      return [];
    }
  }
}

// Export singleton instance with lazy initialization
let engineInstance: PatternRecognitionEngine | null = null;

export function getPatternEngine(): PatternRecognitionEngine {
  if (!engineInstance) {
    engineInstance = new PatternRecognitionEngine();
  }
  return engineInstance;
}
