// ============================================
// Backend Proxy Utility
// ============================================
// Forwards requests to Express backend and handles
// the standardized response format

import { NextRequest, NextResponse } from 'next/server';
import type { BackendResponse } from '@/types';

const BACKEND_URL = process.env.BACKEND_URL;

// Re-export for backwards compatibility
export type { BackendResponse } from '@/types';

/**
 * Proxy a request to the Express backend
 * Handles cookies for HTTP-only token authentication
 */
export async function proxyToBackend(
  request: NextRequest,
  backendPath: string,
  options?: {
    method?: string;
    body?: unknown;
  }
): Promise<NextResponse> {
  try {
    if (!BACKEND_URL) throw new Error('BACKEND_URL is not defined');
    const method = options?.method || request.method;
    const cookieHeader = request.headers.get('cookie') || '';

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
    };

    // Add body for non-GET requests
    if (options?.body) {
      fetchOptions.body = JSON.stringify(options.body);
    } else if (method !== 'GET' && method !== 'HEAD') {
      try {
        const body = await request.json();
        fetchOptions.body = JSON.stringify(body);
      } catch {
        // No body, that's fine (in case of logout for example, we POST but we do not have a body.)
      }
    }

    const response = await fetch(`${BACKEND_URL}${backendPath}`, fetchOptions);

    // Get the response data
    const data = await response.json();

    // Create Next.js response with the same status
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });

    // Forward Set-Cookie headers from backend (for HTTP-only auth token)
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    console.error('Backend proxy error:', error);
    return NextResponse.json(
      {
        headers: {
          status: 503,
          description: 'Service Unavailable',
        },
        body: {
          error: 'Backend service unavailable',
        },
      },
      { status: 503 }
    );
  }
}

/**
 * Extract the body from backend response format
 * Use this on the frontend to get the actual data
 */
export function extractBody<T>(response: BackendResponse<T>): T {
  return response.body;
}

/**
 * Check if response is successful (2xx status)
 */
export function isSuccess(response: BackendResponse): boolean {
  return response.headers.status >= 200 && response.headers.status < 300;
}
