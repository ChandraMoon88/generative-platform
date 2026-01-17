/**
 * Project Detail Page
 * View and edit a specific project
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ComponentShowcase from '@/components/ComponentShowcase';

interface Project {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  name: string;
  description?: string;
  model_id?: string;
  status: 'draft' | 'building' | 'completed' | 'deployed';
  config?: any;
  generated_files?: any;
  created_at: number;
  updated_at: number;
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    status: 'draft' as Project['status'],
  });

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`http://localhost:3001/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
        setEditData({
          name: data.project.name,
          description: data.project.description || '',
          status: data.project.status,
        });
      } else if (res.status === 401) {
        localStorage.removeItem('user_token');
        router.push('/login');
      } else if (res.status === 403) {
        alert('Access denied: You can only view your own projects');
        router.push('/projects');
      } else if (res.status === 404) {
        alert('Project not found');
        router.push('/projects');
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async () => {
    try {
      const token = localStorage.getItem('user_token');
      const res = await fetch(`http://localhost:3001/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        setEditing(false);
        fetchProject();
      }
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      building: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      deployed: 'bg-purple-100 text-purple-800',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <button
            onClick={() => router.push('/projects')}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <button
                onClick={() => router.push('/projects')}
                className="text-sm text-gray-600 hover:text-gray-900 mb-2 flex items-center gap-1"
              >
                ← Back to Projects
              </button>
              {editing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="text-3xl font-bold text-gray-900 border-b-2 border-purple-600 focus:outline-none"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              )}
              {editing ? (
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Project description..."
                  rows={2}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                />
              ) : (
                project.description && (
                  <p className="mt-2 text-gray-600">{project.description}</p>
                )
              )}
              
              {/* Owner Info (if admin viewing) */}
              {project.user_name && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-yellow-600">👤</span>
                    <span className="font-medium text-yellow-800">Owner:</span>
                    <span className="text-yellow-900">{project.user_name}</span>
                    <span className="text-yellow-600">({project.user_email})</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 ml-4">
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              {editing ? (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateProject}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Edit Project
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status</h3>
              {editing ? (
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value as Project['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                >
                  <option value="draft">Draft</option>
                  <option value="building">Building</option>
                  <option value="completed">Completed</option>
                  <option value="deployed">Deployed</option>
                </select>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${project.status === 'draft' ? 'bg-gray-500' : project.status === 'building' ? 'bg-blue-500' : project.status === 'completed' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                    <span className="text-sm font-medium text-gray-900">{project.status}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Created:</span>
                  <p className="font-medium text-gray-900">
                    {new Date(project.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Last Updated:</span>
                  <p className="font-medium text-gray-900">
                    {new Date(project.updated_at).toLocaleString()}
                  </p>
                </div>
                {project.model_id && (
                  <div>
                    <span className="text-gray-500">Model ID:</span>
                    <p className="font-mono text-xs text-gray-700 break-all">
                      {project.model_id}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/components')}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm"
                >
                  Browse Components
                </button>
                <button
                  onClick={() => alert('Code generation coming soon!')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                >
                  Generate Code
                </button>
                <button
                  onClick={() => alert('Deploy coming soon!')}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
                >
                  Deploy Project
                </button>
              </div>
            </div>
          </div>

          {/* Component Browser */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Component Library
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Browse and select components to build your application
              </p>
              <ComponentShowcase />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
