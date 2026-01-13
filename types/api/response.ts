/**
 * Standard backend response format
 * All API responses follow this structure
 */
export interface BackendResponse<T = Record<string, unknown>> {
  headers: {
    status: number;
    description: string;
  };
  body: T;
}

/**
 * Fetch options for API calls
 * Extends RequestInit but allows any body type (will be JSON stringified)
 */
export type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

/**
 * API error response body
 */
export interface ApiErrorBody {
  error: string;
  message?: string;
}
