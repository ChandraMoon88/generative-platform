/**
 * Core Event Types for Instrumentation
 * These define the structure of all events captured from user interactions
 */

// Base event that all events extend
export interface BaseEvent {
  id: string;                    // Unique event identifier
  timestamp: number;             // Millisecond precision timestamp
  sessionId: string;             // Links events from same session
  userId?: string;               // Optional user identifier
  type: EventType;               // Category of event
  metadata: EventMetadata;       // Context about the event
}

// Categories of events
export type EventType = 
  | 'interaction'      // User clicked, typed, etc.
  | 'navigation'       // User navigated between screens
  | 'state_change'     // Application state changed
  | 'form'             // Form-related events
  | 'workflow'         // Multi-step process events
  | 'error'            // Error occurred
  | 'system';          // System events

// Metadata attached to every event
export interface EventMetadata {
  screen: string;                // Current screen/route
  component?: string;            // Component that triggered event
  elementId?: string;            // DOM element ID if applicable
  elementType?: string;          // Type of element (button, input, etc.)
  semanticAction?: SemanticAction; // What this action means abstractly
  timing?: TimingInfo;           // Timing information
  context?: Record<string, unknown>; // Additional context
}

// Semantic meaning of user actions
export interface SemanticAction {
  pattern: PatternType;          // What pattern this represents
  entity?: string;               // Entity type involved
  operation?: CRUDOperation;     // CRUD operation if applicable
  workflowStep?: string;         // Step in a workflow
  description: string;           // Human-readable description
}

// Types of patterns we recognize
export type PatternType =
  | 'crud_create'
  | 'crud_read'
  | 'crud_update'
  | 'crud_delete'
  | 'list_view'
  | 'detail_view'
  | 'filter'
  | 'sort'
  | 'search'
  | 'navigation'
  | 'form_submission'
  | 'workflow_step'
  | 'relationship_management'
  | 'batch_operation'
  | 'data_export'
  | 'data_import'
  | 'authentication'
  | 'authorization';

export type CRUDOperation = 'create' | 'read' | 'update' | 'delete';

// Timing information for performance tracking
export interface TimingInfo {
  startTime: number;
  endTime?: number;
  duration?: number;
}

// Specific event types

export interface InteractionEvent extends BaseEvent {
  type: 'interaction';
  interactionType: 'click' | 'input' | 'focus' | 'blur' | 'hover' | 'scroll' | 'drag' | 'drop';
  target: ElementTarget;
  value?: unknown;
}

export interface ElementTarget {
  tagName: string;
  id?: string;
  className?: string;
  text?: string;
  attributes?: Record<string, string>;
}

export interface NavigationEvent extends BaseEvent {
  type: 'navigation';
  from: string;
  to: string;
  method: 'click' | 'programmatic' | 'browser';
}

export interface StateChangeEvent extends BaseEvent {
  type: 'state_change';
  changeType: 'set' | 'update' | 'delete' | 'reset';
  path: string;                  // State path that changed
  previousValue?: unknown;
  newValue?: unknown;
  source: string;                // What triggered the change
}

export interface FormEvent extends BaseEvent {
  type: 'form';
  formId: string;
  formAction: 'start' | 'field_change' | 'validate' | 'submit' | 'reset' | 'cancel';
  field?: FormField;
  formData?: Record<string, unknown>;
  validationErrors?: ValidationError[];
}

export interface FormField {
  name: string;
  type: string;
  value: unknown;
  previousValue?: unknown;
  isValid: boolean;
  validationMessage?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  rule: string;
}

export interface WorkflowEvent extends BaseEvent {
  type: 'workflow';
  workflowId: string;
  workflowName: string;
  action: 'start' | 'step' | 'complete' | 'cancel' | 'error';
  currentStep: string;
  previousStep?: string;
  stepsCompleted: string[];
  stepsRemaining: string[];
  workflowData?: Record<string, unknown>;
}

export interface ErrorEvent extends BaseEvent {
  type: 'error';
  errorType: 'validation' | 'network' | 'permission' | 'system' | 'user';
  message: string;
  code?: string;
  stack?: string;
  userAction?: string;           // What user was trying to do
  recoverable: boolean;
}

export interface SystemEvent extends BaseEvent {
  type: 'system';
  systemAction: 'session_start' | 'session_end' | 'page_load' | 'page_unload' | 'visibility_change';
  data?: Record<string, unknown>;
}

// Union type for all events
export type TrackedEvent = 
  | InteractionEvent 
  | NavigationEvent 
  | StateChangeEvent 
  | FormEvent 
  | WorkflowEvent 
  | ErrorEvent 
  | SystemEvent;

// Session that groups related events
export interface Session {
  id: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  events: TrackedEvent[];
  metadata: SessionMetadata;
  patterns?: RecognizedPattern[];
}

export interface SessionMetadata {
  userAgent?: string;
  viewport?: { width: number; height: number };
  timezone?: string;
  language?: string;
  referrer?: string;
}

// Recognized pattern from analysis
export interface RecognizedPattern {
  id: string;
  type: PatternType;
  confidence: number;            // 0-1 confidence score
  events: string[];              // Event IDs that form this pattern
  startTime: number;
  endTime: number;
  metadata: PatternMetadata;
}

export interface PatternMetadata {
  entity?: string;
  properties?: string[];
  workflow?: string;
  relationshipType?: string;
  validationRules?: string[];
  description: string;
}
