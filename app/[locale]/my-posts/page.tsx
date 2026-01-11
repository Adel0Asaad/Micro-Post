'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageContainer } from '@/components/layout';
import { CreatePostForm, PostList } from '@/components/posts';
import { Alert } from '@/components/ui';
import { useTranslations } from '@/lib/i18n';

interface Post {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  translations?: Array<{
    languageCode: string;
    languageName: string;
    content: string;
  }>;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function MyPostsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { t } = useTranslations();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // Fetch session
      const sessionRes = await fetch('/next-proxy/auth/session');
      if (!sessionRes.ok) {
        router.push(`/${locale}/login`);
        return;
      }
      const sessionData = await sessionRes.json();
      const currentUser = sessionData.body?.user;
      setUser(currentUser || null);

      // Fetch user's posts
      const postsRes = await fetch(
        `/next-proxy/users/${currentUser?.id}/posts`
      );
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData.body?.posts || []);
      }
    } catch {
      setError(t('myPosts.error'));
    } finally {
      setIsLoading(false);
    }
  }, [router, locale, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreatePost = async (content: string) => {
    const response = await fetch('/next-proxy/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.body?.error || t('posts.create.error.failed'));
    }

    // Refresh posts
    fetchData();
  };

  const handleDeletePost = async (postId: string) => {
    setDeletingPostId(postId);
    try {
      const response = await fetch(`/next-proxy/posts/${postId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.body?.error || t('posts.delete.error'));
      }

      // Remove post from local state
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('posts.delete.error'));
    } finally {
      setDeletingPostId(null);
    }
  };

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
