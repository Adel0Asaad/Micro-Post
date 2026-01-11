'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageContainer } from '@/components/layout';
import { UserList } from '@/components/users';
import { Alert } from '@/components/ui';
import { useTranslations } from '@/lib/i18n';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export default function UsersPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { t } = useTranslations();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // Check session
      const sessionRes = await fetch('/next-proxy/auth/session');
      if (!sessionRes.ok) {
        router.push(`/${locale}/login`);
        return;
      }

      // Fetch users
      const usersRes = await fetch('/next-proxy/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users);
      }
    } catch {
      setError(t('users.error'));
    } finally {
      setIsLoading(false);
    }
  }, [router, locale, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className='flex justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600'></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={t('users.title')} subtitle={t('users.subtitle')}>
      {error && (
        <Alert type='error' className='mb-6' onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <UserList users={users} />
    </PageContainer>
  );
}
