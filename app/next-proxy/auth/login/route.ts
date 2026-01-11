// ============================================
// Auth API Routes - Controller Layer
// ============================================
// RESTful Endpoint: POST /next-proxy/auth/login
// HTTP Method: POST
// Request Body: { email: string, password: string }

import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/models';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Attempt login
    const user = await loginUser(email, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
