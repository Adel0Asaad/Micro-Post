// ============================================
// Auth Logout Proxy Route
// ============================================
// Proxies to Express backend: POST /api/auth/logout

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/api/auth/logout');
}
