/**
 * Universal List Component
 * Displays items vertically with rich visual presentation
 * Supports infinite scroll, drag-drop reordering, swipe actions
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

export interface ListItem {
  id: string | number;
  icon?: React.ReactNode;
  image?: string;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface ListProps {
  id: string;
  items: ListItem[];
  onItemClick?: (item: ListItem) => void;
  onItemsReorder?: (items: ListItem[]) => void;
  infiniteScroll?: boolean;
  onLoadMore?: () => void;
  expandable?: boolean;
  renderExpanded?: (item: ListItem) => React.ReactNode;
  swipeActions?: Array<{
    label: string;
    icon?: React.ReactNode;
    variant: 'primary' | 'danger' | 'success';
    onAction: (item: ListItem) => void;
  }>;
  variant?: 'default' | 'compact' | 'detailed';
}

export function List({
  id,
  items,
  onItemClick,
  onItemsReorder,
  infiniteScroll = false,
  onLoadMore,
  expandable = false,
  renderExpanded,
  swipeActions = [],
  variant = 'default',
}: ListProps) {
  const { track } = useEventTracking('List', id);
  const [expandedItems, setExpandedItems] = useState<Set<string | number>>(new Set());
  const [draggedItem, setDraggedItem] = useState<ListItem | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Track mount
  useEffect(() => {
    track('mount', null, {
      itemCount: items.length,
      hasInfiniteScroll: infiniteScroll,
      isExpandable: expandable,
      variant,
    });
  }, []);

  // Setup infinite scroll
  useEffect(() => {
    if (!infiniteScroll || !onLoadMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          track('load_more', null);
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [infiniteScroll, onLoadMore]);

  // Handle item click
  const handleItemClick = (item: ListItem) => {
    track('item_click', item.id, { title: item.title });
    onItemClick?.(item);
  };

  // Handle expand/collapse
  const handleToggleExpand = (itemId: string | number) => {
    track('toggle_expand', itemId);
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Handle drag start
  const handleDragStart = (item: ListItem) => {
    track('drag_start', item.id);
    setDraggedItem(item);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, item: ListItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === item.id) return;

    const currentItems = [...items];
    const draggedIndex = currentItems.findIndex((i) => i.id === draggedItem.id);
    const targetIndex = currentItems.findIndex((i) => i.id === item.id);

    currentItems.splice(draggedIndex, 1);
    currentItems.splice(targetIndex, 0, draggedItem);

    onItemsReorder?.(currentItems);
  };

  // Handle drag end
  const handleDragEnd = () => {
    track('drag_end', draggedItem?.id);
    setDraggedItem(null);
  };

  const itemClassName = {
    default: 'p-4',
    compact: 'p-2',
    detailed: 'p-6',
  }[variant];

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="divide-y">
        {items.map((item) => (
          <div key={item.id}>
            <div
              draggable={!!onItemsReorder}
              onDragStart={() => handleDragStart(item)}
              onDragOver={(e) => handleDragOver(e, item)}
              onDragEnd={handleDragEnd}
              className={`${itemClassName} hover:bg-gray-50 cursor-pointer transition-colors ${
                draggedItem?.id === item.id ? 'opacity-50' : ''
              }`}
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-start gap-4">
                {/* Icon/Image */}
                {(item.icon || item.image) && (
                  <div className="flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        {item.icon}
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Expand button */}
                    {expandable && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleExpand(item.id);
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {expandedItems.has(item.id) ? '−' : '+'}
                      </button>
                    )}
                  </div>

                  {/* Metadata */}
                  {item.metadata && Object.keys(item.metadata).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                      {Object.entries(item.metadata).map(([key, value]) => (
                        <span key={key}>
                          <span className="font-medium">{key}:</span> {String(value)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Swipe actions (visible on hover) */}
                {swipeActions.length > 0 && (
                  <div className="flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
                    {swipeActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          track('swipe_action', action.label, { itemId: item.id });
                          action.onAction(item);
                        }}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          action.variant === 'danger'
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : action.variant === 'success'
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {action.icon} {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Expanded content */}
            {expandable && expandedItems.has(item.id) && renderExpanded && (
              <div className="px-4 pb-4 bg-gray-50">
                {renderExpanded(item)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load more trigger for infinite scroll */}
      {infiniteScroll && (
        <div ref={loadMoreRef} className="p-4 text-center">
          <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No items to display
        </div>
      )}
    </div>
  );
}
