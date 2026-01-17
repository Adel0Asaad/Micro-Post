// ============================================
// Following List Proxy Routes
// ============================================
// Proxies to Express backend:
// - GET /api/follows/following - Get users current user is following

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/api/follows/following');
}
