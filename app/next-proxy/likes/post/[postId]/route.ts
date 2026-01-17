// ============================================
// Post Likes Proxy Routes
// ============================================
// Proxies to Express backend:
// - GET /api/likes/post/:postId - Get users who liked a post

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

interface RouteParams {
  params: Promise<{ postId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { postId } = await params;
  return proxyToBackend(request, `/api/likes/post/${postId}`);
}
