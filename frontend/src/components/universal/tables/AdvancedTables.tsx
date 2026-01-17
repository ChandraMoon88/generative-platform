import React, { useState, useRef, useEffect } from 'react';

// ============================================================================
// ADVANCED TABLES & CODE EDITORS
// ============================================================================

// 1. VirtualTable - Virtual scrolling for massive datasets
export const VirtualTable: React.FC<{
  data: any[];
  columns: Array<{ key: string; label: string; width?: number }>;
  rowHeight?: number;
  height?: number;
  onRowClick?: (row: any) => void;
  className?: string;
}> = ({ data, columns, rowHeight = 40, height = 400, onRowClick, className = '' }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleStart = Math.floor(scrollTop / rowHeight);
  const visibleEnd = Math.min(visibleStart + Math.ceil(height / rowHeight) + 1, data.length);
  const visibleData = data.slice(visibleStart, visibleEnd);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { component: 'VirtualTable', action: 'scroll', visibleRows: visibleData.length, totalRows: data.length }
    }));
  }, [scrollTop, data.length, visibleData.length]);

  return (
    <div className={`virtual-table ${className}`}>
      <div className="flex bg-gray-100 border-b font-semibold">
        {columns.map(col => (
          <div key={col.key} className="p-3" style={{ width: col.width || 'auto', flex: col.width ? undefined : 1 }}>
            {col.label}
          </div>
        ))}
      </div>
      <div ref={containerRef} onScroll={handleScroll} style={{ height, overflow: 'auto' }}>
        <div style={{ height: data.length * rowHeight, position: 'relative' }}>
          {visibleData.map((row, i) => (
            <div
              key={visibleStart + i}
              className="flex border-b hover:bg-gray-50 cursor-pointer"
              style={{
                position: 'absolute',
                top: (visibleStart + i) * rowHeight,
                left: 0,
                right: 0,
                height: rowHeight
              }}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(col => (
                <div key={col.key} className="p-3 flex items-center" style={{ width: col.width || 'auto', flex: col.width ? undefined : 1 }}>
                  {row[col.key]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 2. EditableTable - Inline cell editing
export const EditableTable: React.FC<{
  data: any[];
  columns: Array<{ key: string; label: string; editable?: boolean; type?: 'text' | 'number' | 'select'; options?: string[] }>;
  onCellEdit?: (rowIndex: number, key: string, value: any) => void;
  onExport?: () => void;
  className?: string;
}> = ({ data, columns, onCellEdit, onExport, className = '' }) => {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (rowIndex: number, colKey: string, currentValue: any) => {
    setEditingCell({ row: rowIndex, col: colKey });
    setEditValue(currentValue);
  };

  const finishEdit = () => {
    if (editingCell) {
      onCellEdit?.(editingCell.row, editingCell.col, editValue);
      window.dispatchEvent(new CustomEvent('componentInteraction', {
        detail: { component: 'EditableTable', action: 'editCell', row: editingCell.row, column: editingCell.col }
      }));
    }
    setEditingCell(null);
  };

  return (
    <div className={className}>
      <div className="mb-2 flex justify-between">
        <div className="text-sm text-gray-600">{data.length} rows</div>
        {onExport && (
          <button onClick={onExport} className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
            Export
          </button>
        )}
      </div>
      <div className="border rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="p-3 text-left font-semibold">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t hover:bg-gray-50">
                {columns.map(col => {
                  const isEditing = editingCell?.row === rowIndex && editingCell?.col === col.key;
                  return (
                    <td key={col.key} className="p-3">
                      {isEditing ? (
                        <input
                          type={col.type || 'text'}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={finishEdit}
                          onKeyDown={(e) => e.key === 'Enter' && finishEdit()}
                          autoFocus
                          className="w-full p-1 border rounded"
                        />
                      ) : (
                        <div
                          onClick={() => col.editable !== false && startEdit(rowIndex, col.key, row[col.key])}
                          className={col.editable !== false ? 'cursor-pointer' : ''}
                        >
                          {row[col.key]}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 3. PivotTableAdvanced - Advanced pivot with drill-down
export const PivotTableAdvanced: React.FC<{
  data: any[];
  rows: string[];
  columns: string[];
  values: string[];
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  showGrandTotals?: boolean;
  onDrillDown?: (path: string[]) => void;
  className?: string;
}> = ({ data, rows, columns, values, aggregation = 'sum', showGrandTotals = true, onDrillDown, className = '' }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (key: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpanded(newExpanded);
    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { component: 'PivotTableAdvanced', action: 'toggle', key, expanded: !expanded.has(key) }
    }));
  };

  return (
    <div className={`pivot-table-advanced ${className}`}>
      <div className="border rounded overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {rows.map(r => <th key={r} className="p-2 text-left font-semibold border">{r}</th>)}
              {columns.map(c => <th key={c} className="p-2 text-center font-semibold border">{c}</th>)}
              {showGrandTotals && <th className="p-2 text-center font-semibold border bg-gray-200">Total</th>}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((row, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                {rows.map(r => (
                  <td key={r} className="p-2 border">
                    <button
                      onClick={() => toggleExpand(`${i}-${r}`)}
                      className="hover:text-blue-600"
                    >
                      {expanded.has(`${i}-${r}`) ? '▼' : '▶'} {row[r]}
                    </button>
                  </td>
                ))}
                {columns.map(c => (
                  <td key={c} className="p-2 text-center border">{row[c] || '-'}</td>
                ))}
                {showGrandTotals && (
                  <td className="p-2 text-center border font-semibold bg-gray-50">
                    {values.reduce((sum, v) => sum + (Number(row[v]) || 0), 0)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 4. CodeEditor - Syntax highlighting code editor
export const CodeEditor: React.FC<{
  value: string;
  onChange?: (value: string) => void;
  language?: 'javascript' | 'typescript' | 'python' | 'html' | 'css' | 'json';
  theme?: 'light' | 'dark';
  lineNumbers?: boolean;
  readOnly?: boolean;
  height?: number;
  className?: string;
}> = ({ value, onChange, language = 'javascript', theme = 'light', lineNumbers = true, readOnly = false, height = 400, className = '' }) => {
  const [code, setCode] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onChange?.(newCode);
    
    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { component: 'CodeEditor', action: 'edit', language, lines: newCode.split('\n').length }
    }));
  };

  const lineCount = code.split('\n').length;

  return (
    <div className={`code-editor ${className}`}>
      <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 text-sm">
        <div className="flex gap-2">
          <span className="font-mono">{language}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-400">{lineCount} lines</span>
        </div>
        <div className="flex gap-2">
          <button className="hover:text-blue-400">Copy</button>
          <button className="hover:text-blue-400">Format</button>
        </div>
      </div>
      <div className={`flex ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white'}`} style={{ height }}>
        {lineNumbers && (
          <div className="text-right px-3 py-2 bg-gray-800 text-gray-400 font-mono text-sm select-none">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} style={{ height: 20 }}>{i + 1}</div>
            ))}
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          readOnly={readOnly}
          className={`flex-1 p-2 font-mono text-sm resize-none focus:outline-none ${
            theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white'
          }`}
          style={{ lineHeight: '20px', tabSize: 2 }}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

// 5. DiffViewer - Side-by-side diff viewer
export const DiffViewer: React.FC<{
  original: string;
  modified: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}> = ({ original, modified, language = 'text', showLineNumbers = true, className = '' }) => {
  const originalLines = original.split('\n');
  const modifiedLines = modified.split('\n');

  const getDiff = () => {
    const maxLines = Math.max(originalLines.length, modifiedLines.length);
    const diff: Array<{ type: 'same' | 'removed' | 'added'; original?: string; modified?: string }> = [];

    for (let i = 0; i < maxLines; i++) {
      const origLine = originalLines[i];
      const modLine = modifiedLines[i];

      if (origLine === modLine) {
        diff.push({ type: 'same', original: origLine, modified: modLine });
      } else if (!modLine) {
        diff.push({ type: 'removed', original: origLine });
      } else if (!origLine) {
        diff.push({ type: 'added', modified: modLine });
      } else {
        diff.push({ type: 'removed', original: origLine });
        diff.push({ type: 'added', modified: modLine });
      }
    }

    return diff;
  };

  const diff = getDiff();

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { component: 'DiffViewer', action: 'compare', changes: diff.filter(d => d.type !== 'same').length }
    }));
  }, [original, modified]);

  return (
    <div className={`diff-viewer ${className}`}>
      <div className="flex bg-gray-800 text-white text-sm">
        <div className="flex-1 px-4 py-2 border-r border-gray-700">Original</div>
        <div className="flex-1 px-4 py-2">Modified</div>
      </div>
      <div className="flex font-mono text-sm">
        <div className="flex-1 overflow-auto">
          {diff.map((line, i) => (
            line.original !== undefined && (
              <div
                key={`orig-${i}`}
                className={`flex ${
                  line.type === 'removed' ? 'bg-red-50 text-red-800' : ''
                } ${line.type === 'same' ? 'bg-white' : ''}`}
              >
                {showLineNumbers && <div className="px-3 py-1 bg-gray-100 text-gray-500 select-none w-12">{i + 1}</div>}
                <div className="px-3 py-1 flex-1">{line.original || ' '}</div>
              </div>
            )
          ))}
        </div>
        <div className="flex-1 border-l overflow-auto">
          {diff.map((line, i) => (
            line.modified !== undefined && (
              <div
                key={`mod-${i}`}
                className={`flex ${
                  line.type === 'added' ? 'bg-green-50 text-green-800' : ''
                } ${line.type === 'same' ? 'bg-white' : ''}`}
              >
                {showLineNumbers && <div className="px-3 py-1 bg-gray-100 text-gray-500 select-none w-12">{i + 1}</div>}
                <div className="px-3 py-1 flex-1">{line.modified || ' '}</div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

// 6. JSONViewer - Interactive JSON tree viewer
export const JSONViewer: React.FC<{
  data: any;
  expanded?: boolean;
  onNodeClick?: (path: string[], value: any) => void;
  className?: string;
}> = ({ data, expanded = false, onNodeClick, className = '' }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(expanded ? ['root'] : []));

  const toggleNode = (path: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedNodes(newExpanded);
    
    window.dispatchEvent(new CustomEvent('componentInteraction', {
      detail: { component: 'JSONViewer', action: 'toggleNode', path }
    }));
  };

  const renderValue = (value: any, path: string[] = [], level: number = 0): React.ReactNode => {
    const pathKey = path.join('.');

    if (value === null) return <span className="text-gray-400">null</span>;
    if (typeof value === 'boolean') return <span className="text-purple-600">{String(value)}</span>;
    if (typeof value === 'number') return <span className="text-blue-600">{value}</span>;
    if (typeof value === 'string') return <span className="text-green-600">"{value}"</span>;

    if (Array.isArray(value)) {
      const isExpanded = expandedNodes.has(pathKey);
      return (
        <div>
          <button onClick={() => toggleNode(pathKey)} className="hover:bg-gray-100 px-1">
            {isExpanded ? '▼' : '▶'} [{value.length}]
          </button>
          {isExpanded && (
            <div className="ml-4 border-l-2 border-gray-200 pl-2">
              {value.map((item, i) => (
                <div key={i} className="my-1">
                  <span className="text-gray-500">{i}:</span> {renderValue(item, [...path, String(i)], level + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === 'object') {
      const isExpanded = expandedNodes.has(pathKey);
      const keys = Object.keys(value);
      return (
        <div>
          <button onClick={() => toggleNode(pathKey)} className="hover:bg-gray-100 px-1">
            {isExpanded ? '▼' : '▶'} {`{${keys.length}}`}
          </button>
          {isExpanded && (
            <div className="ml-4 border-l-2 border-gray-200 pl-2">
              {keys.map(key => (
                <div key={key} className="my-1">
                  <span className="text-blue-800 font-semibold">{key}:</span>{' '}
                  {renderValue(value[key], [...path, key], level + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return String(value);
  };

  return (
    <div className={`json-viewer font-mono text-sm bg-gray-50 p-4 rounded ${className}`}>
      {renderValue(data, ['root'])}
    </div>
  );
};
