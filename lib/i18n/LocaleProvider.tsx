'use client';

import React, { createContext, useContext } from 'react';
import { Locale, localeDirections } from './config';
import {
  getTranslations,
  TranslationKeys,
  t as translate,
} from './translations';

interface LocaleContextType {
  locale: Locale;
  direction: 'ltr' | 'rtl';
  translations: TranslationKeys;
  t: (path: string, params?: Record<string, string>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: React.ReactNode;
  locale: Locale;
}

export function LocaleProvider({ children, locale }: LocaleProviderProps) {
  const translations = getTranslations(locale);
  const direction = localeDirections[locale];

  const t = (path: string, params?: Record<string, string>) => {
    return translate(translations, path, params);
  };

  return (
    <LocaleContext.Provider value={{ locale, direction, translations, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

export function useTranslations() {
  const { translations, t } = useLocale();
  return { translations, t };
}
