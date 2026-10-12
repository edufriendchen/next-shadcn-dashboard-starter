'use client';

import { useTranslations } from '@/components/i18n/active-locale';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { LOCALES, isLocale } from '@/lib/i18n/locale.config';

import { Icons } from '../icons';
import { Kbd } from '@/components/ui/kbd';

export function LocaleSelector() {
  const { locale, setLocale, t } = useTranslations('locale');

  return (
    <div className='flex items-center gap-2'>
      <Label htmlFor='locale-selector' className='sr-only'>
        {t('label')}
      </Label>
      <Select
        items={LOCALES.map((item) => ({ value: item.value, label: t(item.value) }))}
        value={locale}
        onValueChange={(value) => {
          if (isLocale(value)) setLocale(value);
        }}
      >
        <SelectTrigger
          id='locale-selector'
          className='justify-start *:data-[slot=select-value]:w-20'
        >
          <span className='text-muted-foreground hidden sm:block'>
            <Icons.language />
          </span>
          <span className='text-muted-foreground block sm:hidden'>{t('label')}</span>
          <SelectValue placeholder={t('label')} />
          <Kbd>I I</Kbd>
        </SelectTrigger>
        <SelectContent align='end'>
          <SelectGroup>
            <SelectLabel>{t('label')}</SelectLabel>
            {LOCALES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {t(item.value)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
