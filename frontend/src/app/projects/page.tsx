'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

function ProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projectId && projects.length > 0) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setCurrentProject(project);
      }
    }
  }, [projectId, projects]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('user_token');
      const role = localStorage.getItem('user_role');
      
      console.log('Projects page - checking token:', token);
      console.log('Projects page - role:', role);
      
      if (!token) {
        console.log('No token found, redirecting to login');
        router.push('/login');
        return;
      }

      setIsAdmin(role === 'admin');

      const res = await fetch('/api/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!newProject.name) return;

    try {
      const token = localStorage.getItem('user_token');
      const userId = localStorage.getItem('user_id');
      const userName = localStorage.getItem('user_name');
      const userEmail = localStorage.getItem('user_email');
      
      const projectId = `project_${Date.now()}`;
      
      const res = await fetch(`/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: projectId,
          user_id: userId,
          user_name: userName,
          user_email: userEmail,
          name: newProject.name,
          description: newProject.description,
          status: 'draft',
          created_at: Date.now(),
          updated_at: Date.now(),
        }),
      });

      if (res.ok) {
        setShowNewProject(false);
        setNewProject({ name: '', description: '' });
        fetchProjects();
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const token = localStorage.getItem('user_token');
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const getStatusColor = (status: Project['status']) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      building: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      deployed: 'bg-purple-100 text-purple-800',
    };
    return colors[status];
  };

  const getStatusIcon = (status: Project['status']) => {
    const icons = {
      draft: '📝',
      building: '🔨',
      completed: '✅',
      deployed: '🚀',
    };
    return icons[status];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  // If a project ID is in the URL, show the project detail view
  if (currentProject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => {
                setCurrentProject(null);
                window.history.pushState({}, '', '/projects');
              }}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm mb-4"
            >
              ← Back to Projects
            </button>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{currentProject.name}</h1>
                  {currentProject.description && (
                    <p className="text-gray-600">{currentProject.description}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(currentProject.status)}`}>
                  {getStatusIcon(currentProject.status)} {currentProject.status}
                </span>
              </div>
              
              <div className="text-sm text-gray-500">
                Created: {new Date(currentProject.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Component Showcase */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Add Components</h2>
            <ComponentShowcase onComponentAdd={(comp) => {
              console.log('Added component:', comp);
            }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
              <p className="text-sm text-gray-600 mt-1">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/components')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Browse Components
              </button>
              <button
                onClick={() => setShowNewProject(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                + New Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Badge */}
      {isAdmin && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
            <span className="text-yellow-600">👑</span>
            <span className="text-sm font-medium text-yellow-800">
              Admin View: You can see and manage ALL user projects
            </span>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first project to start building amazing applications
            </p>
            <button
              onClick={() => setShowNewProject(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              Create First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                {/* Project Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)} ml-2`}>
                      {getStatusIcon(project.status)} {project.status}
                    </span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  {/* Admin: Show Owner */}
                  {isAdmin && project.user_name && (
                    <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
                      <span className="text-gray-500">Owner:</span>{' '}
                      <span className="font-medium text-gray-700">{project.user_name}</span>
                      <br />
                      <span className="text-gray-400">{project.user_email}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Created</span>
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Updated</span>
                    <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                  </div>
                  {project.model_id && (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <span>✓</span>
                      <span>Model attached</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      // Store project ID in localStorage and reload
                      localStorage.setItem('current_project_id', project.id);
                      window.location.href = `/projects?id=${project.id}`;
                    }}
                    className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                  >
                    Open
                  </button>
                  <button
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium"
                    onClick={() => deleteProject(project.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="My Awesome App"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Describe your project..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowNewProject(false);
                  setNewProject({ name: '', description: '' });
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                disabled={!newProject.name}
                onClick={createProject}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
