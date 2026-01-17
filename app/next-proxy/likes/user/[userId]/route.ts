// ============================================
// Specific User Liked Posts Proxy Routes
// ============================================
// Proxies to Express backend:
// - GET /api/likes/user/:userId - Get a user's liked posts

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

interface RouteParams {
  params: Promise<{ userId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { userId } = await params;
  return proxyToBackend(request, `/api/likes/user/${userId}`);
}
