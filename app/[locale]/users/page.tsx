'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { PageContainer } from '@/components/layout';
import { UserList } from '@/components/users';
import { Alert } from '@/components/ui';
import { useTranslations } from '@/lib/i18n';
import { useAuth } from '@/lib/useAuth';
import { apiFetch } from '@/lib/api';
import type { User, UsersResponse } from '@/types';

export default function UsersPage() {
  const { t } = useTranslations();
  const { user, isLoading: authLoading } = useAuth({ required: true });
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const usersData = await apiFetch<UsersResponse>('/next-proxy/users');
      setUsers(usersData.body?.users || []);
    } catch {
      setError(t('users.error'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!authLoading) {
      fetchUsers();
    }
  }, [authLoading, fetchUsers]);

  if (authLoading || isLoading) {
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

      <UserList users={users} currentUserId={user?.id} />
    </PageContainer>
  );
}
