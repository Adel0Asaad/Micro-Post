// ============================================
// Check Like Status Proxy Routes
// ============================================
// Proxies to Express backend:
// - GET /api/likes/check/:postId - Check if post is liked

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

interface RouteParams {
  params: Promise<{ postId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { postId } = await params;
  return proxyToBackend(request, `/api/likes/check/${postId}`);
}
