'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, Avatar, Button, TextArea, Alert } from '@/components/ui';
import { useLocale, useTranslations } from '@/lib/i18n';
import { apiFetch } from '@/lib/api';
import type { Post, ApiErrorBody } from '@/types';

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string, newContent: string) => void;
  isDeleting?: boolean;
  showTranslations?: boolean;
  selectedLanguage?: string;
  onLanguageChange?: (languageCode: string) => void;
  showReplies?: boolean;
  isReply?: boolean;
}

export function PostCard({
  post,
  currentUserId,
  onDelete,
  onEdit,
  isDeleting = false,
  showTranslations = false,
  selectedLanguage,
  onLanguageChange,
  showReplies = true,
  isReply = false,
}: PostCardProps) {
  const { locale } = useLocale();
  const { t } = useTranslations();
  const isOwner = currentUserId === post.user.id;
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [replies, setReplies] = useState<Post[]>([]);
  const [showRepliesList, setShowRepliesList] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [repliesCount, setRepliesCount] = useState(post.repliesCount || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState(post.content);

  // Get translated content if available
  const displayContent =
    selectedLanguage && post.translations
      ? post.translations.find((tr) => tr.languageCode === selectedLanguage)
          ?.content || currentContent
      : currentContent;

  const handleLikeToggle = async () => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      if (isLiked) {
        // Unlike
        const response = await apiFetch(`/next-proxy/likes/${post.id}`, {
          method: 'DELETE',
        });
        if (response.headers.status < 400) {
          setIsLiked(false);
          setLikesCount((prev) => Math.max(0, prev - 1));
        }
      } else {
        // Like
        const response = await apiFetch('/next-proxy/likes', {
          method: 'POST',
          body: { postId: post.id },
        });
        if (response.headers.status < 400) {
          setIsLiked(true);
          setLikesCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const refetchReplies = async () => {
    try {
      const response = await apiFetch<{ posts?: Post[]; replies?: Post[] }>(
        `/next-proxy/posts/${post.id}/replies`,
      );
      if (response.headers.status < 400) {
        const repliesData = response.body?.replies || [];
        setReplies(repliesData);
        setRepliesCount(repliesData.length);
      }
    } catch (error) {
      console.error('Failed to refetch replies:', error);
    }
  };

  const handleLoadReplies = async () => {
    if (isLoadingReplies) return;

    if (showRepliesList) {
      setShowRepliesList(false);
      return;
    }

    setIsLoadingReplies(true);
    try {
      const response = await apiFetch<{ posts?: Post[]; replies?: Post[] }>(
        `/next-proxy/posts/${post.id}/replies`,
      );
      // console.log('Replies response:', response);
      if (response.headers.status < 400) {
        const repliesData = response.body?.replies || [];
        // console.log('Parsed replies:', repliesData);
        setReplies(repliesData);
        setShowRepliesList(true);
      }
    } catch (error) {
      console.error('Failed to load replies:', error);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);
    setReplyError(null);

    try {
      const response = await apiFetch(`/next-proxy/posts/${post.id}/replies`, {
        method: 'POST',
        body: { content: replyContent.trim() },
      });

      if (response.headers.status >= 400) {
        throw new Error(
          (response.body as ApiErrorBody)?.error || t('posts.reply.error'),
        );
      }

      setReplyContent('');
      setShowReplyForm(false);
      setRepliesCount((prev) => prev + 1);

      // Always refresh and show replies after creating a reply
      const repliesResponse = await apiFetch<{
        posts?: Post[];
        replies?: Post[];
      }>(`/next-proxy/posts/${post.id}/replies`);
      if (repliesResponse.headers.status < 400) {
        const repliesData =
          repliesResponse.body?.replies || repliesResponse.body?.posts || [];
        setReplies(repliesData);
        setShowRepliesList(true);
      }
    } catch (err) {
      setReplyError(
        err instanceof Error ? err.message : t('posts.reply.error'),
      );
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim() || isSubmittingEdit) return;

    setIsSubmittingEdit(true);
    setEditError(null);

    try {
      const response = await apiFetch(`/next-proxy/posts/${post.id}`, {
        method: 'PUT',
        body: { content: editContent.trim() },
      });

      if (response.headers.status >= 400) {
        throw new Error(
          (response.body as ApiErrorBody)?.error || t('posts.edit.error'),
        );
      }

      setCurrentContent(editContent.trim());
      setIsEditing(false);
      onEdit?.(post.id, editContent.trim());
    } catch (err) {
      setEditError(err instanceof Error ? err.message : t('posts.edit.error'));
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(currentContent);
    setEditError(null);
  };

  return (
    <Card
      className={`hover:shadow-md transition-shadow ${isReply ? 'ml-8 border-l-2 border-primary-200' : ''}`}
    >
      <div className='flex gap-3'>
        <Link href={`/${locale}/users/${post.user.id}/posts`}>
          <Avatar
            name={post.user.name}
            size='md'
            className='cursor-pointer hover:opacity-80 transition-opacity'
          />
        </Link>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2 min-w-0'>
              <Link
                href={`/${locale}/users/${post.user.id}/posts`}
                className='hover:underline cursor-pointer'
              >
                <span className='font-semibold text-text-primary truncate'>
                  {post.user.name}
                </span>
              </Link>
              <span className='text-text-tertiary text-sm truncate'>
                @{post.user.email.split('@')[0]}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              {isOwner && (
                <button
                  onClick={() => {
                    if (!isEditing) {
                      setIsEditing(true);
                      setEditContent(currentContent);
                    } else {
                      handleCancelEdit();
                    }
                  }}
                  className='text-warning-800 hover:text-warning-500 transition-colors cursor-pointer'
                  aria-label={t('posts.edit.button')}
                  title={t('posts.edit.button')}
                >
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                    />
                  </svg>
                </button>
              )}
              <span className='text-text-tertiary text-sm whitespace-nowrap'>
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Post content or edit form */}
          {isEditing ? (
            <form onSubmit={handleSubmitEdit} className='mt-2'>
              <TextArea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className='mb-2'
              />
              {editError && (
                <Alert
                  type='error'
                  className='mb-2'
                  onClose={() => setEditError(null)}
                >
                  {editError}
                </Alert>
              )}
              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='secondary'
                  size='sm'
                  onClick={handleCancelEdit}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type='submit'
                  size='sm'
                  isLoading={isSubmittingEdit}
                  disabled={!editContent.trim()}
                >
                  {t('posts.edit.submit')}
                </Button>
              </div>
            </form>
          ) : (
            <p className='mt-2 text-text-secondary whitespace-pre-wrap break-words'>
              {displayContent}
            </p>
          )}

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
                  className='text-sm border border-border-medium rounded px-2 py-1 bg-surface-elevated text-text-primary cursor-pointer'
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

          {/* Action buttons */}
          {!isEditing && (
            <div className='mt-3 flex items-center gap-4'>
              {/* Like button */}
              <button
                onClick={handleLikeToggle}
                disabled={isLiking}
                className={`flex items-center gap-1 text-sm transition-colors cursor-pointer ${
                  isLiked
                    ? 'text-danger-500 hover:text-danger-600'
                    : 'text-text-tertiary hover:text-danger-500'
                } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label={isLiked ? t('posts.unlike') : t('posts.like')}
              >
                <svg
                  className='w-5 h-5'
                  fill={isLiked ? 'currentColor' : 'none'}
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                  />
                </svg>
                <span>{likesCount}</span>
              </button>

              {/* Reply button */}
              {showReplies && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className='flex items-center gap-1 text-sm text-text-tertiary hover:text-primary-500 transition-colors cursor-pointer'
                >
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                    />
                  </svg>
                  <span>{t('posts.reply.button')}</span>
                </button>
              )}

              {/* View replies button */}
              {showReplies && repliesCount > 0 && (
                <button
                  onClick={handleLoadReplies}
                  disabled={isLoadingReplies}
                  className='flex items-center gap-1 text-sm text-text-tertiary hover:text-primary-500 transition-colors cursor-pointer'
                >
                  <span>
                    {showRepliesList
                      ? t('posts.reply.hide')
                      : t('posts.reply.view', { count: String(repliesCount) })}
                  </span>
                  {isLoadingReplies && (
                    <div className='animate-spin rounded-full h-3 w-3 border-b border-current'></div>
                  )}
                </button>
              )}

              {/* Delete button for owner */}
              {isOwner && onDelete && (
                <div className='ml-auto'>
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
          )}

          {/* Reply form */}
          {showReplyForm && (
            <form onSubmit={handleSubmitReply} className='mt-4'>
              <TextArea
                placeholder={t('posts.reply.placeholder')}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className='mb-2'
              />
              {replyError && (
                <Alert
                  type='error'
                  className='mb-2'
                  onClose={() => setReplyError(null)}
                >
                  {replyError}
                </Alert>
              )}
              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='secondary'
                  size='sm'
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent('');
                    setReplyError(null);
                  }}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type='submit'
                  size='sm'
                  isLoading={isSubmittingReply}
                  disabled={!replyContent.trim()}
                >
                  {t('posts.reply.submit')}
                </Button>
              </div>
            </form>
          )}

          {/* Replies list */}
          {showRepliesList && replies.length > 0 && (
            <div className='mt-4 space-y-3'>
              {replies.map((reply) => (
                <PostCard
                  key={reply.id}
                  post={reply}
                  currentUserId={currentUserId}
                  onDelete={(postId) => {
                    onDelete?.(postId);
                    // Refetch replies after a reply is deleted
                    setTimeout(() => refetchReplies(), 500);
                  }}
                  isReply={true}
                  showReplies={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
