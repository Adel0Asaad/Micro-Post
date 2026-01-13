'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Avatar, Button } from '@/components/ui';
import { useLocale, useTranslations } from '@/lib/i18n';
import type { User } from '@/types';

interface UserCardProps {
  user: User;
  showViewPosts?: boolean;
}

export function UserCard({ user, showViewPosts = true }: UserCardProps) {
  const { locale } = useLocale();
  const { t } = useTranslations();
  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <div className='flex items-center gap-4'>
        <Avatar name={user.name} size='lg' />
        <div className='flex-1 min-w-0'>
          <h3 className='font-semibold text-text-primary truncate'>
            {user.name}
          </h3>
          <p className='text-sm text-text-secondary truncate'>{user.email}</p>
          {formattedDate && (
            <p className='text-xs text-text-tertiary mt-1'>
              {t('users.joined')} {formattedDate}
            </p>
          )}
        </div>
        {showViewPosts && (
          <Link href={`/${locale}/users/${user.id}/posts`}>
            <Button variant='secondary' size='sm'>
              {t('users.viewPosts')}
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
