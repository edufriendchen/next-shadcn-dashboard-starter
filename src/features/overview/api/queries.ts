// ============================================================
// AuthBoot dashboard — React Query options + key factory
// ============================================================

import { queryOptions } from '@tanstack/react-query';
import { fetchDashboard } from './service';
import type { DashboardData, OrgDashboardData } from './types';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  detail: (orgId: number | null | undefined) => [...dashboardKeys.all, orgId ?? 'platform'] as const
};

export function dashboardQueryOptions(orgId?: number | null) {
  return queryOptions({
    queryKey: dashboardKeys.detail(orgId),
    queryFn: () => fetchDashboard(orgId),
    staleTime: 60_000
  });
}

// Type guard: org-scoped dashboards carry the chart/trend fields.
export function isOrgDashboard(data: DashboardData | null | undefined): data is OrgDashboardData {
  return !!data && 'total_users' in data;
}
