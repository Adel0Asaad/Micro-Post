// ============================================
// Followers List Proxy Routes
// ============================================
// Proxies to Express backend:
// - GET /api/follows/followers - Get current user's followers

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/api/follows/followers');
}
