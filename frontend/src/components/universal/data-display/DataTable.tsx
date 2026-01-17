/**
 * Universal DataTable Component
 * Displays tabular data with sorting, filtering, pagination, and selection
 * Tracks all user interactions for pattern learning
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

export interface Column<T = any> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => any);
  type?: 'text' | 'number' | 'date' | 'boolean' | 'enum';
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface DataTableProps<T = any> {
  id: string;
  data: T[];
  columns: Column<T>[];
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  onRowsSelected?: (rows: T[]) => void;
  rowActions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: (row: T) => void;
    variant?: 'default' | 'danger' | 'success';
  }>;
}

export function DataTable<T extends { id?: string | number }>({
  id,
  data,
  columns,
  selectable = false,
  pagination = false,
  pageSize = 10,
  onRowClick,
  onRowsSelected,
  rowActions = [],
}: DataTableProps<T>) {
  const { track } = useEventTracking('DataTable', id);

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((c) => c.id))
  );

  // Track component mount
  React.useEffect(() => {
    track('mount', null, {
      rowCount: data.length,
      columnCount: columns.length,
      hasSelection: selectable,
      hasPagination: pagination,
    });
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.entries(filters).forEach(([columnId, filterValue]) => {
      if (filterValue) {
        const column = columns.find((c) => c.id === columnId);
        if (column) {
          result = result.filter((row) => {
            const value = typeof column.accessor === 'function'
              ? column.accessor(row)
              : row[column.accessor];
            return String(value).toLowerCase().includes(filterValue.toLowerCase());
          });
        }
      }
    });

    return result;
  }, [data, filters, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData;

    const column = columns.find((c) => c.id === sortBy);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = typeof column.accessor === 'function'
        ? column.accessor(a)
        : a[column.accessor];
      const bValue = typeof column.accessor === 'function'
        ? column.accessor(b)
        : b[column.accessor];

      let comparison = 0;

      if (column.type === 'number') {
        comparison = Number(aValue) - Number(bValue);
      } else if (column.type === 'date') {
        comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortBy, sortOrder, columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sorting
  const handleSort = (columnId: string) => {
    track('sort', columnId, {
      previousSortBy: sortBy,
      previousSortOrder: sortOrder,
      newSortOrder: sortBy === columnId && sortOrder === 'asc' ? 'desc' : 'asc',
    });

    if (sortBy === columnId) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnId);
      setSortOrder('asc');
    }
  };

  // Handle filtering
  const handleFilter = (columnId: string, value: string) => {
    track('filter', columnId, { filterValue: value });
    setFilters((prev) => ({ ...prev, [columnId]: value }));
    setCurrentPage(1); // Reset to first page
  };

  // Handle row selection
  const handleRowSelect = (rowId: string | number) => {
    track('select_row', rowId);

    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);

    if (onRowsSelected) {
      const selected = data.filter((row) => newSelected.has(row.id!));
      onRowsSelected(selected);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    track('select_all', null, { currentlySelected: selectedRows.size });

    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      onRowsSelected?.([]);
    } else {
      const allIds = new Set(paginatedData.map((row) => row.id!));
      setSelectedRows(allIds);
      onRowsSelected?.(paginatedData);
    }
  };

  // Handle row click
  const handleRowClick = (row: T) => {
    track('row_click', row.id, { data: row });
    onRowClick?.(row);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    track('page_change', page, {
      previousPage: currentPage,
      totalPages,
    });
    setCurrentPage(page);
  };

  // Toggle column visibility
  const toggleColumn = (columnId: string) => {
    track('toggle_column', columnId, {
      visible: !visibleColumns.has(columnId),
    });

    const newVisible = new Set(visibleColumns);
    if (newVisible.has(columnId)) {
      newVisible.delete(columnId);
    } else {
      newVisible.add(columnId);
    }
    setVisibleColumns(newVisible);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Column visibility controls */}
      <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {columns.map((column) => (
            <button
              key={column.id}
              onClick={() => toggleColumn(column.id)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                visibleColumns.has(column.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {column.header}
            </button>
          ))}
        </div>

        {selectedRows.size > 0 && (
          <div className="text-sm text-gray-600">
            {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              {selectable && (
                <th className="p-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
              )}

              {columns
                .filter((col) => visibleColumns.has(col.id))
                .map((column) => (
                  <th
                    key={column.id}
                    className="p-3 text-left text-sm font-semibold text-gray-700"
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.header}</span>

                      {column.sortable !== false && (
                        <button
                          onClick={() => handleSort(column.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {sortBy === column.id ? (
                            sortOrder === 'asc' ? '↑' : '↓'
                          ) : (
                            '↕'
                          )}
                        </button>
                      )}
                    </div>

                    {column.filterable !== false && (
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={filters[column.id] || ''}
                        onChange={(e) => handleFilter(column.id, e.target.value)}
                        className="mt-1 w-full px-2 py-1 text-xs border rounded"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </th>
                ))}

              {rowActions.length > 0 && (
                <th className="p-3 text-left w-32">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y">
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => handleRowClick(row)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {selectable && (
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id!)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleRowSelect(row.id!);
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
                )}

                {columns
                  .filter((col) => visibleColumns.has(col.id))
                  .map((column) => {
                    const value = typeof column.accessor === 'function'
                      ? column.accessor(row)
                      : row[column.accessor];

                    return (
                      <td key={column.id} className="p-3 text-sm text-gray-900">
                        {column.render ? column.render(value, row) : String(value)}
                      </td>
                    );
                  })}

                {rowActions.length > 0 && (
                  <td className="p-3">
                    <div className="flex gap-2">
                      {rowActions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            track('row_action', action.label, { rowId: row.id });
                            action.onClick(row);
                          }}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            action.variant === 'danger'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : action.variant === 'success'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {action.icon} {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded transition-colors ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'border hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {paginatedData.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No data to display
        </div>
      )}
    </div>
  );
}
