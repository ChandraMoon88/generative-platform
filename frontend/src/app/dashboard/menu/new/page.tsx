'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useRestaurantStore } from '../../../../store/restaurantStore';
import { useInstrumentation } from '../../../../hooks/useInstrumentation';
import type { MenuCategory } from '../../../../types/restaurant';

interface FormData {
  name: string;
  description: string;
  price: string;
  category: MenuCategory;
  preparationTime: string;
  isAvailable: boolean;
  ingredients: string;
  allergens: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  preparationTime?: string;
}

const categories: { value: MenuCategory; label: string }[] = [
  { value: 'appetizer', label: 'Appetizer' },
  { value: 'main', label: 'Main Course' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'beverage', label: 'Beverage' },
  { value: 'side', label: 'Side' },
  { value: 'special', label: 'Special' },
];

export default function NewMenuItemPage() {
  const router = useRouter();
  const { addMenuItem } = useRestaurantStore();
  const {
    trackFormStart,
    trackFormFieldChange,
    trackFormSubmit,
    trackFormValidationError,
    trackCreate,
    trackWorkflowStart,
    trackWorkflowStep,
    trackWorkflowComplete,
  } = useInstrumentation({
    componentName: 'NewMenuItemForm',
    entityType: 'MenuItem',
  });
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    category: 'main',
    preparationTime: '',
    isAvailable: true,
    ingredients: '',
    allergens: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const workflowId = React.useRef(`create-menu-item-${Date.now()}`);
  const formId = 'new-menu-item-form';
  
  // Track form and workflow start
  useEffect(() => {
    trackFormStart(formId);
    trackWorkflowStart(workflowId.current, 'Create Menu Item', {});
  }, [trackFormStart, trackWorkflowStart]);
  
  // Handle field change with tracking
  const handleFieldChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    const previousValue = formData[field];
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    
    // Track the change
    trackFormFieldChange(formId, {
      name: field,
      type: typeof value === 'boolean' ? 'checkbox' : 'text',
      value,
      previousValue,
      isValid: true,
    });
  };
  
  // Validate form
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price)) {
      newErrors.price = 'Valid price is required';
    } else if (price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    } else if (price > 10000) {
      newErrors.price = 'Price must be less than 10,000';
    }
    
    const prepTime = parseInt(formData.preparationTime);
    if (!formData.preparationTime || isNaN(prepTime)) {
      newErrors.preparationTime = 'Preparation time is required';
    } else if (prepTime < 1) {
      newErrors.preparationTime = 'Preparation time must be at least 1 minute';
    } else if (prepTime > 180) {
      newErrors.preparationTime = 'Preparation time must be less than 180 minutes';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      trackFormValidationError(formId, 
        Object.entries(newErrors).map(([field, message]) => ({
          field,
          message: message || '',
          rule: 'validation',
        }))
      );
      return false;
    }
    
    return true;
  };
  
  // Handle step navigation
  const goToStep = (step: number) => {
    const previousStep = currentStep;
    setCurrentStep(step);
    
    trackWorkflowStep(
      workflowId.current,
      'Create Menu Item',
      `step-${step}`,
      `step-${previousStep}`,
      Array.from({ length: previousStep }, (_, i) => `step-${i + 1}`),
      Array.from({ length: 3 - step }, (_, i) => `step-${step + i + 1}`)
    );
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Parse ingredients and allergens
      const ingredients = formData.ingredients
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i.length > 0);
      
      const allergens = formData.allergens
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0);
      
      // Create the menu item
      const newItem = addMenuItem({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        preparationTime: parseInt(formData.preparationTime),
        isAvailable: formData.isAvailable,
        ingredients,
        allergens,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
      });
      
      // Track submission
      const timing = trackFormSubmit(formId, formData, 'create');
      trackCreate(newItem as unknown as Record<string, unknown>);
      trackWorkflowComplete(
        workflowId.current,
        'Create Menu Item',
        'complete',
        ['step-1', 'step-2', 'step-3'],
        { itemId: newItem.id, duration: timing?.duration }
      );
      
      // Navigate back to menu list
      router.push('/dashboard/menu');
    } catch (error) {
      console.error('Failed to create menu item:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/menu"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Add Menu Item</h2>
          <p className="text-slate-500">Create a new item for your menu</p>
        </div>
      </div>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <button
              onClick={() => goToStep(step)}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors
                ${currentStep >= step
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-200 text-slate-500'}
              `}
            >
              {step}
            </button>
            {step < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  currentStep > step ? 'bg-primary-600' : 'bg-slate-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} id={formId}>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-slide-in">
              <h3 className="text-lg font-semibold text-slate-800">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className={`
                    w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
                    ${errors.name ? 'border-red-500' : 'border-slate-200'}
                  `}
                  placeholder="e.g., Classic Burger"
                  data-field="name"
                  data-entity="MenuItem"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={3}
                  className={`
                    w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
                    ${errors.description ? 'border-red-500' : 'border-slate-200'}
                  `}
                  placeholder="Describe your menu item..."
                  data-field="description"
                  data-entity="MenuItem"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  data-field="category"
                  data-entity="MenuItem"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          {/* Step 2: Pricing & Time */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-slide-in">
              <h3 className="text-lg font-semibold text-slate-800">Pricing & Preparation</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleFieldChange('price', e.target.value)}
                    className={`
                      w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
                      ${errors.price ? 'border-red-500' : 'border-slate-200'}
                    `}
                    placeholder="0.00"
                    data-field="price"
                    data-entity="MenuItem"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Prep Time (min) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.preparationTime}
                    onChange={(e) => handleFieldChange('preparationTime', e.target.value)}
                    className={`
                      w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
                      ${errors.preparationTime ? 'border-red-500' : 'border-slate-200'}
                    `}
                    placeholder="15"
                    data-field="preparationTime"
                    data-entity="MenuItem"
                  />
                  {errors.preparationTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.preparationTime}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => handleFieldChange('isAvailable', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  data-field="isAvailable"
                  data-entity="MenuItem"
                />
                <label htmlFor="isAvailable" className="text-sm text-slate-700">
                  Available for ordering
                </label>
              </div>
            </div>
          )}
          
          {/* Step 3: Ingredients & Allergens */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-slide-in">
              <h3 className="text-lg font-semibold text-slate-800">Ingredients & Allergens</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ingredients (comma-separated)
                </label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) => handleFieldChange('ingredients', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="beef, lettuce, tomato, cheese, bun"
                  data-field="ingredients"
                  data-entity="MenuItem"
                />
                <p className="text-sm text-slate-500 mt-1">
                  Enter ingredients separated by commas
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Allergens (comma-separated)
                </label>
                <textarea
                  value={formData.allergens}
                  onChange={(e) => handleFieldChange('allergens', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="gluten, dairy, nuts"
                  data-field="allergens"
                  data-entity="MenuItem"
                />
                <p className="text-sm text-slate-500 mt-1">
                  List any allergens present in this item
                </p>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => goToStep(currentStep - 1)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex gap-3">
              <Link
                href="/dashboard/menu"
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel
              </Link>
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => goToStep(currentStep + 1)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? 'Creating...' : 'Create Item'}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
