/**
 * Search and Filter Components
 * Search bars, advanced filters, faceted search
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

// ========== SEARCH BAR ==========
export function SearchBar({
  id,
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
}: {
  id: string;
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
}) {
  const { track } = useEventTracking('SearchBar', id);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        track('search', query, { queryLength: query.length });
        onSearch(query);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, onSearch, track]);

  const handleClear = () => {
    track('clear', null);
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ========== FILTER PANEL ==========
export interface FilterOption {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'select';
  options?: Array<{ value: string; label: string; count?: number }>;
  min?: number;
  max?: number;
  value?: any;
}

export function FilterPanel({
  id,
  filters,
  onFilterChange,
  onReset,
}: {
  id: string;
  filters: FilterOption[];
  onFilterChange: (filterId: string, value: any) => void;
  onReset: () => void;
}) {
  const { track } = useEventTracking('FilterPanel', id);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});

  const handleFilterChange = (filterId: string, value: any) => {
    track('filter_change', filterId, { value });

    setSelectedFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }));

    onFilterChange(filterId, value);
  };

  const handleReset = () => {
    track('reset', null);
    setSelectedFilters({});
    onReset();
  };

  const renderFilter = (filter: FilterOption) => {
    switch (filter.type) {
      case 'checkbox':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFilters[filter.id]?.includes(option.value) || false}
                  onChange={(e) => {
                    const current = selectedFilters[filter.id] || [];
                    const next = e.target.checked
                      ? [...current, option.value]
                      : current.filter((v: string) => v !== option.value);
                    handleFilterChange(filter.id, next);
                  }}
                  className="rounded"
                />
                <span className="text-sm">{option.label}</span>
                {option.count !== undefined && (
                  <span className="text-xs text-gray-500">({option.count})</span>
                )}
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={filter.id}
                  checked={selectedFilters[filter.id] === option.value}
                  onChange={() => handleFilterChange(filter.id, option.value)}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'range':
        return (
          <div>
            <input
              type="range"
              min={filter.min}
              max={filter.max}
              value={selectedFilters[filter.id] || filter.min}
              onChange={(e) => handleFilterChange(filter.id, Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{filter.min}</span>
              <span className="font-medium">{selectedFilters[filter.id] || filter.min}</span>
              <span>{filter.max}</span>
            </div>
          </div>
        );

      case 'select':
        return (
          <select
            value={selectedFilters[filter.id] || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">All</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Filters</h3>
        <button
          onClick={handleReset}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-4">
        {filters.map((filter) => (
          <div key={filter.id} className="border-b pb-4 last:border-b-0">
            <h4 className="font-medium mb-2">{filter.label}</h4>
            {renderFilter(filter)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== AUTOCOMPLETE SEARCH ==========
export function AutocompleteSearch({
  id,
  placeholder = 'Search...',
  suggestions,
  onSearch,
  onSelect,
}: {
  id: string;
  placeholder?: string;
  suggestions: Array<{ id: string; label: string; metadata?: any }>;
  onSearch: (query: string) => void;
  onSelect: (item: any) => void;
}) {
  const { track } = useEventTracking('AutocompleteSearch', id);
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowSuggestions(true);
    onSearch(value);
    track('type', value, { length: value.length });
  };

  const handleSelect = (item: any) => {
    track('select', item.id);
    setQuery(item.label);
    setShowSuggestions(false);
    onSelect(item);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ========== FACETED SEARCH ==========
export function FacetedSearch({
  id,
  facets,
  onFacetChange,
}: {
  id: string;
  facets: Array<{
    id: string;
    label: string;
    values: Array<{ value: string; label: string; count: number }>;
  }>;
  onFacetChange: (facetId: string, values: string[]) => void;
}) {
  const { track } = useEventTracking('FacetedSearch', id);
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const toggleValue = (facetId: string, value: string) => {
    track('toggle_facet', facetId, { value });

    setSelected((prev) => {
      const current = prev[facetId] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      const updated = { ...prev, [facetId]: next };
      onFacetChange(facetId, next);
      return updated;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold mb-4">Refine Results</h3>

      <div className="space-y-4">
        {facets.map((facet) => (
          <div key={facet.id}>
            <h4 className="font-medium mb-2">{facet.label}</h4>
            <div className="space-y-1">
              {facet.values.map((item) => (
                <label
                  key={item.value}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected[facet.id]?.includes(item.value) || false}
                      onChange={() => toggleValue(facet.id, item.value)}
                      className="rounded"
                    />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="text-xs text-gray-500">{item.count}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
