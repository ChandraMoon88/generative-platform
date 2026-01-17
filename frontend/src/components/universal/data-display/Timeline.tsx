/**
 * Timeline/Activity Feed Component
 * Shows chronological sequence of events
 * Tracks viewing and interaction patterns
 */

'use client';

import React, { useState } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

export interface TimelineEvent {
  id: string | number;
  timestamp: number;
  type: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actor?: {
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
  link?: string;
}

export interface TimelineProps {
  id: string;
  events: TimelineEvent[];
  orientation?: 'vertical' | 'horizontal';
  grouped?: boolean;
  filterTypes?: string[];
  onEventClick?: (event: TimelineEvent) => void;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
}

export function Timeline({
  id,
  events,
  orientation = 'vertical',
  grouped = false,
  filterTypes = [],
  onEventClick,
  showLoadMore = false,
  onLoadMore,
}: TimelineProps) {
  const { track } = useEventTracking('Timeline', id);
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    track('mount', null, { eventCount: events.length, orientation, grouped });
  }, []);

  const filteredEvents = selectedFilters.size > 0
    ? events.filter((e) => selectedFilters.has(e.type))
    : events;

  const groupedEvents = grouped
    ? filteredEvents.reduce((acc, event) => {
        const date = new Date(event.timestamp).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
      }, {} as Record<string, TimelineEvent[]>)
    : { All: filteredEvents };

  const handleFilterToggle = (type: string) => {
    track('filter_toggle', type);
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(type)) {
      newFilters.delete(type);
    } else {
      newFilters.add(type);
    }
    setSelectedFilters(newFilters);
  };

  const handleEventClick = (event: TimelineEvent) => {
    track('event_click', event.id, { type: event.type, title: event.title });
    onEventClick?.(event);
  };

  if (orientation === 'horizontal') {
    return (
      <div className="w-full bg-white rounded-lg shadow-md p-6 overflow-x-auto">
        {filterTypes.length > 0 && (
          <div className="mb-4 flex gap-2">
            {filterTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleFilterToggle(type)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  selectedFilters.has(type)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-8 pb-4">
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              onClick={() => handleEventClick(event)}
              className="flex-shrink-0 w-64 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl mx-auto mb-2">
                  {event.icon || '📌'}
                </div>
                {index < filteredEvents.length - 1 && (
                  <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gray-300" />
                )}
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">
                  {new Date(event.timestamp).toLocaleString()}
                </div>
                <div className="font-semibold text-gray-900 mb-1">{event.title}</div>
                {event.description && (
                  <div className="text-sm text-gray-600">{event.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      {filterTypes.length > 0 && (
        <div className="mb-6 flex gap-2 flex-wrap">
          {filterTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleFilterToggle(type)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                selectedFilters.has(type)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([date, dateEvents]) => (
          <div key={date}>
            {grouped && (
              <div className="text-sm font-semibold text-gray-700 mb-3 sticky top-0 bg-white py-2">
                {date}
              </div>
            )}

            <div className="relative pl-8 border-l-2 border-gray-200 space-y-6">
              {dateEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="relative cursor-pointer hover:bg-gray-50 p-3 rounded-r transition-colors"
                >
                  <div className="absolute left-[-2.25rem] w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm border-4 border-white">
                    {event.icon || '•'}
                  </div>

                  <div className="flex items-start gap-3">
                    {event.actor?.avatar && (
                      <img
                        src={event.actor.avatar}
                        alt={event.actor.name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="font-semibold text-gray-900">{event.title}</div>
                        <div className="text-xs text-gray-500 flex-shrink-0">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </div>
                      </div>

                      {event.actor && (
                        <div className="text-sm text-gray-600 mb-1">{event.actor.name}</div>
                      )}

                      {event.description && (
                        <div className="text-sm text-gray-600 mb-2">{event.description}</div>
                      )}

                      {event.metadata && Object.keys(event.metadata).length > 0 && (
                        <div className="flex gap-3 text-xs text-gray-500">
                          {Object.entries(event.metadata).map(([key, value]) => (
                            <span key={key}>
                              <span className="font-medium">{key}:</span> {String(value)}
                            </span>
                          ))}
                        </div>
                      )}

                      {event.link && (
                        <a
                          href={event.link}
                          onClick={(e) => {
                            e.stopPropagation();
                            track('link_click', event.id);
                          }}
                          className="text-sm text-blue-600 hover:underline inline-block mt-2"
                        >
                          View details →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showLoadMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              track('load_more', null);
              onLoadMore?.();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Load More Events
          </button>
        </div>
      )}

      {filteredEvents.length === 0 && (
        <div className="text-center text-gray-500 py-8">No events to display</div>
      )}
    </div>
  );
}
