import { useRegisterActions } from 'kbar';
import { useTranslations } from '@/components/i18n/active-locale';
import { LOCALES } from '@/lib/i18n/locale.config';

const useLocaleSwitching = () => {
  const { locale, setLocale, t } = useTranslations('locale');

  const cycleLocale = () => {
    const currentIndex = LOCALES.findIndex((item) => item.value === locale);
    const nextIndex = (currentIndex + 1) % LOCALES.length;
    setLocale(LOCALES[nextIndex].value);
  };

  const localeActions = [
    {
      id: 'cycleLocale',
      name: t('switch'),
      shortcut: ['i', 'i'],
      section: t('label'),
      perform: cycleLocale
    },
    ...LOCALES.map((item) => ({
      id: `setLocale-${item.value}`,
      name: t(item.value),
      section: t('label'),
      perform: () => setLocale(item.value)
    }))
  ];

  useRegisterActions(localeActions, [locale]);
};

export default useLocaleSwitching;
