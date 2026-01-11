import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function PageContainer({
  children,
  title,
  subtitle,
  className = '',
}: PageContainerProps) {
  return (
    <main className={`max-w-4xl mx-auto px-4 py-8 ${className}`}>
      {(title || subtitle) && (
        <div className='mb-8'>
          {title && (
            <h1 className='text-3xl font-bold text-text-primary'>{title}</h1>
          )}
          {subtitle && <p className='mt-2 text-text-secondary'>{subtitle}</p>}
        </div>
      )}
      {children}
    </main>
  );
}
