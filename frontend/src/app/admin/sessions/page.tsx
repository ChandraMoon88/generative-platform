'use client';

/**
 * Admin Sessions Page
 * View user sessions and trigger pattern analysis
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Session {
  id: string;
  user_id: string | null;
  start_time: number;
  end_time: number | null;
  event_count: number;
  metadata: Record<string, unknown> | null;
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{sessionId: string; message: string} | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/sessions`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeSession = async (sessionId: string) => {
    try {
      setAnalyzing(sessionId);
      setAnalysisResult(null);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const res = await fetch(`${API_URL}/api/sessions/${sessionId}/analyze`, {
        method: 'POST',
      });
      
      if (res.ok) {
        const data = await res.json();
        setAnalysisResult({
          sessionId,
          message: `Analysis complete! Found patterns from ${data.eventCount} events.`,
        });
      }
    } catch (error) {
      console.error('Failed to analyze session:', error);
    } finally {
      setAnalyzing(null);
    }
  };

  const synthesizeModel = async (sessionId: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const res = await fetch(`${API_URL}/api/models/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      
      if (res.ok) {
        const data = await res.json();
        alert(`Model "${data.name}" created successfully!`);
      } else {
        const error = await res.json();
        alert(`Failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to synthesize model:', error);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Delete this session and all its events?')) return;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId));
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (start: number, end: number | null) => {
    if (!end) return 'Active';
    const duration = end - start;
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Sessions</h1>
                <p className="text-sm text-gray-500">
                  {sessions.length} recorded sessions
                </p>
              </div>
            </div>
            <button
              onClick={fetchSessions}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Analysis Result */}
        {analysisResult && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-800">{analysisResult.message}</span>
            </div>
          </div>
        )}

        {/* Sessions Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No sessions recorded yet. Sessions are created when users interact with the application.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Started</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Events</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {session.id.slice(0, 12)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(session.start_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDuration(session.start_time, session.end_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {session.event_count} events
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => analyzeSession(session.id)}
                          disabled={analyzing === session.id}
                          className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        >
                          {analyzing === session.id ? 'Analyzing...' : 'Analyze'}
                        </button>
                        <button
                          onClick={() => synthesizeModel(session.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          Synthesize
                        </button>
                        <Link
                          href={`/admin/events?sessionId=${session.id}`}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          View Events
                        </Link>
                        <button
                          onClick={() => deleteSession(session.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
