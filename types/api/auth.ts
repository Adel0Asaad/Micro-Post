import type { User } from '../models/user';

/**
 * Session user - the currently authenticated user
 */
export type SessionUser = Pick<User, 'id' | 'name' | 'email'>;

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Auth session response
 */
export interface SessionResponse {
  user: SessionUser | null;
}
