// ============================================
// User Liked Posts Proxy Routes
// ============================================
// Proxies to Express backend:
// - GET /api/likes/user - Get current user's liked posts

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/api/likes/user');
}
