'use client';
import React from 'react';
import { ActiveLocaleProvider } from '@/components/i18n/active-locale';
import { ActiveThemeProvider } from '@/components/themes/active-theme';
import QueryProvider from '@/components/layout/query-provider';
import type { Locale } from '@/lib/i18n/locale.config';

export default function Providers({
  activeThemeValue,
  activeLocaleValue,
  children
}: {
  activeThemeValue: string;
  activeLocaleValue: Locale;
  children: React.ReactNode;
}) {
  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <ActiveLocaleProvider initialLocale={activeLocaleValue}>
          <QueryProvider>{children}</QueryProvider>
        </ActiveLocaleProvider>
      </ActiveThemeProvider>
    </>
  );
}
