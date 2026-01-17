/**
 * Modal and Dialog Components
 * All overlay patterns for focused interactions
 */

'use client';

import React, { useEffect } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

// ========== MODAL ==========
export interface ModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
}

export function Modal({
  id,
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  footer,
}: ModalProps) {
  const { track } = useEventTracking('Modal', id);

  useEffect(() => {
    if (isOpen) {
      track('open', null, { size });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    track('close', null);
    onClose();
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full m-4',
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => closeOnOverlayClick && handleClose()}
      />

      <div className={`relative bg-white rounded-lg shadow-2xl w-full ${sizeClasses} max-h-[90vh] flex flex-col`}>
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b">
            {title && <h2 className="text-xl font-semibold">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {footer && (
          <div className="p-6 border-t bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ========== DRAWER ==========
export interface DrawerProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: number; // pixels or percentage
}

export function Drawer({
  id,
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 400,
}: DrawerProps) {
  const { track } = useEventTracking('Drawer', id);

  useEffect(() => {
    if (isOpen) {
      track('open', null, { position, size });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const positionClasses = {
    left: 'left-0 top-0 bottom-0',
    right: 'right-0 top-0 bottom-0',
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
  }[position];

  const sizeStyle = ['left', 'right'].includes(position)
    ? { width: `${size}px` }
    : { height: `${size}px` };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => {
          track('overlay_click', null);
          onClose();
        }}
      />

      <div
        className={`absolute ${positionClasses} bg-white shadow-2xl flex flex-col`}
        style={sizeStyle}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={() => {
                track('close', null);
                onClose();
              }}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// ========== POPOVER ==========
export interface PopoverProps {
  id: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onOpenChange?: (isOpen: boolean) => void;
}

export function Popover({ id, trigger, content, position = 'bottom', onOpenChange }: PopoverProps) {
  const { track } = useEventTracking('Popover', id);
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    if (isOpen) {
      track('open', null, { position });
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
    track(newState ? 'open' : 'close', null);
  };

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  }[position];

  return (
    <div ref={popoverRef} className="relative inline-block">
      <div onClick={handleToggle}>
        {trigger}
      </div>

      {isOpen && (
        <div className={`absolute ${positionClasses} z-50 bg-white rounded-lg shadow-lg border p-4 min-w-[200px]`}>
          {content}
        </div>
      )}
    </div>
  );
}

// ========== TOOLTIP ==========
export interface TooltipProps {
  id: string;
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ id, children, content, position = 'top', delay = 500 }: TooltipProps) {
  const { track } = useEventTracking('Tooltip', id);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      track('show', null, { content });
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  }[position];

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div className={`absolute ${positionClasses} z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap`}>
          {content}
        </div>
      )}
    </div>
  );
}

// ========== CONFIRMATION DIALOG ==========
export interface ConfirmDialogProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
}

export function ConfirmDialog({
  id,
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}: ConfirmDialogProps) {
  const { track } = useEventTracking('ConfirmDialog', id);

  const handleConfirm = () => {
    track('confirm', null, { variant });
    onConfirm();
  };

  const handleCancel = () => {
    track('cancel', null);
    onClose();
  };

  return (
    <Modal id={id} isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-md text-white transition-colors ${
              variant === 'danger'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
