'use client';

/**
 * Admin Events Page
 * View and filter all collected events
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
  id: string;
  session_id: string;
  user_id: string | null;
  type: string;
  timestamp: number;
  data: Record<string, unknown>;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: '',
    sessionId: '',
  });
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
    total: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, [filter, pagination.offset]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString(),
      });
      
      if (filter.type) params.append('type', filter.type);
      if (filter.sessionId) params.append('sessionId', filter.sessionId);
      
      const res = await fetch(`${API_URL}/api/events?${params}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
        setPagination(p => ({ ...p, total: data.count || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      interaction: 'bg-blue-100 text-blue-800',
      navigation: 'bg-green-100 text-green-800',
      state_change: 'bg-yellow-100 text-yellow-800',
      form: 'bg-purple-100 text-purple-800',
      workflow: 'bg-orange-100 text-orange-800',
      error: 'bg-red-100 text-red-800',
      system: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const eventTypes = ['interaction', 'navigation', 'state_change', 'form', 'workflow', 'error', 'system'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700 mr-4">
                ← Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Events</h1>
                <p className="text-sm text-gray-500">
                  {pagination.total} total events
                </p>
              </div>
            </div>
            <button
              onClick={fetchEvents}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select
                value={filter.type}
                onChange={(e) => setFilter(f => ({ ...f, type: e.target.value }))}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">All Types</option>
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session ID</label>
              <input
                type="text"
                value={filter.sessionId}
                onChange={(e) => setFilter(f => ({ ...f, sessionId: e.target.value }))}
                placeholder="Enter session ID..."
                className="border rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilter({ type: '', sessionId: '' })}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No events found
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(event.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {event.session_id?.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <pre className="max-w-md overflow-hidden text-ellipsis">
                        {JSON.stringify(event.data, null, 2).slice(0, 100)}...
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {events.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
              <button
                onClick={() => setPagination(p => ({ ...p, offset: Math.max(0, p.offset - p.limit) }))}
                disabled={pagination.offset === 0}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Showing {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
              </span>
              <button
                onClick={() => setPagination(p => ({ ...p, offset: p.offset + p.limit }))}
                disabled={pagination.offset + pagination.limit >= pagination.total}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
