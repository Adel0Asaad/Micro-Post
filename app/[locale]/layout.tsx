import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { ThemeProvider } from '@/lib/theme';
import {
  LocaleProvider,
  getLocaleDirection,
  Locale,
  isValidLocale,
} from '@/lib/i18n';
import { NavbarWrapper } from './NavbarWrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MicroPost - Share Your Thoughts',
  description: 'A micro-posting platform to share your thoughts with the world',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : 'en';
  const direction = getLocaleDirection(locale);

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
        {/* Script to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('micropost-theme');
                  var resolved = theme;
                  if (!theme || theme === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.add(resolved);
                } catch (e) {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-surface-background min-h-screen`}
      >
        <ThemeProvider>
          <LocaleProvider locale={locale}>
            <NavbarWrapper />
            {children}
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}
