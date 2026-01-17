'use client';

/**
 * Reservations Page
 * Manage restaurant reservations with full instrumentation
 */

import { useState, useEffect } from 'react';
import { useRestaurantStore } from '@/store/restaurantStore';
import { useInstrumentation } from '@/hooks/useInstrumentation';
import { Reservation, ReservationStatus } from '@/types/restaurant';

export default function ReservationsPage() {
  const { reservations, tables, addReservation, updateReservation, deleteReservation } = useRestaurantStore();
  const { trackClick, trackFilter, trackCRUD, trackListView, trackFormSubmit } = useInstrumentation({ componentName: 'ReservationsPage', entityType: 'reservation' });

  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingRes, setEditingRes] = useState<Reservation | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    partySize: 2,
    tableId: '',
    specialRequests: '',
  });

  useEffect(() => {
    trackListView('reservations', reservations.length);
  }, []);

  const handleDateChange = (date: string) => {
    setDateFilter(date);
    trackFilter('reservations', { date });
  };

  const handleStatusFilter = (status: ReservationStatus | 'all') => {
    setStatusFilter(status);
    trackFilter('reservations', { status });
  };

  const handleEdit = (res: Reservation) => {
    setEditingRes(res);
    setFormData({
      customerName: res.customerName,
      customerPhone: res.customerPhone || '',
      customerEmail: res.customerEmail || '',
      date: res.date,
      time: res.time,
      partySize: res.partySize,
      tableId: res.tableId || '',
      specialRequests: res.specialRequests || '',
    });
    setShowModal(true);
    trackClick('edit_reservation_button', 'reservation', { resId: res.id });
  };

  const handleAdd = () => {
    setEditingRes(null);
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      date: dateFilter,
      time: '18:00',
      partySize: 2,
      tableId: '',
      specialRequests: '',
    });
    setShowModal(true);
    trackClick('add_reservation_button', 'reservation');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRes) {
      updateReservation(editingRes.id, formData);
      trackCRUD('update', 'reservation', editingRes.id, formData);
    } else {
      const newRes: Reservation = {
        id: crypto.randomUUID(),
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addReservation(newRes);
      trackCRUD('create', 'reservation', newRes.id, formData);
    }
    
    trackFormSubmit('reservation_form', formData, true);
    setShowModal(false);
  };

  const handleStatusChange = (res: Reservation, newStatus: ReservationStatus) => {
    updateReservation(res.id, { status: newStatus });
    trackCRUD('update', 'reservation', res.id, { status: newStatus });
  };

  const handleDelete = (res: Reservation) => {
    if (confirm(`Cancel reservation for ${res.customerName}?`)) {
      deleteReservation(res.id);
      trackCRUD('delete', 'reservation', res.id);
    }
  };

  const filteredReservations = reservations
    .filter(r => {
      if (dateFilter && r.date !== dateFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  const statuses: ReservationStatus[] = ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no-show'];
  const availableTables = tables.filter(t => t.status === 'available');

  const getStatusColor = (status: ReservationStatus) => {
    const colors: Record<ReservationStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      seated: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      'no-show': 'bg-orange-100 text-orange-800',
    };
    return colors[status];
  };

  // Get date navigation
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-500">{filteredReservations.length} reservations</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          New Reservation
        </button>
      </div>

      {/* Date Navigation */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map(date => {
            const d = new Date(date);
            const isToday = date === today.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = d.getDate();
            
            return (
              <button
                key={date}
                onClick={() => handleDateChange(date)}
                className={`flex-shrink-0 w-16 py-3 rounded-lg text-center transition-colors ${
                  dateFilter === date
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-xs font-medium">{dayName}</div>
                <div className="text-lg font-bold">{dayNum}</div>
                {isToday && <div className="text-xs">Today</div>}
              </button>
            );
          })}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => handleDateChange(e.target.value)}
            className="flex-shrink-0 px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Status Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusFilter('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              statusFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                statusFilter === status ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Timeline */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredReservations.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No reservations for this date
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredReservations.map((res) => (
              <div key={res.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-primary-600 w-20">
                      {res.time}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{res.customerName}</h3>
                      <p className="text-sm text-gray-500">
                        {res.partySize} guests • {res.tableId ? `Table ${res.tableId}` : 'No table assigned'}
                      </p>
                      {res.specialRequests && (
                        <p className="text-sm text-gray-400 mt-1">
                          📝 {res.specialRequests}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={res.status}
                      onChange={(e) => handleStatusChange(res, e.target.value as ReservationStatus)}
                      className={`text-xs font-medium rounded-full px-3 py-1 border-0 ${getStatusColor(res.status)}`}
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleEdit(res)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(res)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingRes ? 'Edit Reservation' : 'New Reservation'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData(p => ({ ...p, customerName: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData(p => ({ ...p, customerPhone: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData(p => ({ ...p, customerEmail: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(p => ({ ...p, time: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Party Size</label>
                  <input
                    type="number"
                    value={formData.partySize}
                    onChange={(e) => setFormData(p => ({ ...p, partySize: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    min="1"
                    max="20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Table</label>
                  <select
                    value={formData.tableId}
                    onChange={(e) => setFormData(p => ({ ...p, tableId: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Assign later</option>
                    {availableTables.map(t => (
                      <option key={t.id} value={t.id}>
                        Table {t.tableNumber} ({t.capacity} seats)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData(p => ({ ...p, specialRequests: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={2}
                  placeholder="Allergies, celebrations, seating preferences..."
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
                  {editingRes ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
