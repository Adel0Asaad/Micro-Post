// ============================================
// Users API Route - Controller Layer
// ============================================
// RESTful Endpoint: GET /next-proxy/users
// Returns list of all users in the system

import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/models';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const users = await getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
