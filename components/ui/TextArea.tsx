import React from 'react';

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCount?: boolean;
}

export function TextArea({
  label,
  error,
  helperText,
  maxLength,
  showCount = false,
  className = '',
  id,
  value,
  ...props
}: TextAreaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className='w-full'>
      {label && (
        <label
          htmlFor={textareaId}
          className='block text-sm font-medium text-text-secondary mb-1'
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        value={value}
        maxLength={maxLength}
        className={`
          w-full px-4 py-2 border rounded-lg transition-colors resize-none
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
      <div className='flex justify-between items-center mt-1'>
        <div>
          {error && <p className='text-sm text-danger-600'>{error}</p>}
          {helperText && !error && (
            <p className='text-sm text-text-tertiary'>{helperText}</p>
          )}
        </div>
        {showCount && maxLength && (
          <p
            className={`text-sm ${
              currentLength >= maxLength
                ? 'text-danger-500'
                : 'text-text-tertiary'
            }`}
          >
            {currentLength}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
