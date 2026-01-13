'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { PageContainer } from '@/components/layout';
import { CreatePostForm, PostList } from '@/components/posts';
import { Alert } from '@/components/ui';
import { useTranslations } from '@/lib/i18n';
import { useAuth } from '@/lib/useAuth';
import { apiFetch } from '@/lib/api';
import type { Post, PostsResponse, ApiErrorBody } from '@/types';

export default function MyPostsPage() {
  const { t } = useTranslations();
  const { user, isLoading: authLoading } = useAuth({ required: true });
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!user) return;
    try {
      const postsData = await apiFetch<PostsResponse>(
        `/next-proxy/users/${user.id}/posts`
      );
      setPosts(postsData.body?.posts || []);
    } catch {
      setError(t('myPosts.error'));
    } finally {
      setIsLoading(false);
    }
  }, [user, t]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchPosts();
    }
  }, [authLoading, user, fetchPosts]);

  const handleCreatePost = async (content: string) => {
    const response = await apiFetch('/next-proxy/posts', {
      method: 'POST',
      body: { content },
    });

    if (response.headers.status >= 400) {
      throw new Error(
        (response.body as ApiErrorBody)?.error || t('posts.create.error.failed')
      );
    }

    // Refresh posts
    fetchPosts();
  };

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

      // Remove post from local state
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

  return (
    <PageContainer title={t('myPosts.title')} subtitle={t('myPosts.subtitle')}>
      {error && (
        <Alert type='error' className='mb-6' onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <CreatePostForm onSubmit={handleCreatePost} />

      {posts.length === 0 ? (
        <div className='text-center py-12 text-text-secondary'>
          {t('posts.myPostsEmpty')}
        </div>
      ) : (
        <PostList
          posts={posts}
          currentUserId={user?.id}
          onDelete={handleDeletePost}
          deletingPostId={deletingPostId}
        />
      )}
    </PageContainer>
  );
}
