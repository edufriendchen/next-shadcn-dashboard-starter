'use client';
import React from 'react';
import { AuthProvider } from '@/components/auth/auth-provider';
import { ActiveLocaleProvider } from '../i18n/active-locale';
import { ActiveThemeProvider } from '../themes/active-theme';
import QueryProvider from './query-provider';
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
          <AuthProvider>
            <QueryProvider>{children}</QueryProvider>
          </AuthProvider>
        </ActiveLocaleProvider>
      </ActiveThemeProvider>
    </>
  );
}
