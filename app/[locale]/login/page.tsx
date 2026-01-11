'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LoginForm, RegisterForm } from '@/components/auth';
import { PageContainer } from '@/components/layout';

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async (email: string, password: string) => {
    const response = await fetch('/next-proxy/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.body?.error || 'Login failed');
    }

    router.push(`/${locale}/feed`);
    router.refresh();
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string
  ) => {
    const response = await fetch('/next-proxy/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.body?.error || 'Registration failed');
    }

    router.push(`/${locale}/feed`);
    router.refresh();
  };

  return (
    <PageContainer className='flex items-center justify-center min-h-[80vh]'>
      {isLogin ? (
        <LoginForm
          onSubmit={handleLogin}
          onSwitchToRegister={() => setIsLogin(false)}
        />
      ) : (
        <RegisterForm
          onSubmit={handleRegister}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </PageContainer>
  );
}
