/**
 * Button Component
 * Universal button with all variants and states
 * Tracks all click interactions
 */

'use client';

import React from 'react';
import { useEventTracking } from '@/lib/instrumentation/eventTracker';

export interface ButtonProps {
  id: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({
  id,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  const { track } = useEventTracking('Button', id);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || loading) return;
    track('click', null, { variant, size });
    onClick?.(e);
  };

  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 active:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 active:bg-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 active:bg-red-700',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 active:bg-green-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    link: 'bg-transparent text-blue-600 hover:text-blue-700 hover:underline focus:ring-blue-500',
  }[variant];

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  }[size];

  const disabledClasses = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${widthClass} ${className}`}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {icon && iconPosition === 'left' && !loading && icon}
      {children}
      {icon && iconPosition === 'right' && !loading && icon}
    </button>
  );
}

/**
 * Button Group Component
 */
export interface ButtonGroupProps {
  id: string;
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function ButtonGroup({
  id,
  children,
  orientation = 'horizontal',
  className = '',
}: ButtonGroupProps) {
  const { track } = useEventTracking('ButtonGroup', id);

  React.useEffect(() => {
    track('mount', null, { orientation });
  }, []);

  const orientationClass = orientation === 'horizontal' ? 'flex-row' : 'flex-col';

  return (
    <div className={`inline-flex ${orientationClass} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Icon Button Component
 */
export interface IconButtonProps {
  id: string;
  icon: React.ReactNode;
  label: string; // For accessibility
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function IconButton({
  id,
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
}: IconButtonProps) {
  return (
    <Button
      id={id}
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      className="!p-2"
      aria-label={label}
    >
      {icon}
    </Button>
  );
}
