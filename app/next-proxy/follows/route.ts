// ============================================
// Follows Proxy Routes
// ============================================
// Proxies to Express backend:
// - POST /api/follows - Follow a user

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/api/follows');
}
