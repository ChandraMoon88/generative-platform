'use client';

/**
 * Generate Code Page - Admin
 * Generate application code from synthesized models
 */

import { useState, useEffect } from 'react';

interface Model {
  id: string;
  name: string;
  version: string;
  entities: any[];
  workflows: any[];
  uiPatterns: any[];
  createdAt: string;
}

interface GeneratedFile {
  path: string;
  content: string;
  size: number;
}

export default function GeneratePage() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeFile, setActiveFile] = useState<GeneratedFile | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/models');
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

  const handleGenerate = async () => {
    if (!selectedModel) return;
    
    setGenerating(true);
    setGeneratedFiles([]);
    setActiveFile(null);
    
    try {
      const res = await fetch(`http://localhost:3001/api/generate/${selectedModel}`, {
        method: 'POST',
      });
      
      if (res.ok) {
        const data = await res.json();
        const files = (data.files || []).map((f: any) => ({
          ...f,
          size: f.content?.length || 0,
        }));
        setGeneratedFiles(files);
        if (files.length > 0) {
          setActiveFile(files[0]);
        }
      } else {
        alert('Failed to generate code');
      }
    } catch (error) {
      console.error('Failed to generate:', error);
      alert('Failed to generate code');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async (content: string, path: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(path);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownloadAll = () => {
    const content = generatedFiles.map(f => 
      `// ============================================================\n` +
      `// File: ${f.path}\n` +
      `// ============================================================\n\n` +
      f.content + '\n\n'
    ).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-code.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFileIcon = (path: string) => {
    if (path.endsWith('.tsx')) return '⚛️';
    if (path.endsWith('.ts')) return '📘';
    if (path.endsWith('.json')) return '📋';
    if (path.endsWith('.css')) return '🎨';
    return '📄';
  };

  const getFileCategory = (path: string) => {
    if (path.includes('/types/')) return 'Types';
    if (path.includes('/store/')) return 'Store';
    if (path.includes('/app/') && path.includes('page')) return 'Pages';
    if (path.includes('/components/')) return 'Components';
    if (path.includes('/api/')) return 'API';
    return 'Other';
  };

  // Group files by category
  const groupedFiles = generatedFiles.reduce((acc, file) => {
    const category = getFileCategory(file.path);
    if (!acc[category]) acc[category] = [];
    acc[category].push(file);
    return acc;
  }, {} as Record<string, GeneratedFile[]>);

  const model = models.find(m => m.id === selectedModel);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-gray-500">Loading models...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Generate Code</h1>
          <p className="text-gray-500">Generate application code from synthesized models</p>
        </div>
      </div>

      {/* Model Selection */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Select Model</h2>
        
        {models.length === 0 ? (
          <div className="text-gray-500 py-4">
            No models available. Synthesize a model from sessions first.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedModel === m.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-medium text-gray-900">{m.name}</h3>
                <p className="text-sm text-gray-500">Version {m.version}</p>
                <div className="mt-2 flex gap-2 text-xs">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    {m.entities?.length || 0} entities
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    {m.workflows?.length || 0} workflows
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedModel && (
          <div className="mt-6 pt-6 border-t">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? 'Generating...' : '🚀 Generate Code'}
            </button>
          </div>
        )}
      </div>

      {/* Generated Files */}
      {generatedFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-bold text-gray-900">
              Generated Files ({generatedFiles.length})
            </h2>
            <button
              onClick={handleDownloadAll}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              📥 Download All
            </button>
          </div>

          <div className="flex h-[600px]">
            {/* File Tree */}
            <div className="w-64 border-r bg-gray-50 overflow-y-auto">
              {Object.entries(groupedFiles).map(([category, files]) => (
                <div key={category}>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-100">
                    {category}
                  </div>
                  {files.map(file => (
                    <button
                      key={file.path}
                      onClick={() => setActiveFile(file)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 ${
                        activeFile?.path === file.path ? 'bg-primary-100 text-primary-800' : ''
                      }`}
                    >
                      <span>{getFileIcon(file.path)}</span>
                      <span className="truncate">{file.path.split('/').pop()}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* File Content */}
            <div className="flex-1 flex flex-col">
              {activeFile ? (
                <>
                  <div className="px-4 py-2 border-b bg-gray-50 flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-900">{activeFile.path}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({Math.round(activeFile.size / 1024 * 100) / 100} KB)
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(activeFile.content, activeFile.path)}
                      className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                    >
                      {copySuccess === activeFile.path ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <pre className="p-4 text-sm font-mono text-gray-800 leading-relaxed">
                      <code>{activeFile.content}</code>
                    </pre>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a file to view its content
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Model Details */}
      {model && generatedFiles.length === 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-gray-900 mb-4">Model Preview: {model.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Entities */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Entities</h3>
              <div className="space-y-2">
                {model.entities?.map((entity: any, i: number) => (
                  <div key={i} className="p-2 bg-blue-50 rounded text-sm">
                    <span className="font-medium">{entity.name}</span>
                    <span className="text-gray-500 ml-2">
                      ({entity.fields?.length || 0} fields)
                    </span>
                  </div>
                )) || <p className="text-gray-500 text-sm">No entities</p>}
              </div>
            </div>

            {/* Workflows */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Workflows</h3>
              <div className="space-y-2">
                {model.workflows?.map((wf: any, i: number) => (
                  <div key={i} className="p-2 bg-green-50 rounded text-sm">
                    <span className="font-medium">{wf.name}</span>
                    <span className="text-gray-500 ml-2">
                      ({wf.steps?.length || 0} steps)
                    </span>
                  </div>
                )) || <p className="text-gray-500 text-sm">No workflows</p>}
              </div>
            </div>

            {/* UI Patterns */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">UI Patterns</h3>
              <div className="space-y-2">
                {model.uiPatterns?.map((ui: any, i: number) => (
                  <div key={i} className="p-2 bg-purple-50 rounded text-sm">
                    <span className="font-medium">{ui.type}</span>
                    {ui.entity && (
                      <span className="text-gray-500 ml-2">({ui.entity})</span>
                    )}
                  </div>
                )) || <p className="text-gray-500 text-sm">No UI patterns</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
