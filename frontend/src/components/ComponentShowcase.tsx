/**
 * Component Showcase - Live preview of selected components
 * Allows users to interact with components and add them to projects
 */

'use client';

import React, { useState } from 'react';
import { ComponentSelector, COMPONENT_CATALOG, ComponentInfo } from './ComponentSelector';

// Import all components
import * as UniversalComponents from './universal';

interface ComponentShowcaseProps {
  onComponentAdd?: (component: ComponentInfo) => void;
}

export const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({ onComponentAdd }) => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null);
  const [addedComponents, setAddedComponents] = useState<string[]>([]);

  const getComponentExample = (componentName: string) => {
    const examples: Record<string, React.ReactNode> = {
      Button: (
        <div className="flex gap-2 flex-wrap">
          <UniversalComponents.Button id="demo-btn-1" variant="primary">Primary</UniversalComponents.Button>
          <UniversalComponents.Button id="demo-btn-2" variant="secondary">Secondary</UniversalComponents.Button>
          <UniversalComponents.Button id="demo-btn-3" variant="success">Success</UniversalComponents.Button>
        </div>
      ),
      Modal: (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center text-sm text-gray-600">
          <div className="text-4xl mb-2">🪟</div>
          Modal Dialog Component
        </div>
      ),
      Alert: (
        <div className="space-y-2">
          <UniversalComponents.Alert id="demo-alert-1" type="success" message="Success message" />
          <UniversalComponents.Alert id="demo-alert-2" type="error" message="Error message" />
        </div>
      ),
    };

    return examples[componentName] || (
      <div className="text-gray-400 text-center py-4 text-sm">Preview not available</div>
    );
  };

  const handleAddComponent = (component: ComponentInfo) => {
    if (!addedComponents.includes(component.name)) {
      setAddedComponents([...addedComponents, component.name]);
      if (onComponentAdd) {
        onComponentAdd(component);
      }
      alert(`${component.name} added to your project!`);
    } else {
      alert(`${component.name} is already in your project.`);
    }
  };

  return (
    <div className="space-y-6">
      {!selectedComponent ? (
        <>
          {/* Component Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPONENT_CATALOG.map((component) => (
              <div
                key={component.name}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedComponent(component)}
              >
                {/* Component Preview */}
                <div className="p-4 bg-gray-50 border-b border-gray-200 min-h-32 flex items-center justify-center">
                  {getComponentExample(component.name)}
                </div>
                
                {/* Component Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{component.name}</h3>
                    {addedComponents.includes(component.name) && (
                      <span className="text-green-600 text-xs">✓ Added</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {component.description}
                  </p>
                  <div className="mt-3">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {component.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          {/* Back Button */}
          <button
            onClick={() => setSelectedComponent(null)}
            className="mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
          >
            ← Back to Components
          </button>

          {/* Component Detail View */}
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedComponent.name}</h2>
                  <p className="text-gray-600 mb-4">{selectedComponent.description}</p>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {selectedComponent.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleAddComponent(selectedComponent)}
                  disabled={addedComponents.includes(selectedComponent.name)}
                  className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap ${
                    addedComponents.includes(selectedComponent.name)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {addedComponents.includes(selectedComponent.name) ? '✓ Added' : '+ Add to Project'}
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="p-6 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
              <div className="bg-white rounded-lg border border-gray-200 p-8 min-h-48 flex items-center justify-center">
                {getComponentExample(selectedComponent.name)}
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Use Cases</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {selectedComponent.useCases.map((useCase, i) => (
                    <li key={i}>{useCase}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Available Props</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedComponent.props.map(prop => (
                    <code key={prop} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-mono">
                      {prop}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Added Components Summary */}
      {addedComponents.length > 0 && !selectedComponent && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">
            Components in Project ({addedComponents.length})
          </h3>
          <div className="flex gap-2 flex-wrap">
            {addedComponents.map(name => (
              <span key={name} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm">
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentShowcase;
