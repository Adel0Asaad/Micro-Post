// ============================================
// Users Proxy Route
// ============================================
// Proxies to Express backend: GET /api/users

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/api/users');
}
