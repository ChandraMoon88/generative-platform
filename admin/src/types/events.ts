/**
 * Event Types for Frontend
 * Re-export from shared types with frontend-specific additions
 */

// Re-export all shared types
export type {
  BaseEvent,
  EventType,
  EventMetadata,
  SemanticAction,
  PatternType,
  CRUDOperation,
  TimingInfo,
  InteractionEvent,
  ElementTarget,
  NavigationEvent,
  StateChangeEvent,
  FormEvent,
  FormField,
  ValidationError,
  WorkflowEvent,
  ErrorEvent,
  SystemEvent,
  TrackedEvent,
  Session,
  SessionMetadata,
  RecognizedPattern,
  PatternMetadata,
} from '../../../shared/types/events';
