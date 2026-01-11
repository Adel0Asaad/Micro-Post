// ============================================
// User Posts Proxy Route
// ============================================
// Proxies to Express backend: GET /api/users/:userId/posts

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  return proxyToBackend(request, `/api/users/${userId}/posts`);
}
