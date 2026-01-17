/**
 * Instrumentation Service
 * Central event tracking system that captures all user interactions
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  TrackedEvent,
  BaseEvent,
  EventType,
  EventMetadata,
  SemanticAction,
  InteractionEvent,
  NavigationEvent,
  StateChangeEvent,
  FormEvent,
  WorkflowEvent,
  ErrorEvent,
  SystemEvent,
  ElementTarget,
  FormField,
  ValidationError,
  TimingInfo,
} from '../types/events';

// Configuration
const CONFIG = {
  API_ENDPOINT: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  BATCH_SIZE: 10,
  FLUSH_INTERVAL: 5000, // 5 seconds
  DEBUG_MODE: process.env.NODE_ENV === 'development',
};

// Session management
let sessionId: string | null = null;
let userId: string | null = null;

// Event buffer for batching
let eventBuffer: TrackedEvent[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

// Timing trackers
const timingTrackers: Map<string, number> = new Map();

// Initialize session
export function initSession(existingSessionId?: string, existingUserId?: string): string {
  sessionId = existingSessionId || uuidv4();
  userId = existingUserId || null;
  
  // Log session start
  logSystem('session_start', {
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    viewport: typeof window !== 'undefined' ? { 
      width: window.innerWidth, 
      height: window.innerHeight 
    } : undefined,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: typeof navigator !== 'undefined' ? navigator.language : undefined,
    referrer: typeof document !== 'undefined' ? document.referrer : undefined,
  });
  
  // Set up page unload handler
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      logSystem('session_end', { reason: 'page_unload' });
      flushEvents(true);
    });
    
    window.addEventListener('visibilitychange', () => {
      logSystem('visibility_change', { 
        visible: document.visibilityState === 'visible' 
      });
    });
  }
  
  // Start flush interval
  startFlushInterval();
  
  return sessionId;
}

export function setUserId(id: string): void {
  userId = id;
}

export function getSessionId(): string {
  if (!sessionId) {
    sessionId = initSession();
  }
  return sessionId;
}

// Create base event
function createBaseEvent(type: EventType, metadata: Partial<EventMetadata> = {}): BaseEvent {
  return {
    id: uuidv4(),
    timestamp: Date.now(),
    sessionId: getSessionId(),
    userId: userId || undefined,
    type,
    metadata: {
      screen: typeof window !== 'undefined' ? window.location.pathname : '',
      ...metadata,
    },
  };
}

// ============ LOGGING FUNCTIONS ============

export function logInteraction(
  interactionType: InteractionEvent['interactionType'],
  target: ElementTarget,
  semanticAction?: SemanticAction,
  value?: unknown
): void {
  const event: InteractionEvent = {
    ...createBaseEvent('interaction', { semanticAction }),
    type: 'interaction',
    interactionType,
    target,
    value,
  };
  
  bufferEvent(event);
}

export function logNavigation(
  from: string,
  to: string,
  method: NavigationEvent['method'] = 'click'
): void {
  const event: NavigationEvent = {
    ...createBaseEvent('navigation'),
    type: 'navigation',
    from,
    to,
    method,
  };
  
  bufferEvent(event);
}

export function logStateChange(
  changeType: StateChangeEvent['changeType'],
  path: string,
  source: string,
  previousValue?: unknown,
  newValue?: unknown
): void {
  const event: StateChangeEvent = {
    ...createBaseEvent('state_change'),
    type: 'state_change',
    changeType,
    path,
    previousValue,
    newValue,
    source,
  };
  
  bufferEvent(event);
}

export function logFormEvent(
  formId: string,
  formAction: FormEvent['formAction'],
  field?: FormField,
  formData?: Record<string, unknown>,
  validationErrors?: ValidationError[],
  semanticAction?: SemanticAction
): void {
  const event: FormEvent = {
    ...createBaseEvent('form', { semanticAction }),
    type: 'form',
    formId,
    formAction,
    field,
    formData,
    validationErrors,
  };
  
  bufferEvent(event);
}

export function logWorkflow(
  workflowId: string,
  workflowName: string,
  action: WorkflowEvent['action'],
  currentStep: string,
  previousStep?: string,
  stepsCompleted: string[] = [],
  stepsRemaining: string[] = [],
  workflowData?: Record<string, unknown>,
  semanticAction?: SemanticAction
): void {
  const event: WorkflowEvent = {
    ...createBaseEvent('workflow', { semanticAction }),
    type: 'workflow',
    workflowId,
    workflowName,
    action,
    currentStep,
    previousStep,
    stepsCompleted,
    stepsRemaining,
    workflowData,
  };
  
  bufferEvent(event);
}

export function logError(
  errorType: ErrorEvent['errorType'],
  message: string,
  userAction?: string,
  code?: string,
  stack?: string,
  recoverable: boolean = true
): void {
  const event: ErrorEvent = {
    ...createBaseEvent('error'),
    type: 'error',
    errorType,
    message,
    code,
    stack,
    userAction,
    recoverable,
  };
  
  bufferEvent(event);
}

export function logSystem(
  systemAction: SystemEvent['systemAction'],
  data?: Record<string, unknown>
): void {
  const event: SystemEvent = {
    ...createBaseEvent('system'),
    type: 'system',
    systemAction,
    data,
  };
  
  bufferEvent(event);
}

// ============ TIMING FUNCTIONS ============

export function startTiming(key: string): void {
  timingTrackers.set(key, Date.now());
}

export function endTiming(key: string): TimingInfo | null {
  const startTime = timingTrackers.get(key);
  if (!startTime) return null;
  
  const endTime = Date.now();
  timingTrackers.delete(key);
  
  return {
    startTime,
    endTime,
    duration: endTime - startTime,
  };
}

// ============ BUFFER MANAGEMENT ============

function bufferEvent(event: TrackedEvent): void {
  eventBuffer.push(event);
  
  if (CONFIG.DEBUG_MODE) {
    console.log('[Instrumentation]', event.type, event);
  }
  
  // Flush if buffer is full
  if (eventBuffer.length >= CONFIG.BATCH_SIZE) {
    flushEvents();
  }
}

function startFlushInterval(): void {
  if (flushTimeout) {
    clearInterval(flushTimeout);
  }
  
  flushTimeout = setInterval(() => {
    if (eventBuffer.length > 0) {
      flushEvents();
    }
  }, CONFIG.FLUSH_INTERVAL);
}

async function flushEvents(sync: boolean = false): Promise<void> {
  if (eventBuffer.length === 0) return;
  
  const eventsToSend = [...eventBuffer];
  eventBuffer = [];
  
  try {
    if (sync && typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      // Use sendBeacon for synchronous flush (page unload)
      navigator.sendBeacon(
        `${CONFIG.API_ENDPOINT}/api/events`,
        JSON.stringify({ events: eventsToSend })
      );
    } else {
      // Use fetch for async flush
      await fetch(`${CONFIG.API_ENDPOINT}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: eventsToSend }),
      });
    }
  } catch (error) {
    // Re-buffer events on failure
    eventBuffer = [...eventsToSend, ...eventBuffer];
    
    if (CONFIG.DEBUG_MODE) {
      console.error('[Instrumentation] Failed to flush events:', error);
    }
  }
}

// ============ ELEMENT HELPERS ============

export function extractElementTarget(element: HTMLElement): ElementTarget {
  return {
    tagName: element.tagName.toLowerCase(),
    id: element.id || undefined,
    className: element.className || undefined,
    text: element.textContent?.slice(0, 100) || undefined,
    attributes: extractDataAttributes(element),
  };
}

function extractDataAttributes(element: HTMLElement): Record<string, string> {
  const attributes: Record<string, string> = {};
  
  Array.from(element.attributes).forEach(attr => {
    if (attr.name.startsWith('data-')) {
      attributes[attr.name] = attr.value;
    }
  });
  
  return attributes;
}

// Export singleton
export const instrumentation = {
  initSession,
  setUserId,
  getSessionId,
  logInteraction,
  logNavigation,
  logStateChange,
  logFormEvent,
  logWorkflow,
  logError,
  logSystem,
  startTiming,
  endTiming,
  extractElementTarget,
};

export default instrumentation;
