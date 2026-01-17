// ============================================
// Follows User Proxy Routes
// ============================================
// Proxies to Express backend:
// - DELETE /api/follows/:userId - Unfollow a user

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

interface RouteParams {
  params: Promise<{ userId: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { userId } = await params;
  return proxyToBackend(request, `/api/follows/${userId}`);
}
