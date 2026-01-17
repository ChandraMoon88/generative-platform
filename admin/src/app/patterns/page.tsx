'use client';

/**
 * Patterns Page - Admin
 * View and manage recognized patterns from user behavior
 */

import { useState, useEffect } from 'react';

interface Pattern {
  id: string;
  definitionId: string;
  sessionId: string;
  confidence: number;
  context: Record<string, any>;
  timestamp: string;
}

interface PatternDefinition {
  id: string;
  name: string;
  type: string;
  description?: string;
  occurrences: number;
}

export default function PatternsPage() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [definitions, setDefinitions] = useState<PatternDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDef, setSelectedDef] = useState<string | null>(null);
  const [view, setView] = useState<'definitions' | 'instances'>('definitions');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patternsRes, defsRes] = await Promise.all([
        fetch('http://localhost:3001/api/patterns'),
        fetch('http://localhost:3001/api/patterns/definitions'),
      ]);
      
      if (patternsRes.ok) {
        const data = await patternsRes.json();
        setPatterns(data.patterns || []);
      }
      
      if (defsRes.ok) {
        const data = await defsRes.json();
        setDefinitions(data.definitions || []);
      }
    } catch (error) {
      console.error('Failed to fetch patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      navigation: 'bg-blue-100 text-blue-800',
      crud: 'bg-green-100 text-green-800',
      workflow: 'bg-purple-100 text-purple-800',
      filter: 'bg-yellow-100 text-yellow-800',
      form: 'bg-pink-100 text-pink-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const filteredPatterns = selectedDef 
    ? patterns.filter(p => p.definitionId === selectedDef)
    : patterns;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-gray-500">Loading patterns...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patterns</h1>
          <p className="text-gray-500">
            {definitions.length} pattern types, {patterns.length} instances detected
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('definitions')}
            className={`px-4 py-2 rounded-lg ${
              view === 'definitions' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Definitions
          </button>
          <button
            onClick={() => setView('instances')}
            className={`px-4 py-2 rounded-lg ${
              view === 'instances' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Instances
          </button>
        </div>
      </div>

      {view === 'definitions' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {definitions.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No pattern definitions found. Analyze some sessions to detect patterns.
            </div>
          ) : (
            definitions.map(def => (
              <div key={def.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{def.name}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getTypeColor(def.type)}`}>
                      {def.type}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-primary-600">
                    {def.occurrences || 0}
                  </div>
                </div>
                {def.description && (
                  <p className="text-sm text-gray-500 mt-2">{def.description}</p>
                )}
                <div className="mt-4 pt-3 border-t">
                  <button
                    onClick={() => {
                      setSelectedDef(def.id);
                      setView('instances');
                    }}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    View Instances →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div>
          {/* Filter by Definition */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDef(null)}
                className={`px-3 py-1 rounded-full text-sm ${
                  !selectedDef ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Patterns
              </button>
              {definitions.map(def => (
                <button
                  key={def.id}
                  onClick={() => setSelectedDef(def.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedDef === def.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {def.name}
                </button>
              ))}
            </div>
          </div>

          {/* Pattern Instances Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pattern
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Session
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Context
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatterns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No pattern instances found
                    </td>
                  </tr>
                ) : (
                  filteredPatterns.map(pattern => {
                    const def = definitions.find(d => d.id === pattern.definitionId);
                    return (
                      <tr key={pattern.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{def?.name || 'Unknown'}</div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(def?.type || '')}`}>
                            {def?.type || 'unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-500">
                          {pattern.sessionId.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary-600 rounded-full"
                                style={{ width: `${pattern.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">
                              {Math.round(pattern.confidence * 100)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(pattern.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-500">
                          <pre className="max-w-xs overflow-hidden text-ellipsis">
                            {JSON.stringify(pattern.context, null, 2).slice(0, 100)}...
                          </pre>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
