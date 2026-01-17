/**
 * Mobile-Specific Components
 * Pull-to-refresh, Bottom sheets, FAB, Swipe actions
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

// ========== PULL TO REFRESH ==========
export function PullToRefresh({
  id,
  onRefresh,
  children,
}: {
  id: string;
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}) {
  const { track } = useEventTracking('PullToRefresh', id);
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);

  const threshold = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    if (distance > 0 && window.scrollY === 0) {
      setPulling(true);
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold) {
      track('refresh_triggered', null);
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
    setPulling(false);
    setPullDistance(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull indicator */}
      {(pulling || refreshing) && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all"
          style={{ height: pullDistance }}
        >
          {refreshing ? (
            <div className="animate-spin text-2xl">↻</div>
          ) : (
            <div className="text-2xl" style={{ opacity: Math.min(pullDistance / threshold, 1) }}>
              ↓
            </div>
          )}
        </div>
      )}

      <div style={{ transform: `translateY(${pullDistance}px)`, transition: pulling ? 'none' : 'transform 0.3s' }}>
        {children}
      </div>
    </div>
  );
}

// ========== BOTTOM SHEET ==========
export function BottomSheet({
  id,
  isOpen,
  onClose,
  children,
  snapPoints = [0.3, 0.7, 1],
}: {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[];
}) {
  const { track } = useEventTracking('BottomSheet', id);
  const [snapIndex, setSnapIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const currentHeight = useRef(0);

  useEffect(() => {
    if (isOpen) {
      track('open', null);
    }
  }, [isOpen, track]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
    currentHeight.current = window.innerHeight * snapPoints[snapIndex];
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const deltaY = e.touches[0].clientY - startY.current;
    const newHeight = currentHeight.current - deltaY;
    const newSnapIndex = snapPoints.findIndex((point) => Math.abs(newHeight - window.innerHeight * point) < 50);

    if (newSnapIndex !== -1) {
      setSnapIndex(newSnapIndex);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    track('snap', snapIndex);
  };

  if (!isOpen) return null;

  const height = snapPoints[snapIndex] * 100;

  return (
    <>
      <div
        onClick={() => {
          track('overlay_click', null);
          onClose();
        }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
      />

      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 transition-all"
        style={{ height: `${height}vh` }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Content */}
        <div className="overflow-auto h-full pb-20 px-4">
          {children}
        </div>
      </div>
    </>
  );
}

// ========== FLOATING ACTION BUTTON ==========
export function FloatingActionButton({
  id,
  icon,
  label,
  onClick,
  actions = [],
  position = 'bottom-right',
}: {
  id: string;
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  actions?: Array<{ id: string; icon: React.ReactNode; label: string; onClick: () => void }>;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}) {
  const { track } = useEventTracking('FloatingActionButton', id);
  const [expanded, setExpanded] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  };

  const handleMainClick = () => {
    if (actions.length > 0) {
      track('toggle_menu', !expanded);
      setExpanded(!expanded);
    } else {
      track('click', null);
      onClick?.();
    }
  };

  const handleActionClick = (action: any) => {
    track('action_click', action.id);
    action.onClick();
    setExpanded(false);
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Action menu */}
      {expanded && actions.length > 0 && (
        <div className="absolute bottom-16 right-0 space-y-2 mb-2">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className="flex items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2 hover:bg-gray-50 transition-all"
            >
              {action.icon}
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main button */}
      <button
        onClick={handleMainClick}
        className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110"
      >
        {icon}
      </button>

      {label && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
}

// ========== SWIPE ACTIONS ==========
export function SwipeActions({
  id,
  children,
  leftActions = [],
  rightActions = [],
}: {
  id: string;
  children: React.ReactNode;
  leftActions?: Array<{ id: string; label: string; color: string; onClick: () => void }>;
  rightActions?: Array<{ id: string; label: string; color: string; onClick: () => void }>;
}) {
  const { track } = useEventTracking('SwipeActions', id);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - startX.current;
    setOffset(deltaX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (Math.abs(offset) > 80) {
      track('swipe', offset > 0 ? 'right' : 'left');
    } else {
      setOffset(0);
    }
  };

  const handleActionClick = (action: any, direction: 'left' | 'right') => {
    track('action_click', action.id, { direction });
    action.onClick();
    setOffset(0);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Left actions */}
      {leftActions.length > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex">
          {leftActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action, 'left')}
              className="px-6 flex items-center justify-center text-white font-medium"
              style={{ backgroundColor: action.color }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Right actions */}
      {rightActions.length > 0 && (
        <div className="absolute right-0 top-0 bottom-0 flex">
          {rightActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action, 'right')}
              className="px-6 flex items-center justify-center text-white font-medium"
              style={{ backgroundColor: action.color }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="bg-white relative z-10 transition-transform"
        style={{
          transform: `translateX(${offset}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s',
        }}
      >
        {children}
      </div>
    </div>
  );
}
