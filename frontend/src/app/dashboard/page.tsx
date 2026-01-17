'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  UtensilsCrossed,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { useRestaurantStore } from '../../store/restaurantStore';
import { useInstrumentation } from '../../hooks/useInstrumentation';

export default function DashboardPage() {
  const { 
    menuItems, 
    orders, 
    tables, 
    staff, 
    alerts,
    loadSampleData 
  } = useRestaurantStore();
  
  const { trackClick } = useInstrumentation({ 
    componentName: 'Dashboard' 
  });
  
  // Load sample data on first visit
  useEffect(() => {
    if (menuItems.length === 0) {
      loadSampleData();
    }
  }, [menuItems.length, loadSampleData]);
  
  // Calculate statistics
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === new Date().toDateString()
  );
  const activeOrders = orders.filter(
    (o) => !['completed', 'cancelled'].includes(o.status)
  );
  const todayRevenue = todayOrders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length;
  const unreadAlerts = alerts.filter((a) => !a.read);
  
  const stats = [
    {
      label: 'Menu Items',
      value: menuItems.length,
      icon: UtensilsCrossed,
      color: 'bg-primary-50 text-primary-600',
      href: '/dashboard/menu',
    },
    {
      label: 'Active Orders',
      value: activeOrders.length,
      icon: ShoppingCart,
      color: 'bg-blue-50 text-blue-600',
      href: '/dashboard/orders',
    },
    {
      label: 'Tables Occupied',
      value: `${occupiedTables}/${tables.length}`,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
      href: '/dashboard/tables',
    },
    {
      label: "Today's Revenue",
      value: `$${todayRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
      href: '/dashboard/reports',
    },
  ];
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Restaurant Manager</h2>
        <p className="text-primary-100">
          Manage your restaurant efficiently. Track orders, inventory, and staff all in one place.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              onClick={(e) => trackClick(e.currentTarget, 'navigation', undefined, `View ${stat.label}`)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Recent Orders</h3>
            <Link 
              href="/dashboard/orders"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          <div className="p-4">
            {orders.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No orders yet</p>
                <Link 
                  href="/dashboard/orders"
                  className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block"
                >
                  Create your first order
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div 
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{order.orderNumber}</p>
                      <p className="text-sm text-slate-500">
                        {order.items.length} items • Table {order.tableNumber || 'Takeaway'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-800">${order.total.toFixed(2)}</p>
                      <span className={`
                        text-xs px-2 py-1 rounded-full
                        ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'preparing' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'}
                      `}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Alerts & Quick Actions */}
        <div className="space-y-6">
          {/* Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">Alerts</h3>
            </div>
            <div className="p-4">
              {unreadAlerts.length === 0 ? (
                <div className="text-center py-4 text-slate-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">All caught up!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {unreadAlerts.slice(0, 3).map((alert) => (
                    <div 
                      key={alert.id}
                      className={`
                        p-3 rounded-lg text-sm
                        ${alert.severity === 'error' ? 'bg-red-50 text-red-700' :
                          alert.severity === 'warning' ? 'bg-amber-50 text-amber-700' :
                          'bg-blue-50 text-blue-700'}
                      `}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-xs opacity-75 mt-1">{alert.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">Quick Actions</h3>
            </div>
            <div className="p-4 space-y-2">
              <Link
                href="/dashboard/orders/new"
                className="flex items-center gap-3 p-3 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
                data-semantic-action="crud_create"
                data-entity="order"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="font-medium">New Order</span>
              </Link>
              <Link
                href="/dashboard/menu/new"
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
                data-semantic-action="crud_create"
                data-entity="menuItem"
              >
                <UtensilsCrossed className="h-5 w-5" />
                <span className="font-medium">Add Menu Item</span>
              </Link>
              <Link
                href="/dashboard/staff/new"
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
                data-semantic-action="crud_create"
                data-entity="staff"
              >
                <Users className="h-5 w-5" />
                <span className="font-medium">Add Staff</span>
              </Link>
            </div>
          </div>
          
          {/* Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-50">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Today's Performance</p>
                <p className="font-semibold text-slate-800">{todayOrders.length} orders</p>
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((todayOrders.length / 50) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Target: 50 orders/day
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
