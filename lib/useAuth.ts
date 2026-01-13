'use client';

// ============================================
// Auth Hook for Client Components
// ============================================
// React hook for session management with automatic
// 401 handling and redirect

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import type { SessionUser, SessionResponse } from '@/types';
import { apiFetch, AuthError } from './api';

interface UseAuthOptions {
  required?: boolean; // If true, redirects to login when not authenticated
}

interface UseAuthReturn {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
  const { required = false } = options;
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const locale = (params.locale as string) || 'en';

  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch<SessionResponse>(
        '/next-proxy/auth/session'
      );
      const sessionUser = response.body?.user || null;
      setUser(sessionUser);

      if (required && !sessionUser) {
        router.push(`/${locale}/login`);
      }
    } catch (error) {
      if (error instanceof AuthError) {
        setUser(null);
        if (required) {
          router.push(`/${locale}/login`);
        }
      } else {
        console.error('Session fetch error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [required, router, locale]);

  const logout = useCallback(async () => {
    try {
      await apiFetch('/next-proxy/auth/logout', { method: 'POST' });
      setUser(null);
      router.push(`/${locale}/login`);
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect on logout error
      router.push(`/${locale}/login`);
    }
  }, [router, locale]);

  // Refetch session on mount and when pathname changes (e.g., after login redirect)
  useEffect(() => {
    fetchSession();
  }, [fetchSession, pathname]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    refetch: fetchSession,
    logout,
  };
}
