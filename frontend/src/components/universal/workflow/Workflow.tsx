/**
 * Workflow Components
 * Wizard, Stepper, Kanban Board, Approval Workflows
 */

'use client';

import React, { useState } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

// ========== WIZARD / STEPPER ==========
export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  validate?: () => Promise<boolean> | boolean;
}

export interface WizardProps {
  id: string;
  steps: WizardStep[];
  onComplete: (data: Record<string, any>) => void;
  onCancel?: () => void;
}

export function Wizard({ id, steps, onComplete, onCancel }: WizardProps) {
  const { track } = useEventTracking('Wizard', id);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [wizardData, setWizardData] = useState<Record<string, any>>({});

  const handleNext = async () => {
    const step = steps[currentStep];

    // Validate current step
    if (step.validate) {
      const isValid = await step.validate();
      if (!isValid) {
        track('validation_failed', step.id);
        return;
      }
    }

    track('step_complete', step.id, { stepNumber: currentStep + 1 });

    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);

    if (currentStep === steps.length - 1) {
      track('wizard_complete', null);
      onComplete(wizardData);
    } else {
      setCurrentStep(currentStep + 1);
      track('step_change', steps[currentStep + 1].id, { from: currentStep, to: currentStep + 1 });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      track('step_back', steps[currentStep - 1].id);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (index: number) => {
    if (completedSteps.has(index) || index < currentStep) {
      track('step_jump', steps[index].id, { from: currentStep, to: index });
      setCurrentStep(index);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      {/* Step Indicator */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isCurrent = index === currentStep;
          const isAccessible = isCompleted || index <= currentStep;

          return (
            <div key={step.id} className="flex-1 flex flex-col items-center">
              <button
                onClick={() => handleStepClick(index)}
                disabled={!isAccessible}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${
                  isCurrent
                    ? 'bg-blue-500 text-white'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                } ${isAccessible ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'}`}
              >
                {isCompleted ? '✓' : index + 1}
              </button>

              <div className="text-center">
                <div className={`text-sm font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-600'}`}>
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-gray-500 mt-1">{step.description}</div>
                )}
              </div>

              {index < steps.length - 1 && (
                <div className={`h-1 w-full mt-[-1.5rem] ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="min-h-[300px] mb-6">
        {steps[currentStep].content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Back
        </button>

        <div className="flex gap-3">
          {onCancel && (
            <button
              onClick={() => {
                track('cancel', null, { currentStep });
                onCancel();
              }}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== KANBAN BOARD ==========
export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  limit?: number;
}

export interface KanbanBoardProps {
  id: string;
  columns: KanbanColumn[];
  onCardMove: (cardId: string, fromColumn: string, toColumn: string) => void;
  onCardClick?: (card: KanbanCard) => void;
}

export function KanbanBoard({ id, columns, onCardMove, onCardClick }: KanbanBoardProps) {
  const { track } = useEventTracking('KanbanBoard', id);
  const [draggedCard, setDraggedCard] = useState<{ card: KanbanCard; column: string } | null>(null);

  const handleDragStart = (card: KanbanCard, columnId: string) => {
    track('card_drag_start', card.id, { column: columnId });
    setDraggedCard({ card, column: columnId });
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (!draggedCard) return;

    if (draggedCard.column !== columnId) {
      track('card_move', draggedCard.card.id, {
        from: draggedCard.column,
        to: columnId,
      });
      onCardMove(draggedCard.card.id, draggedCard.column, columnId);
    }

    setDraggedCard(null);
  };

  const priorityColors = {
    low: 'border-green-500',
    medium: 'border-yellow-500',
    high: 'border-red-500',
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 min-w-max p-4">
        {columns.map((column) => (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
            className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <span className="text-sm text-gray-600">
                {column.cards.length}
                {column.limit && `/${column.limit}`}
              </span>
            </div>

            <div className="space-y-3">
              {column.cards.map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => handleDragStart(card, column.id)}
                  onClick={() => {
                    track('card_click', card.id);
                    onCardClick?.(card);
                  }}
                  className={`bg-white rounded-lg p-3 shadow-sm cursor-move hover:shadow-md transition-shadow border-l-4 ${
                    card.priority ? priorityColors[card.priority] : 'border-transparent'
                  }`}
                >
                  <h4 className="font-medium text-gray-900 mb-1">{card.title}</h4>
                  {card.description && (
                    <p className="text-sm text-gray-600 mb-2">{card.description}</p>
                  )}

                  {card.tags && card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {card.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {card.assignee && (
                    <div className="flex items-center gap-2 mt-2">
                      {card.assignee.avatar ? (
                        <img
                          src={card.assignee.avatar}
                          alt={card.assignee.name}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                          {card.assignee.name[0]}
                        </div>
                      )}
                      <span className="text-xs text-gray-600">{card.assignee.name}</span>
                    </div>
                  )}
                </div>
              ))}

              {column.cards.length === 0 && (
                <div className="text-center text-gray-400 py-8 text-sm">
                  Drop cards here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== PROGRESS TRACKER ==========
export interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  timestamp?: number;
}

export function ProgressTracker({
  id,
  steps,
  orientation = 'vertical',
}: {
  id: string;
  steps: ProgressStep[];
  orientation?: 'vertical' | 'horizontal';
}) {
  const { track } = useEventTracking('ProgressTracker', id);

  useEffect(() => {
    track('mount', null, { stepCount: steps.length, orientation });
  }, []);

  const statusColors = {
    pending: 'bg-gray-300',
    active: 'bg-blue-500 animate-pulse',
    completed: 'bg-green-500',
    error: 'bg-red-500',
  };

  const statusIcons = {
    pending: '○',
    active: '◉',
    completed: '✓',
    error: '✕',
  };

  if (orientation === 'horizontal') {
    return (
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full ${statusColors[step.status]} text-white flex items-center justify-center font-bold`}>
                {statusIcons[step.status]}
              </div>
              <div className="text-sm mt-2 text-center">{step.label}</div>
              {step.timestamp && (
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(step.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>

            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 ${step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <div key={step.id} className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full ${statusColors[step.status]} text-white flex items-center justify-center font-bold flex-shrink-0`}>
            {statusIcons[step.status]}
          </div>
          <div className="flex-1">
            <div className="font-medium">{step.label}</div>
            {step.timestamp && (
              <div className="text-xs text-gray-500">
                {new Date(step.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
