/**
 * Organizational Components
 * Accordion, Tree View, Collapsible sections, Layouts
 */

'use client';

import React, { useState } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

// ========== ACCORDION ==========
export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export function Accordion({
  id,
  items,
  allowMultiple = false,
  defaultOpen = [],
}: {
  id: string;
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
}) {
  const { track } = useEventTracking('Accordion', id);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggleItem = (itemId: string) => {
    track('toggle', itemId, { action: openItems.has(itemId) ? 'close' : 'open' });

    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(itemId);
      }
      return next;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {items.map((item, index) => {
        const isOpen = openItems.has(item.id);

        return (
          <div key={item.id} className={index > 0 ? 'border-t' : ''}>
            <button
              onClick={() => !item.disabled && toggleItem(item.id)}
              disabled={item.disabled}
              className={`w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors ${
                item.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="font-medium">{item.title}</span>
              </div>
              <span className="text-gray-500 transition-transform" style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}>
                ▼
              </span>
            </button>

            {isOpen && (
              <div className="px-4 py-3 bg-gray-50 border-t">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ========== TREE VIEW ==========
export interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  metadata?: Record<string, any>;
}

export function TreeView({
  id,
  nodes,
  onNodeClick,
  onNodeExpand,
}: {
  id: string;
  nodes: TreeNode[];
  onNodeClick?: (node: TreeNode) => void;
  onNodeExpand?: (node: TreeNode, expanded: boolean) => void;
}) {
  const { track } = useEventTracking('TreeView', id);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (node: TreeNode) => {
    const isExpanded = expandedNodes.has(node.id);
    track('toggle_node', node.id, { action: isExpanded ? 'collapse' : 'expand' });

    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(node.id)) {
        next.delete(node.id);
      } else {
        next.add(node.id);
      }
      return next;
    });

    onNodeExpand?.(node, !isExpanded);
  };

  const handleNodeClick = (node: TreeNode) => {
    track('node_click', node.id);
    onNodeClick?.(node);
  };

  const renderNode = (node: TreeNode, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    return (
      <div key={node.id}>
        <div
          className="flex items-center gap-2 py-2 px-2 hover:bg-gray-100 cursor-pointer rounded"
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node);
              }}
              className="w-4 h-4 flex items-center justify-center text-gray-500"
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          {!hasChildren && <span className="w-4" />}

          <div
            onClick={() => handleNodeClick(node)}
            className="flex items-center gap-2 flex-1"
          >
            {node.icon}
            <span>{node.label}</span>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {nodes.map((node) => renderNode(node))}
    </div>
  );
}

// ========== COLLAPSIBLE SECTION ==========
export function CollapsibleSection({
  id,
  title,
  children,
  defaultOpen = true,
  badge,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
}) {
  const { track } = useEventTracking('CollapsibleSection', id);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => {
    track('toggle', null, { action: isOpen ? 'close' : 'open' });
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <button
        onClick={toggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{title}</h3>
          {badge}
        </div>
        <span className="text-gray-500 transition-transform" style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          ▼
        </span>
      </button>

      {isOpen && <div className="p-4 border-t">{children}</div>}
    </div>
  );
}

// ========== SPLIT PANE ==========
export function SplitPane({
  id,
  left,
  right,
  defaultSplit = 50,
  minSize = 20,
}: {
  id: string;
  left: React.ReactNode;
  right: React.ReactNode;
  defaultSplit?: number;
  minSize?: number;
}) {
  const { track } = useEventTracking('SplitPane', id);
  const [splitPosition, setSplitPosition] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const container = (e.currentTarget as HTMLElement).parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newPosition = ((e.clientX - rect.left) / rect.width) * 100;

    if (newPosition >= minSize && newPosition <= 100 - minSize) {
      setSplitPosition(newPosition);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      track('resize', splitPosition);
      setIsDragging(false);
    }
  };

  return (
    <div
      className="flex h-full"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div style={{ width: `${splitPosition}%` }} className="overflow-auto">
        {left}
      </div>

      <div
        onMouseDown={() => setIsDragging(true)}
        className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors"
      />

      <div style={{ width: `${100 - splitPosition}%` }} className="overflow-auto">
        {right}
      </div>
    </div>
  );
}

// ========== TABS WITH CONTENT ==========
export function TabPanel({
  id,
  tabs,
  defaultTab,
}: {
  id: string;
  tabs: Array<{ id: string; label: string; content: React.ReactNode; badge?: string }>;
  defaultTab?: string;
}) {
  const { track } = useEventTracking('TabPanel', id);
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    track('tab_change', tabId);
    setActiveTab(tabId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
