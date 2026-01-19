/**
 * Component Showcase - Live preview of selected components
 * Allows users to interact with components and add them to projects
 */

'use client';

import React, { useState } from 'react';
import { COMPONENT_CATALOG, ComponentInfo } from './ComponentSelector';

// Import all components
import * as UniversalComponents from './universal';

interface ComponentShowcaseProps {
  onComponentAdd?: (component: ComponentInfo) => void;
}

export const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({ onComponentAdd }) => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null);
  const [addedComponents, setAddedComponents] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const getComponentExample = (componentName: string) => {
    const examples: Record<string, React.ReactNode> = {
      Button: (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <UniversalComponents.Button id="demo-btn-1" variant="primary">Primary</UniversalComponents.Button>
            <UniversalComponents.Button id="demo-btn-2" variant="secondary">Secondary</UniversalComponents.Button>
            <UniversalComponents.Button id="demo-btn-3" variant="success">Success</UniversalComponents.Button>
            <UniversalComponents.Button id="demo-btn-4" variant="danger">Danger</UniversalComponents.Button>
          </div>
        </div>
      ),
      Modal: (
        <div className="relative p-8 bg-gray-100 rounded-lg">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto">
            <h3 className="text-lg font-bold mb-2">Modal Title</h3>
            <p className="text-gray-600 mb-4">This is a modal dialog component for displaying content.</p>
            <div className="flex gap-2 justify-end">
              <button className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      ),
      Alert: (
        <div className="space-y-3">
          <UniversalComponents.Alert id="demo-alert-1" type="success" message="Success! Your action completed successfully." />
          <UniversalComponents.Alert id="demo-alert-2" type="error" message="Error: Something went wrong." />
          <UniversalComponents.Alert id="demo-alert-3" type="warning" message="Warning: Please check your input." />
          <UniversalComponents.Alert id="demo-alert-4" type="info" message="Info: Here's some helpful information." />
        </div>
      ),
      Input: (
        <div className="space-y-3 max-w-md">
          <input type="text" placeholder="Enter your name" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="password" placeholder="Enter password" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>
      ),
      Card: (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-sm">
          <div className="text-4xl mb-3">🎨</div>
          <h3 className="text-lg font-bold mb-2">Card Title</h3>
          <p className="text-gray-600 mb-4">Card component for displaying content in a contained format.</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Learn More</button>
        </div>
      ),
      Navbar: (
        <div className="bg-gray-900 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">Logo</div>
            <div className="flex gap-6">
              <a className="hover:text-blue-400">Home</a>
              <a className="hover:text-blue-400">About</a>
              <a className="hover:text-blue-400">Contact</a>
            </div>
          </div>
        </div>
      ),
      Table: (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-b">John Doe</td>
                <td className="px-4 py-2 border-b">john@example.com</td>
                <td className="px-4 py-2 border-b"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span></td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Jane Smith</td>
                <td className="px-4 py-2 border-b">jane@example.com</td>
                <td className="px-4 py-2 border-b"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
      Tabs: (
        <div className="max-w-2xl">
          <div className="border-b border-gray-300 flex gap-4 mb-4">
            <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium">Tab 1</button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Tab 2</button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Tab 3</button>
          </div>
          <div className="p-4 bg-gray-50 rounded">Content for selected tab</div>
        </div>
      ),
      Dropdown: (
        <div className="relative inline-block">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2">
            Select Option
            <span>▼</span>
          </button>
        </div>
      ),
    };

    return examples[componentName] || (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <div className="text-6xl mb-3">🧩</div>
        <div className="text-sm">Component preview coming soon</div>
      </div>
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

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(COMPONENT_CATALOG.map(c => c.category)))];

  // Filter components by category
  const filteredComponents = selectedCategory === 'All'
    ? COMPONENT_CATALOG
    : COMPONENT_CATALOG.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-6">
      {!selectedComponent ? (
        <>
          {/* Category Filter */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-bold mb-3">Filter by Category</h2>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Component List */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                {selectedCategory === 'All' ? 'All Components' : selectedCategory}
                <span className="ml-2 text-sm text-gray-500">({filteredComponents.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredComponents.map((component) => (
                <button
                  key={component.name}
                  onClick={() => setSelectedComponent(component)}
                  className="text-left p-4 border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">
                      {component.name}
                    </h3>
                    {addedComponents.includes(component.name) && (
                      <span className="text-green-600 text-xs">✓</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {component.description}
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    {component.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {tag}
                      </span>
                    ))}
                    {component.tags.length > 2 && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        +{component.tags.length - 2}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
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
