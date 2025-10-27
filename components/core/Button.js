'use client';

import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary', 'danger', etc.
  isLoading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
}) {
  // Determine styles based on variant
  const baseStyles =
    'w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-colors';
  
  const variantStyles = {
    primary: 'bg-primary-foreground text-primary hover:bg-primary-foreground/90',
    secondary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const disabledStyles = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {LeftIcon && <LeftIcon className="mr-2" />}
          {children}
          {RightIcon && <RightIcon className="ml-2" />}
        </>
      )}
    </button>
  );
}