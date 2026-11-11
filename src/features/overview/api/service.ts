// ============================================================
// AuthBoot dashboard — service layer
// ============================================================
// Fetches dashboard stats through the /api/dashboard BFF route. The
// active organization id is read from the active_org cookie (set when
// the admin switches organization), falling back to the platform
// dashboard when no org is active.

import type { DashboardApiResponse, DashboardData } from './types';
import { ACTIVE_ORG_COOKIE, parseOrgId } from '@/lib/auth-shared';
import { apiClient } from '@/lib/api-client';

export { ACTIVE_ORG_COOKIE, parseOrgId };

// Client-side read of the active organization id (mirrors the layout's
// server-side read so query keys match between prefetch and hydration).
export function getActiveOrgId(): number | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${ACTIVE_ORG_COOKIE}=`));
  return match ? parseOrgId(match.split('=')[1]) : null;
}

export async function fetchDashboard(orgId?: number | null): Promise<DashboardData | null> {
  const query = orgId ? `?organization_id=${orgId}` : '';
  try {
    const body = await apiClient<DashboardApiResponse>(`/dashboard${query}`, { cache: 'no-store' });
    return body?.data ?? null;
  } catch {
    return null;
  }
}
