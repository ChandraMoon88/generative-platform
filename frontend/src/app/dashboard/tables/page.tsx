'use client';

/**
 * Tables Page
 * Manage restaurant tables with floor plan view and instrumentation
 */

import { useState, useEffect } from 'react';
import { useRestaurantStore } from '@/store/restaurantStore';
import { useInstrumentation } from '@/hooks/useInstrumentation';
import { Table, TableStatus } from '@/types/restaurant';

export default function TablesPage() {
  const { tables, addTable, updateTable, deleteTable } = useRestaurantStore();
  const { trackClick, trackFilter, trackCRUD, trackListView, trackFormSubmit } = useInstrumentation();

  const [statusFilter, setStatusFilter] = useState<TableStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: 4,
    section: 'main',
    minPartySize: 1,
    maxPartySize: 4,
  });

  useEffect(() => {
    trackListView('tables', tables.length);
  }, []);

  const handleStatusFilter = (status: TableStatus | 'all') => {
    setStatusFilter(status);
    trackFilter('tables', { status });
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    trackClick('view_mode_toggle', 'tables', { mode });
  };

  const handleStatusChange = (table: Table, newStatus: TableStatus) => {
    updateTable(table.id, { status: newStatus });
    trackCRUD('update', 'table', table.id, { status: newStatus });
  };

  const handleEdit = (table: Table) => {
    setEditingTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      section: table.section,
      minPartySize: table.minPartySize,
      maxPartySize: table.maxPartySize,
    });
    setShowModal(true);
    trackClick('edit_table_button', 'table', { tableId: table.id });
  };

  const handleAdd = () => {
    setEditingTable(null);
    setFormData({
      tableNumber: '',
      capacity: 4,
      section: 'main',
      minPartySize: 1,
      maxPartySize: 4,
    });
    setShowModal(true);
    trackClick('add_table_button', 'table');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTable) {
      updateTable(editingTable.id, formData);
      trackCRUD('update', 'table', editingTable.id, formData);
    } else {
      const newTable: Table = {
        id: crypto.randomUUID(),
        ...formData,
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addTable(newTable);
      trackCRUD('create', 'table', newTable.id, formData);
    }
    
    trackFormSubmit('table_form', formData, true);
    setShowModal(false);
  };

  const handleDelete = (table: Table) => {
    if (confirm(`Delete Table ${table.tableNumber}?`)) {
      deleteTable(table.id);
      trackCRUD('delete', 'table', table.id);
    }
  };

  const filteredTables = tables.filter(t => statusFilter === 'all' || t.status === statusFilter);

  const statuses: TableStatus[] = ['available', 'occupied', 'reserved', 'cleaning', 'maintenance'];

  const getStatusColor = (status: TableStatus) => {
    const colors: Record<TableStatus, string> = {
      available: 'bg-green-500',
      occupied: 'bg-red-500',
      reserved: 'bg-blue-500',
      cleaning: 'bg-yellow-500',
      maintenance: 'bg-gray-500',
    };
    return colors[status];
  };

  const getStatusBgColor = (status: TableStatus) => {
    const colors: Record<TableStatus, string> = {
      available: 'bg-green-100 border-green-300',
      occupied: 'bg-red-100 border-red-300',
      reserved: 'bg-blue-100 border-blue-300',
      cleaning: 'bg-yellow-100 border-yellow-300',
      maintenance: 'bg-gray-100 border-gray-300',
    };
    return colors[status];
  };

  const sections = ['main', 'patio', 'bar', 'private', 'outdoor'];

  const statusStats = statuses.map(status => ({
    status,
    count: tables.filter(t => t.status === status).length,
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tables</h1>
          <p className="text-gray-500">{filteredTables.length} tables</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg overflow-hidden border">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-white'}`}
            >
              ▦
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-200' : 'bg-white'}`}
            >
              ☰
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Add Table
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {statusStats.map(({ status, count }) => (
          <div
            key={status}
            onClick={() => handleStatusFilter(statusFilter === status ? 'all' : status)}
            className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition ${
              statusFilter === status ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
              <span className="text-sm text-gray-600 capitalize">{status}</span>
            </div>
            <p className="text-2xl font-bold mt-2">{count}</p>
          </div>
        ))}
      </div>

      {/* Tables View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredTables.map(table => (
            <div
              key={table.id}
              className={`rounded-lg border-2 p-4 cursor-pointer transition hover:shadow-md ${getStatusBgColor(table.status)}`}
              onClick={() => handleEdit(table)}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">
                  {table.tableNumber}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {table.capacity} seats
                </div>
                <div className={`mt-2 text-xs font-medium px-2 py-1 rounded-full inline-block ${
                  table.status === 'available' ? 'bg-green-200 text-green-800' :
                  table.status === 'occupied' ? 'bg-red-200 text-red-800' :
                  table.status === 'reserved' ? 'bg-blue-200 text-blue-800' :
                  table.status === 'cleaning' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-gray-200 text-gray-800'
                }`}>
                  {table.status}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {table.section}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Table</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Party Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTables.map(table => (
                <tr key={table.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-bold">
                    {table.tableNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {table.capacity} seats
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    {table.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {table.minPartySize} - {table.maxPartySize}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={table.status}
                      onChange={(e) => handleStatusChange(table, e.target.value as TableStatus)}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-xs font-medium rounded px-2 py-1 border-0 ${getStatusBgColor(table.status)}`}
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(table)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(table)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredTables.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No tables found
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingTable ? 'Edit Table' : 'Add Table'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
                <input
                  type="text"
                  value={formData.tableNumber}
                  onChange={(e) => setFormData(p => ({ ...p, tableNumber: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., T1, A5, Patio-3"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(p => ({ ...p, capacity: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  min="1"
                  max="20"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData(p => ({ ...p, section: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {sections.map(section => (
                    <option key={section} value={section} className="capitalize">{section}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Party Size</label>
                  <input
                    type="number"
                    value={formData.minPartySize}
                    onChange={(e) => setFormData(p => ({ ...p, minPartySize: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Party Size</label>
                  <input
                    type="number"
                    value={formData.maxPartySize}
                    onChange={(e) => setFormData(p => ({ ...p, maxPartySize: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editingTable ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
