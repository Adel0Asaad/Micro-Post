/**
 * Centralized Color Theme Configuration
 *
 * This file defines all semantic colors used throughout the application.
 * Colors are defined for both light and dark modes.
 *
 * Usage in CSS: var(--color-{semantic-name})
 * Usage in Tailwind: Use the custom classes defined in globals.css
 *
 * Color naming convention:
 * - {semantic}-{shade} (e.g., primary-500, success-600)
 * - Shades range from 50 (lightest) to 950 (darkest)
 */

export const colors = {
  // Primary - Main brand color (blue)
  primary: {
    50: { light: '#eff6ff', dark: '#1e3a5f' },
    100: { light: '#dbeafe', dark: '#1e4976' },
    200: { light: '#bfdbfe', dark: '#1d5a8e' },
    300: { light: '#93c5fd', dark: '#2672b3' },
    400: { light: '#60a5fa', dark: '#3b8fd4' },
    500: { light: '#3b82f6', dark: '#60a5fa' },
    600: { light: '#2563eb', dark: '#7ab8fc' },
    700: { light: '#1d4ed8', dark: '#93c5fd' },
    800: { light: '#1e40af', dark: '#bfdbfe' },
    900: { light: '#1e3a8a', dark: '#dbeafe' },
    950: { light: '#172554', dark: '#eff6ff' },
  },

  // Success - Positive actions and confirmations (green)
  success: {
    50: { light: '#f0fdf4', dark: '#14412a' },
    100: { light: '#dcfce7', dark: '#166534' },
    200: { light: '#bbf7d0', dark: '#15803d' },
    300: { light: '#86efac', dark: '#16a34a' },
    400: { light: '#4ade80', dark: '#22c55e' },
    500: { light: '#22c55e', dark: '#4ade80' },
    600: { light: '#16a34a', dark: '#86efac' },
    700: { light: '#15803d', dark: '#bbf7d0' },
    800: { light: '#166534', dark: '#dcfce7' },
    900: { light: '#14532d', dark: '#f0fdf4' },
    950: { light: '#052e16', dark: '#f0fdf4' },
  },

  // Warning - Cautionary actions and alerts (yellow/amber)
  warning: {
    50: { light: '#fffbeb', dark: '#451a03' },
    100: { light: '#fef3c7', dark: '#78350f' },
    200: { light: '#fde68a', dark: '#92400e' },
    300: { light: '#fcd34d', dark: '#b45309' },
    400: { light: '#fbbf24', dark: '#d97706' },
    500: { light: '#f59e0b', dark: '#f59e0b' },
    600: { light: '#d97706', dark: '#fbbf24' },
    700: { light: '#b45309', dark: '#fcd34d' },
    800: { light: '#92400e', dark: '#fde68a' },
    900: { light: '#78350f', dark: '#fef3c7' },
    950: { light: '#451a03', dark: '#fffbeb' },
  },

  // Danger/Error - Destructive actions and errors (red)
  danger: {
    50: { light: '#fef2f2', dark: '#450a0a' },
    100: { light: '#fee2e2', dark: '#7f1d1d' },
    200: { light: '#fecaca', dark: '#991b1b' },
    300: { light: '#fca5a5', dark: '#b91c1c' },
    400: { light: '#f87171', dark: '#dc2626' },
    500: { light: '#ef4444', dark: '#f87171' },
    600: { light: '#dc2626', dark: '#fca5a5' },
    700: { light: '#b91c1c', dark: '#fecaca' },
    800: { light: '#991b1b', dark: '#fee2e2' },
    900: { light: '#7f1d1d', dark: '#fef2f2' },
    950: { light: '#450a0a', dark: '#fef2f2' },
  },

  // Info - Informational elements (blue variant)
  info: {
    50: { light: '#f0f9ff', dark: '#0c2744' },
    100: { light: '#e0f2fe', dark: '#0c4a6e' },
    200: { light: '#bae6fd', dark: '#075985' },
    300: { light: '#7dd3fc', dark: '#0369a1' },
    400: { light: '#38bdf8', dark: '#0284c7' },
    500: { light: '#0ea5e9', dark: '#38bdf8' },
    600: { light: '#0284c7', dark: '#7dd3fc' },
    700: { light: '#0369a1', dark: '#bae6fd' },
    800: { light: '#075985', dark: '#e0f2fe' },
    900: { light: '#0c4a6e', dark: '#f0f9ff' },
    950: { light: '#082f49', dark: '#f0f9ff' },
  },

  // Neutral - Backgrounds, borders, text (gray)
  neutral: {
    50: { light: '#f9fafb', dark: '#111827' },
    100: { light: '#f3f4f6', dark: '#1f2937' },
    200: { light: '#e5e7eb', dark: '#374151' },
    300: { light: '#d1d5db', dark: '#4b5563' },
    400: { light: '#9ca3af', dark: '#6b7280' },
    500: { light: '#6b7280', dark: '#9ca3af' },
    600: { light: '#4b5563', dark: '#d1d5db' },
    700: { light: '#374151', dark: '#e5e7eb' },
    800: { light: '#1f2937', dark: '#f3f4f6' },
    900: { light: '#111827', dark: '#f9fafb' },
    950: { light: '#030712', dark: '#ffffff' },
  },

  // Surface colors - For cards, modals, popups
  surface: {
    background: { light: '#ffffff', dark: '#0f172a' },
    foreground: { light: '#f9fafb', dark: '#1e293b' },
    elevated: { light: '#ffffff', dark: '#334155' },
    overlay: { light: 'rgba(0, 0, 0, 0.5)', dark: 'rgba(0, 0, 0, 0.7)' },
  },

  // Text colors
  text: {
    primary: { light: '#111827', dark: '#f9fafb' },
    secondary: { light: '#4b5563', dark: '#9ca3af' },
    tertiary: { light: '#9ca3af', dark: '#6b7280' },
    inverse: { light: '#ffffff', dark: '#111827' },
    link: { light: '#2563eb', dark: '#60a5fa' },
    linkHover: { light: '#1d4ed8', dark: '#93c5fd' },
  },

  // Border colors
  border: {
    light: { light: '#e5e7eb', dark: '#374151' },
    medium: { light: '#d1d5db', dark: '#4b5563' },
    heavy: { light: '#9ca3af', dark: '#6b7280' },
    focus: { light: '#3b82f6', dark: '#60a5fa' },
  },
} as const;

// Type definitions for better TypeScript support
export type ColorCategory = keyof typeof colors;
export type ColorShade =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | '950';
export type ThemeMode = 'light' | 'dark';

/**
 * Helper function to get a color value for a specific theme
 */
export function getColor(
  category: ColorCategory,
  shade: string,
  mode: ThemeMode
): string {
  const colorCategory = colors[category];
  if (!colorCategory) return '#000000';

  const colorShade = colorCategory[shade as keyof typeof colorCategory];
  if (!colorShade) return '#000000';

  if (typeof colorShade === 'object' && 'light' in colorShade) {
    return colorShade[mode];
  }

  return '#000000';
}

/**
 * Generate CSS custom properties for a theme mode
 */
export function generateCSSVariables(mode: ThemeMode): Record<string, string> {
  const variables: Record<string, string> = {};

  for (const [category, shades] of Object.entries(colors)) {
    for (const [shade, values] of Object.entries(shades)) {
      if (typeof values === 'object' && 'light' in values) {
        variables[`--color-${category}-${shade}`] = values[mode];
      }
    }
  }

  return variables;
}
