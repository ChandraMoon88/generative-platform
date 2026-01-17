'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  Users,
  Package,
  CalendarDays,
  BarChart3,
  Settings,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { useRestaurantStore } from '../../store/restaurantStore';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/tables', label: 'Tables', icon: CalendarDays },
  { href: '/dashboard/inventory', label: 'Inventory', icon: Package },
  { href: '/dashboard/staff', label: 'Staff', icon: Users },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const alerts = useRestaurantStore((state) => state.alerts);
  const unreadAlerts = alerts.filter((a) => !a.read).length;
  
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <UtensilsCrossed className="h-8 w-8 text-primary-600" />
          <span className="ml-3 text-xl font-bold text-slate-800">
            Restaurant
          </span>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 rounded-lg text-sm font-medium
                  transition-colors duration-150
                  ${isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
                data-semantic-action="navigation"
                data-pattern="navigation"
                data-target={item.href}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                <span className="ml-3">{item.label}</span>
                {isActive && (
                  <ChevronRight className="ml-auto h-4 w-4 text-primary-400" />
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* User section */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center px-4 py-3 rounded-lg bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 font-semibold">RM</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-700">Restaurant Manager</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold text-slate-800">
              {navItems.find((item) => 
                pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              )?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button 
              className="relative p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              data-semantic-action="view_alerts"
            >
              <Bell className="h-5 w-5" />
              {unreadAlerts > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadAlerts}
                </span>
              )}
            </button>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
