import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import React from 'react';
import { getQueryClient } from '@/lib/query-client';
import { ACTIVE_ORG_COOKIE, parseOrgId } from '@/lib/auth';
import { dashboardQueryOptions } from '@/features/overview/api/queries';
import { KpiCards } from '@/features/overview/components/kpi-cards';

export default async function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  // Server-side read of the active organization (set by /api/auth/switch-org)
  // so the prefetched dashboard query matches what the client charts hydrate.
  const cookieStore = await cookies();
  const orgId = parseOrgId(cookieStore.get(ACTIVE_ORG_COOKIE)?.value);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(dashboardQueryOptions(orgId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageContainer>
        <div className='flex flex-1 flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold tracking-tight'>Hi, Welcome back 👋</h2>
            <Icons.sparkles className='text-muted-foreground size-5' />
          </div>

          <KpiCards />

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <div className='col-span-4'> {area_stats}</div>
            <div className='col-span-4 md:col-span-3'>{sales}</div>
            <div className='col-span-4'>{bar_stats}</div>
            <div className='col-span-4 min-h-0 md:col-span-3'>{pie_stats}</div>
          </div>
        </div>
      </PageContainer>
    </HydrationBoundary>
  );
}
