'use client';

/**
 * Admin Dashboard - Overview Page
 * Shows platform statistics, recent events, and recognized patterns
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  totalEvents: number;
  totalSessions: number;
  totalPatterns: number;
  totalModels: number;
}

interface RecentEvent {
  id: string;
  type: string;
  timestamp: number;
  session_id: string;
}

interface Pattern {
  id: string;
  type: string;
  confidence: number;
  created_at: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    totalSessions: 0,
    totalPatterns: 0,
    totalModels: 0,
  });
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      // Fetch stats in parallel
      const [eventsRes, sessionsRes, patternsRes, modelsRes] = await Promise.all([
        fetch(`${API_URL}/api/events/stats/summary`).catch(() => null),
        fetch(`${API_URL}/api/sessions/stats/summary`).catch(() => null),
        fetch(`${API_URL}/api/patterns/stats/summary`).catch(() => null),
        fetch(`${API_URL}/api/models`).catch(() => null),
      ]);

      const eventsData = eventsRes?.ok ? await eventsRes.json() : { totalEvents: 0, recentEvents: [] };
      const sessionsData = sessionsRes?.ok ? await sessionsRes.json() : { totalSessions: 0 };
      const patternsData = patternsRes?.ok ? await patternsRes.json() : { totalPatterns: 0 };
      const modelsData = modelsRes?.ok ? await modelsRes.json() : { models: [] };

      setStats({
        totalEvents: eventsData.totalEvents || 0,
        totalSessions: sessionsData.totalSessions || 0,
        totalPatterns: patternsData.totalPatterns || 0,
        totalModels: modelsData.models?.length || 0,
      });

      setRecentEvents(eventsData.recentEvents || []);
      
      // Fetch recent patterns
      const patternsListRes = await fetch(`${API_URL}/api/patterns?limit=5`).catch(() => null);
      if (patternsListRes?.ok) {
        const patternsList = await patternsListRes.json();
        setPatterns(patternsList.patterns || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getPatternColor = (type: string) => {
    const colors: Record<string, string> = {
      crud_create: 'bg-green-100 text-green-800',
      crud_read: 'bg-blue-100 text-blue-800',
      crud_update: 'bg-yellow-100 text-yellow-800',
      crud_delete: 'bg-red-100 text-red-800',
      list_view: 'bg-purple-100 text-purple-800',
      filter: 'bg-indigo-100 text-indigo-800',
      sort: 'bg-pink-100 text-pink-800',
      workflow: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Generative Platform Admin
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Monitor events, patterns, and generated applications
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/admin/events"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Events
              </Link>
              <Link
                href="/admin/models"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                View Models
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSessions.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Patterns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatterns.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Models</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalModels.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Events */}
          <div className="bg-white rounded-xl shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
                <Link href="/admin/events" className="text-blue-600 hover:underline text-sm">
                  View all →
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentEvents.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No events recorded yet. Start using the application to generate events.
                </div>
              ) : (
                recentEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {event.type}
                        </span>
                        <p className="mt-1 text-sm text-gray-500">
                          Session: {event.session_id?.slice(0, 8)}...
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatTime(event.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recognized Patterns */}
          <div className="bg-white rounded-xl shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Patterns</h2>
                <Link href="/admin/patterns" className="text-blue-600 hover:underline text-sm">
                  View all →
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {patterns.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No patterns recognized yet. Patterns are detected from user interactions.
                </div>
              ) : (
                patterns.map((pattern) => (
                  <div key={pattern.id} className="px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPatternColor(pattern.type)}`}>
                          {pattern.type}
                        </span>
                        <p className="mt-1 text-sm text-gray-500">
                          Confidence: {(pattern.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatTime(pattern.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/sessions"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Analyze Session</h3>
                <p className="text-sm text-gray-500">Run pattern detection on a session</p>
              </div>
            </Link>

            <Link
              href="/admin/generate"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Generate Code</h3>
                <p className="text-sm text-gray-500">Create application from a model</p>
              </div>
            </Link>

            <Link
              href="/admin/patterns/definitions"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Pattern Definitions</h3>
                <p className="text-sm text-gray-500">Configure pattern recognition rules</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
