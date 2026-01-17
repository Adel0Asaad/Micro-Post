// ============================================
// Following Feed Proxy Routes
// ============================================
// Proxies to Express backend:
// - GET /api/follows/following/posts - Get posts from followed users

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/api/follows/following/posts');
}
