/**
 * Component Builder - Extensibility System
 * Dynamic component creation and customization
 */

'use client';

import React, { useState } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

// ========== COMPONENT BUILDER ==========
export interface ComponentDefinition {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: ComponentDefinition[];
  style?: React.CSSProperties;
}

export function ComponentBuilder({
  id,
  availableComponents,
  onSave,
}: {
  id: string;
  availableComponents: Array<{
    type: string;
    label: string;
    icon: string;
    defaultProps: Record<string, any>;
  }>;
  onSave: (definition: ComponentDefinition) => void;
}) {
  const { track } = useEventTracking('ComponentBuilder', id);
  const [canvas, setCanvas] = useState<ComponentDefinition[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const addComponent = (type: string) => {
    const component = availableComponents.find((c) => c.type === type);
    if (!component) return;

    const newComponent: ComponentDefinition = {
      id: `${type}-${Date.now()}`,
      type,
      props: { ...component.defaultProps },
    };

    track('add_component', type);
    setCanvas([...canvas, newComponent]);
  };

  const removeComponent = (componentId: string) => {
    track('remove_component', componentId);
    setCanvas(canvas.filter((c) => c.id !== componentId));
    if (selected === componentId) setSelected(null);
  };

  const updateComponent = (componentId: string, props: Record<string, any>) => {
    track('update_component', componentId);
    setCanvas(
      canvas.map((c) =>
        c.id === componentId ? { ...c, props: { ...c.props, ...props } } : c
      )
    );
  };

  const handleSave = () => {
    track('save_layout', null, { componentCount: canvas.length });
    const root: ComponentDefinition = {
      id: 'root',
      type: 'Container',
      props: {},
      children: canvas,
    };
    onSave(root);
  };

  const selectedComponent = canvas.find((c) => c.id === selected);

  return (
    <div className="bg-white rounded-lg shadow-md h-screen flex">
      {/* Component Palette */}
      <div className="w-64 border-r p-4 overflow-y-auto">
        <h3 className="font-semibold mb-4">Components</h3>
        <div className="space-y-2">
          {availableComponents.map((component) => (
            <button
              key={component.type}
              onClick={() => addComponent(component.type)}
              className="w-full p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="text-2xl mb-1">{component.icon}</div>
              <div className="font-medium text-sm">{component.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="font-semibold">Canvas</h3>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Layout
          </button>
        </div>

        {canvas.length === 0 ? (
          <div className="h-96 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400">
            Drag components here to start building
          </div>
        ) : (
          <div className="space-y-2">
            {canvas.map((component) => (
              <div
                key={component.id}
                onClick={() => setSelected(component.id)}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selected === component.id ? 'border-blue-500 bg-blue-50' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{component.type}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeComponent(component.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {Object.keys(component.props).length} properties
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Properties Panel */}
      {selectedComponent && (
        <div className="w-80 border-l p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Properties</h3>
          <div className="space-y-4">
            {Object.entries(selectedComponent.props).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {key}
                </label>
                {typeof value === 'boolean' ? (
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      updateComponent(selectedComponent.id, {
                        [key]: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                ) : typeof value === 'number' ? (
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      updateComponent(selectedComponent.id, {
                        [key]: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      updateComponent(selectedComponent.id, {
                        [key]: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ========== TEMPLATE GALLERY ==========
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  components: ComponentDefinition;
}

export function TemplateGallery({
  id,
  templates,
  onUseTemplate,
}: {
  id: string;
  templates: Template[];
  onUseTemplate: (template: Template) => void;
}) {
  const { track } = useEventTracking('TemplateGallery', id);
  const [filter, setFilter] = useState<string>('all');

  const categories = Array.from(new Set(templates.map((t) => t.category)));
  const filteredTemplates =
    filter === 'all' ? templates : templates.filter((t) => t.category === filter);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Template Gallery</h2>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
            filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              filter === category ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="border rounded-lg overflow-hidden hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => {
              track('select_template', template.id);
              onUseTemplate(template);
            }}
          >
            <div className="aspect-video bg-gray-100 flex items-center justify-center text-4xl">
              {template.thumbnail}
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1">{template.name}</h3>
              <p className="text-sm text-gray-600">{template.description}</p>
              <button className="mt-3 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== DYNAMIC FORM BUILDER ==========
export interface BuilderFormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'textarea';
  label: string;
  required: boolean;
  options?: string[];
  validation?: Record<string, any>;
}

export function DynamicFormBuilder({
  id,
  onSave,
}: {
  id: string;
  onSave: (fields: BuilderFormField[]) => void;
}) {
  const { track } = useEventTracking('DynamicFormBuilder', id);
  const [fields, setFields] = useState<BuilderFormField[]>([]);
  const [editingField, setEditingField] = useState<BuilderFormField | null>(null);

  const addField = (type: BuilderFormField['type']) => {
    const newField: BuilderFormField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${type} field`,
      required: false,
    };

    track('add_field', type);
    setFields([...fields, newField]);
    setEditingField(newField);
  };

  const updateField = (fieldId: string, updates: Partial<BuilderFormField>) => {
    setFields(fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)));
  };

  const removeField = (fieldId: string) => {
    track('remove_field', fieldId);
    setFields(fields.filter((f) => f.id !== fieldId));
    if (editingField?.id === fieldId) setEditingField(null);
  };

  const handleSave = () => {
    track('save_form', null, { fieldCount: fields.length });
    onSave(fields);
  };

  const fieldTypes: BuilderFormField['type'][] = [
    'text',
    'email',
    'number',
    'select',
    'checkbox',
    'textarea',
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 grid grid-cols-3 gap-6">
      {/* Field Types */}
      <div>
        <h3 className="font-semibold mb-4">Field Types</h3>
        <div className="space-y-2">
          {fieldTypes.map((type) => (
            <button
              key={type}
              onClick={() => addField(type)}
              className="w-full p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left capitalize"
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Form Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Form Preview</h3>
          <button
            onClick={handleSave}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>

        {fields.length === 0 ? (
          <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-400">
            Add fields to build your form
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field) => (
              <div
                key={field.id}
                onClick={() => setEditingField(field)}
                className={`p-3 border rounded cursor-pointer ${
                  editingField?.id === field.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeField(field.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>

                {field.type === 'select' ? (
                  <select className="w-full px-3 py-2 border rounded" disabled>
                    <option>Select option...</option>
                  </select>
                ) : field.type === 'checkbox' ? (
                  <input type="checkbox" disabled />
                ) : field.type === 'textarea' ? (
                  <textarea className="w-full px-3 py-2 border rounded" rows={3} disabled />
                ) : (
                  <input
                    type={field.type}
                    className="w-full px-3 py-2 border rounded"
                    placeholder={`Enter ${field.type}...`}
                    disabled
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Field Properties */}
      {editingField && (
        <div>
          <h3 className="font-semibold mb-4">Field Properties</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Label</label>
              <input
                type="text"
                value={editingField.label}
                onChange={(e) =>
                  updateField(editingField.id, { label: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingField.required}
                  onChange={(e) =>
                    updateField(editingField.id, { required: e.target.checked })
                  }
                />
                <span className="text-sm font-medium">Required</span>
              </label>
            </div>

            {editingField.type === 'select' && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Options (comma-separated)
                </label>
                <textarea
                  value={editingField.options?.join(', ') || ''}
                  onChange={(e) =>
                    updateField(editingField.id, {
                      options: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
