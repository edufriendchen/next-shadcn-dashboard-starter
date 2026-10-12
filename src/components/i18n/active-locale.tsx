'use client';

import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  Locale,
  MESSAGES,
  Messages
} from '@/lib/i18n/locale.config';

function setLocaleCookie(locale: Locale) {
  if (typeof window === 'undefined') return;

  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === 'https:' ? 'Secure;' : ''}`;
}

function resolveMessage(messages: Messages, key: string): string | undefined {
  const value = key
    .split('.')
    .reduce<unknown>(
      (acc, segment) =>
        typeof acc === 'object' && acc !== null
          ? (acc as Record<string, unknown>)[segment]
          : undefined,
      messages
    );

  return typeof value === 'string' ? value : undefined;
}

function interpolate(message: string, values?: Record<string, string | number>): string {
  if (!values) return message;

  return message.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match
  );
}

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function ActiveLocaleProvider({
  children,
  initialLocale
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale || DEFAULT_LOCALE);

  useEffect(() => {
    setLocaleCookie(locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: string, values?: Record<string, string | number>) => {
      const message =
        resolveMessage(MESSAGES[locale], key) ?? resolveMessage(MESSAGES[DEFAULT_LOCALE], key);

      return message ? interpolate(message, values) : key;
    },
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within an ActiveLocaleProvider');
  }
  return context;
}

/**
 * Scopes `t()` to a namespace so callers can use short keys:
 * `useTranslations('locale').t('label')` → `locale.label`
 */
export function useTranslations(namespace?: string) {
  const { locale, setLocale, t } = useLocale();

  const scopedT = useCallback(
    (key: string, values?: Record<string, string | number>) =>
      t(namespace ? `${namespace}.${key}` : key, values),
    [namespace, t]
  );

  return { locale, setLocale, t: scopedT };
}
