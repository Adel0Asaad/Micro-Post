import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className='w-full'>
      {label && (
        <label
          htmlFor={inputId}
          className='block text-sm font-medium text-text-secondary mb-1'
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-2 border rounded-lg transition-colors
          bg-surface-elevated text-text-primary
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          ${
            error
              ? 'border-danger-500 focus:ring-danger-500'
              : 'border-border-medium hover:border-border-heavy'
          }
          ${className}
        `}
        {...props}
      />
      {error && <p className='mt-1 text-sm text-danger-600'>{error}</p>}
      {helperText && !error && (
        <p className='mt-1 text-sm text-text-tertiary'>{helperText}</p>
      )}
    </div>
  );
}
