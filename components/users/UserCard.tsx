'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, Avatar, Button } from '@/components/ui';
import { useLocale, useTranslations } from '@/lib/i18n';
import { apiFetch } from '@/lib/api';
import type { User } from '@/types';

interface UserCardProps {
  user: User;
  showViewPosts?: boolean;
  currentUserId?: string;
  onFollowChange?: (userId: string, isFollowing: boolean) => void;
}

export function UserCard({
  user,
  showViewPosts = true,
  currentUserId,
  onFollowChange,
}: UserCardProps) {
  const { locale } = useLocale();
  const { t } = useTranslations();
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [isLoading, setIsLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(
    user.followersCount || 0,
  );

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const isOwnProfile = currentUserId === user.id;

  const handleFollowToggle = async () => {
    if (isLoading || isOwnProfile) return;
    setIsLoading(true);

    try {
      if (isFollowing) {
        // Unfollow
        const response = await apiFetch(`/next-proxy/follows/${user.id}`, {
          method: 'DELETE',
        });
        if (response.headers.status < 400) {
          setIsFollowing(false);
          setFollowersCount((prev) => Math.max(0, prev - 1));
          onFollowChange?.(user.id, false);
        }
      } else {
        // Follow
        const response = await apiFetch('/next-proxy/follows', {
          method: 'POST',
          body: { userId: user.id },
        });
        if (response.headers.status < 400) {
          setIsFollowing(true);
          setFollowersCount((prev) => prev + 1);
          onFollowChange?.(user.id, true);
        }
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <div className='flex items-center gap-4'>
        <Link href={`/${locale}/users/${user.id}/posts`}>
          <Avatar
            name={user.name}
            userId={user.id}
            size='lg'
            className='cursor-pointer hover:opacity-80 transition-opacity'
          />
        </Link>
        <div className='flex-1 min-w-0'>
          <Link
            href={`/${locale}/users/${user.id}/posts`}
            className='hover:underline cursor-pointer'
          >
            <h3 className='font-semibold text-text-primary truncate'>
              {user.name}
            </h3>
          </Link>
          <p className='text-sm text-text-secondary truncate'>{user.email}</p>

          {/* Stats row */}
          <div className='flex items-center gap-4 mt-1'>
            {formattedDate && (
              <p className='text-xs text-text-tertiary'>
                {t('users.joined')} {formattedDate}
              </p>
            )}
            {(user.followersCount !== undefined ||
              user.followingCount !== undefined ||
              user.postsCount !== undefined) && (
              <div className='flex items-center gap-3 text-xs text-text-tertiary'>
                {user.postsCount !== undefined && (
                  <span>
                    <strong className='text-text-secondary'>
                      {user.postsCount}
                    </strong>{' '}
                    {t('users.postsCount')}
                  </span>
                )}
                <span>
                  <strong className='text-text-secondary'>
                    {followersCount}
                  </strong>{' '}
                  {t('users.followers')}
                </span>
                {user.followingCount !== undefined && (
                  <span>
                    <strong className='text-text-secondary'>
                      {user.followingCount}
                    </strong>{' '}
                    {t('users.following')}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          {/* Follow/Unfollow button */}
          {!isOwnProfile && currentUserId && (
            <Button
              variant={isFollowing ? 'secondary' : 'primary'}
              size='sm'
              onClick={handleFollowToggle}
              isLoading={isLoading}
            >
              {isFollowing ? t('users.unfollow') : t('users.follow')}
            </Button>
          )}

          {showViewPosts && (
            <Link href={`/${locale}/users/${user.id}/posts`}>
              <Button variant='secondary' size='sm'>
                {t('users.viewPosts')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
