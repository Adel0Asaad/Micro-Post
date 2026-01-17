// ============================================
// Unlike Post Proxy Routes
// ============================================
// Proxies to Express backend:
// - DELETE /api/likes/:postId - Unlike a post

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

interface RouteParams {
  params: Promise<{ postId: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { postId } = await params;
  return proxyToBackend(request, `/api/likes/${postId}`);
}
