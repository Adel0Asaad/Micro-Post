// ============================================
// Auth Register API Route - Controller Layer
// ============================================
// RESTful Endpoint: POST /next-proxy/auth/register

import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/models';
import { signToken, setAuthCookie } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user
    const user = await createUser(email, password, name);

    // Create JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
