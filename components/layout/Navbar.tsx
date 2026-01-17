'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Avatar } from '@/components/ui';
import { ThemeToggle } from '@/lib/theme';
import { useLocale, localeNames, Locale } from '@/lib/i18n';

interface NavbarProps {
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
  onLogout?: () => void;
  onLanguageChange?: (locale: string) => void;
}

export function Navbar({ user, onLogout, onLanguageChange }: NavbarProps) {
  const { locale, translations: t } = useLocale();

  const handleLanguageToggle = () => {
    const newLocale: Locale = locale === 'en' ? 'ar' : 'en';
    onLanguageChange?.(newLocale);
  };

  return (
    <nav className='bg-surface-elevated border-b border-border-light sticky top-0 z-50'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link href={`/${locale}`} className='flex items-center gap-2'>
            <span className='text-2xl'>📝</span>
            <span className='text-xl font-bold text-text-primary'>
              MicroPost
            </span>
          </Link>

          {/* Navigation */}
          <div className='flex items-center gap-4'>
            {user ? (
              <>
                <Link
                  href={`/${locale}/feed`}
                  className='text-text-secondary hover:text-text-primary font-medium'
                >
                  {t.nav.feed}
                </Link>
                <Link
                  href={`/${locale}/following`}
                  className='text-text-secondary hover:text-text-primary font-medium'
                >
                  {t.nav.following}
                </Link>
                <Link
                  href={`/${locale}/users`}
                  className='text-text-secondary hover:text-text-primary font-medium'
                >
                  {t.nav.users}
                </Link>
                <Link
                  href={`/${locale}/my-posts`}
                  className='text-text-secondary hover:text-text-primary font-medium'
                >
                  {t.nav.myPosts}
                </Link>
                <div className='flex items-center gap-3 ml-4 pl-4 border-l border-border-light'>
                  <Link
                    href={`/${locale}/my-posts`}
                    className='flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer'
                  >
                    <Avatar name={user.name} size='sm' />
                    <span className='text-sm font-medium text-text-secondary hidden sm:block hover:text-text-primary'>
                      {user.name}
                    </span>
                  </Link>
                  <Button variant='ghost' size='sm' onClick={onLogout}>
                    {t.nav.logout}
                  </Button>
                </div>
              </>
            ) : (
              <Link href={`/${locale}/login`}>
                <Button size='sm'>{t.nav.login}</Button>
              </Link>
            )}

            {/* Language Toggle */}
            <button
              onClick={handleLanguageToggle}
              className='p-2 rounded-lg transition-colors cursor-pointer bg-surface-foreground hover:bg-neutral-200 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500'
              aria-label={t.language.toggle}
              title={localeNames[locale === 'en' ? 'ar' : 'en']}
            >
              <span className='text-sm font-medium'>
                {locale === 'en' ? 'ع' : 'En'}
              </span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
