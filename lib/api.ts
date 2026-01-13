// ============================================
// API Client with Auth Handling
// ============================================
// Centralized fetch wrapper that handles 401 responses
// with automatic token refresh and consistent error handling

import type {
  BackendResponse,
  FetchOptions,
  SessionUser,
  SessionResponse,
} from '@/types';

// Re-export types for convenience
export type { BackendResponse, FetchOptions, SessionUser } from '@/types';

// Track if we're currently refreshing to prevent multiple refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Check if user is currently on the login page
 */
function isOnLoginPage(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.includes('/login');
}

/**
 * Attempt to refresh the auth token
 * Returns true if refresh succeeded, false otherwise
 */
async function refreshToken(): Promise<boolean> {
  // If already refreshing, wait for that attempt
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch('/next-proxy/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return true;
      }

      // Check if refresh token is missing (400 - "Refresh token is required")
      // In this case, user simply needs to login - don't force redirect
      if (response.status === 400) {
        const data = await response.json().catch(() => null);
        if (data?.headers?.description === 'Refresh token is required') {
          // No refresh token - user just needs to login naturally
          return false;
        }
      }

      // Refresh failed for other reasons - clear cookies and redirect
      await clearAuthAndRedirect();
      return false;
    } catch {
      await clearAuthAndRedirect();
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Clear auth cookies and redirect to login
 */
async function clearAuthAndRedirect(): Promise<void> {
  if (typeof window === 'undefined') return;

  // Never redirect if already on login page
  if (isOnLoginPage()) return;

  // Clear cookies by setting them as expired
  document.cookie =
    'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie =
    'refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  const locale = window.location.pathname.split('/')[1] || 'en';
  window.location.href = `/${locale}/login`;
}

/**
 * Authenticated fetch wrapper
 * - Automatically handles 401 responses by attempting token refresh
 * - Retries the original request after successful refresh
 * - Redirects to login if refresh fails
 * - Provides consistent JSON parsing
 */
export async function apiFetch<T = unknown>(
  url: string,
  options?: FetchOptions
): Promise<BackendResponse<T>> {
  const { body, ...rest } = options || {};

  const fetchOptions: RequestInit = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...rest?.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  let response = await fetch(url, fetchOptions);

  // Handle 401 Unauthorized - attempt token refresh
  if (response.status === 401) {
    // Don't try to refresh if we're already on the refresh endpoint
    if (url.includes('/auth/refresh')) {
      throw new AuthError('Refresh failed');
    }

    const refreshed = await refreshToken();

    if (refreshed) {
      // Retry the original request with new tokens
      response = await fetch(url, fetchOptions);

      // If still 401 after refresh, give up
      if (response.status === 401) {
        await clearAuthAndRedirect();
        throw new AuthError('Unauthorized');
      }
    } else {
      throw new AuthError('Unauthorized');
    }
  }

  const data: BackendResponse<T> = await response.json();
  return data;
}

/**
 * Custom error for auth failures
 */
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Check if user is authenticated
 * Returns user data or null
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const response = await apiFetch<SessionResponse>(
      '/next-proxy/auth/session'
    );
    return response.body?.user || null;
  } catch (error) {
    if (error instanceof AuthError) {
      return null;
    }
    throw error;
  }
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use in pages that require login
 */
export async function requireAuth(
  locale: string = 'en'
): Promise<SessionUser | null> {
  const user = await getSession();
  if (!user && typeof window !== 'undefined') {
    window.location.href = `/${locale}/login`;
    return null;
  }
  return user;
}
