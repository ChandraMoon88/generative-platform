'use client';

/**
 * Admin Models Page
 * View and manage synthesized application models
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Model {
  id: string;
  name: string;
  version: string;
  description: string;
  confidence: number | null;
  created_at: number;
  data: {
    entities?: unknown[];
    screens?: unknown[];
    workflows?: unknown[];
  };
  pattern_ids: string[] | null;
}

export default function AdminModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<{path: string; type: string}[] | null>(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/models`);
      if (res.ok) {
        const data = await res.json();
        setModels(data.models || []);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async (modelId: string) => {
    try {
      setGenerating(true);
      setGeneratedFiles(null);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const res = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setGeneratedFiles(data.files || []);
      }
    } catch (error) {
      console.error('Failed to generate code:', error);
    } finally {
      setGenerating(false);
    }
  };

  const deleteModel = async (modelId: string) => {
    if (!confirm('Are you sure you want to delete this model?')) return;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/models/${modelId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setModels(models.filter(m => m.id !== modelId));
        if (selectedModel?.id === modelId) {
          setSelectedModel(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete model:', error);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
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
                <h1 className="text-2xl font-bold text-gray-900">Application Models</h1>
                <p className="text-sm text-gray-500">
                  {models.length} synthesized models
                </p>
              </div>
            </div>
            <button
              onClick={fetchModels}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Models List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Models</h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : models.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No models yet. Synthesize a model from patterns to get started.
                  </div>
                ) : (
                  models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={`w-full text-left px-6 py-4 hover:bg-gray-50 ${
                        selectedModel?.id === model.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{model.name}</h3>
                          <p className="text-sm text-gray-500">v{model.version}</p>
                        </div>
                        {model.confidence && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {(model.confidence * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatTime(model.created_at)}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Model Details */}
          <div className="lg:col-span-2">
            {selectedModel ? (
              <div className="bg-white rounded-xl shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{selectedModel.name}</h2>
                      <p className="text-sm text-gray-500">{selectedModel.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => generateCode(selectedModel.id)}
                        disabled={generating}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {generating ? 'Generating...' : 'Generate Code'}
                      </button>
                      <button
                        onClick={() => deleteModel(selectedModel.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Model Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Entities</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedModel.data?.entities?.length || 0}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Screens</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedModel.data?.screens?.length || 0}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Workflows</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedModel.data?.workflows?.length || 0}
                      </p>
                    </div>
                  </div>

                  {/* Generated Files */}
                  {generatedFiles && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-3">Generated Files</h3>
                      <div className="bg-gray-900 rounded-lg p-4 max-h-60 overflow-y-auto">
                        {generatedFiles.map((file, i) => (
                          <div key={i} className="flex items-center text-sm font-mono py-1">
                            <span className={`w-20 text-xs px-2 py-0.5 rounded mr-2 ${
                              file.type === 'page' ? 'bg-blue-600 text-white' :
                              file.type === 'component' ? 'bg-green-600 text-white' :
                              file.type === 'type' ? 'bg-purple-600 text-white' :
                              file.type === 'store' ? 'bg-yellow-600 text-white' :
                              file.type === 'api' ? 'bg-red-600 text-white' :
                              'bg-gray-600 text-white'
                            }`}>
                              {file.type}
                            </span>
                            <span className="text-gray-300">{file.path}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Model JSON */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Model Data</h3>
                    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-auto max-h-96 text-sm">
                      {JSON.stringify(selectedModel.data, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                Select a model to view details
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
