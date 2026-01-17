'use client';

/**
 * Admin Layout
 * Layout for admin pages with navigation
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminNavItems = [
  { href: '/admin', label: 'Overview', icon: '📊' },
  { href: '/admin/events', label: 'Events', icon: '📡' },
  { href: '/admin/patterns', label: 'Patterns', icon: '🔍' },
  { href: '/admin/sessions', label: 'Sessions', icon: '👤' },
  { href: '/admin/models', label: 'Models', icon: '🏗️' },
  { href: '/admin/generate', label: 'Generate', icon: '⚡' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-xl font-bold text-purple-400">
                🛠️ Admin Panel
              </Link>
              <span className="text-gray-500">|</span>
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
                ← Back to Dashboard
              </Link>
            </div>
            <div className="text-sm text-gray-400">
              Generative Platform v1.0
            </div>
          </div>
        </div>
      </header>

      {/* Sub Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-purple-100 text-purple-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
