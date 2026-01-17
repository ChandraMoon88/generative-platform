/**
 * Advanced Data & Analytics Components
 * Gauges, funnels, sankey, network graphs, pivot tables
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

// ========== GAUGE CHART ==========
export function GaugeChart({
  id,
  value,
  min = 0,
  max = 100,
  label,
  thresholds = [],
}: {
  id: string;
  value: number;
  min?: number;
  max?: number;
  label?: string;
  thresholds?: Array<{ value: number; color: string; label?: string }>;
}) {
  const { track } = useEventTracking('GaugeChart', id);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw arc
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;
    const percentage = (value - min) / (max - min);
    const valueAngle = startAngle + percentage * (endAngle - startAngle);

    // Background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#e5e7eb';
    ctx.stroke();

    // Value arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, valueAngle);
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#3b82f6';
    ctx.stroke();

    // Draw value text
    ctx.fillStyle = '#000';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(value.toString(), centerX, centerY - 10);

    if (label) {
      ctx.font = '16px sans-serif';
      ctx.fillText(label, centerX, centerY + 20);
    }

    track('render', value);
  }, [value, min, max, label, track]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <canvas ref={canvasRef} width={300} height={200} />
    </div>
  );
}

// ========== FUNNEL CHART ==========
export function FunnelChart({
  id,
  stages,
}: {
  id: string;
  stages: Array<{ label: string; value: number; color?: string }>;
}) {
  const { track } = useEventTracking('FunnelChart', id);

  const maxValue = Math.max(...stages.map((s) => s.value));

  const handleStageClick = (stage: any, index: number) => {
    track('stage_click', index, { label: stage.label, value: stage.value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-2">
        {stages.map((stage, index) => {
          const widthPercent = (stage.value / maxValue) * 100;
          const conversionRate =
            index > 0 ? ((stage.value / stages[index - 1].value) * 100).toFixed(1) : 100;

          return (
            <div key={index} onClick={() => handleStageClick(stage, index)}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{stage.label}</span>
                <span className="text-sm text-gray-600">
                  {stage.value.toLocaleString()} ({conversionRate}%)
                </span>
              </div>
              <div
                className="h-12 rounded transition-all hover:opacity-80 cursor-pointer flex items-center justify-center text-white font-semibold"
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: stage.color || '#3b82f6',
                  marginLeft: `${(100 - widthPercent) / 2}%`,
                }}
              >
                {stage.value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ========== NETWORK GRAPH ==========
export interface Node {
  id: string;
  label: string;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
}

export interface Edge {
  from: string;
  to: string;
  weight?: number;
}

export function NetworkGraph({
  id,
  nodes,
  edges,
  onNodeClick,
}: {
  id: string;
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: (node: Node) => void;
}) {
  const { track } = useEventTracking('NetworkGraph', id);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Position nodes if not positioned
    const positionedNodes = nodes.map((node, i) => {
      if (node.x !== undefined && node.y !== undefined) return node;

      const angle = (i / nodes.length) * 2 * Math.PI;
      const radius = Math.min(canvas.width, canvas.height) / 3;
      return {
        ...node,
        x: canvas.width / 2 + Math.cos(angle) * radius,
        y: canvas.height / 2 + Math.sin(angle) * radius,
      };
    });

    // Draw edges
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    edges.forEach((edge) => {
      const fromNode = positionedNodes.find((n) => n.id === edge.from);
      const toNode = positionedNodes.find((n) => n.id === edge.to);

      if (fromNode && toNode && fromNode.x && fromNode.y && toNode.x && toNode.y) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    positionedNodes.forEach((node) => {
      if (!node.x || !node.y) return;

      const size = node.size || 20;

      ctx.fillStyle = node.color || '#3b82f6';
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label.substring(0, 3), node.x, node.y);
    });
  }, [nodes, edges]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = nodes.find((node) => {
      if (!node.x || !node.y) return false;
      const size = node.size || 20;
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= size;
    });

    if (clickedNode) {
      track('node_click', clickedNode.id);
      onNodeClick?.(clickedNode);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        onClick={handleCanvasClick}
        className="border rounded cursor-pointer"
      />
    </div>
  );
}

// ========== PIVOT TABLE ==========
export function PivotTable({
  id,
  data,
  rows,
  columns,
  values,
  aggregation = 'sum',
}: {
  id: string;
  data: Record<string, any>[];
  rows: string[];
  columns: string[];
  values: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}) {
  const { track } = useEventTracking('PivotTable', id);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Build pivot structure
  const pivot: Record<string, Record<string, number>> = {};
  const columnValues = new Set<string>();

  data.forEach((row) => {
    const rowKey = rows.map((r) => row[r]).join('|');
    const colKey = columns.map((c) => row[c]).join('|');
    const value = Number(row[values]) || 0;

    columnValues.add(colKey);

    if (!pivot[rowKey]) {
      pivot[rowKey] = {};
    }

    if (!pivot[rowKey][colKey]) {
      pivot[rowKey][colKey] = 0;
    }

    switch (aggregation) {
      case 'sum':
        pivot[rowKey][colKey] += value;
        break;
      case 'count':
        pivot[rowKey][colKey]++;
        break;
      case 'avg':
        pivot[rowKey][colKey] = (pivot[rowKey][colKey] + value) / 2;
        break;
      case 'min':
        pivot[rowKey][colKey] = Math.min(pivot[rowKey][colKey] || value, value);
        break;
      case 'max':
        pivot[rowKey][colKey] = Math.max(pivot[rowKey][colKey] || value, value);
        break;
    }
  });

  const columnArray = Array.from(columnValues);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            {rows.map((row) => (
              <th key={row} className="px-4 py-2 text-left font-semibold">
                {row}
              </th>
            ))}
            {columnArray.map((col) => (
              <th key={col} className="px-4 py-2 text-right font-semibold">
                {col}
              </th>
            ))}
            <th className="px-4 py-2 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(pivot).map(([rowKey, colData]) => {
            const rowTotal = Object.values(colData).reduce((sum, val) => sum + val, 0);

            return (
              <tr key={rowKey} className="border-b hover:bg-gray-50">
                {rowKey.split('|').map((cell, i) => (
                  <td key={i} className="px-4 py-2">
                    {cell}
                  </td>
                ))}
                {columnArray.map((col) => (
                  <td key={col} className="px-4 py-2 text-right">
                    {colData[col]?.toFixed(2) || '-'}
                  </td>
                ))}
                <td className="px-4 py-2 text-right font-semibold">
                  {rowTotal.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ========== TREEMAP ==========
export function Treemap({
  id,
  data,
  onNodeClick,
}: {
  id: string;
  data: Array<{ id: string; label: string; value: number; color?: string }>;
  onNodeClick?: (node: any) => void;
}) {
  const { track } = useEventTracking('Treemap', id);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentX = 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex h-96 gap-1">
        {data.map((item) => {
          const widthPercent = (item.value / total) * 100;

          return (
            <div
              key={item.id}
              onClick={() => {
                track('node_click', item.id);
                onNodeClick?.(item);
              }}
              className="flex items-center justify-center text-white font-semibold cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                width: `${widthPercent}%`,
                backgroundColor: item.color || '#3b82f6',
              }}
            >
              <div className="text-center p-2">
                <div className="text-sm">{item.label}</div>
                <div className="text-lg">{item.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
