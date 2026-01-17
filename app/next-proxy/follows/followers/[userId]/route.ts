// ============================================
// User Followers List Proxy Routes
// ============================================
// Proxies to Express backend:
// - GET /api/follows/followers/:userId - Get a user's followers

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

interface RouteParams {
  params: Promise<{ userId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { userId } = await params;
  return proxyToBackend(request, `/api/follows/followers/${userId}`);
}
