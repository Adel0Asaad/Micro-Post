'use client';

import React from 'react';
import { PostCard } from './PostCard';
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

interface PostListProps {
  posts: Post[];
  currentUserId?: string;
  onDeletePost?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  deletingPostId?: string | null;
  emptyMessage?: string;
  showTranslations?: boolean;
}

export function PostList({
  posts,
  currentUserId,
  onDeletePost,
  onDelete,
  deletingPostId,
  emptyMessage,
  showTranslations = false,
}: PostListProps) {
  const { t } = useTranslations();
  const [selectedLanguages, setSelectedLanguages] = React.useState<
    Record<string, string>
  >({});

  const handleLanguageChange = (postId: string, languageCode: string) => {
    setSelectedLanguages((prev) => ({
      ...prev,
      [postId]: languageCode,
    }));
  };

  const handleDelete = onDeletePost || onDelete;

  if (posts.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='text-text-tertiary text-6xl mb-4'>📝</div>
        <p className='text-text-secondary'>
          {emptyMessage || t('posts.empty')}
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onDelete={handleDelete}
          isDeleting={deletingPostId === post.id}
          showTranslations={showTranslations}
          selectedLanguage={selectedLanguages[post.id]}
          onLanguageChange={(lang) => handleLanguageChange(post.id, lang)}
        />
      ))}
    </div>
  );
}
