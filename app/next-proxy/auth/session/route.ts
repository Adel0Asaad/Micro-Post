// ============================================
// Auth Session Proxy Route
// ============================================
// Proxies to Express backend: GET /api/auth/session

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/api/auth/session');
}
