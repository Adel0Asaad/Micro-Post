// ============================================
// Posts Proxy Routes
// ============================================
// Proxies to Express backend:
// - GET /api/posts
// - POST /api/posts

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/api/posts');
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/api/posts');
}
