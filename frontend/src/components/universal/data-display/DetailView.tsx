/**
 * DetailView Component
 * Shows complete information about a single entity
 * Tracks property viewing and edit actions
 */

'use client';

import React, { useState } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

export interface DetailSection {
  title: string;
  fields: Array<{
    label: string;
    value: any;
    type?: 'text' | 'number' | 'date' | 'boolean' | 'link' | 'list' | 'image';
    link?: string;
    render?: (value: any) => React.ReactNode;
  }>;
}

export interface DetailViewProps {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  sections: DetailSection[];
  onEdit?: () => void;
  onDelete?: () => void;
  metadata?: {
    createdAt?: number;
    updatedAt?: number;
    createdBy?: string;
    updatedBy?: string;
  };
  relatedItems?: Array<{
    label: string;
    items: Array<{ id: string; name: string; link?: string }>;
  }>;
}

export function DetailView({
  id,
  title,
  subtitle,
  image,
  sections,
  onEdit,
  onDelete,
  metadata,
  relatedItems = [],
}: DetailViewProps) {
  const { track } = useEventTracking('DetailView', id);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  React.useEffect(() => {
    track('mount', null, { title, sectionCount: sections.length });
  }, []);

  const handleEdit = () => {
    track('edit_click', null);
    onEdit?.();
  };

  const handleDelete = () => {
    track('delete_click', null);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    track('delete_confirm', null);
    setShowDeleteConfirm(false);
    onDelete?.();
  };

  const formatValue = (value: any, type?: string) => {
    if (value === null || value === undefined) return '-';

    switch (type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'boolean':
        return value ? '✓ Yes' : '✗ No';
      case 'list':
        return Array.isArray(value) ? value.join(', ') : value;
      default:
        return String(value);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            {image && (
              <img src={image} alt={title} className="w-20 h-20 rounded-lg object-cover" />
            )}
            <div>
              <h1 className="text-2xl font-bold mb-1">{title}</h1>
              {subtitle && <p className="text-blue-100">{subtitle}</p>}
            </div>
          </div>

          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                ✏️ Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                🗑️ Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metadata */}
      {metadata && (
        <div className="px-6 py-3 bg-gray-50 border-b text-sm text-gray-600 flex gap-6">
          {metadata.createdAt && (
            <span>Created: {new Date(metadata.createdAt).toLocaleString()}</span>
          )}
          {metadata.updatedAt && (
            <span>Updated: {new Date(metadata.updatedAt).toLocaleString()}</span>
          )}
          {metadata.createdBy && <span>By: {metadata.createdBy}</span>}
        </div>
      )}

      {/* Sections */}
      <div className="p-6 space-y-6">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">
              {section.title}
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((field, fieldIndex) => (
                <div
                  key={fieldIndex}
                  onClick={() => track('field_view', field.label)}
                  className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <dt className="text-sm font-medium text-gray-500 mb-1">{field.label}</dt>
                  <dd className="text-gray-900">
                    {field.render ? (
                      field.render(field.value)
                    ) : field.type === 'link' ? (
                      <a
                        href={field.link}
                        onClick={(e) => {
                          e.stopPropagation();
                          track('link_click', field.label, { link: field.link });
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        {formatValue(field.value, field.type)}
                      </a>
                    ) : field.type === 'image' ? (
                      <img src={field.value} alt={field.label} className="w-32 h-32 object-cover rounded" />
                    ) : (
                      formatValue(field.value, field.type)
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}

        {/* Related Items */}
        {relatedItems.map((related, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">
              {related.label}
            </h2>
            <div className="space-y-2">
              {related.items.map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  onClick={() => track('related_click', item.name, { relationType: related.label })}
                  className="block p-3 hover:bg-gray-50 rounded transition-colors text-blue-600 hover:underline"
                >
                  {item.name} →
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
