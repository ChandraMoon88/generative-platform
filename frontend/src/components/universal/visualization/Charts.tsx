/**
 * Chart and Visualization Components
 * Line, Bar, Pie, Area, Scatter charts with full instrumentation
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
}

// ========== LINE CHART ==========
export interface LineChartProps {
  id: string;
  series: ChartSeries[];
  width?: number;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  onDataPointClick?: (point: ChartDataPoint, seriesName: string) => void;
}

export function LineChart({
  id,
  series,
  width = 600,
  height = 400,
  showLegend = true,
  showGrid = true,
  onDataPointClick,
}: LineChartProps) {
  const { track } = useEventTracking('LineChart', id);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    track('mount', null, { seriesCount: series.length });
    drawChart();
  }, [series]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Find min/max values
    const allValues = series.flatMap((s) => s.data.map((d) => d.value));
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const valueRange = maxValue - minValue;

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }
    }

    // Draw each series
    series.forEach((s, seriesIndex) => {
      const color = s.color || `hsl(${seriesIndex * 60}, 70%, 50%)`;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      s.data.forEach((point, index) => {
        const x = padding + (chartWidth / (s.data.length - 1)) * index;
        const y =
          padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        // Draw point
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });

      ctx.stroke();
    });

    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !onDataPointClick) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked point (simplified - would need better hit detection in production)
    const padding = 40;
    const chartWidth = width - 2 * padding;

    series.forEach((s) => {
      s.data.forEach((point, index) => {
        const pointX = padding + (chartWidth / (s.data.length - 1)) * index;
        if (Math.abs(x - pointX) < 10) {
          track('data_point_click', point.label, { series: s.name, value: point.value });
          onDataPointClick(point, s.name);
        }
      });
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleClick}
        className="cursor-pointer"
      />
      {showLegend && (
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {series.map((s, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: s.color || `hsl(${index * 60}, 70%, 50%)` }}
              />
              <span className="text-sm">{s.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ========== BAR CHART ==========
export function BarChart({
  id,
  data,
  width = 600,
  height = 400,
  horizontal = false,
}: {
  id: string;
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  horizontal?: boolean;
}) {
  const { track } = useEventTracking('BarChart', id);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    track('mount', null, { dataPoints: data.length, horizontal });
    drawChart();
  }, [data]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    const maxValue = Math.max(...data.map((d) => d.value));
    const barWidth = chartWidth / data.length - 10;

    data.forEach((point, index) => {
      const barHeight = (point.value / maxValue) * chartHeight;
      const x = padding + index * (chartWidth / data.length) + 5;
      const y = padding + chartHeight - barHeight;

      ctx.fillStyle = point.color || `hsl(${index * 30}, 70%, 50%)`;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw label
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(point.label, x + barWidth / 2, height - padding + 20);

      // Draw value
      ctx.fillText(point.value.toString(), x + barWidth / 2, y - 5);
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
}

// ========== PIE CHART ==========
export function PieChart({
  id,
  data,
  size = 400,
  showLabels = true,
}: {
  id: string;
  data: ChartDataPoint[];
  size?: number;
  showLabels?: boolean;
}) {
  const { track } = useEventTracking('PieChart', id);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    track('mount', null, { dataPoints: data.length });
    drawChart();
  }, [data]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 40;

    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = -Math.PI / 2;

    data.forEach((point, index) => {
      const sliceAngle = (point.value / total) * 2 * Math.PI;
      const endAngle = currentAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = point.color || `hsl(${index * 30}, 70%, 50%)`;
      ctx.fill();

      // Draw label
      if (showLabels) {
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
        const labelY = centerY + Math.sin(labelAngle) * (radius + 20);

        ctx.fillStyle = '#374151';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${point.label} (${Math.round((point.value / total) * 100)}%)`,
          labelX,
          labelY
        );
      }

      currentAngle = endAngle;
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <canvas ref={canvasRef} width={size} height={size} />
    </div>
  );
}

// ========== METRIC CARD ==========
export interface MetricCardProps {
  id: string;
  title: string;
  value: number | string;
  unit?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    label?: string;
  };
  icon?: React.ReactNode;
  color?: string;
}

export function MetricCard({
  id,
  title,
  value,
  unit,
  trend,
  icon,
  color = 'blue',
}: MetricCardProps) {
  const { track } = useEventTracking('MetricCard', id);

  useEffect(() => {
    track('mount', null, { title, value });
  }, []);

  const trendColor = trend?.direction === 'up' ? 'text-green-600' : 'text-red-600';
  const trendIcon = trend?.direction === 'up' ? '↑' : '↓';

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {unit && <span className="text-gray-600">{unit}</span>}
      </div>

      {trend && (
        <div className={`mt-2 flex items-center gap-1 text-sm ${trendColor}`}>
          <span>{trendIcon}</span>
          <span className="font-medium">{trend.value}%</span>
          {trend.label && <span className="text-gray-600">{trend.label}</span>}
        </div>
      )}
    </div>
  );
}

// ========== HEATMAP ==========
export interface HeatmapCell {
  x: number;
  y: number;
  value: number;
  label?: string;
}

export function Heatmap({
  id,
  data,
  width = 600,
  height = 400,
  xLabels,
  yLabels,
}: {
  id: string;
  data: HeatmapCell[];
  width?: number;
  height?: number;
  xLabels?: string[];
  yLabels?: string[];
}) {
  const { track } = useEventTracking('Heatmap', id);

  useEffect(() => {
    track('mount', null, { cellCount: data.length });
  }, []);

  const maxValue = Math.max(...data.map((d) => d.value));
  const cellWidth = width / (xLabels?.length || 10);
  const cellHeight = height / (yLabels?.length || 10);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <svg width={width} height={height}>
        {data.map((cell, index) => {
          const intensity = cell.value / maxValue;
          const color = `rgba(59, 130, 246, ${intensity})`;

          return (
            <rect
              key={index}
              x={cell.x * cellWidth}
              y={cell.y * cellHeight}
              width={cellWidth - 2}
              height={cellHeight - 2}
              fill={color}
              onClick={() => track('cell_click', `${cell.x},${cell.y}`, { value: cell.value })}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <title>{cell.label || `${cell.value}`}</title>
            </rect>
          );
        })}
      </svg>
    </div>
  );
}
