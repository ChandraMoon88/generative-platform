/**
 * Component Showcase - Live preview of selected components
 * Allows users to interact with components and see their code
 */

'use client';

import React, { useState } from 'react';
import { ComponentSelector, COMPONENT_CATALOG, ComponentInfo } from './ComponentSelector';

// Import all components
import * as UniversalComponents from './universal';

export const ComponentShowcase: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null);
  const [showCode, setShowCode] = useState(false);

  const getComponentExample = (componentName: string) => {
    const examples: Record<string, { component: React.ReactNode; code: string }> = {
      Button: {
        component: (
          <div className="flex gap-3">
            <UniversalComponents.Button id="demo-btn-1" variant="primary">
              Primary Button
            </UniversalComponents.Button>
            <UniversalComponents.Button id="demo-btn-2" variant="secondary">
              Secondary
            </UniversalComponents.Button>
            <UniversalComponents.Button id="demo-btn-3" variant="danger">
              Danger
            </UniversalComponents.Button>
            <UniversalComponents.Button id="demo-btn-4" variant="success">
              Success
            </UniversalComponents.Button>
          </div>
        ),
        code: `<Button id="btn-1" variant="primary">Primary</Button>
<Button id="btn-2" variant="secondary">Secondary</Button>
<Button id="btn-3" variant="danger">Danger</Button>
<Button id="btn-4" variant="success">Success</Button>`
      },
      Modal: {
        component: (
          <UniversalComponents.Modal
            id="demo-modal"
            isOpen={true}
            onClose={() => {}}
            title="Example Modal"
            size="md"
          >
            <p>This is a modal dialog example.</p>
          </UniversalComponents.Modal>
        ),
        code: `<Modal
  id="modal-1"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="My Modal"
  size="md"
>
  <p>Modal content goes here</p>
</Modal>`
      },
      Alert: {
        component: (
          <div className="space-y-3">
            <UniversalComponents.Alert id="demo-alert-1" type="success" message="Success! Your action completed." />
            <UniversalComponents.Alert id="demo-alert-2" type="error" message="Error: Something went wrong." />
            <UniversalComponents.Alert id="demo-alert-3" type="warning" message="Warning: Please check your input." />
            <UniversalComponents.Alert id="demo-alert-4" type="info" message="Info: Here's some information." />
          </div>
        ),
        code: `<Alert id="alert-1" type="success" message="Success!" />
<Alert id="alert-2" type="error" message="Error!" />
<Alert id="alert-3" type="warning" message="Warning!" />
<Alert id="alert-4" type="info" message="Info!" />`
      },
      // Badge: {
      //   component: (
      //     <div className="flex gap-3">
      //       <UniversalComponents.Badge id="demo-badge-1" content="New" variant="default" />
      //       <UniversalComponents.Badge id="demo-badge-2" content="5" variant="primary" />
      //       <UniversalComponents.Badge id="demo-badge-3" content="Sale" variant="success" />
      //       <UniversalComponents.Badge id="demo-badge-4" content="Hot" variant="danger" />
      //     </div>
      //   ),
      //   code: `<Badge id="badge-1" content="New" variant="default" />
// <Badge id="badge-2" content="5" variant="primary" />
// <Badge id="badge-3" content="Sale" variant="success" />
// <Badge id="badge-4" content="Hot" variant="danger" />`
      // },
      // ProgressBar: {
      //   component: (
      //     <div className="space-y-4">
      //       <UniversalComponents.ProgressBar id="demo-progress-1" value={25} max={100} showLabel />
      //       <UniversalComponents.ProgressBar id="demo-progress-2" value={50} max={100} showLabel variant="success" />
      //       <UniversalComponents.ProgressBar id="demo-progress-3" value={75} max={100} showLabel variant="warning" />
      //     </div>
      //   ),
      //   code: `<ProgressBar id="progress-1" value={25} max={100} showLabel />
// <ProgressBar id="progress-2" value={50} max={100} showLabel variant="success" />
// <ProgressBar id="progress-3" value={75} max={100} showLabel variant="warning" />`
      // },
    };

    return examples[componentName] || {
      component: <div className="text-gray-500 text-center py-8">Preview not available for this component yet.</div>,
      code: '// Code example coming soon'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!selectedComponent ? (
        <ComponentSelector onComponentSelect={setSelectedComponent} />
      ) : (
        <div className="max-w-7xl mx-auto p-6">
          {/* Back Button */}
          <button
            onClick={() => setSelectedComponent(null)}
            className="mb-6 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            ← Back to Component Library
          </button>

          {/* Component Header */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{selectedComponent.name}</h1>
                <p className="text-gray-600">{selectedComponent.description}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg">
                {selectedComponent.category}
              </span>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Tags:</h3>
              <div className="flex gap-2 flex-wrap">
                {selectedComponent.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Use Cases */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Common Use Cases:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {selectedComponent.useCases.map((useCase, i) => (
                  <li key={i}>{useCase}</li>
                ))}
              </ul>
            </div>

            {/* Props */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Available Props:</h3>
              <div className="flex gap-2 flex-wrap">
                {selectedComponent.props.map(prop => (
                  <code key={prop} className="px-3 py-1 bg-gray-800 text-green-400 rounded text-sm font-mono">
                    {prop}
                  </code>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold">Live Preview</h2>
              <button
                onClick={() => setShowCode(!showCode)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                {showCode ? 'Hide Code' : 'Show Code'}
              </button>
            </div>

            {!showCode && (
              <div className="p-8 bg-gray-50 min-h-64 flex items-center justify-center">
                {getComponentExample(selectedComponent.name).component}
              </div>
            )}

            {showCode && (
              <div className="p-4 bg-gray-900 text-white font-mono text-sm">
                <pre className="whitespace-pre-wrap">
                  <code>{getComponentExample(selectedComponent.name).code}</code>
                </pre>
              </div>
            )}
          </div>

          {/* Documentation */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Installation & Usage</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">1. Import the component:</h3>
                <code className="block p-3 bg-gray-900 text-green-400 rounded text-sm">
                  import {'{'} {selectedComponent.name} {'}'} from '@/components/universal';
                </code>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">2. Use in your JSX:</h3>
                <code className="block p-3 bg-gray-900 text-white rounded text-sm whitespace-pre">
                  {getComponentExample(selectedComponent.name).code}
                </code>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">3. Automatic Instrumentation:</h3>
                <p className="text-sm text-gray-700">
                  This component automatically tracks all user interactions. Every click, change, and interaction
                  is recorded to help the system learn patterns and generate better applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentShowcase;
