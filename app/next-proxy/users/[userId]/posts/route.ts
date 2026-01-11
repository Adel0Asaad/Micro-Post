// ============================================
// User Posts API Route - Controller Layer
// ============================================
// RESTful Endpoint: GET /next-proxy/users/[userId]/posts
// URL: /next-proxy/users/{userId}/posts
// HTTP Method: GET
// Returns all posts for a specific user

import { NextRequest, NextResponse } from 'next/server';
import { getUserPosts, getUserById } from '@/lib/models';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Check if user is authenticated
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { userId } = await params;

    // Check if user exists
    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const posts = await getUserPosts(userId);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      posts,
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
