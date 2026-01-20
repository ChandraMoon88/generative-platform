/**
 * Application Model Synthesizer
 * Converts recognized patterns into structured application models
 */

import { getDatabase } from '../db/database';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

interface Pattern {
  id: string;
  session_id: string;
  type: string;
  confidence: number;
  start_time: number;
  end_time: number;
  event_ids: string[];
  metadata: Record<string, unknown>;
}

interface Entity {
  id: string;
  name: string;
  displayName: string;
  properties: EntityProperty[];
  relationships: EntityRelationship[];
  operations: string[];
}

interface EntityProperty {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: unknown;
}

interface EntityRelationship {
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  targetEntity: string;
  foreignKey?: string;
}

interface Screen {
  id: string;
  name: string;
  path: string;
  type: 'list' | 'detail' | 'form' | 'dashboard' | 'custom';
  components: UIComponent[];
  actions: string[];
  entity?: string;
}

interface UIComponent {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children?: UIComponent[];
}

interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  triggers: string[];
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'form' | 'action' | 'decision' | 'navigation';
  config: Record<string, unknown>;
}

interface ApplicationModel {
  id: string;
  version: string;
  name: string;
  description: string;
  entities: Entity[];
  screens: Screen[];
  workflows: Workflow[];
  navigation: NavigationStructure;
  confidence: number;
  metadata: Record<string, unknown>;
}

interface NavigationStructure {
  type: 'sidebar' | 'tabs' | 'nested';
  items: NavigationItem[];
}

interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
}

/**
 * Application Model Synthesizer
 * Transforms patterns into a structured application model
 */
export class ApplicationModelSynthesizer {
  /**
   * Synthesize an application model from patterns
   */
  public synthesize(sessionId: string, options: { name?: string; description?: string } = {}): ApplicationModel {
    const patterns = this.loadPatterns(sessionId);
    
    if (patterns.length === 0) {
      throw new Error(`No patterns found for session ${sessionId}`);
    }
    
    // Extract model components
    const entities = this.synthesizeEntities(patterns);
    const screens = this.synthesizeScreens(patterns, entities);
    const workflows = this.synthesizeWorkflows(patterns);
    const navigation = this.synthesizeNavigation(screens);
    
    // Calculate overall confidence
    const avgConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length;
    
    const model: ApplicationModel = {
      id: uuidv4(),
      version: '1.0.0',
      name: options.name || `App_${new Date().toISOString().split('T')[0]}`,
      description: options.description || `Generated from ${patterns.length} patterns`,
      entities,
      screens,
      workflows,
      navigation,
      confidence: avgConfidence,
      metadata: {
        sessionId,
        patternCount: patterns.length,
        generatedAt: Date.now(),
        patternTypes: [...new Set(patterns.map(p => p.type))],
      },
    };
    
    // Save to database
    this.saveModel(model, patterns.map(p => p.id));
    
    logger.info(`Synthesized model ${model.id} with ${entities.length} entities, ${screens.length} screens`);
    
    return model;
  }
  
  /**
   * Load patterns for a session
   */
  private loadPatterns(sessionId: string): Pattern[] {
    const db = getDatabase();
    const rows = db.prepare(`
      SELECT * FROM patterns 
      WHERE session_id = ?
      ORDER BY start_time ASC
    `).all(sessionId) as Record<string, unknown>[];
    
    return rows.map(row => ({
      id: row.id as string,
      session_id: row.session_id as string,
      type: row.type as string,
      confidence: row.confidence as number,
      start_time: row.start_time as number,
      end_time: row.end_time as number,
      event_ids: JSON.parse(row.event_ids as string),
      metadata: row.metadata ? JSON.parse(row.metadata as string) : {},
    }));
  }
  
  /**
   * Synthesize entities from CRUD patterns
   */
  private synthesizeEntities(patterns: Pattern[]): Entity[] {
    const entityMap = new Map<string, Entity>();
    
    for (const pattern of patterns) {
      const { type, metadata } = pattern;
      const entityName = (metadata.entityName as string) || this.inferEntityName(type, metadata);
      
      if (!entityName) continue;
      
      if (!entityMap.has(entityName)) {
        entityMap.set(entityName, {
          id: uuidv4(),
          name: this.toCamelCase(entityName),
          displayName: this.toDisplayName(entityName),
          properties: [],
          relationships: [],
          operations: [],
        });
      }
      
      const entity = entityMap.get(entityName)!;
      
      // Add operation
      const operation = this.extractOperation(type);
      if (operation && !entity.operations.includes(operation)) {
        entity.operations.push(operation);
      }
      
      // Add properties from fields
      if (metadata.fields) {
        for (const fieldName of metadata.fields as string[]) {
          if (!entity.properties.find(p => p.name === fieldName)) {
            entity.properties.push({
              name: fieldName,
              type: this.inferPropertyType(fieldName),
              required: false,
            });
          }
        }
      }
    }
    
    // Ensure all entities have basic properties
    for (const entity of entityMap.values()) {
      if (!entity.properties.find(p => p.name === 'id')) {
        entity.properties.unshift({
          name: 'id',
          type: 'string',
          required: true,
        });
      }
      
      if (!entity.properties.find(p => p.name === 'createdAt')) {
        entity.properties.push({
          name: 'createdAt',
          type: 'datetime',
          required: true,
        });
      }
      
      if (!entity.properties.find(p => p.name === 'updatedAt')) {
        entity.properties.push({
          name: 'updatedAt',
          type: 'datetime',
          required: true,
        });
      }
    }
    
    return Array.from(entityMap.values());
  }
  
  /**
   * Synthesize screens from patterns
   */
  private synthesizeScreens(patterns: Pattern[], entities: Entity[]): Screen[] {
    const screenMap = new Map<string, Screen>();
    
    for (const pattern of patterns) {
      const { type, metadata } = pattern;
      const path = (metadata.path as string) || '';
      
      if (!path) continue;
      
      const screenKey = path.replace(/\/[^/]+$/, '') || path; // Group by base path
      
      if (!screenMap.has(screenKey)) {
        screenMap.set(screenKey, {
          id: uuidv4(),
          name: this.pathToName(screenKey),
          path: screenKey,
          type: this.inferScreenType(type, path),
          components: [],
          actions: [],
        });
      }
      
      const screen = screenMap.get(screenKey)!;
      
      // Add actions
      if (!screen.actions.includes(type)) {
        screen.actions.push(type);
      }
      
      // Associate with entity
      if (metadata.entityName) {
        const entity = entities.find(e => 
          e.name === metadata.entityName || e.displayName === metadata.entityName
        );
        if (entity) {
          screen.entity = entity.name;
        }
      }
      
      // Infer components
      this.inferComponents(screen, pattern);
    }
    
    return Array.from(screenMap.values());
  }
  
  /**
   * Synthesize workflows from workflow patterns
   */
  private synthesizeWorkflows(patterns: Pattern[]): Workflow[] {
    const workflowPatterns = patterns.filter(p => p.type.includes('workflow'));
    const workflows: Workflow[] = [];
    
    for (const pattern of workflowPatterns) {
      const { metadata } = pattern;
      
      const workflow: Workflow = {
        id: uuidv4(),
        name: (metadata.workflowName as string) || 'Unnamed Workflow',
        steps: [],
        triggers: ['manual'],
      };
      
      // Convert steps from metadata
      if (metadata.steps) {
        for (let i = 0; i < (metadata.steps as unknown[]).length; i++) {
          const step = (metadata.steps as Record<string, unknown>[])[i];
          workflow.steps.push({
            id: uuidv4(),
            name: (step.name as string) || `Step ${i + 1}`,
            type: this.inferStepType(step),
            config: step,
          });
        }
      }
      
      workflows.push(workflow);
    }
    
    return workflows;
  }
  
  /**
   * Synthesize navigation structure from screens
   */
  private synthesizeNavigation(screens: Screen[]): NavigationStructure {
    const items: NavigationItem[] = [];
    
    // Group screens by base path
    const pathGroups = new Map<string, Screen[]>();
    
    for (const screen of screens) {
      const basePath = screen.path.split('/')[1] || screen.path;
      if (!pathGroups.has(basePath)) {
        pathGroups.set(basePath, []);
      }
      pathGroups.get(basePath)!.push(screen);
    }
    
    // Create navigation items
    for (const [basePath, groupScreens] of pathGroups) {
      if (groupScreens.length === 1) {
        items.push({
          label: this.toDisplayName(basePath),
          path: groupScreens[0].path,
          icon: this.inferIcon(basePath),
        });
      } else {
        items.push({
          label: this.toDisplayName(basePath),
          path: `/${basePath}`,
          icon: this.inferIcon(basePath),
          children: groupScreens.map(s => ({
            label: s.name,
            path: s.path,
          })),
        });
      }
    }
    
    return {
      type: items.length > 5 ? 'sidebar' : 'tabs',
      items,
    };
  }
  
  /**
   * Infer UI components for a screen based on patterns
   */
  private inferComponents(screen: Screen, pattern: Pattern): void {
    const { type } = pattern;
    
    if (type.includes('list') || type === 'list_view') {
      if (!screen.components.find(c => c.type === 'DataTable')) {
        screen.components.push({
          id: uuidv4(),
          type: 'DataTable',
          props: {
            sortable: pattern.type.includes('sort'),
            filterable: pattern.type.includes('filter'),
          },
        });
      }
    }
    
    if (type.includes('create') || type.includes('update')) {
      if (!screen.components.find(c => c.type === 'Form')) {
        screen.components.push({
          id: uuidv4(),
          type: 'Form',
          props: {
            fields: pattern.metadata.fields || [],
          },
        });
      }
    }
    
    if (type.includes('filter')) {
      if (!screen.components.find(c => c.type === 'FilterPanel')) {
        screen.components.push({
          id: uuidv4(),
          type: 'FilterPanel',
          props: {},
        });
      }
    }
    
    if (type.includes('search')) {
      if (!screen.components.find(c => c.type === 'SearchInput')) {
        screen.components.push({
          id: uuidv4(),
          type: 'SearchInput',
          props: {},
        });
      }
    }
  }
  
  /**
   * Save model to database
   */
  private saveModel(model: ApplicationModel, patternIds: string[]): void {
    const db = getDatabase();
    
    db.prepare(`
      INSERT INTO app_models (id, version, name, description, data, pattern_ids, confidence)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      model.id,
      model.version,
      model.name,
      model.description,
      JSON.stringify({
        entities: model.entities,
        screens: model.screens,
        workflows: model.workflows,
        navigation: model.navigation,
        metadata: model.metadata,
      }),
      JSON.stringify(patternIds),
      model.confidence
    );
  }
  
  // Utility methods
  
  private inferEntityName(type: string, metadata: Record<string, unknown>): string | null {
    // Try to extract from path
    if (metadata.path) {
      const path = metadata.path as string;
      const segments = path.split('/').filter(Boolean);
      if (segments.length > 0) {
        const name = segments[segments.length - 1].replace(/new|edit|create/, '');
        if (name) return this.singularize(name);
        if (segments.length > 1) return this.singularize(segments[segments.length - 2]);
      }
    }
    return null;
  }
  
  private extractOperation(type: string): string | null {
    if (type.includes('create')) return 'create';
    if (type.includes('read')) return 'read';
    if (type.includes('update')) return 'update';
    if (type.includes('delete')) return 'delete';
    if (type.includes('list')) return 'list';
    return null;
  }
  
  private inferPropertyType(fieldName: string): string {
    const name = fieldName.toLowerCase();
    
    if (name.includes('email')) return 'email';
    if (name.includes('phone')) return 'phone';
    if (name.includes('date') || name.includes('time')) return 'datetime';
    if (name.includes('price') || name.includes('cost') || name.includes('amount')) return 'currency';
    if (name.includes('count') || name.includes('quantity') || name.includes('number')) return 'number';
    if (name.includes('is') || name.includes('has') || name.includes('active')) return 'boolean';
    if (name.includes('description') || name.includes('notes') || name.includes('content')) return 'text';
    if (name.includes('url') || name.includes('link')) return 'url';
    if (name.includes('image') || name.includes('photo') || name.includes('avatar')) return 'image';
    
    return 'string';
  }
  
  private inferScreenType(patternType: string, path: string): Screen['type'] {
    if (patternType.includes('list') || path.endsWith('/')) return 'list';
    if (patternType.includes('create') || path.includes('/new')) return 'form';
    if (patternType.includes('update') || path.includes('/edit')) return 'form';
    if (patternType.includes('read') || /\/\d+$/.test(path)) return 'detail';
    if (path.includes('dashboard')) return 'dashboard';
    return 'custom';
  }
  
  private inferStepType(step: Record<string, unknown>): WorkflowStep['type'] {
    if (step.formId || step.fields) return 'form';
    if (step.condition) return 'decision';
    if (step.path || step.navigate) return 'navigation';
    return 'action';
  }
  
  private inferIcon(name: string): string {
    const iconMap: Record<string, string> = {
      dashboard: 'LayoutDashboard',
      home: 'Home',
      menu: 'Menu',
      order: 'ShoppingCart',
      orders: 'ShoppingCart',
      staff: 'Users',
      table: 'Grid',
      tables: 'Grid',
      reservation: 'Calendar',
      reservations: 'Calendar',
      inventory: 'Package',
      settings: 'Settings',
      report: 'BarChart',
      reports: 'BarChart',
      customer: 'User',
      customers: 'Users',
    };
    
    return iconMap[name.toLowerCase()] || 'Circle';
  }
  
  private toCamelCase(str: string): string {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  }
  
  private toDisplayName(str: string): string {
    return str
      .replace(/[-_]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, c => c.toUpperCase());
  }
  
  private pathToName(path: string): string {
    const segments = path.split('/').filter(Boolean);
    return segments.map(s => this.toDisplayName(s)).join(' - ');
  }
  
  private singularize(word: string): string {
    if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
    if (word.endsWith('es')) return word.slice(0, -2);
    if (word.endsWith('s')) return word.slice(0, -1);
    return word;
  }
}

// Singleton instance
let synthesizerInstance: ApplicationModelSynthesizer | null = null;

export function getModelSynthesizer(): ApplicationModelSynthesizer {
  if (!synthesizerInstance) {
    synthesizerInstance = new ApplicationModelSynthesizer();
  }
  return synthesizerInstance;
}
