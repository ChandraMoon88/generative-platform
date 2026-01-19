'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ComponentShowcase from '@/components/ComponentShowcase';
import CreativeUniverseGame from '@/components/CreativeUniverseGame';

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

  // Component editor state
  const [projectComponents, setProjectComponents] = useState<any[]>([]);
  const [selectedComponentIndex, setSelectedComponentIndex] = useState<number | null>(null);
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [gameMode, setGameMode] = useState(true); // Start in game mode

  useEffect(() => {
    fetchProjects();
    // Check if user wants to skip game mode
    const skipGame = localStorage.getItem('skipGameMode');
    if (skipGame === 'true') {
      setGameMode(false);
    }
    
    // Clear old cached game version
    const currentVersion = '2.0.0';
    const savedVersion = localStorage.getItem('gameVersion');
    if (savedVersion !== currentVersion) {
      localStorage.removeItem('gameProgress');
      localStorage.setItem('gameVersion', currentVersion);
    }
  }, []);

  useEffect(() => {
    if (projectId && projects.length > 0) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setCurrentProject(project);
        // Load project components from config
        if (project.config?.components) {
          setProjectComponents(project.config.components);
        }
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

  const handleGameAppCreated = async (components: any[]) => {
    // Create project from completed game
    try {
      const token = localStorage.getItem('user_token');
      const userId = localStorage.getItem('user_id');
      const userName = localStorage.getItem('user_name');
      const userEmail = localStorage.getItem('user_email');
      
      const projectId = `project_${Date.now()}`;

      const res = await fetch('/api/projects', {
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
          name: '🎮 My Creative World',
          description: 'Built through the Creative Universe journey',
          status: 'completed',
          config: { components },
          created_at: Date.now(),
          updated_at: Date.now(),
        }),
      });

      if (res.ok) {
        const project = await res.json();
        setGameMode(false);
        localStorage.setItem('gameCompleted', 'true');
        await fetchProjects();
        router.push(`/projects?id=${projectId}`);
      }
    } catch (error) {
      console.error('Error creating project from game:', error);
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

  const handleComponentAdd = async (component: any) => {
    const newComponent = {
      id: `comp-${Date.now()}`,
      name: component.name,
      type: component.name,
      props: {
        id: `${component.name.toLowerCase()}-${Date.now()}`,
        text: 'Edit me',
        variant: 'primary',
        content: 'Component content',
      },
      category: component.category,
    };

    const updatedComponents = [...projectComponents, newComponent];
    setProjectComponents(updatedComponents);
    setShowComponentLibrary(false);

    // Save to backend
    await saveProjectComponents(updatedComponents);
  };

  const handleComponentUpdate = async (index: number, newProps: any) => {
    const updatedComponents = [...projectComponents];
    updatedComponents[index] = {
      ...updatedComponents[index],
      props: { ...updatedComponents[index].props, ...newProps }
    };
    setProjectComponents(updatedComponents);
    
    // Auto-save
    await saveProjectComponents(updatedComponents);
  };

  const handleComponentDelete = async (index: number) => {
    const updatedComponents = projectComponents.filter((_, i) => i !== index);
    setProjectComponents(updatedComponents);
    setSelectedComponentIndex(null);
    
    await saveProjectComponents(updatedComponents);
  };

  const saveProjectComponents = async (components: any[]) => {
    if (!currentProject) return;

    try {
      const token = localStorage.getItem('user_token');
      await fetch(`/api/projects/${currentProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          config: {
            ...(currentProject.config || {}),
            components,
          },
        }),
      });
    } catch (error) {
      console.error('Failed to save components:', error);
    }
  };

  const renderComponent = (comp: any, index: number) => {
    const isSelected = selectedComponentIndex === index;
    
    // Build inline styles from component props
    const dynamicStyles: React.CSSProperties = {
      backgroundColor: comp.props.backgroundColor || undefined,
      color: comp.props.color || undefined,
      borderWidth: comp.props.borderWidth || undefined,
      borderColor: comp.props.borderColor || undefined,
      borderRadius: comp.props.borderRadius || undefined,
      borderStyle: comp.props.borderWidth ? 'solid' : undefined,
      padding: comp.props.padding || undefined,
      margin: comp.props.margin || undefined,
      width: comp.props.width || undefined,
      fontSize: comp.props.fontSize || undefined,
      fontWeight: comp.props.fontWeight || undefined,
      textAlign: comp.props.textAlign as any || undefined,
    };

    return (
      <div
        key={comp.id}
        onClick={() => setSelectedComponentIndex(index)}
        className={`relative transition-all cursor-pointer ${
          isSelected ? 'ring-4 ring-purple-500' : 'hover:ring-2 hover:ring-gray-300'
        }`}
        style={dynamicStyles}
      >
        {isSelected && (
          <div className="absolute -top-8 left-0 right-0 bg-purple-600 text-white text-xs px-2 py-1 rounded-t flex justify-between items-center z-10">
            <span>{comp.type}</span>
            <span className="text-xs opacity-75">Click to edit →</span>
          </div>
        )}
        
        {comp.type === 'Button' && (
          <button
            style={dynamicStyles}
            className="px-6 py-3 rounded font-medium transition-all"
          >
            {comp.props.text || 'Button'}
          </button>
        )}
        
        {comp.type === 'Input' && (
          <input
            type="text"
            placeholder={comp.props.placeholder || 'Enter text...'}
            style={dynamicStyles}
            className="px-4 py-2 border rounded"
            readOnly
          />
        )}
        
        {comp.type === 'Card' && (
          <div style={dynamicStyles} className="p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2" style={{ color: comp.props.color }}>
              {comp.props.title || 'Card Title'}
            </h3>
            <p style={{ color: comp.props.color }}>{comp.props.content || 'Card content goes here'}</p>
          </div>
        )}
        
        {comp.type === 'Alert' && (
          <div style={dynamicStyles} className="p-4 rounded">
            {comp.props.message || 'Alert message'}
          </div>
        )}
        
        {comp.type === 'Navbar' && (
          <nav style={dynamicStyles} className="p-4 rounded">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">{comp.props.title || 'Logo'}</div>
              <div className="flex gap-4">
                <a className="hover:opacity-75">Home</a>
                <a className="hover:opacity-75">About</a>
                <a className="hover:opacity-75">Contact</a>
              </div>
            </div>
          </nav>
        )}

        {comp.type === 'Table' && (
          <div style={dynamicStyles} className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Column 1</th>
                  <th className="px-4 py-2 border">Column 2</th>
                  <th className="px-4 py-2 border">Column 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border">Data 1</td>
                  <td className="px-4 py-2 border">Data 2</td>
                  <td className="px-4 py-2 border">Data 3</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        {!['Button', 'Input', 'Card', 'Alert', 'Navbar', 'Table'].includes(comp.type) && (
          <div style={dynamicStyles} className="p-6 rounded text-center">
            <div className="text-3xl mb-2">🧩</div>
            <div className="font-medium">{comp.type}</div>
            <p className="text-sm mt-2">{comp.props.content || comp.props.text || 'Edit this component'}</p>
          </div>
        )}
      </div>
    );
  };

  const renderPropertyEditor = () => {
    if (selectedComponentIndex === null) return null;
    
    const comp = projectComponents[selectedComponentIndex];
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-lg">{comp.type}</h3>
          <button
            onClick={() => handleComponentDelete(selectedComponentIndex)}
            className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
          >
            Delete
          </button>
        </div>

        {/* Common Style Controls */}
        <div className="space-y-3">
          <div className="font-semibold text-sm text-gray-700 border-b pb-2">🎨 Appearance</div>
          
          {/* Background Color */}
          <div>
            <label className="block text-xs font-medium mb-2 text-gray-600">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={comp.props.backgroundColor || '#ffffff'}
                onChange={(e) => handleComponentUpdate(selectedComponentIndex, { backgroundColor: e.target.value })}
                className="w-12 h-10 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={comp.props.backgroundColor || '#ffffff'}
                onChange={(e) => handleComponentUpdate(selectedComponentIndex, { backgroundColor: e.target.value })}
                className="flex-1 px-3 py-2 border rounded text-sm"
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-xs font-medium mb-2 text-gray-600">Text Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={comp.props.color || '#000000'}
                onChange={(e) => handleComponentUpdate(selectedComponentIndex, { color: e.target.value })}
                className="w-12 h-10 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={comp.props.color || '#000000'}
                onChange={(e) => handleComponentUpdate(selectedComponentIndex, { color: e.target.value })}
                className="flex-1 px-3 py-2 border rounded text-sm"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Border */}
          <div>
            <label className="block text-xs font-medium mb-2 text-gray-600">Border Width (px)</label>
            <input
              type="range"
              min="0"
              max="10"
              value={parseInt(comp.props.borderWidth) || 0}
              onChange={(e) => handleComponentUpdate(selectedComponentIndex, { borderWidth: e.target.value + 'px' })}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{comp.props.borderWidth || '0px'}</span>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2 text-gray-600">Border Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={comp.props.borderColor || '#e5e7eb'}
                onChange={(e) => handleComponentUpdate(selectedComponentIndex, { borderColor: e.target.value })}
                className="w-12 h-10 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={comp.props.borderColor || '#e5e7eb'}
                onChange={(e) => handleComponentUpdate(selectedComponentIndex, { borderColor: e.target.value })}
                className="flex-1 px-3 py-2 border rounded text-sm"
              />
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className="block text-xs font-medium mb-2 text-gray-600">Border Radius (px)</label>
            <input
              type="range"
              min="0"
              max="50"
              value={parseInt(comp.props.borderRadius) || 0}
              onChange={(e) => handleComponentUpdate(selectedComponentIndex, { borderRadius: e.target.value + 'px' })}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{comp.props.borderRadius || '0px'}</span>
          </div>
        </div>

        {/* Spacing Controls */}
        <div className="space-y-3">
          <div className="font-semibold text-sm text-gray-700 border-b pb-2">📐 Spacing</div>
          
          <div>
            <label className="block text-xs font-medium mb-2 text-gray-600">Padding (px)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={parseInt(comp.props.padding) || 0}
              onChange={(e) => handleComponentUpdate(selectedComponentIndex, { padding: e.target.value + 'px' })}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{comp.props.padding || '0px'}</span>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2 text-gray-600">Margin (px)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={parseInt(comp.props.margin) || 0}
              onChange={(e) => handleComponentUpdate(selectedComponentIndex, { margin: e.target.value + 'px' })}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{comp.props.margin || '0px'}</span>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2 text-gray-600">Width</label>
            <select
              value={comp.props.width || 'auto'}
              onChange={(e) => handleComponentUpdate(selectedComponentIndex, { width: e.target.value })}
              className="w-full px-3 py-2 border rounded text-sm"
            >
              <option value="auto">Auto</option>
              <option value="100%">Full Width (100%)</option>
              <option value="50%">Half Width (50%)</option>
              <option value="33.333%">One Third (33%)</option>
              <option value="300px">Fixed 300px</option>
              <option value="500px">Fixed 500px</option>
            </select>
          </div>
        </div>

        {/* Typography Controls */}
        <div className="space-y-3">
          <div className="font-semibold text-sm text-gray-700 border-b pb-2">✍️ Typography</div>
          
          <div>
            <label className="block text-xs font-medium mb-2 text-gray-600">Font Size (px)</label>
            <input
              type="range"
              min="10"
              max="72"
              value={parseInt(comp.props.fontSize) || 16}
              onChange={(e) => handleComponentUpdate(selectedComponentIndex, { fontSize: e.target.value + 'px' })}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{comp.props.fontSize || '16px'}</span>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2 text-gray-600">Font Weight</label>
            <select
              value={comp.props.fontWeight || 'normal'}
              onChange={(e) => handleComponentUpdate(selectedComponentIndex, { fontWeight: e.target.value })}
              className="w-full px-3 py-2 border rounded text-sm"
            >
              <option value="300">Light (300)</option>
              <option value="normal">Normal (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi-Bold (600)</option>
              <option value="bold">Bold (700)</option>
              <option value="900">Black (900)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2 text-gray-600">Text Align</label>
            <div className="grid grid-cols-4 gap-2">
              {['left', 'center', 'right', 'justify'].map(align => (
                <button
                  key={align}
                  onClick={() => handleComponentUpdate(selectedComponentIndex, { textAlign: align })}
                  className={`px-2 py-2 border rounded text-xs ${
                    comp.props.textAlign === align ? 'bg-purple-600 text-white' : 'bg-white'
                  }`}
                >
                  {align === 'left' && '⬅'}
                  {align === 'center' && '↔️'}
                  {align === 'right' && '➡'}
                  {align === 'justify' && '⬌'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Component-Specific Properties */}
        <div className="space-y-3">
          <div className="font-semibold text-sm text-gray-700 border-b pb-2">⚙️ Content</div>
          
          {comp.type === 'Button' && (
            <>
              <div>
                <label className="block text-xs font-medium mb-2 text-gray-600">Button Text</label>
                <input
                  type="text"
                  value={comp.props.text || ''}
                  onChange={(e) => handleComponentUpdate(selectedComponentIndex, { text: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Click me"
                />
              </div>
            </>
          )}
          
          {comp.type === 'Input' && (
            <>
              <div>
                <label className="block text-xs font-medium mb-2 text-gray-600">Placeholder</label>
                <input
                  type="text"
                  value={comp.props.placeholder || ''}
                  onChange={(e) => handleComponentUpdate(selectedComponentIndex, { placeholder: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter text..."
                />
              </div>
            </>
          )}
          
          {comp.type === 'Card' && (
            <>
              <div>
                <label className="block text-xs font-medium mb-2 text-gray-600">Title</label>
                <input
                  type="text"
                  value={comp.props.title || ''}
                  onChange={(e) => handleComponentUpdate(selectedComponentIndex, { title: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Card title"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2 text-gray-600">Content</label>
                <textarea
                  value={comp.props.content || ''}
                  onChange={(e) => handleComponentUpdate(selectedComponentIndex, { content: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  rows={4}
                  placeholder="Card content"
                />
              </div>
            </>
          )}
          
          {comp.type === 'Alert' && (
            <>
              <div>
                <label className="block text-xs font-medium mb-2 text-gray-600">Message</label>
                <input
                  type="text"
                  value={comp.props.message || ''}
                  onChange={(e) => handleComponentUpdate(selectedComponentIndex, { message: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Alert message"
                />
              </div>
            </>
          )}

          {/* Universal Text Editor for all components */}
          {!['Card', 'Alert'].includes(comp.type) && (
            <div>
              <label className="block text-xs font-medium mb-2 text-gray-600">Text Content</label>
              <textarea
                value={comp.props.content || comp.props.text || comp.props.placeholder || comp.props.title || ''}
                onChange={(e) => handleComponentUpdate(selectedComponentIndex, { 
                  content: e.target.value,
                  text: e.target.value,
                  placeholder: comp.type === 'Input' ? e.target.value : comp.props.placeholder,
                  title: comp.type === 'Navbar' ? e.target.value : comp.props.title
                })}
                className="w-full px-3 py-2 border rounded"
                rows={3}
                placeholder="Enter text content..."
              />
            </div>
          )}
        </div>

        {/* Position Controls */}
        <div className="space-y-3">
          <div className="font-semibold text-sm text-gray-700 border-b pb-2">🔄 Position</div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (selectedComponentIndex > 0) {
                  const updated = [...projectComponents];
                  [updated[selectedComponentIndex - 1], updated[selectedComponentIndex]] = 
                  [updated[selectedComponentIndex], updated[selectedComponentIndex - 1]];
                  setProjectComponents(updated);
                  setSelectedComponentIndex(selectedComponentIndex - 1);
                  saveProjectComponents(updated);
                }
              }}
              disabled={selectedComponentIndex === 0}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm disabled:opacity-50"
            >
              ⬆️ Move Up
            </button>
            <button
              onClick={() => {
                if (selectedComponentIndex < projectComponents.length - 1) {
                  const updated = [...projectComponents];
                  [updated[selectedComponentIndex], updated[selectedComponentIndex + 1]] = 
                  [updated[selectedComponentIndex + 1], updated[selectedComponentIndex]];
                  setProjectComponents(updated);
                  setSelectedComponentIndex(selectedComponentIndex + 1);
                  saveProjectComponents(updated);
                }
              }}
              disabled={selectedComponentIndex === projectComponents.length - 1}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm disabled:opacity-50"
            >
              ⬇️ Move Down
            </button>
          </div>
        </div>
      </div>
    );
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

  // Show game mode for new users (no projects and must complete game first)
  const gameCompleted = typeof window !== 'undefined' && localStorage.getItem('gameCompleted') === 'true';
  
  if (!gameCompleted && projects.length === 0) {
    return <CreativeUniverseGame onGameComplete={handleGameAppCreated} />;
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
                setProjectComponents([]);
                setSelectedComponentIndex(null);
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
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowComponentLibrary(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                  >
                    + Add Component
                  </button>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(currentProject.status)}`}>
                    {getStatusIcon(currentProject.status)} {currentProject.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Editor Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Canvas Area */}
            <div className="col-span-8">
              <div className="bg-white rounded-lg shadow-sm p-6 min-h-[600px]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Canvas</h2>
                  <span className="text-sm text-gray-500">
                    {projectComponents.length} component{projectComponents.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {projectComponents.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No components yet</h3>
                    <p className="text-gray-600 mb-4">Click "Add Component" to start building</p>
                    <button
                      onClick={() => setShowComponentLibrary(true)}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                    >
                      Add Your First Component
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projectComponents.map((comp, index) => renderComponent(comp, index))}
                  </div>
                )}
              </div>
            </div>

            {/* Properties Panel */}
            <div className="col-span-4">
              <div className="sticky top-6">
                {selectedComponentIndex !== null ? (
                  renderPropertyEditor()
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <div className="text-4xl mb-3">👆</div>
                    <h3 className="font-medium text-gray-900 mb-2">Select a component</h3>
                    <p className="text-sm text-gray-600">Click on a component to edit its properties</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Component Library Modal */}
        {showComponentLibrary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Component Library</h2>
                <button
                  onClick={() => setShowComponentLibrary(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <ComponentShowcase onComponentAdd={handleComponentAdd} />
              </div>
            </div>
          </div>
        )}
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

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}
