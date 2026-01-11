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

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSubmit, onSwitchToLogin }: RegisterFormProps) {
  const { t } = useTranslations();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError(t('auth.register.error.required'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.register.error.passwordMismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.register.error.passwordLength'));
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(name, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>{t('auth.register.title')}</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label={t('auth.register.name')}
          type='text'
          placeholder={t('auth.register.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label={t('auth.register.email')}
          type='email'
          placeholder={t('auth.register.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label={t('auth.register.password')}
          type='password'
          placeholder={t('auth.register.passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          helperText={t('auth.register.passwordHelper')}
        />

        <Input
          label={t('auth.register.confirmPassword')}
          type='password'
          placeholder={t('auth.register.passwordPlaceholder')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && (
          <Alert type='error' onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Button type='submit' className='w-full' isLoading={isSubmitting}>
          {t('auth.register.submit')}
        </Button>

        {onSwitchToLogin && (
          <p className='text-center text-sm text-text-secondary'>
            {t('auth.register.hasAccount')}{' '}
            <button
              type='button'
              onClick={onSwitchToLogin}
              className='text-text-link hover:text-text-link-hover hover:underline font-medium'
            >
              {t('auth.register.loginLink')}
            </button>
          </p>
        )}
      </form>
    </Card>
  );
}
