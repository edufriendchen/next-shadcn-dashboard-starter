'use client';
import { ClerkProvider } from '@clerk/nextjs';
import React from 'react';
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
          <ClerkProvider
            appearance={{
              variables: {
                colorPrimary: 'var(--primary)',
                colorPrimaryForeground: 'var(--primary-foreground)',
                colorDanger: 'var(--destructive)',
                colorBackground: 'var(--card)',
                colorForeground: 'var(--foreground)',
                colorMuted: 'var(--muted)',
                colorMutedForeground: 'var(--muted-foreground)',
                colorInput: 'var(--input)',
                colorInputForeground: 'var(--foreground)',
                colorBorder: 'var(--border)',
                colorRing: 'var(--ring)',
                fontFamily: 'var(--font-sans)'
              }
            }}
          >
            <QueryProvider>{children}</QueryProvider>
          </ClerkProvider>
        </ActiveLocaleProvider>
      </ActiveThemeProvider>
    </>
  );
}
