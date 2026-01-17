/**
 * Navigation Components
 * Navbar, Sidebar, Breadcrumbs, Tabs
 * Tracks all navigation patterns
 */

'use client';

import React, { useState } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

// ========== NAVBAR ==========
export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  link?: string;
  onClick?: () => void;
  badge?: number | string;
  children?: NavItem[];
}

export interface NavbarProps {
  id: string;
  logo?: React.ReactNode;
  items: NavItem[];
  rightItems?: React.ReactNode;
  sticky?: boolean;
}

export function Navbar({ id, logo, items, rightItems, sticky = true }: NavbarProps) {
  const { track } = useEventTracking('Navbar', id);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleItemClick = (item: NavItem) => {
    track('nav_click', item.id, { label: item.label });
    item.onClick?.();
  };

  return (
    <nav className={`bg-white shadow-md ${sticky ? 'sticky top-0 z-50' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            {logo && <div className="flex-shrink-0">{logo}</div>}

            <div className="hidden md:flex gap-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center gap-2"
                >
                  {item.icon}
                  {item.label}
                  {item.badge && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {rightItems}

            <button
              onClick={() => {
                track('mobile_menu_toggle', !mobileOpen);
                setMobileOpen(!mobileOpen);
              }}
              className="md:hidden p-2"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  handleItemClick(item);
                  setMobileOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

// ========== SIDEBAR ==========
export interface SidebarProps {
  id: string;
  items: NavItem[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function Sidebar({ id, items, collapsible = true, defaultCollapsed = false }: SidebarProps) {
  const { track } = useEventTracking('Sidebar', id);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleItemClick = (item: NavItem) => {
    track('nav_click', item.id, { label: item.label, hasChildren: !!item.children });

    if (item.children) {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(item.id)) {
        newExpanded.delete(item.id);
      } else {
        newExpanded.add(item.id);
      }
      setExpandedItems(newExpanded);
    } else {
      item.onClick?.();
    }
  };

  const renderItem = (item: NavItem, level = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          className={`w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-gray-100 transition-colors ${
            level > 0 ? 'pl-8' : ''
          }`}
          style={{ paddingLeft: `${1 + level * 1.5}rem` }}
        >
          {item.icon && <span className="text-xl">{item.icon}</span>}
          {!collapsed && (
            <>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
              {hasChildren && <span>{isExpanded ? '▼' : '▶'}</span>}
            </>
          )}
        </button>

        {!collapsed && hasChildren && isExpanded && (
          <div>
            {item.children!.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white shadow-md h-full flex flex-col transition-all ${collapsed ? 'w-16' : 'w-64'}`}>
      {collapsible && (
        <button
          onClick={() => {
            track('collapse_toggle', !collapsed);
            setCollapsed(!collapsed);
          }}
          className="p-4 border-b hover:bg-gray-50 transition-colors"
        >
          {collapsed ? '☰' : '←'}
        </button>
      )}

      <div className="flex-1 overflow-y-auto">
        {items.map((item) => renderItem(item))}
      </div>
    </div>
  );
}

// ========== BREADCRUMBS ==========
export interface BreadcrumbItem {
  label: string;
  link?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  id: string;
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

export function Breadcrumbs({ id, items, separator = '/' }: BreadcrumbsProps) {
  const { track } = useEventTracking('Breadcrumbs', id);

  const handleClick = (item: BreadcrumbItem, index: number) => {
    track('breadcrumb_click', index, { label: item.label });
    item.onClick?.();
  };

  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-400">{separator}</span>}
          {index === items.length - 1 ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : (
            <button
              onClick={() => handleClick(item, index)}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// ========== TABS ==========
export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

export interface TabsProps {
  id: string;
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'line' | 'enclosed' | 'pills';
  onChange?: (tabId: string) => void;
}

export function Tabs({ id, tabs, defaultTab, variant = 'line', onChange }: TabsProps) {
  const { track } = useEventTracking('Tabs', id);
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    track('tab_change', tabId);
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabData = tabs.find((t) => t.id === activeTab);

  const tabClasses = {
    line: (isActive: boolean) =>
      `px-4 py-2 border-b-2 transition-colors ${
        isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
      }`,
    enclosed: (isActive: boolean) =>
      `px-4 py-2 border rounded-t transition-colors ${
        isActive
          ? 'bg-white border-gray-300 border-b-white text-blue-600 -mb-px'
          : 'bg-gray-100 border-transparent text-gray-600 hover:text-gray-900'
      }`,
    pills: (isActive: boolean) =>
      `px-4 py-2 rounded-full transition-colors ${
        isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`,
  };

  return (
    <div className="w-full">
      <div className={`flex gap-2 ${variant === 'line' ? 'border-b' : ''}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={`${tabClasses[variant](activeTab === tab.id)} ${
              tab.disabled ? 'opacity-50 cursor-not-allowed' : ''
            } flex items-center gap-2`}
          >
            {tab.icon}
            {tab.label}
            {tab.badge && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTabData?.content}
      </div>
    </div>
  );
}

// ========== PAGINATION ==========
export interface PaginationProps {
  id: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisible?: number;
}

export function Pagination({
  id,
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisible = 5,
}: PaginationProps) {
  const { track } = useEventTracking('Pagination', id);

  const handlePageChange = (page: number) => {
    track('page_change', page, { from: currentPage, to: page });
    onPageChange(page);
  };

  const getVisiblePages = () => {
    const pages: number[] = [];
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center gap-2">
      {showFirstLast && currentPage > 1 && (
        <button
          onClick={() => handlePageChange(1)}
          className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors"
        >
          ««
        </button>
      )}

      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ‹ Previous
      </button>

      {getVisiblePages().map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-1 rounded transition-colors ${
            page === currentPage
              ? 'bg-blue-500 text-white'
              : 'border hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next ›
      </button>

      {showFirstLast && currentPage < totalPages && (
        <button
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors"
        >
          »»
        </button>
      )}
    </div>
  );
}
