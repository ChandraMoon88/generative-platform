/**
 * Notification and Feedback Components
 * Toast, Alert, Badge, Loading, Progress
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

// ========== TOAST ==========
export interface Toast {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class ToastManager {
  private listeners: Set<(toasts: Toast[]) => void> = new Set();
  private toasts: Toast[] = [];

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  show(toast: Omit<Toast, 'id'>) {
    const id = `toast_${Date.now()}_${Math.random()}`;
    const newToast: Toast = { ...toast, id };
    this.toasts = [...this.toasts, newToast];
    this.notify();

    if (toast.duration !== 0) {
      setTimeout(() => this.dismiss(id), toast.duration || 5000);
    }
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.toasts));
  }
}

export const toastManager = new ToastManager();

export function ToastContainer({ id }: { id: string }) {
  const { track } = useEventTracking('ToastContainer', id);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return () => {
      unsubscribe();
    };
  }, []);

  const handleDismiss = (toastId: string) => {
    track('toast_dismiss', toastId);
    toastManager.dismiss(toastId);
  };

  const typeStyles = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const typeIcons = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠️',
    error: '✕',
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${typeStyles[toast.type || 'info']} text-white rounded-lg shadow-lg p-4 flex items-start gap-3 animate-slide-in`}
        >
          <span className="text-xl">{typeIcons[toast.type || 'info']}</span>
          <div className="flex-1">
            <p>{toast.message}</p>
            {toast.action && (
              <button
                onClick={() => {
                  track('toast_action', toast.id);
                  toast.action!.onClick();
                }}
                className="mt-2 text-sm underline hover:no-underline"
              >
                {toast.action.label}
              </button>
            )}
          </div>
          <button
            onClick={() => handleDismiss(toast.id)}
            className="text-white hover:text-gray-200 text-xl leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// ========== ALERT ==========
export interface AlertProps {
  id: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Alert({
  id,
  type = 'info',
  title,
  message,
  dismissible = true,
  onDismiss,
  action,
}: AlertProps) {
  const { track } = useEventTracking('Alert', id);

  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    error: 'bg-red-50 border-red-200 text-red-900',
  };

  const typeIcons = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠️',
    error: '✕',
  };

  return (
    <div className={`${typeStyles[type]} border rounded-lg p-4 flex items-start gap-3`}>
      <span className="text-xl">{typeIcons[type]}</span>
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <p>{message}</p>
        {action && (
          <button
            onClick={() => {
              track('action_click', null);
              action.onClick();
            }}
            className="mt-2 text-sm font-medium underline hover:no-underline"
          >
            {action.label}
          </button>
        )}
      </div>
      {dismissible && (
        <button
          onClick={() => {
            track('dismiss', null);
            onDismiss?.();
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      )}
    </div>
  );
}

// ========== BADGE ==========
export interface BadgeProps {
  id: string;
  children: React.ReactNode;
  count?: number | string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  dot?: boolean;
}

export function Badge({
  id,
  children,
  count,
  variant = 'default',
  position = 'top-right',
  dot = false,
}: BadgeProps) {
  const { track } = useEventTracking('Badge', id);

  useEffect(() => {
    if (count) {
      track('mount', null, { count, variant });
    }
  }, [count]);

  const variantStyles = {
    default: 'bg-gray-500',
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  const positionStyles = {
    'top-right': '-top-2 -right-2',
    'top-left': '-top-2 -left-2',
    'bottom-right': '-bottom-2 -right-2',
    'bottom-left': '-bottom-2 -left-2',
  };

  const shouldShow = count !== undefined && (typeof count === 'number' ? count > 0 : true);

  return (
    <div className="relative inline-block">
      {children}
      {shouldShow && (
        <span
          className={`absolute ${positionStyles[position]} ${variantStyles[variant]} text-white text-xs font-bold rounded-full flex items-center justify-center ${
            dot ? 'w-2 h-2' : 'min-w-[1.25rem] h-5 px-1'
          }`}
        >
          {!dot && count}
        </span>
      )}
    </div>
  );
}

// ========== LOADING SPINNER ==========
export interface SpinnerProps {
  id: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

export function Spinner({ id, size = 'md', color = 'blue-500' }: SpinnerProps) {
  const { track } = useEventTracking('Spinner', id);

  useEffect(() => {
    track('mount', null, { size });
  }, []);

  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-${color} border-t-transparent rounded-full animate-spin`}
    />
  );
}

// ========== PROGRESS BAR ==========
export interface ProgressBarProps {
  id: string;
  value: number; // 0-100
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  animated?: boolean;
}

export function ProgressBar({
  id,
  value,
  max = 100,
  label,
  showValue = true,
  variant = 'default',
  animated = false,
}: ProgressBarProps) {
  const { track } = useEventTracking('ProgressBar', id);

  useEffect(() => {
    track('update', value, { max });
  }, [value]);

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantStyles = {
    default: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1 text-sm">
          <span>{label}</span>
          {showValue && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${variantStyles[variant]} transition-all duration-300 ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ========== SKELETON SCREEN ==========
export interface SkeletonProps {
  id: string;
  variant?: 'text' | 'circle' | 'rect';
  width?: string;
  height?: string;
  count?: number;
}

export function Skeleton({
  id,
  variant = 'text',
  width = '100%',
  height,
  count = 1,
}: SkeletonProps) {
  const { track } = useEventTracking('Skeleton', id);

  useEffect(() => {
    track('mount', null, { variant, count });
  }, []);

  const defaultHeight = variant === 'text' ? '1rem' : variant === 'circle' ? '3rem' : '4rem';

  const variantClasses = {
    text: 'rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 animate-pulse ${variantClasses[variant]} ${
            index > 0 ? 'mt-2' : ''
          }`}
          style={{ width, height: height || defaultHeight }}
        />
      ))}
    </>
  );
}

// ========== EMPTY STATE ==========
export interface EmptyStateProps {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ id, icon, title, description, action }: EmptyStateProps) {
  const { track } = useEventTracking('EmptyState', id);

  useEffect(() => {
    track('mount', null);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {icon && <div className="text-6xl mb-4">{icon}</div>}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-4 max-w-md">{description}</p>}
      {action && (
        <button
          onClick={() => {
            track('action_click', null);
            action.onClick();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
