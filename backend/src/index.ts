/**
 * Backend Server Entry Point











































































































































































































































































































































}  );    </div>      </div>        )}          </div>            ))}              </div>                </div>                  </button>                    Delete                  >                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium"                    onClick={() => deleteProject(project.id)}                  <button                  </button>                    Open                  >                    className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"                    onClick={() => router.push(`/projects/${project.id}`)}                  <button                <div className="mt-4 flex gap-2">                {/* Actions */}                </div>                  )}                    </div>                      <span>Model attached</span>                      <span>✓</span>                    <div className="flex items-center gap-2 text-xs text-green-600">                  {project.model_id && (                  </div>                    <span>{new Date(project.updated_at).toLocaleDateString()}</span>                    <span>Updated</span>                  <div className="flex justify-between text-xs text-gray-500">                  </div>                    <span>{new Date(project.created_at).toLocaleDateString()}</span>                    <span>Created</span>                  <div className="flex justify-between text-xs text-gray-500">                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">                {/* Metadata */}                )}                  </div>                    <span className="text-gray-400">{project.user_email}</span>                    <br />                    <span className="font-medium text-gray-700">{project.user_name}</span>                    <span className="text-gray-500">Owner:</span>{' '}                  <div className="mb-3 p-2 bg-gray-50 rounded text-xs">                {isAdmin && project.user_name && (                {/* Admin: Show Owner */}                </div>                  </span>                    {getStatusIcon(project.status)} {project.status}                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)} ml-2`}>                  </div>                    )}                      </p>                        {project.description}                      <p className="text-sm text-gray-600 line-clamp-2">                    {project.description && (                    </h3>                      {project.name}                    <h3 className="text-lg font-semibold text-gray-900 mb-1">                  <div className="flex-1">                <div className="flex justify-between items-start mb-3">                {/* Project Header */}              >                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"                key={project.id}              <div            {projects.map((project) => (          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">        ) : (          </div>            </button>              Create First Project            >              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"              onClick={() => setShowNewProject(true)}            <button            </p>              Create your first project to start building amazing applications            <p className="text-gray-600 mb-6">            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>            <div className="text-6xl mb-4">📦</div>          <div className="text-center py-12">        {projects.length === 0 ? (      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">      {/* Projects Grid */}      )}        </div>          </div>            </div>              </button>                Create Project              >                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"                disabled={!newProject.name}                onClick={createProject}              <button              </button>                Cancel              >                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"                }}                  setNewProject({ name: '', description: '' });                  setShowNewProject(false);                onClick={() => {              <button            <div className="mt-6 flex gap-3">            </div>              </div>                />                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"                  rows={3}                  placeholder="Describe your project..."                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}                  value={newProject.description}                <textarea                </label>                  Description                <label className="block text-sm font-medium text-gray-700 mb-1">              <div>              </div>                />                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"                  placeholder="My Awesome App"                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}                  value={newProject.name}                  type="text"                <input                </label>                  Project Name *                <label className="block text-sm font-medium text-gray-700 mb-1">              <div>            <div className="space-y-4">            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Project</h2>          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">      {showNewProject && (      {/* New Project Modal */}      )}        </div>          </div>            </span>              Admin View: You can see and manage ALL user projects            <span className="text-sm font-medium text-yellow-800">            <span className="text-yellow-600">👑</span>          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">      {isAdmin && (      {/* Admin Badge */}      </div>        </div>          </div>            </div>              </button>                + New Project              >                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"                onClick={() => setShowNewProject(true)}              <button              </button>                Browse Components              >                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"                onClick={() => router.push('/components')}              <button            <div className="flex gap-3">            </div>              </p>                  : `Manage your application projects (${projects.length} total)`}                  ? `Viewing all projects from all users (${projects.length} total)`                {isAdmin              <p className="mt-1 text-sm text-gray-500">              </h1>                {isAdmin ? 'All Projects' : 'My Projects'}              <h1 className="text-3xl font-bold text-gray-900">            <div>          <div className="flex justify-between items-center">        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">      <div className="bg-white border-b">      {/* Header */}    <div className="min-h-screen bg-gray-50">  return (  }    );      </div>        </div>          <p className="text-gray-600">Loading projects...</p>          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>        <div className="text-center">      <div className="min-h-screen bg-gray-50 flex items-center justify-center">    return (  if (loading) {  };    return icons[status as keyof typeof icons] || icons.draft;    };      deployed: '🚀',      completed: '✅',      building: '🔨',      draft: '📝',    const icons = {  const getStatusIcon = (status: string) => {  };    return colors[status as keyof typeof colors] || colors.draft;    };      deployed: 'bg-purple-100 text-purple-800',      completed: 'bg-green-100 text-green-800',      building: 'bg-blue-100 text-blue-800',      draft: 'bg-gray-100 text-gray-800',    const colors = {  const getStatusColor = (status: string) => {  };    }      console.error('Failed to delete project:', error);    } catch (error) {      }        fetchProjects();      if (res.ok) {      });        },          Authorization: `Bearer ${token}`,        headers: {        method: 'DELETE',      const res = await fetch(`http://localhost:3001/api/projects/${projectId}`, {      const token = localStorage.getItem('user_token');    try {    if (!confirm('Are you sure you want to delete this project?')) return;  const deleteProject = async (projectId: string) => {  };    }      console.error('Failed to create project:', error);    } catch (error) {      }        fetchProjects();        setShowNewProject(false);        setNewProject({ name: '', description: '' });      if (res.ok) {      });        body: JSON.stringify(newProject),        },          Authorization: `Bearer ${token}`,          'Content-Type': 'application/json',        headers: {        method: 'POST',      const res = await fetch('http://localhost:3001/api/projects', {      const token = localStorage.getItem('user_token');    try {  const createProject = async () => {  };    }      setLoading(false);    } finally {      console.error('Failed to fetch projects:', error);    } catch (error) {      }        router.push('/login');        localStorage.removeItem('user_token');      } else if (res.status === 401) {        setIsAdmin(data.isAdmin || false);        setProjects(data.projects || []);        const data = await res.json();      if (res.ok) {      });        },          Authorization: `Bearer ${token}`,        headers: {      const res = await fetch('http://localhost:3001/api/projects', {      }        return;        router.push('/login');      if (!token) {      const token = localStorage.getItem('user_token');    try {  const fetchProjects = async () => {  }, []);    fetchProjects();  useEffect(() => {  });    description: '',    name: '',  const [newProject, setNewProject] = useState({  const [showNewProject, setShowNewProject] = useState(false);  const [isAdmin, setIsAdmin] = useState(false);  const [loading, setLoading] = useState(true);  const [projects, setProjects] = useState<Project[]>([]);  const router = useRouter();export default function MyProjectsPage() {}  updated_at: number;  created_at: number;  generated_files?: any;  config?: any;  status: 'draft' | 'building' | 'completed' | 'deployed';  model_id?: string;  description?: string;  name: string;  user_email?: string;  user_name?: string;  user_id: string;  id: string;interface Project {import { useRouter } from 'next/navigation';import React, { useState, useEffect } from 'react';'use client'; */ * Shows user's own projects (or all projects for admins) * Handles event collection, pattern recognition, and model building
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { eventsRouter } from './api/events';
import { patternsRouter } from './api/patterns';
import { modelsRouter } from './api/models';
import { sessionsRouter } from './api/sessions';
import { generatorRouter } from './api/generator';
import { authRouter } from './api/auth';
import { projectsRouter } from './api/projects';
import { assetsRouter } from './api/assets';
import { initDatabase } from './db/database';
import { logger } from './utils/logger';
import { 
  rateLimiter, 
  validateInput, 
  csrfProtection, 
  securityHeaders 
} from './middleware/security';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware (FIRST)
app.use(securityHeaders);
app.use(rateLimiter);

// Core middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, process.env.VERCEL_URL].filter(Boolean)
    : ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '1mb' })); // Reduced from 10mb for security

// Input validation and CSRF protection
app.use(validateInput);
app.use(csrfProtection);

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: Date.now() });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/patterns', patternsRouter);
app.use('/api/models', modelsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/generate', generatorRouter);
app.use('/api/assets', assetsRouter);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
async function start() {
  try {
    // Initialize database
    await initDatabase();
    logger.info('Database initialized');
    
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.info('Event collection ready');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
