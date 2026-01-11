'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'micropost-theme';

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (stored && ['light', 'dark', 'system'].includes(stored)) {
    return stored;
  }
  return 'system';
}

// External store for theme with subscribers
let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribeToTheme(callback: () => void) {
  listeners = [...listeners, callback];

  // Also subscribe to storage events for cross-tab sync
  const handleStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener('storage', handleStorage);

  // Subscribe to system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', callback);

  return () => {
    listeners = listeners.filter((l) => l !== callback);
    window.removeEventListener('storage', handleStorage);
    mediaQuery.removeEventListener('change', callback);
  };
}

function getThemeSnapshot(): Theme {
  return getStoredTheme();
}

function getThemeServerSnapshot(): Theme {
  return 'system';
}

// Helper to apply theme to DOM
function applyThemeToDOM(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  );

  const resolvedTheme = useMemo(() => resolveTheme(theme), [theme]);

  // Apply theme to DOM in an effect
  useEffect(() => {
    applyThemeToDOM(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);

    // Apply to document immediately
    const resolved = resolveTheme(newTheme);
    applyThemeToDOM(resolved);

    emitChange();
  }, []);

  const toggleTheme = useCallback(() => {
    const currentResolved = resolveTheme(getStoredTheme());
    const newTheme = currentResolved === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [setTheme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme toggle button component
interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-lg transition-colors
        bg-surface-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700
        text-text-primary
        focus:outline-none focus:ring-2 focus:ring-primary-500
        ${className}
      `}
      aria-label={`Switch to ${
        resolvedTheme === 'dark' ? 'light' : 'dark'
      } mode`}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        // Sun icon for switching to light mode
        <svg
          className='w-5 h-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
          />
        </svg>
      ) : (
        // Moon icon for switching to dark mode
        <svg
          className='w-5 h-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
          />
        </svg>
      )}
    </button>
  );
}
