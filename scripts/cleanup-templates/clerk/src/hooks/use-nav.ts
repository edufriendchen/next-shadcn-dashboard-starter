'use client';

import { useMemo } from 'react';
import { useTranslations } from '@/components/i18n/active-locale';
import type { NavItem, NavGroup } from '@/types';

export function useFilteredNavItems(items: NavItem[]) {
  return items;
}

export function useFilteredNavGroups(groups: NavGroup[]) {
  return groups;
}

/**
 * Hook that resolves navigation labels through the active locale.
 *
 * Items/groups carrying a `titleKey`/`labelKey` are looked up under `nav.items`/`nav.groups`
 * in the message files; anything without a key falls back to its hardcoded `title`/`label`.
 */
export function useNavLabels() {
  const { t } = useTranslations('nav');

  return useMemo(
    () => ({
      itemLabel: (item: NavItem) => (item.titleKey ? t(`items.${item.titleKey}`) : item.title),
      groupLabel: (group: NavGroup) =>
        group.labelKey ? t(`groups.${group.labelKey}`) : group.label
    }),
    [t]
  );
}
