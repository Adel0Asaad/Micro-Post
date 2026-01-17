// ============================================
// Post Replies Proxy Routes
// ============================================
// Proxies to Express backend:
// - POST /api/posts/:postId/replies - Create a reply
// - GET /api/posts/:postId/replies - Get post replies

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

interface RouteParams {
  params: Promise<{ postId: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { postId } = await params;
  return proxyToBackend(request, `/api/posts/${postId}/replies`);
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { postId } = await params;
  return proxyToBackend(request, `/api/posts/${postId}/replies`);
}
