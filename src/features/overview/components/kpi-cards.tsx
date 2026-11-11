'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { dashboardQueryOptions, isOrgDashboard } from '@/features/overview/api/queries';
import { getActiveOrgId } from '@/features/overview/api/service';
import type { PlatformDashboardData } from '@/features/overview/api/types';

function formatNumber(value: number | undefined | null): string {
  return (value ?? 0).toLocaleString('en-US');
}

/**
 * Four KPI cards backed by the AuthBoot dashboard API. Reads the org-scoped
 * dashboard when an organization is active, otherwise falls back to the
 * platform-wide dashboard.
 */
export function KpiCards() {
  const orgId = getActiveOrgId();
  const { data } = useSuspenseQuery(dashboardQueryOptions(orgId));
  const org = isOrgDashboard(data) ? data : null;
  const platform = !org ? (data as PlatformDashboardData | null) : null;

  const cards = [
    {
      description: 'Total Users',
      value: formatNumber(org?.total_users ?? platform?.user_count),
      badge: null as React.ReactNode,
      footerTitle:
        org !== null
          ? `${formatNumber(org.active_users_7d)} active in 7 days`
          : 'Users across the platform',
      footerDetail:
        org !== null ? `${formatNumber(org.disabled_users)} disabled` : 'Registered accounts',
      icon: <Icons.users className='size-4' />
    },
    {
      description: 'New Today',
      value: formatNumber(org?.today_new_users ?? platform?.today_new_users),
      badge:
        org && org.new_users_delta_pct !== 0 ? (
          <Badge variant='outline'>
            {org.new_users_delta_pct > 0 ? <Icons.trendingUp /> : <Icons.trendingDown />}
            {org.new_users_delta_pct > 0 ? '+' : ''}
            {org.new_users_delta_pct}%
          </Badge>
        ) : null,
      footerTitle: org
        ? `New this month: ${formatNumber(org.new_users_this_month)}`
        : 'Registrations today',
      footerDetail: org ? 'vs last month' : 'New accounts created today',
      icon: <Icons.userPlus className='size-4' />
    },
    {
      description: "Today's Logins",
      value: formatNumber(org?.today_logins ?? platform?.today_login_count),
      badge: org ? (
        <Badge variant='outline'>
          <Icons.trendingUp />
          {org.login_success_rate}%
        </Badge>
      ) : null,
      footerTitle: org ? `Success rate ${org.login_success_rate}%` : 'Successful logins today',
      footerDetail: org
        ? `${formatNumber(org.today_failed_logins)} failed · delta ${org.login_success_rate_delta > 0 ? '+' : ''}${org.login_success_rate_delta}pp`
        : 'Platform-wide login count',
      icon: <Icons.login className='size-4' />
    },
    {
      description: 'Admins',
      value: formatNumber(org?.admin_count ?? platform?.admin_count),
      badge: null as React.ReactNode,
      footerTitle: platform
        ? `Organizations: ${formatNumber(platform.organization_count)}`
        : 'Platform account admins',
      footerDetail: platform
        ? `Audit logs: ${formatNumber(platform.audit_log_count)}`
        : 'Admins managing this organization',
      icon: <Icons.shieldCheck className='size-4' />
    }
  ];

  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
      {cards.map((card) => (
        <Card key={card.description} className='@container/card'>
          <CardHeader>
            <CardDescription>{card.description}</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
              {card.value}
            </CardTitle>
            <CardAction>{card.badge}</CardAction>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
              {card.icon}
              {card.footerTitle}
            </div>
            <div className='text-muted-foreground'>{card.footerDetail}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
