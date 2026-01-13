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

  const fetchData = useCallback(async () => {
    try {
      const postsData = await apiFetch<UserPostsResponse>(
        `/next-proxy/users/${resolvedParams.userId}/posts`
      );

      if (postsData.headers.status === 404) {
        setError(t('errors.notFound'));
      } else {
        setProfileUser(postsData.body?.user || null);
        setPosts(postsData.body?.posts || []);
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
          (response.body as ApiErrorBody)?.error || t('posts.delete.error')
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
          <Avatar name={profileUser.name} size='xl' />
          <div>
            <h1 className='text-2xl font-bold text-text-primary'>
              {profileUser.name}
            </h1>
            <p className='text-text-secondary'>{profileUser.email}</p>
            <p className='text-sm text-text-tertiary mt-1'>
              {posts.length} post{posts.length !== 1 ? 's' : ''}
            </p>
          </div>
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
