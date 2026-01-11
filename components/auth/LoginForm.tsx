'use client';

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Alert,
} from '@/components/ui';
import { useTranslations } from '@/lib/i18n';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSubmit, onSwitchToRegister }: LoginFormProps) {
  const { t } = useTranslations();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError(t('auth.login.error.required'));
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(email, password);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('auth.login.error.invalid')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>{t('auth.login.title')}</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label={t('auth.login.email')}
          type='email'
          placeholder={t('auth.login.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label={t('auth.login.password')}
          type='password'
          placeholder={t('auth.login.passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <Alert type='error' onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Button type='submit' className='w-full' isLoading={isSubmitting}>
          {t('auth.login.submit')}
        </Button>

        {onSwitchToRegister && (
          <p className='text-center text-sm text-text-secondary'>
            {t('auth.login.noAccount')}{' '}
            <button
              type='button'
              onClick={onSwitchToRegister}
              className='text-text-link hover:text-text-link-hover hover:underline font-medium'
            >
              {t('auth.login.registerLink')}
            </button>
          </p>
        )}
      </form>
    </Card>
  );
}
