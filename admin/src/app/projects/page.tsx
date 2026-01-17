/**
 * Admin Projects Overview Page
 * Admin can view ALL projects from ALL users with activity monitoring
 */

'use client';

import React, { useState, useEffect } from 'react';

interface Project {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  name: string;
  description?: string;
  status: string;
  created_at: number;
  updated_at: number;
  model_id?: string;
}

interface Stats {
  totalProjects: number;
  totalUsers: number;
  projectsByStatus: Array<{ status: string; count: number }>;
  recentProjects: Project[];
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  const fetchProjects = async () => {
    try {
      // In production, this would use admin authentication
      const res = await fetch('http://localhost:3001/api/projects', {
        headers: {
          // Admin token would go here
          Authorization: `Bearer admin-token`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/projects/stats/overview', {
        headers: {
          Authorization: `Bearer admin-token`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesFilter = filter === 'all' || project.status === filter;
    const matchesSearch =
      searchQuery === '' ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.user_email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">👑</span>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-purple-100 mt-1">Monitor all user projects and activity</p>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-purple-100 text-sm">Total Projects</div>
                <div className="text-3xl font-bold mt-1">{stats.totalProjects}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-purple-100 text-sm">Total Users</div>
                <div className="text-3xl font-bold mt-1">{stats.totalUsers}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-purple-100 text-sm">Active Projects</div>
                <div className="text-3xl font-bold mt-1">
                  {stats.projectsByStatus.find((s) => s.status === 'building')?.count || 0}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-purple-100 text-sm">Deployed</div>
                <div className="text-3xl font-bold mt-1">
                  {stats.projectsByStatus.find((s) => s.status === 'deployed')?.count || 0}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by project name, user name, or email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['all', 'draft', 'building', 'completed', 'deployed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    filter === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No projects found
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{project.name}</div>
                          {project.description && (
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {project.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.user_name}
                          </div>
                          <div className="text-sm text-gray-500">{project.user_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(project.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(project.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => window.open(`/projects/${project.id}`, '_blank')}
                          className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        {stats && stats.recentProjects.length > 0 && (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {stats.recentProjects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{project.name}</div>
                    <div className="text-sm text-gray-500">
                      by {project.user_name} •{' '}
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
