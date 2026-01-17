'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useRestaurantStore } from '../../../store/restaurantStore';
import { useInstrumentation } from '../../../hooks/useInstrumentation';
import type { MenuItem, MenuCategory } from '../../../types/restaurant';

type SortField = 'name' | 'price' | 'category' | 'preparationTime';
type SortDirection = 'asc' | 'desc';

export default function MenuPage() {
  const { menuItems, deleteMenuItem } = useRestaurantStore();
  const { trackListView, trackFilter, trackSort, trackDelete, trackClick } = useInstrumentation({
    componentName: 'MenuList',
    entityType: 'MenuItem',
  });
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<MenuCategory | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Filter and sort items
  const filteredItems = useMemo(() => {
    let items = [...menuItems];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      items = items.filter((item) => item.category === categoryFilter);
    }
    
    // Sort
    items.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'preparationTime':
          comparison = a.preparationTime - b.preparationTime;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return items;
  }, [menuItems, searchQuery, categoryFilter, sortField, sortDirection]);
  
  // Track list view on mount and filter changes
  React.useEffect(() => {
    trackListView(filteredItems, { search: searchQuery, category: categoryFilter });
  }, [filteredItems, searchQuery, categoryFilter, trackListView]);
  
  // Handlers
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    trackFilter({ search: value, category: categoryFilter });
  };
  
  const handleCategoryChange = (category: MenuCategory | 'all') => {
    setCategoryFilter(category);
    trackFilter({ search: searchQuery, category });
  };
  
  const handleSort = (field: SortField) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    trackSort(field, newDirection);
  };
  
  const handleDelete = (item: MenuItem) => {
    trackDelete(item.id, item);
    deleteMenuItem(item.id);
    setShowDeleteConfirm(null);
  };
  
  const categories: { value: MenuCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'appetizer', label: 'Appetizers' },
    { value: 'main_course', label: 'Main Course' },
    { value: 'dessert', label: 'Desserts' },
    { value: 'beverage', label: 'Beverages' },
    { value: 'side', label: 'Sides' },
    { value: 'special', label: 'Specials' },
  ];
  
  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      className="px-4 py-3 text-left text-sm font-medium text-slate-600 cursor-pointer hover:bg-slate-100"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </th>
  );
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Menu Items</h2>
          <p className="text-slate-500 mt-1">Manage your restaurant menu</p>
        </div>
        <Link
          href="/dashboard/menu/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          onClick={(e) => trackClick(e.currentTarget, 'crud_create', 'create', 'Create new menu item')}
          data-semantic-action="crud_create"
          data-entity="MenuItem"
        >
          <Plus className="h-5 w-5" />
          Add Menu Item
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              data-semantic-action="search"
              data-entity="MenuItem"
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value as MenuCategory | 'all')}
              className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              data-semantic-action="filter"
              data-entity="MenuItem"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">No menu items found</h3>
            <p className="text-slate-500 mt-1">
              {menuItems.length === 0
                ? 'Get started by adding your first menu item'
                : 'Try adjusting your search or filters'}
            </p>
            {menuItems.length === 0 && (
              <Link
                href="/dashboard/menu/new"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-5 w-5" />
                Add Menu Item
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <SortHeader field="name" label="Name" />
                <SortHeader field="category" label="Category" />
                <SortHeader field="price" label="Price" />
                <SortHeader field="preparationTime" label="Prep Time" />
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-slate-800">{item.name}</p>
                      <p className="text-sm text-slate-500 truncate max-w-xs">
                        {item.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 capitalize">
                      {item.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-800">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {item.preparationTime} min
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.isAvailable
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/menu/${item.id}`}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                        title="View"
                        data-semantic-action="crud_read"
                        data-entity="MenuItem"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/dashboard/menu/${item.id}/edit`}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                        title="Edit"
                        data-semantic-action="crud_update"
                        data-entity="MenuItem"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setShowDeleteConfirm(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                        data-semantic-action="crud_delete"
                        data-entity="MenuItem"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Delete Confirmation */}
                    {showDeleteConfirm === item.id && (
                      <div className="absolute right-4 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 p-4 z-10">
                        <p className="text-sm text-slate-600 mb-3">
                          Delete "{item.name}"?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Summary */}
      {filteredItems.length > 0 && (
        <div className="text-sm text-slate-500 text-center">
          Showing {filteredItems.length} of {menuItems.length} items
        </div>
      )}
    </div>
  );
}
