import enUS from '@/message/en-US.json';
import zhCN from '@/message/zh-CN.json';

export const LOCALE_COOKIE_NAME = 'active_locale';

export const LOCALES = [
  { value: 'en-US', name: 'English' },
  { value: 'zh-CN', name: '简体中文' }
] as const;

export type Locale = (typeof LOCALES)[number]['value'];

export const DEFAULT_LOCALE: Locale = 'en-US';

export type Messages = typeof enUS;

export const MESSAGES: Record<Locale, Messages> = {
  'en-US': enUS,
  'zh-CN': zhCN as Messages
};

export function isLocale(value: string | null | undefined): value is Locale {
  return LOCALES.some((locale) => locale.value === value);
}

export function resolveLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
