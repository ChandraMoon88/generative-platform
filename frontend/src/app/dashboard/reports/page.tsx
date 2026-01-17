'use client';

/**
 * Reports Page
 * Analytics and reports for restaurant operations
 */

import { useState, useEffect } from 'react';
import { useRestaurantStore } from '@/store/restaurantStore';
import { useInstrumentation } from '@/hooks/useInstrumentation';

export default function ReportsPage() {
  const { orders, tables, staff, menuItems, reservations } = useRestaurantStore();
  const { trackPageView } = useInstrumentation();
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    trackPageView('/dashboard/reports', { page: 'reports' });
  }, []);

  // Calculate statistics
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  // Orders by status
  const ordersByStatus = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Menu item popularity (mock data since we don't track order items separately)
  const menuStats = menuItems.slice(0, 5).map(item => ({
    name: item.name,
    orders: Math.floor(Math.random() * 50) + 10,
    revenue: item.price * (Math.floor(Math.random() * 50) + 10),
  }));

  // Staff performance (mock data)
  const staffStats = staff.filter(s => s.role === 'waiter').slice(0, 5).map(member => ({
    name: member.name,
    ordersServed: Math.floor(Math.random() * 30) + 5,
    tips: Math.floor(Math.random() * 200) + 50,
    rating: (Math.random() * 2 + 3).toFixed(1),
  }));

  // Table utilization
  const tableUtilization = {
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    other: tables.filter(t => ['cleaning', 'maintenance'].includes(t.status)).length,
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">Analytics and performance metrics</p>
        </div>
        <div className="flex gap-2">
          {(['today', 'week', 'month'] as const).map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg capitalize ${
                dateRange === range
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-green-600 mt-1">↑ 12% from yesterday</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          <p className="text-sm text-green-600 mt-1">↑ 8% from yesterday</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Avg Order Value</p>
          <p className="text-3xl font-bold text-gray-900">${avgOrderValue.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Per completed order</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Table Turnover</p>
          <p className="text-3xl font-bold text-gray-900">{(Math.random() * 2 + 1.5).toFixed(1)}x</p>
          <p className="text-sm text-gray-500 mt-1">Average per table</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Orders by Status */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-bold text-gray-900 mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {Object.entries(ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-600 capitalize">{status}</div>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      status === 'completed' ? 'bg-green-500' :
                      status === 'preparing' ? 'bg-yellow-500' :
                      status === 'pending' ? 'bg-blue-500' :
                      status === 'cancelled' ? 'bg-red-500' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${(count / orders.length) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-sm font-medium text-gray-900">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Table Utilization */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-bold text-gray-900 mb-4">Table Utilization</h2>
          <div className="flex items-center justify-center h-48">
            <div className="relative w-40 h-40">
              {/* Simple pie chart visualization */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="10"
                  strokeDasharray={`${(tableUtilization.available / tables.length) * 283} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">{tables.length}</p>
                <p className="text-sm text-gray-500">Tables</p>
              </div>
            </div>
            <div className="ml-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-sm">Available ({tableUtilization.available})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-sm">Occupied ({tableUtilization.occupied})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-sm">Reserved ({tableUtilization.reserved})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                <span className="text-sm">Other ({tableUtilization.other})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Menu Items */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="font-bold text-gray-900">Top Menu Items</h2>
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase">
                  <th className="pb-2">Item</th>
                  <th className="pb-2 text-right">Orders</th>
                  <th className="pb-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {menuStats.map((item, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2 font-medium">{item.name}</td>
                    <td className="py-2 text-right text-gray-600">{item.orders}</td>
                    <td className="py-2 text-right font-medium">${item.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff Performance */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="font-bold text-gray-900">Staff Performance</h2>
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase">
                  <th className="pb-2">Staff</th>
                  <th className="pb-2 text-right">Orders</th>
                  <th className="pb-2 text-right">Tips</th>
                  <th className="pb-2 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {staffStats.map((member, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2 font-medium">{member.name}</td>
                    <td className="py-2 text-right text-gray-600">{member.ordersServed}</td>
                    <td className="py-2 text-right text-green-600">${member.tips}</td>
                    <td className="py-2 text-right">
                      <span className="text-yellow-500">★</span> {member.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
