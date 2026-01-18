import React from 'react';

interface AvatarProps {
  name: string;
  userId?: string | number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Simple hash function for consistent color generation
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export function Avatar({
  name,
  userId,
  size = 'md',
  className = '',
}: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  // Generate a consistent color based on userId (or name as fallback)
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-orange-500',
  ];
  const hashSource = userId !== undefined ? String(userId) : name;
  const colorIndex = hashString(hashSource) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div
      className={`
        ${sizes[size]} ${bgColor}
        rounded-full flex items-center justify-center
        text-white font-medium
        ${className}
      `}
    >
      {initials}
    </div>
  );
}
