import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getTranslations, Locale, isValidLocale } from '@/lib/i18n';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : 'en';
  const t = getTranslations(locale);
  const session = await getSession();

  // If user is logged in, redirect to feed
  if (session) {
    redirect(`/${locale}/feed`);
  }

  return (
    <div className='min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4'>
      <div className='max-w-2xl text-center'>
        {/* Hero Section */}
        <div className='mb-8'>
          <span className='text-6xl mb-4 block'>📝</span>
          <h1 className='text-4xl md:text-5xl font-bold text-text-primary mb-4'>
            {t.home.welcome}
          </h1>
          <p className='text-xl text-text-secondary mb-8'>{t.home.tagline}</p>
        </div>

        {/* CTA Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link
            href={`/${locale}/login`}
            className='inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-text-inverse bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors'
          >
            {t.home.getStarted}
          </Link>
          <Link
            href={`/${locale}/login`}
            className='inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-text-primary bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors'
          >
            {t.home.signIn}
          </Link>
        </div>

        {/* Features */}
        <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='p-6 bg-surface-elevated rounded-xl shadow-sm border border-border-light'>
            <div className='text-3xl mb-3'>✍️</div>
            <h3 className='font-semibold text-text-primary mb-2'>
              {t.home.features.create.title}
            </h3>
            <p className='text-text-secondary text-sm'>
              {t.home.features.create.description}
            </p>
          </div>
          <div className='p-6 bg-surface-elevated rounded-xl shadow-sm border border-border-light'>
            <div className='text-3xl mb-3'>🤝</div>
            <h3 className='font-semibold text-text-primary mb-2'>
              {t.home.features.connect.title}
            </h3>
            <p className='text-text-secondary text-sm'>
              {t.home.features.connect.description}
            </p>
          </div>
          <div className='p-6 bg-surface-elevated rounded-xl shadow-sm border border-border-light'>
            <div className='text-3xl mb-3'>🔍</div>
            <h3 className='font-semibold text-text-primary mb-2'>
              {t.home.features.discover.title}
            </h3>
            <p className='text-text-secondary text-sm'>
              {t.home.features.discover.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
