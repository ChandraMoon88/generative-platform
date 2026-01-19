/**
 * Specialized Input Components
 * Rich text editor, file upload, color picker, relation selector
 */

'use client';

import React, { useState, useRef } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';
import { userAssetManager } from '@/lib/instrumentation/userAssetManager';

// ========== RICH TEXT EDITOR ==========
export function RichTextEditor({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const { track } = useEventTracking('RichTextEditor', id);
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, value?: string) => {
    track('format', command, { value });
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    const content = editorRef.current?.innerHTML || '';
    onChange(content);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b bg-gray-50 flex-wrap">
        <button
          onClick={() => execCommand('bold')}
          className="px-3 py-1 hover:bg-gray-200 rounded font-bold"
          title="Bold"
        >
          B
        </button>
        <button
          onClick={() => execCommand('italic')}
          className="px-3 py-1 hover:bg-gray-200 rounded italic"
          title="Italic"
        >
          I
        </button>
        <button
          onClick={() => execCommand('underline')}
          className="px-3 py-1 hover:bg-gray-200 rounded underline"
          title="Underline"
        >
          U
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button
          onClick={() => execCommand('justifyLeft')}
          className="px-3 py-1 hover:bg-gray-200 rounded"
          title="Align Left"
        >
          ⬅
        </button>
        <button
          onClick={() => execCommand('justifyCenter')}
          className="px-3 py-1 hover:bg-gray-200 rounded"
          title="Align Center"
        >
          ↔
        </button>
        <button
          onClick={() => execCommand('justifyRight')}
          className="px-3 py-1 hover:bg-gray-200 rounded"
          title="Align Right"
        >
          ➡
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button
          onClick={() => execCommand('insertUnorderedList')}
          className="px-3 py-1 hover:bg-gray-200 rounded"
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => execCommand('insertOrderedList')}
          className="px-3 py-1 hover:bg-gray-200 rounded"
          title="Numbered List"
        >
          1. List
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <select
          onChange={(e) => execCommand('formatBlock', e.target.value)}
          className="px-2 py-1 border rounded"
          defaultValue="p"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[200px] focus:outline-none"
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />
    </div>
  );
}

// ========== FILE UPLOAD ==========
export function FileUpload({
  id,
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  onUpload,
}: {
  id: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onUpload: (files: File[]) => void;
}) {
  const { track } = useEventTracking('FileUpload', id);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Validate size
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSize) {
        track('error', 'file_too_large', { filename: file.name, size: file.size });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    track('upload', null, { count: validFiles.length, totalSize: validFiles.reduce((sum, f) => sum + f.size, 0) });

    setFiles(validFiles);

    // Generate previews for images
    const previewUrls: string[] = [];
    for (const file of validFiles) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          previewUrls.push(reader.result as string);
          if (previewUrls.length === validFiles.filter(f => f.type.startsWith('image/')).length) {
            setPreviews(previewUrls);
          }
        };
        reader.readAsDataURL(file);

        // Store in user assets
        // await userAssetManager.addAsset({
        //   type: 'image',
        //   name: file.name,
        //   data: reader.result as string,
        //   context: { uploadedFrom: id },
        // });
      }
    }

    onUpload(validFiles);
  };

  const handleRemove = (index: number) => {
    track('remove', index);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={() => inputRef.current?.click()}
        className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
      >
        <div className="text-center">
          <div className="text-4xl mb-2">📁</div>
          <div className="font-medium">Click to upload</div>
          <div className="text-sm text-gray-500 mt-1">
            {accept || 'Any file type'} • Max {Math.round(maxSize / 1024 / 1024)}MB
          </div>
        </div>
      </button>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              {previews[index] && (
                <img src={previews[index]} alt={file.name} className="w-12 h-12 object-cover rounded" />
              )}
              <div className="flex-1">
                <div className="font-medium text-sm">{file.name}</div>
                <div className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
              <button
                onClick={() => handleRemove(index)}
                className="px-2 py-1 text-red-500 hover:bg-red-50 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ========== COLOR PICKER ==========
export function ColorPicker({
  id,
  value,
  onChange,
  presets = [],
}: {
  id: string;
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
}) {
  const { track } = useEventTracking('ColorPicker', id);

  const handleColorChange = (color: string) => {
    track('select_color', color);
    onChange(color);

    // Store in user assets
    userAssetManager.addAsset({
      type: 'color',
      name: color,
      data: color,
      context: { selectedFrom: id },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-4 mb-4">
        <input
          type="color"
          value={value}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-16 h-16 rounded cursor-pointer"
        />
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => handleColorChange(e.target.value)}
            className="px-3 py-2 border rounded font-mono text-sm"
            placeholder="#000000"
          />
          <div className="text-xs text-gray-500 mt-1">Hex color code</div>
        </div>
      </div>

      {presets.length > 0 && (
        <div>
          <div className="text-sm font-medium mb-2">Presets</div>
          <div className="grid grid-cols-8 gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => handleColorChange(preset)}
                className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                style={{
                  backgroundColor: preset,
                  borderColor: preset === value ? '#3b82f6' : 'transparent',
                }}
                title={preset}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ========== RELATION SELECTOR ==========
export function RelationSelector({
  id,
  label,
  items,
  selected = [],
  multiple = true,
  onSelect,
}: {
  id: string;
  label: string;
  items: Array<{ id: string; label: string; metadata?: any }>;
  selected?: string[];
  multiple?: boolean;
  onSelect: (selected: string[]) => void;
}) {
  const { track } = useEventTracking('RelationSelector', id);
  const [search, setSearch] = useState('');

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleItem = (itemId: string) => {
    track('toggle', itemId);

    if (multiple) {
      const next = selected.includes(itemId)
        ? selected.filter((id) => id !== itemId)
        : [...selected, itemId];
      onSelect(next);
    } else {
      onSelect([itemId]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold mb-3">{label}</h3>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="w-full px-3 py-2 border rounded-md mb-3"
      />

      <div className="max-h-60 overflow-auto space-y-1">
        {filteredItems.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
          >
            <input
              type={multiple ? 'checkbox' : 'radio'}
              checked={selected.includes(item.id)}
              onChange={() => toggleItem(item.id)}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <div className="text-sm font-medium mb-2">
            Selected ({selected.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {selected.map((id) => {
              const item = items.find((i) => i.id === id);
              return (
                <div
                  key={id}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                >
                  {item?.label}
                  <button
                    onClick={() => toggleItem(id)}
                    className="hover:text-blue-900"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ========== TAG INPUT ==========
export function TagInput({
  id,
  tags,
  onChange,
  suggestions = [],
}: {
  id: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
}) {
  const { track } = useEventTracking('TagInput', id);
  const [input, setInput] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      track('add_tag', trimmed);
      onChange([...tags, trimmed]);
      setInput('');
    }
  };

  const removeTag = (tag: string) => {
    track('remove_tag', tag);
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <div
            key={tag}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="hover:text-blue-900"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter..."
        className="w-full px-3 py-2 border rounded-md"
      />

      {suggestions.length > 0 && (
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">Suggestions:</div>
          <div className="flex flex-wrap gap-1">
            {suggestions
              .filter((s) => !tags.includes(s))
              .map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => addTag(suggestion)}
                  className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                >
                  + {suggestion}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
