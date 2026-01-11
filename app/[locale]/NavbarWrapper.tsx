'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout';
import { useLocale } from '@/lib/i18n';

interface User {
  id: string;
  name: string;
  email: string;
}

export function NavbarWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocale();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/next-proxy/auth/session');
        if (res.ok) {
          const data = await res.json();
          setUser(data.body?.user || null);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    fetchSession();
  }, [pathname]); // Re-fetch session when route changes

  const handleLogout = async () => {
    await fetch('/next-proxy/auth/logout', { method: 'POST' });
    setUser(null);
    router.push(`/${locale}/login`);
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
