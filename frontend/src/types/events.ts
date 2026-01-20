/**
 * Event Types for Frontend
 * Shared event type definitions
 */

// Base Event Types
export type EventType = 
  | 'interaction'
  | 'navigation'
  | 'state_change'
  | 'form'
  | 'workflow'
  | 'error'
  | 'system'
  | 'pattern_detected';

export interface EventMetadata {
  timestamp: number;
  sessionId: string;
  userId?: string;
  component?: string;
  route?: string;
  [key: string]: any;
}

export interface BaseEvent {
  id: string;
  type: EventType;
  metadata: EventMetadata;
}

export type SemanticAction = 
  | 'create' | 'read' | 'update' | 'delete'
  | 'navigate' | 'filter' | 'sort' | 'search'
  | 'submit' | 'validate' | 'export' | 'import'
  | 'select' | 'deselect' | 'expand' | 'collapse';

export type PatternType =
  | 'crud' | 'list_view' | 'detail_view' | 'form_flow'
  | 'search' | 'filter' | 'sort' | 'navigation'
  | 'user_preference' | 'workflow' | 'error_handling';

export type CRUDOperation = 'create' | 'read' | 'update' | 'delete';

export interface TimingInfo {
  duration?: number;
  startTime?: number;
  endTime?: number;
}

export interface InteractionEvent extends BaseEvent {
  type: 'interaction';
  action: SemanticAction;
  target: ElementTarget;
  timing: TimingInfo;
}

export interface ElementTarget {
  id?: string;
  type: string;
  value?: any;
  label?: string;
}

export interface NavigationEvent extends BaseEvent {
  type: 'navigation';
  from: string;
  to: string;
  method: 'link' | 'button' | 'back' | 'forward' | 'programmatic';
}

export interface StateChangeEvent extends BaseEvent {
  type: 'state_change';
  entityType?: string;
  operation: CRUDOperation;
  data: any;
  previousState?: any;
}

export interface FormEvent extends BaseEvent {
  type: 'form';
  formId: string;
  action: 'start' | 'field_change' | 'validate' | 'submit' | 'error' | 'success';
  fields?: FormField[];
  errors?: ValidationError[];
}

export interface FormField {
  name: string;
  type: string;
  value: any;
  label?: string;
  previousValue?: any;
  isValid?: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  type: string;
}

export interface WorkflowEvent extends BaseEvent {
  type: 'workflow';
  workflowId: string;
  step: string;
  action: 'start' | 'progress' | 'complete' | 'abandon';
  data?: any;
}

export interface ErrorEvent extends BaseEvent {
  type: 'error';
  errorType: string;
  message: string;
  stack?: string;
  context?: any;
}

export interface SystemEvent extends BaseEvent {
  type: 'system';
  action: 'page_load' | 'page_unload' | 'visibility_change' | 'network_change';
  data?: any;
}

export type TrackedEvent = 
  | InteractionEvent
  | NavigationEvent
  | StateChangeEvent
  | FormEvent
  | WorkflowEvent
  | ErrorEvent
  | SystemEvent;

export interface Session {
  id: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  metadata: SessionMetadata;
  events: TrackedEvent[];
}

export interface SessionMetadata {
  userAgent: string;
  viewport: { width: number; height: number };
  referrer?: string;
  [key: string]: any;
}

export interface RecognizedPattern {
  type: PatternType;
  confidence: number;
  metadata: PatternMetadata;
  suggestedImplementation?: any;
}

export interface PatternMetadata {
  entityType?: string;
  operations?: CRUDOperation[];
  fields?: string[];
  workflow?: string[];
  [key: string]: any;
}
