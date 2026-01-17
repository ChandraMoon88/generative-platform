/**
 * Application Model Types
 * These define the structure of synthesized application specifications
 */

// Complete application model
export interface ApplicationModel {
  id: string;
  version: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  
  // Core model components
  dataModel: DataModel;
  uiModel: UIModel;
  workflowModel: WorkflowModel;
  validationModel: ValidationModel;
  accessControlModel: AccessControlModel;
  
  // Metadata
  sourcePatterns: string[];      // Pattern IDs that contributed
  confidence: number;            // Overall confidence score
  statistics: ModelStatistics;
}

export interface ModelStatistics {
  sessionsAnalyzed: number;
  patternsRecognized: number;
  entitiesDiscovered: number;
  workflowsDiscovered: number;
  validationRulesInferred: number;
}

// ============ DATA MODEL ============

export interface DataModel {
  entities: Entity[];
  relationships: Relationship[];
}

export interface Entity {
  id: string;
  name: string;
  displayName: string;
  description: string;
  properties: Property[];
  primaryKey: string;
  timestamps: boolean;           // Include createdAt/updatedAt
  softDelete: boolean;           // Include deletedAt for soft deletes
  
  // Discovered metadata
  frequency: number;             // How often this entity was used
  confidence: number;
}

export interface Property {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: PropertyType;
  required: boolean;
  unique: boolean;
  defaultValue?: unknown;
  
  // Type-specific constraints
  constraints: PropertyConstraints;
  
  // Discovered metadata
  frequency: number;
  inferredFrom: string[];        // Pattern IDs
}

export type PropertyType = 
  | 'string'
  | 'text'
  | 'number'
  | 'integer'
  | 'decimal'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'time'
  | 'email'
  | 'phone'
  | 'url'
  | 'enum'
  | 'json'
  | 'file'
  | 'image';

export interface PropertyConstraints {
  // String constraints
  minLength?: number;
  maxLength?: number;
  pattern?: string;              // Regex pattern
  
  // Number constraints
  min?: number;
  max?: number;
  precision?: number;
  
  // Enum constraints
  enumValues?: EnumValue[];
  
  // Reference constraints
  referencedEntity?: string;
  
  // Custom validation
  customValidation?: string;
}

export interface EnumValue {
  value: string;
  label: string;
  order?: number;
}

export interface Relationship {
  id: string;
  name: string;
  type: RelationshipType;
  sourceEntity: string;
  targetEntity: string;
  sourceProperty: string;
  targetProperty?: string;
  
  // Relationship behavior
  cascadeDelete: boolean;
  cascadeUpdate: boolean;
  required: boolean;
  
  // Discovered metadata
  frequency: number;
  confidence: number;
}

export type RelationshipType = 
  | 'one-to-one'
  | 'one-to-many'
  | 'many-to-one'
  | 'many-to-many';

// ============ UI MODEL ============

export interface UIModel {
  screens: Screen[];
  navigation: NavigationStructure;
  theme: ThemeConfig;
  layouts: Layout[];
}

export interface Screen {
  id: string;
  name: string;
  path: string;
  type: ScreenType;
  layout: string;                // Layout ID
  components: UIComponent[];
  
  // Screen metadata
  entity?: string;               // Primary entity for this screen
  requiresAuth: boolean;
  allowedRoles?: string[];
  
  // Discovered metadata
  visitFrequency: number;
  averageTimeSpent: number;
}

export type ScreenType = 
  | 'dashboard'
  | 'list'
  | 'detail'
  | 'form'
  | 'wizard'
  | 'report'
  | 'settings'
  | 'custom';

export interface UIComponent {
  id: string;
  type: ComponentType;
  properties: Record<string, unknown>;
  children?: UIComponent[];
  
  // Data binding
  dataSource?: DataBinding;
  actions?: ComponentAction[];
  
  // Layout
  position?: { row: number; col: number; rowSpan?: number; colSpan?: number };
}

export type ComponentType = 
  | 'container'
  | 'text'
  | 'heading'
  | 'button'
  | 'link'
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'datepicker'
  | 'timepicker'
  | 'file-upload'
  | 'table'
  | 'list'
  | 'card'
  | 'form'
  | 'modal'
  | 'tabs'
  | 'accordion'
  | 'chart'
  | 'map'
  | 'image'
  | 'custom';

export interface DataBinding {
  type: 'entity' | 'list' | 'computed' | 'static';
  entity?: string;
  property?: string;
  query?: QueryDefinition;
  transform?: string;
}

export interface QueryDefinition {
  filters?: QueryFilter[];
  sort?: QuerySort[];
  pagination?: boolean;
  pageSize?: number;
}

export interface QueryFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in' | 'between';
  value: unknown;
  dynamic?: boolean;             // Value from user input
}

export interface QuerySort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface ComponentAction {
  trigger: 'click' | 'change' | 'submit' | 'hover' | 'focus';
  type: 'navigate' | 'api' | 'state' | 'workflow' | 'custom';
  config: Record<string, unknown>;
}

export interface NavigationStructure {
  type: 'sidebar' | 'topbar' | 'both';
  items: NavigationItem[];
}

export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  screen?: string;
  children?: NavigationItem[];
  roles?: string[];
}

export interface Layout {
  id: string;
  name: string;
  type: 'single' | 'split' | 'grid' | 'dashboard';
  config: Record<string, unknown>;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: string;
  spacing: string;
}

// ============ WORKFLOW MODEL ============

export interface WorkflowModel {
  workflows: Workflow[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  triggerEntity?: string;
  
  states: WorkflowState[];
  transitions: WorkflowTransition[];
  
  initialState: string;
  finalStates: string[];
  
  // Discovered metadata
  frequency: number;
  averageDuration: number;
  completionRate: number;
}

export interface WorkflowState {
  id: string;
  name: string;
  type: 'initial' | 'intermediate' | 'final' | 'error';
  
  // Actions when entering/exiting state
  onEnter?: WorkflowAction[];
  onExit?: WorkflowAction[];
  
  // UI for this state
  screen?: string;
  formFields?: string[];
}

export interface WorkflowTransition {
  id: string;
  from: string;
  to: string;
  trigger: string;               // Event that triggers transition
  
  // Guards and conditions
  guards?: TransitionGuard[];
  
  // Actions during transition
  actions?: WorkflowAction[];
}

export interface TransitionGuard {
  type: 'condition' | 'permission' | 'validation';
  expression: string;
  errorMessage?: string;
}

export interface WorkflowAction {
  type: 'api' | 'state' | 'notification' | 'email' | 'custom';
  config: Record<string, unknown>;
}

// ============ VALIDATION MODEL ============

export interface ValidationModel {
  rules: ValidationRule[];
  customValidators: CustomValidator[];
}

export interface ValidationRule {
  id: string;
  entity: string;
  property?: string;             // undefined means entity-level
  type: ValidationRuleType;
  config: Record<string, unknown>;
  message: string;
  
  // When to apply
  applyOn: ('create' | 'update' | 'delete')[];
  
  // Discovered metadata
  frequency: number;             // How often this rule was triggered
  inferredFrom: string[];
}

export type ValidationRuleType = 
  | 'required'
  | 'type'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'enum'
  | 'unique'
  | 'reference'
  | 'custom';

export interface CustomValidator {
  id: string;
  name: string;
  description: string;
  code: string;                  // Validation logic
}

// ============ ACCESS CONTROL MODEL ============

export interface AccessControlModel {
  roles: Role[];
  permissions: Permission[];
  policies: AccessPolicy[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];         // Permission IDs
  inherits?: string[];           // Inherit from other roles
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;              // Entity or screen
  actions: ('create' | 'read' | 'update' | 'delete' | 'execute')[];
}

export interface AccessPolicy {
  id: string;
  name: string;
  description: string;
  condition: string;             // Expression to evaluate
  effect: 'allow' | 'deny';
}

// Export all types
export * from './events';
