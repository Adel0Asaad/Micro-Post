// ============================================
// Single Post API Routes - Controller Layer
// ============================================
// RESTful Endpoints:
// - GET /next-proxy/posts/[postId] - Get a specific post
// - DELETE /next-proxy/posts/[postId] - Delete a post
//   URL: /next-proxy/posts/{postId}
//   HTTP Method: DELETE
//   Request Body: None

import { NextRequest, NextResponse } from 'next/server';
import { getPostById, deleteUserPost } from '@/lib/models';
import { getSession } from '@/lib/auth';

// GET /next-proxy/posts/[postId] - Get a specific post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { postId } = await params;
    const post = await getPostById(postId);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /next-proxy/posts/[postId] - Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { postId } = await params;

    // Attempt to delete (will fail if post doesn't belong to user)
    const deletedPost = await deleteUserPost(postId, session.userId);

    if (!deletedPost) {
      return NextResponse.json(
        { error: "Post not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Post deleted successfully',
      post: deletedPost,
    });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
