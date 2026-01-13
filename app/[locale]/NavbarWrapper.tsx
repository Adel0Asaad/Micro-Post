'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout';
import { useLocale } from '@/lib/i18n';
import { useAuth } from '@/lib/useAuth';

export function NavbarWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocale();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  const handleLanguageChange = (newLocale: string) => {
    // Replace current locale with new locale in pathname
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <Navbar
      user={user}
      onLogout={handleLogout}
      onLanguageChange={handleLanguageChange}
    />
  );
}
