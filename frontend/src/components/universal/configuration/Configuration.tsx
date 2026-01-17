/**
 * Configuration and Settings Components
 * Settings panels, preferences, admin controls
 */

'use client';

import React, { useState } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

// ========== SETTINGS PANEL ==========
export interface SettingItem {
  id: string;
  label: string;
  description?: string;
  type: 'toggle' | 'select' | 'text' | 'number' | 'slider';
  value: any;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
}

export function SettingsPanel({
  id,
  title,
  settings,
  onSettingChange,
  onSave,
}: {
  id: string;
  title: string;
  settings: SettingItem[];
  onSettingChange: (settingId: string, value: any) => void;
  onSave: () => void;
}) {
  const { track } = useEventTracking('SettingsPanel', id);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (settingId: string, value: any) => {
    track('setting_change', settingId, { value });
    onSettingChange(settingId, value);
    setHasChanges(true);
  };

  const handleSave = () => {
    track('save', null);
    onSave();
    setHasChanges(false);
  };

  const renderSetting = (setting: SettingItem) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={setting.value}
              onChange={(e) => handleChange(setting.id, e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        );

      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => handleChange(setting.id, e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'text':
        return (
          <input
            type="text"
            value={setting.value}
            onChange={(e) => handleChange(setting.id, e.target.value)}
            className="px-3 py-2 border rounded-lg w-full"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={setting.value}
            onChange={(e) => handleChange(setting.id, Number(e.target.value))}
            min={setting.min}
            max={setting.max}
            step={setting.step}
            className="px-3 py-2 border rounded-lg w-32"
          />
        );

      case 'slider':
        return (
          <div className="flex items-center gap-4">
            <input
              type="range"
              value={setting.value}
              onChange={(e) => handleChange(setting.id, Number(e.target.value))}
              min={setting.min}
              max={setting.max}
              step={setting.step}
              className="flex-1"
            />
            <span className="text-sm font-medium w-12 text-right">{setting.value}</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">{title}</h2>

      <div className="space-y-6">
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-medium mb-1">{setting.label}</h3>
              {setting.description && (
                <p className="text-sm text-gray-600">{setting.description}</p>
              )}
            </div>
            <div className="flex-shrink-0">{renderSetting(setting)}</div>
          </div>
        ))}
      </div>

      {hasChanges && (
        <div className="mt-6 pt-6 border-t flex justify-end gap-3">
          <button
            onClick={() => setHasChanges(false)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

// ========== USER PREFERENCES ==========
export function UserPreferences({
  id,
  categories,
}: {
  id: string;
  categories: Array<{
    id: string;
    label: string;
    icon?: string;
    settings: SettingItem[];
  }>;
}) {
  const { track } = useEventTracking('UserPreferences', id);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id);

  const handleCategoryChange = (categoryId: string) => {
    track('category_change', categoryId);
    setActiveCategory(categoryId);
  };

  const activeSettings = categories.find((cat) => cat.id === activeCategory)?.settings || [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r bg-gray-50">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Preferences</h2>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`w-full px-3 py-2 text-left rounded-lg transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {category.icon && <span>{category.icon}</span>}
                    <span>{category.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <SettingsPanel
            id={`${id}-${activeCategory}`}
            title={categories.find((cat) => cat.id === activeCategory)?.label || ''}
            settings={activeSettings}
            onSettingChange={(settingId, value) => {
              track('setting_change', settingId, { category: activeCategory, value });
            }}
            onSave={() => {
              track('save_preferences', activeCategory);
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ========== PERMISSION MANAGER ==========
export interface Permission {
  id: string;
  name: string;
  description: string;
  granted: boolean;
}

export function PermissionManager({
  id,
  roles,
  permissions,
  onPermissionChange,
}: {
  id: string;
  roles: Array<{ id: string; name: string }>;
  permissions: Permission[];
  onPermissionChange: (roleId: string, permissionId: string, granted: boolean) => void;
}) {
  const { track } = useEventTracking('PermissionManager', id);
  const [selectedRole, setSelectedRole] = useState(roles[0]?.id);

  const handlePermissionToggle = (permissionId: string, granted: boolean) => {
    track('permission_toggle', permissionId, { role: selectedRole, granted });
    onPermissionChange(selectedRole, permissionId, granted);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Permissions</h2>

      {/* Role selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Role</label>
        <select
          value={selectedRole}
          onChange={(e) => {
            track('role_select', e.target.value);
            setSelectedRole(e.target.value);
          }}
          className="px-3 py-2 border rounded-lg"
        >
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      {/* Permissions list */}
      <div className="space-y-3">
        {permissions.map((permission) => (
          <div
            key={permission.id}
            className="flex items-start justify-between p-3 border rounded-lg"
          >
            <div className="flex-1">
              <h3 className="font-medium">{permission.name}</h3>
              <p className="text-sm text-gray-600">{permission.description}</p>
            </div>
            <label className="flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                checked={permission.granted}
                onChange={(e) => handlePermissionToggle(permission.id, e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== THEME SELECTOR ==========
export function ThemeSelector({
  id,
  themes,
  currentTheme,
  onThemeChange,
}: {
  id: string;
  themes: Array<{
    id: string;
    name: string;
    preview: { primary: string; secondary: string; background: string };
  }>;
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}) {
  const { track } = useEventTracking('ThemeSelector', id);

  const handleThemeChange = (themeId: string) => {
    track('theme_change', themeId);
    onThemeChange(themeId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-semibold mb-4">Theme</h3>

      <div className="grid grid-cols-2 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`p-4 border-2 rounded-lg transition-all ${
              currentTheme === theme.id
                ? 'border-blue-500 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex gap-2 mb-2">
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: theme.preview.primary }}
              />
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: theme.preview.secondary }}
              />
              <div
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: theme.preview.background }}
              />
            </div>
            <div className="font-medium text-sm">{theme.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
