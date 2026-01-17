'use client';

import React, { useState } from 'react';
import { Card, Button, TextArea, Alert } from '@/components/ui';
import { useTranslations } from '@/lib/i18n';

interface CreatePostFormProps {
  onSubmit: (content: string) => Promise<void>;
}

export function CreatePostForm({ onSubmit }: CreatePostFormProps) {
  const { t } = useTranslations();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!content.trim()) {
      setError(t('posts.create.error.empty'));
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(content.trim());
      setContent('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('posts.create.error.failed'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='mb-6'>
      <form onSubmit={handleSubmit}>
        <TextArea
          placeholder={t('posts.create.placeholder')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className='mb-4'
        />

        {error && (
          <Alert type='error' className='mb-4' onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert type='success' className='mb-4'>
            {t('posts.create.success')}
          </Alert>
        )}

        <div className='flex justify-end'>
          <Button
            type='submit'
            isLoading={isSubmitting}
            disabled={!content.trim()}
          >
            {t('posts.create.submit')}
          </Button>
        </div>
      </form>
    </Card>
  );
}
