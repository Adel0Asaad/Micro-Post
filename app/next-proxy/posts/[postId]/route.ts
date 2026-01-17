// ============================================
// Single Post Proxy Routes
// ============================================
// Proxies to Express backend:
// - GET /api/posts/:postId
// - PUT /api/posts/:postId
// - DELETE /api/posts/:postId

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params;
  return proxyToBackend(request, `/api/posts/${postId}`);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params;
  return proxyToBackend(request, `/api/posts/${postId}`);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params;
  return proxyToBackend(request, `/api/posts/${postId}`);
}
