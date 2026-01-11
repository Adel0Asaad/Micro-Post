// ============================================
// Posts API Routes - Controller Layer
// ============================================
// RESTful Endpoints:
// - GET /next-proxy/posts - Get all posts
// - POST /next-proxy/posts - Create a new post
//   URL: /next-proxy/posts
//   HTTP Method: POST
//   Request Body: { content: string }

import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/lib/models';
import { getSession } from '@/lib/auth';

// GET /next-proxy/posts - Get all posts
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const posts = await getAllPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /next-proxy/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content } = body;

    // Validate input
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Validate content length (micro-post should be short)
    if (content.length > 280) {
      return NextResponse.json(
        { error: 'Content must be 280 characters or less' },
        { status: 400 }
      );
    }

    const post = await createPost(session.userId, content.trim());

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
