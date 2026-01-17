/**
 * Universal Form Component
 * Handles form state, validation, submission
 * Tracks all form interactions for pattern learning
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'date'
    | 'file'
    | 'color'
    | 'toggle';
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null; // Returns error message or null
  };
  options?: Array<{ label: string; value: any }>; // For select, radio, checkbox
  disabled?: boolean;
  helpText?: string;
}

export interface FormProps {
  id: string;
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  layout?: 'vertical' | 'horizontal' | 'inline';
  sections?: Array<{
    title: string;
    description?: string;
    fields: string[]; // Field IDs
  }>;
}

export function Form({
  id,
  fields,
  onSubmit,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel,
  layout = 'vertical',
  sections = [],
}: FormProps) {
  const { track } = useEventTracking('Form', id);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  // Initialize form data
  useEffect(() => {
    const initialData: Record<string, any> = {};
    fields.forEach((field) => {
      initialData[field.name] = field.defaultValue ?? '';
    });
    setFormData(initialData);

    track('mount', null, {
      fieldCount: fields.length,
      layout,
      hasSections: sections.length > 0,
    });
  }, []);

  // Validate field
  const validateField = (field: FormField, value: any): string | null => {
    // Required check
    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${field.label} is required`;
    }

    // Skip other validations if empty and not required
    if (!value) return null;

    const validation = field.validation;
    if (!validation) return null;

    // Min/Max for numbers
    if (field.type === 'number') {
      const num = Number(value);
      if (validation.min !== undefined && num < validation.min) {
        return `${field.label} must be at least ${validation.min}`;
      }
      if (validation.max !== undefined && num > validation.max) {
        return `${field.label} must be at most ${validation.max}`;
      }
    }

    // MinLength/MaxLength for text
    if (typeof value === 'string') {
      if (validation.minLength && value.length < validation.minLength) {
        return `${field.label} must be at least ${validation.minLength} characters`;
      }
      if (validation.maxLength && value.length > validation.maxLength) {
        return `${field.label} must be at most ${validation.maxLength} characters`;
      }
    }

    // Pattern validation
    if (validation.pattern && typeof value === 'string' && !validation.pattern.test(value)) {
      return `${field.label} format is invalid`;
    }

    // Custom validation
    if (validation.custom) {
      return validation.custom(value);
    }

    return null;
  };

  // Handle field change
  const handleFieldChange = (field: FormField, value: any) => {
    track('field_change', field.name, {
      fieldType: field.type,
      value: field.type === 'password' ? '[hidden]' : value,
    });

    setFormData((prev) => ({ ...prev, [field.name]: value }));

    // Validate if field was touched
    if (touched[field.name]) {
      const error = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [field.name]: error || '',
      }));
    }
  };

  // Handle field blur
  const handleFieldBlur = (field: FormField) => {
    track('field_blur', field.name);

    setTouched((prev) => ({ ...prev, [field.name]: true }));

    const error = validateField(field, formData[field.name]);
    setErrors((prev) => ({
      ...prev,
      [field.name]: error || '',
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const timeSpent = Date.now() - startTime;

    track('submit_attempt', null, { timeSpent, fieldCount: fields.length });

    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);
    setTouched(
      fields.reduce((acc, field) => {
        acc[field.name] = true;
        return acc;
      }, {} as Record<string, boolean>)
    );

    // If errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      track('submit_validation_failed', null, {
        errorCount: Object.keys(newErrors).length,
        errors: newErrors,
      });
      return;
    }

    // Submit
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      track('submit_success', null, { timeSpent });
    } catch (error) {
      track('submit_error', null, {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render field
  const renderField = (field: FormField) => {
    const value = formData[field.name] ?? '';
    const error = errors[field.name];
    const showError = touched[field.name] && error;

    const inputClassName = `w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      showError ? 'border-red-500' : 'border-gray-300'
    } ${field.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onBlur={() => handleFieldBlur(field)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={`${inputClassName} min-h-[100px]`}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onBlur={() => handleFieldBlur(field)}
            disabled={field.disabled}
            className={inputClassName}
          >
            <option value="">Select...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(value as any[])?.includes(option.value) || false}
                  onChange={(e) => {
                    const currentValue = (value as any[]) || [];
                    const newValue = e.target.checked
                      ? [...currentValue, option.value]
                      : currentValue.filter((v) => v !== option.value);
                    handleFieldChange(field, newValue);
                  }}
                  disabled={field.disabled}
                  className="rounded border-gray-300"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={value === option.value}
                  onChange={() => handleFieldChange(field, option.value)}
                  disabled={field.disabled}
                  className="border-gray-300"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'toggle':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`relative w-12 h-6 rounded-full transition-colors ${
                value ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              onClick={() => handleFieldChange(field, !value)}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  value ? 'translate-x-6' : ''
                }`}
              />
            </div>
            <span className="text-sm text-gray-700">{field.label}</span>
          </label>
        );

      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => handleFieldChange(field, e.target.files?.[0] || null)}
            onBlur={() => handleFieldBlur(field)}
            disabled={field.disabled}
            className={inputClassName}
          />
        );

      case 'color':
        return (
          <input
            type="color"
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onBlur={() => handleFieldBlur(field)}
            disabled={field.disabled}
            className="w-full h-10 rounded-md"
          />
        );

      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onBlur={() => handleFieldBlur(field)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={inputClassName}
          />
        );
    }
  };

  const layoutClass = {
    vertical: 'space-y-4',
    horizontal: 'grid grid-cols-2 gap-4',
    inline: 'flex gap-4 items-end',
  }[layout];

  // Organize fields by sections
  const fieldsBySections = sections.length > 0
    ? sections
    : [{ title: '', description: '', fields: fields.map((f) => f.id) }];

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white rounded-lg shadow-md p-6">
      {fieldsBySections.map((section, sectionIndex) => (
        <div key={sectionIndex} className={sectionIndex > 0 ? 'mt-8' : ''}>
          {section.title && (
            <div className="mb-4 pb-2 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              {section.description && (
                <p className="text-sm text-gray-600 mt-1">{section.description}</p>
              )}
            </div>
          )}

          <div className={layoutClass}>
            {fields
              .filter((field) => section.fields.includes(field.id))
              .map((field) => (
                <div key={field.name} className={field.type === 'toggle' ? '' : ''}>
                  {field.type !== 'toggle' && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  )}

                  {renderField(field)}

                  {field.helpText && !errors[field.name] && (
                    <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
                  )}

                  {touched[field.name] && errors[field.name] && (
                    <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="mt-6 flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={() => {
              track('cancel', null);
              onCancel();
            }}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
