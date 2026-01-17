'use client';

/**
 * Staff Page
 * Manage restaurant staff with full instrumentation
 */

import { useState, useEffect } from 'react';
import { useRestaurantStore } from '@/store/restaurantStore';
import { useInstrumentation } from '@/hooks/useInstrumentation';
import { Staff, StaffRole } from '@/types/restaurant';

export default function StaffPage() {
  const { staff, addStaff, updateStaff, deleteStaff } = useRestaurantStore();
  const { trackClick, trackFilter, trackCRUD, trackListView, trackFormSubmit } = useInstrumentation();

  const [roleFilter, setRoleFilter] = useState<StaffRole | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'waiter' as StaffRole,
    phone: '',
    hourlyRate: 15,
  });

  useEffect(() => {
    trackListView('staff', staff.length);
  }, []);

  const handleRoleFilter = (role: StaffRole | 'all') => {
    setRoleFilter(role);
    trackFilter('staff', { role });
  };

  const handleEdit = (member: Staff) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      phone: member.phone || '',
      hourlyRate: member.hourlyRate,
    });
    setShowModal(true);
    trackClick('edit_staff_button', 'staff', { staffId: member.id });
  };

  const handleAdd = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      role: 'waiter',
      phone: '',
      hourlyRate: 15,
    });
    setShowModal(true);
    trackClick('add_staff_button', 'staff');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStaff) {
      updateStaff(editingStaff.id, formData);
      trackCRUD('update', 'staff', editingStaff.id, formData);
    } else {
      const newStaff: Staff = {
        id: crypto.randomUUID(),
        ...formData,
        status: 'active',
        assignedTables: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addStaff(newStaff);
      trackCRUD('create', 'staff', newStaff.id, formData);
    }
    
    trackFormSubmit('staff_form', formData, true);
    setShowModal(false);
  };

  const handleDelete = (member: Staff) => {
    if (confirm(`Delete ${member.name}?`)) {
      deleteStaff(member.id);
      trackCRUD('delete', 'staff', member.id);
    }
  };

  const handleToggleStatus = (member: Staff) => {
    const newStatus = member.status === 'active' ? 'inactive' : 'active';
    updateStaff(member.id, { status: newStatus });
    trackCRUD('update', 'staff', member.id, { status: newStatus });
  };

  const filteredStaff = staff.filter(s => roleFilter === 'all' || s.role === roleFilter);

  const roles: StaffRole[] = ['manager', 'host', 'waiter', 'chef', 'bartender', 'busser'];

  const getRoleColor = (role: StaffRole) => {
    const colors: Record<StaffRole, string> = {
      manager: 'bg-purple-100 text-purple-800',
      host: 'bg-blue-100 text-blue-800',
      waiter: 'bg-green-100 text-green-800',
      chef: 'bg-orange-100 text-orange-800',
      bartender: 'bg-pink-100 text-pink-800',
      busser: 'bg-gray-100 text-gray-800',
    };
    return colors[role];
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
          <p className="text-gray-500">{filteredStaff.length} team members</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Add Staff
        </button>
      </div>

      {/* Role Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleRoleFilter('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              roleFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Roles
          </button>
          {roles.map(role => (
            <button
              key={role}
              onClick={() => handleRoleFilter(role)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                roleFilter === role ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {role}s
            </button>
          ))}
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map(member => (
          <div key={member.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getRoleColor(member.role)}`}>
                    {member.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleToggleStatus(member)}
                className={`w-3 h-3 rounded-full ${
                  member.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                }`}
                title={member.status === 'active' ? 'Active' : 'Inactive'}
              />
            </div>
            
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <span>📧</span> {member.email}
              </p>
              {member.phone && (
                <p className="flex items-center gap-2">
                  <span>📱</span> {member.phone}
                </p>
              )}
              <p className="flex items-center gap-2">
                <span>💰</span> ${member.hourlyRate}/hr
              </p>
              {member.assignedTables.length > 0 && (
                <p className="flex items-center gap-2">
                  <span>🪑</span> Tables: {member.assignedTables.join(', ')}
                </p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t flex gap-2">
              <button
                onClick={() => handleEdit(member)}
                className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(member)}
                className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredStaff.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No staff members found
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(p => ({ ...p, role: e.target.value as StaffRole }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {roles.map(role => (
                    <option key={role} value={role} className="capitalize">{role}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData(p => ({ ...p, hourlyRate: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  min="0"
                  step="0.5"
                />
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
                  {editingStaff ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
