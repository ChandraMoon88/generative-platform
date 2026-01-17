/**
 * Universal CardGrid Component
 * Displays entities as visual cards in a responsive grid
 * Supports filtering, sorting, favoriting, quick view
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

export interface Card {
  id: string | number;
  image?: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  isFavorite?: boolean;
}

export interface CardGridProps {
  id: string;
  cards: Card[];
  onCardClick?: (card: Card) => void;
  onFavoriteToggle?: (card: Card, isFavorite: boolean) => void;
  size?: 'compact' | 'medium' | 'large';
  columns?: 2 | 3 | 4 | 6;
  sortOptions?: Array<{
    label: string;
    value: string;
    compare: (a: Card, b: Card) => number;
  }>;
  filterOptions?: Array<{
    label: string;
    value: string;
    predicate: (card: Card) => boolean;
  }>;
  quickViewRender?: (card: Card) => React.ReactNode;
}

export function CardGrid({
  id,
  cards,
  onCardClick,
  onFavoriteToggle,
  size = 'medium',
  columns = 3,
  sortOptions = [],
  filterOptions = [],
  quickViewRender,
}: CardGridProps) {
  const { track } = useEventTracking('CardGrid', id);
  const [selectedSort, setSelectedSort] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [quickViewCard, setQuickViewCard] = useState<Card | null>(null);

  // Track mount
  React.useEffect(() => {
    track('mount', null, {
      cardCount: cards.length,
      size,
      columns,
    });
  }, []);

  // Apply filters and sort
  const processedCards = useMemo(() => {
    let result = [...cards];

    // Apply filters
    if (selectedFilters.size > 0) {
      filterOptions.forEach((filterOption) => {
        if (selectedFilters.has(filterOption.value)) {
          result = result.filter(filterOption.predicate);
        }
      });
    }

    // Apply sort
    if (selectedSort) {
      const sortOption = sortOptions.find((opt) => opt.value === selectedSort);
      if (sortOption) {
        result.sort(sortOption.compare);
      }
    }

    return result;
  }, [cards, selectedFilters, selectedSort, filterOptions, sortOptions]);

  // Handle sort change
  const handleSortChange = (value: string) => {
    track('sort', value);
    setSelectedSort(value);
  };

  // Handle filter toggle
  const handleFilterToggle = (value: string) => {
    track('filter_toggle', value);
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(value)) {
      newFilters.delete(value);
    } else {
      newFilters.add(value);
    }
    setSelectedFilters(newFilters);
  };

  // Handle card click
  const handleCardClick = (card: Card) => {
    track('card_click', card.id, { title: card.title });
    onCardClick?.(card);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (e: React.MouseEvent, card: Card) => {
    e.stopPropagation();
    const newFavorite = !card.isFavorite;
    track('favorite_toggle', card.id, { isFavorite: newFavorite });
    onFavoriteToggle?.(card, newFavorite);
  };

  // Handle quick view
  const handleQuickView = (e: React.MouseEvent, card: Card) => {
    e.stopPropagation();
    track('quick_view', card.id);
    setQuickViewCard(card);
  };

  const cardSizeClasses = {
    compact: 'h-32',
    medium: 'h-64',
    large: 'h-96',
  }[size];

  const gridColsClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  }[columns];

  return (
    <div className="w-full">
      {/* Controls */}
      {(sortOptions.length > 0 || filterOptions.length > 0) && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-md flex flex-wrap gap-4 items-center">
          {/* Sort */}
          {sortOptions.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={selectedSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="">Default</option>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filters */}
          {filterOptions.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <label className="text-sm font-medium text-gray-700">Filters:</label>
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterToggle(option.value)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    selectedFilters.has(option.value)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {/* Results count */}
          <div className="ml-auto text-sm text-gray-600">
            {processedCards.length} card{processedCards.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className={`grid ${gridColsClass} gap-4`}>
        {processedCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`${cardSizeClasses} bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1`}
          >
            {/* Image/Icon */}
            <div className="h-2/3 relative bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
              {card.image ? (
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              ) : card.icon ? (
                <div className="text-4xl text-blue-500">{card.icon}</div>
              ) : (
                <div className="text-2xl text-gray-400">📦</div>
              )}

              {/* Favorite button */}
              {onFavoriteToggle && (
                <button
                  onClick={(e) => handleFavoriteToggle(e, card)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  {card.isFavorite ? (
                    <span className="text-red-500">❤️</span>
                  ) : (
                    <span className="text-gray-400">🤍</span>
                  )}
                </button>
              )}

              {/* Quick view button */}
              {quickViewRender && (
                <button
                  onClick={(e) => handleQuickView(e, card)}
                  className="absolute top-2 left-2 px-2 py-1 bg-white rounded shadow-md text-xs hover:bg-gray-100 transition-colors"
                >
                  Quick View
                </button>
              )}
            </div>

            {/* Content */}
            <div className="h-1/3 p-3 flex flex-col">
              <h3 className="font-semibold text-gray-900 truncate mb-1">
                {card.title}
              </h3>
              {card.description && (
                <p className="text-xs text-gray-600 line-clamp-2 mb-2 flex-1">
                  {card.description}
                </p>
              )}

              {/* Metadata */}
              {card.metadata && Object.keys(card.metadata).length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  {Object.entries(card.metadata).slice(0, 2).map(([key, value]) => (
                    <span key={key} className="flex items-center gap-1">
                      <span className="font-medium">{key}:</span>
                      <span>{String(value)}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {processedCards.length === 0 && (
        <div className="p-12 bg-white rounded-lg shadow-md text-center text-gray-500">
          <div className="text-4xl mb-4">📭</div>
          <p>No cards to display</p>
        </div>
      )}

      {/* Quick view modal */}
      {quickViewCard && quickViewRender && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            track('quick_view_close', quickViewCard.id);
            setQuickViewCard(null);
          }}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">{quickViewCard.title}</h2>
              <button
                onClick={() => setQuickViewCard(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">{quickViewRender(quickViewCard)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
