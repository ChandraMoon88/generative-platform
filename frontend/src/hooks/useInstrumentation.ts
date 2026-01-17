/**
 * useInstrumentation Hook
 * Provides easy instrumentation capabilities to any component
 */

import { useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  instrumentation,
  logInteraction,
  logNavigation,
  logFormEvent,
  logWorkflow,
  logError,
  logStateChange,
  startTiming,
  endTiming,
  extractElementTarget,
} from '../services/instrumentation';
import type { SemanticAction, PatternType, CRUDOperation, FormField, ValidationError } from '../types/events';

interface UseInstrumentationOptions {
  componentName: string;
  entityType?: string;
}

export function useInstrumentation(options: UseInstrumentationOptions) {
  const { componentName, entityType } = options;
  const pathname = usePathname();
  const previousPathRef = useRef<string>('');
  
  // Track navigation
  useEffect(() => {
    if (previousPathRef.current && previousPathRef.current !== pathname) {
      logNavigation(previousPathRef.current, pathname, 'programmatic');
    }
    previousPathRef.current = pathname;
  }, [pathname]);
  
  // Create semantic action helper
  const createSemanticAction = useCallback((
    pattern: PatternType,
    operation?: CRUDOperation,
    description?: string,
    workflowStep?: string
  ): SemanticAction => ({
    pattern,
    entity: entityType,
    operation,
    workflowStep,
    description: description || `${pattern} on ${entityType || 'unknown'}`,
  }), [entityType]);
  
  // Track click with semantic meaning - supports HTMLElement or string identifier
  const trackClick = useCallback((
    elementOrId: HTMLElement | string,
    patternOrEntity?: PatternType | string,
    operationOrMeta?: CRUDOperation | Record<string, unknown>,
    description?: string
  ) => {
    const target = typeof elementOrId === 'string' 
      ? { tagName: 'button', id: elementOrId, attributes: {} }
      : extractElementTarget(elementOrId);
    const pattern: PatternType = (typeof patternOrEntity === 'string' && !['crud_create', 'crud_read', 'crud_update', 'crud_delete'].includes(patternOrEntity))
      ? 'crud_read' 
      : (patternOrEntity as PatternType) || 'crud_read';
    const operation = typeof operationOrMeta === 'string' ? operationOrMeta as CRUDOperation : undefined;
    
    logInteraction(
      'click',
      target,
      createSemanticAction(pattern, operation, description),
      typeof operationOrMeta === 'object' ? operationOrMeta : undefined
    );
  }, [createSemanticAction]);
  
  // Track input change
  const trackInput = useCallback((
    element: HTMLElement,
    value: unknown,
    pattern: PatternType = 'form_submission'
  ) => {
    logInteraction(
      'input',
      extractElementTarget(element),
      createSemanticAction(pattern, undefined, `Input change in ${componentName}`),
      value
    );
  }, [componentName, createSemanticAction]);
  
  // Track form events
  const trackFormStart = useCallback((formId: string) => {
    logFormEvent(
      formId,
      'start',
      undefined,
      undefined,
      undefined,
      createSemanticAction('form_submission', undefined, `Started form ${formId}`)
    );
    startTiming(`form_${formId}`);
  }, [createSemanticAction]);
  
  const trackFormFieldChange = useCallback((
    formId: string,
    field: FormField
  ) => {
    logFormEvent(formId, 'field_change', field);
  }, []);
  
  const trackFormSubmit = useCallback((
    formId: string,
    formData: Record<string, unknown>,
    operation: CRUDOperation = 'create'
  ) => {
    const timing = endTiming(`form_${formId}`);
    logFormEvent(
      formId,
      'submit',
      undefined,
      formData,
      undefined,
      createSemanticAction(
        operation === 'create' ? 'crud_create' : 'crud_update',
        operation,
        `Submitted form ${formId}`,
      )
    );
    return timing;
  }, [createSemanticAction]);
  
  const trackFormValidationError = useCallback((
    formId: string,
    errors: ValidationError[]
  ) => {
    logFormEvent(formId, 'validate', undefined, undefined, errors);
  }, []);
  
  // Track CRUD operations
  const trackCreate = useCallback((data: Record<string, unknown>) => {
    logStateChange('set', `${entityType}/create`, componentName, undefined, data);
  }, [entityType, componentName]);
  
  const trackRead = useCallback((id: string) => {
    logInteraction(
      'click',
      { tagName: 'item', id },
      createSemanticAction('crud_read', 'read', `View ${entityType} ${id}`)
    );
  }, [entityType, createSemanticAction]);
  
  const trackUpdate = useCallback((id: string, previousData: unknown, newData: unknown) => {
    logStateChange('update', `${entityType}/${id}`, componentName, previousData, newData);
  }, [entityType, componentName]);
  
  const trackDelete = useCallback((id: string, data: unknown) => {
    logStateChange('delete', `${entityType}/${id}`, componentName, data, undefined);
  }, [entityType, componentName]);

  // Combined CRUD tracking (convenience method)
  const trackCRUD = useCallback((
    operation: CRUDOperation,
    entity: string,
    id?: string,
    data?: Record<string, unknown>,
    previousData?: unknown
  ) => {
    const targetEntity = entity || entityType;
    switch (operation) {
      case 'create':
        logStateChange('set', `${targetEntity}/create`, componentName, undefined, data);
        break;
      case 'read':
        logInteraction(
          'click',
          { tagName: 'item', id: id || '' },
          createSemanticAction('crud_read', 'read', `View ${targetEntity} ${id}`)
        );
        break;
      case 'update':
        logStateChange('update', `${targetEntity}/${id}`, componentName, previousData, data);
        break;
      case 'delete':
        logStateChange('delete', `${targetEntity}/${id}`, componentName, data, undefined);
        break;
    }
  }, [entityType, componentName, createSemanticAction]);
  
  // Track list interactions
  const trackListView = useCallback((items: unknown[], filters?: Record<string, unknown>) => {
    logInteraction(
      'scroll',
      { tagName: 'list', attributes: { 'data-entity': entityType || '' } },
      createSemanticAction('list_view', 'read', `Viewing ${entityType} list`),
      { itemCount: items.length, filters }
    );
  }, [entityType, createSemanticAction]);
  
  const trackFilter = useCallback((filters: Record<string, unknown>) => {
    logInteraction(
      'input',
      { tagName: 'filter' },
      createSemanticAction('filter', undefined, `Filtering ${entityType}`),
      filters
    );
  }, [entityType, createSemanticAction]);
  
  const trackSort = useCallback((field: string, direction: 'asc' | 'desc') => {
    logInteraction(
      'click',
      { tagName: 'sort', attributes: { 'data-field': field } },
      createSemanticAction('sort', undefined, `Sorting ${entityType} by ${field}`),
      { field, direction }
    );
  }, [entityType, createSemanticAction]);
  
  // Track workflow
  const trackWorkflowStart = useCallback((
    workflowId: string,
    workflowName: string,
    initialData?: Record<string, unknown>
  ) => {
    logWorkflow(
      workflowId,
      workflowName,
      'start',
      'initial',
      undefined,
      [],
      [],
      initialData,
      createSemanticAction('workflow_step', undefined, `Started workflow ${workflowName}`)
    );
    startTiming(`workflow_${workflowId}`);
  }, [createSemanticAction]);
  
  const trackWorkflowStep = useCallback((
    workflowId: string,
    workflowName: string,
    currentStep: string,
    previousStep: string,
    stepsCompleted: string[],
    stepsRemaining: string[],
    stepData?: Record<string, unknown>
  ) => {
    logWorkflow(
      workflowId,
      workflowName,
      'step',
      currentStep,
      previousStep,
      stepsCompleted,
      stepsRemaining,
      stepData,
      createSemanticAction('workflow_step', undefined, `Workflow step: ${currentStep}`, currentStep)
    );
  }, [createSemanticAction]);
  
  const trackWorkflowComplete = useCallback((
    workflowId: string,
    workflowName: string,
    finalStep: string,
    stepsCompleted: string[],
    resultData?: Record<string, unknown>
  ) => {
    const timing = endTiming(`workflow_${workflowId}`);
    logWorkflow(
      workflowId,
      workflowName,
      'complete',
      finalStep,
      undefined,
      stepsCompleted,
      [],
      { ...resultData, duration: timing?.duration },
      createSemanticAction('workflow_step', undefined, `Completed workflow ${workflowName}`)
    );
    return timing;
  }, [createSemanticAction]);
  
  // Track errors
  const trackError = useCallback((
    message: string,
    userAction?: string,
    errorType: 'validation' | 'network' | 'permission' | 'system' | 'user' = 'system'
  ) => {
    logError(errorType, message, userAction);
  }, []);
  
  return {
    // Basic tracking
    trackClick,
    trackInput,
    
    // Form tracking
    trackFormStart,
    trackFormFieldChange,
    trackFormSubmit,
    trackFormValidationError,
    
    // CRUD tracking
    trackCreate,
    trackRead,
    trackUpdate,
    trackDelete,
    trackCRUD,
    
    // List tracking
    trackListView,
    trackFilter,
    trackSort,
    
    // Workflow tracking
    trackWorkflowStart,
    trackWorkflowStep,
    trackWorkflowComplete,
    
    // Error tracking
    trackError,
    
    // Helpers
    createSemanticAction,
  };
}

export default useInstrumentation;
