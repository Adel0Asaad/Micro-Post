'use client';

import React, { useEffect, useState, use, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageContainer } from '@/components/layout';
import { PostList } from '@/components/posts';
import { Alert, Avatar, Button } from '@/components/ui';
import { useTranslations } from '@/lib/i18n';
import { useAuth } from '@/lib/useAuth';
import { apiFetch } from '@/lib/api';
import type { Post, User, UserPostsResponse, ApiErrorBody } from '@/types';

export default function UserPostsPage({
  params,
}: {
  params: Promise<{ userId: string; locale: string }>;
}) {
  const resolvedParams = use(params);
  const routeParams = useParams();
  const locale = routeParams.locale as string;
  const { t } = useTranslations();
  const { user: currentUser, isLoading: authLoading } = useAuth({
    required: true,
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const postsData = await apiFetch<UserPostsResponse>(
        `/next-proxy/users/${resolvedParams.userId}/posts`,
      );

      if (postsData.headers.status === 404) {
        setError(t('errors.notFound'));
      } else {
        const userData = postsData.body?.user;
        // console.log({ userData });
        setProfileUser(userData || null);
        setIsFollowing(userData?.isFollowing || false);
        setFollowersCount(userData?.followersCount || 0);
        setFollowingCount(userData?.followingCount || 0);
        setPosts(
          postsData.body?.posts?.map?.((post) => ({
            ...post,
            user: userData,
          })) || [],
        );
      }
    } catch {
      setError(t('users.posts.error'));
    } finally {
      setIsLoading(false);
    }
  }, [resolvedParams.userId, t]);

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, fetchData]);

  const handleDeletePost = async (postId: string) => {
    setDeletingPostId(postId);
    try {
      const response = await apiFetch(`/next-proxy/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.headers.status >= 400) {
        throw new Error(
          (response.body as ApiErrorBody)?.error || t('posts.delete.error'),
        );
      }

      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('posts.delete.error'));
    } finally {
      setDeletingPostId(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <PageContainer>
        <div className='flex justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600'></div>
        </div>
      </PageContainer>
    );
  }

  const isOwnProfile = currentUser?.id === profileUser?.id;

  const handleFollowToggle = async () => {
    if (isFollowLoading || isOwnProfile || !profileUser) return;
    setIsFollowLoading(true);

    try {
      if (isFollowing) {
        const response = await apiFetch(
          `/next-proxy/follows/${profileUser.id}`,
          {
            method: 'DELETE',
          },
        );
        if (response.headers.status < 400) {
          setIsFollowing(false);
          setFollowersCount((prev) => Math.max(0, prev - 1));
        }
      } else {
        const response = await apiFetch('/next-proxy/follows', {
          method: 'POST',
          body: { userId: profileUser.id },
        });
        if (response.headers.status < 400) {
          setIsFollowing(true);
          setFollowersCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (!profileUser) {
    return (
      <PageContainer>
        <Alert type='error'>{t('errors.notFound')}</Alert>
        <Link href={`/${locale}/users`} className='mt-4 inline-block'>
          <Button variant='secondary'>{t('common.back')}</Button>
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* User Profile Header */}
      <div className='bg-surface-elevated rounded-xl shadow-sm border border-border-light p-6 mb-8'>
        <div className='flex items-center gap-4'>
          <Avatar name={profileUser.name} userId={profileUser.id} size='xl' />
          <div className='flex-1'>
            <h1 className='text-2xl font-bold text-text-primary'>
              {profileUser.name}
            </h1>
            <p className='text-text-secondary'>{profileUser.email}</p>
            <div className='flex items-center gap-4 mt-2 text-sm text-text-tertiary'>
              <span>
                <strong className='text-text-primary'>{posts.length}</strong>{' '}
                {t('users.postsCount')}
              </span>
              <span>
                <strong className='text-text-primary'>{followersCount}</strong>{' '}
                {t('users.followers')}
              </span>
              <span>
                <strong className='text-text-primary'>{followingCount}</strong>{' '}
                {t('users.following')}
              </span>
            </div>
          </div>
          {!isOwnProfile && currentUser && (
            <Button
              variant={isFollowing ? 'secondary' : 'primary'}
              onClick={handleFollowToggle}
              isLoading={isFollowLoading}
            >
              {isFollowing ? t('users.unfollow') : t('users.follow')}
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert type='error' className='mb-6' onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <h2 className='text-xl font-semibold text-text-primary mb-4'>
        {t('users.posts.title', { name: profileUser.name })}
      </h2>

      <PostList
        posts={posts}
        currentUserId={currentUser?.id}
        onDeletePost={handleDeletePost}
        deletingPostId={deletingPostId}
        emptyMessage={t('users.posts.empty', { name: profileUser.name })}
        showTranslations
      />
    </PageContainer>
  );
}
