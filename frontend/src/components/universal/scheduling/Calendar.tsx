/**
 * Calendar and Scheduling Components
 * Month/Week/Day views, Event creation, Booking
 */

'use client';

import React, { useState } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  description?: string;
  metadata?: Record<string, any>;
}

// ========== MONTH CALENDAR ==========
export function MonthCalendar({
  id,
  events = [],
  onDateClick,
  onEventClick,
}: {
  id: string;
  events?: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}) {
  const { track } = useEventTracking('MonthCalendar', id);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    track('prev_month', null);
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    track('next_month', null);
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDate = (day: number) => {
    const date = new Date(year, month, day);
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === year &&
        eventDate.getMonth() === month &&
        eventDate.getDate() === day
      );
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="px-3 py-1 hover:bg-gray-100 rounded">
          ←
        </button>
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={handleNextMonth} className="px-3 py-1 hover:bg-gray-100 rounded">
          →
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="aspect-square" />;
          }

          const dayEvents = getEventsForDate(day);
          const isToday =
            day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear();

          return (
            <div
              key={index}
              onClick={() => {
                track('date_click', day);
                onDateClick?.(new Date(year, month, day));
              }}
              className={`aspect-square border rounded p-1 cursor-pointer hover:bg-blue-50 transition-colors ${
                isToday ? 'bg-blue-100 border-blue-500' : ''
              }`}
            >
              <div className="text-sm font-medium">{day}</div>
              <div className="space-y-1 mt-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      track('event_click', event.id);
                      onEventClick?.(event);
                    }}
                    className="text-xs p-1 rounded truncate"
                    style={{ backgroundColor: event.color || '#3b82f6', color: 'white' }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ========== TIME SLOT PICKER ==========
export function TimeSlotPicker({
  id,
  availableSlots,
  onSlotSelect,
  duration = 30,
}: {
  id: string;
  availableSlots: Date[];
  onSlotSelect: (slot: Date) => void;
  duration?: number;
}) {
  const { track } = useEventTracking('TimeSlotPicker', id);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  const handleSlotClick = (slot: Date) => {
    track('slot_select', slot.toISOString());
    setSelectedSlot(slot);
    onSlotSelect(slot);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold mb-4">Select a time slot</h3>
      <div className="grid grid-cols-3 gap-2">
        {availableSlots.map((slot, index) => {
          const isSelected = selectedSlot?.getTime() === slot.getTime();

          return (
            <button
              key={index}
              onClick={() => handleSlotClick(slot)}
              className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                isSelected
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              {slot.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ========== DATE RANGE PICKER ==========
export function DateRangePicker({
  id,
  onRangeSelect,
}: {
  id: string;
  onRangeSelect: (start: Date, end: Date) => void;
}) {
  const { track } = useEventTracking('DateRangePicker', id);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleApply = () => {
    if (startDate && endDate) {
      track('range_select', null, {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
      });
      onRangeSelect(startDate, endDate);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            min={startDate?.toISOString().split('T')[0]}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <button
        onClick={handleApply}
        disabled={!startDate || !endDate}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Apply Range
      </button>
    </div>
  );
}
