'use client';

import React from 'react';
import { Card, Avatar, Button } from '@/components/ui';
import { useTranslations } from '@/lib/i18n';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onDelete?: (postId: string) => void;
  isDeleting?: boolean;
  showTranslations?: boolean;
  selectedLanguage?: string;
  onLanguageChange?: (languageCode: string) => void;
}

export function PostCard({
  post,
  currentUserId,
  onDelete,
  isDeleting = false,
  showTranslations = false,
  selectedLanguage,
  onLanguageChange,
}: PostCardProps) {
  const { t } = useTranslations();
  const isOwner = currentUserId === post.user.id;
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Get translated content if available
  const displayContent =
    selectedLanguage && post.translations
      ? post.translations.find((tr) => tr.languageCode === selectedLanguage)
          ?.content || post.content
      : post.content;

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <div className='flex gap-3'>
        <Avatar name={post.user.name} size='md' />
        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2 min-w-0'>
              <span className='font-semibold text-text-primary truncate'>
                {post.user.name}
              </span>
              <span className='text-text-tertiary text-sm truncate'>
                @{post.user.email.split('@')[0]}
              </span>
            </div>
            <span className='text-text-tertiary text-sm whitespace-nowrap'>
              {formattedDate}
            </span>
          </div>

          <p className='mt-2 text-text-secondary whitespace-pre-wrap break-words'>
            {displayContent}
          </p>

          {/* Translation selector */}
          {showTranslations &&
            post.translations &&
            post.translations.length > 0 && (
              <div className='mt-3 flex items-center gap-2'>
                <span className='text-sm text-text-tertiary'>
                  {t('posts.translation.label')}
                </span>
                <select
                  value={selectedLanguage || ''}
                  onChange={(e) => onLanguageChange?.(e.target.value)}
                  className='text-sm border border-border-medium rounded px-2 py-1 bg-surface-elevated text-text-primary'
                >
                  <option value=''>{t('posts.translation.original')}</option>
                  {post.translations.map((tr) => (
                    <option key={tr.languageCode} value={tr.languageCode}>
                      {tr.languageName}
                    </option>
                  ))}
                </select>
              </div>
            )}

          {/* Delete button for owner */}
          {isOwner && onDelete && (
            <div className='mt-3 flex justify-end'>
              <Button
                variant='danger'
                size='sm'
                onClick={() => onDelete(post.id)}
                isLoading={isDeleting}
              >
                {t('posts.delete.button')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
