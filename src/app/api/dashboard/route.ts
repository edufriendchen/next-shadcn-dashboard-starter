// ============================================================
// GET /api/dashboard — AuthBoot dashboard stats (BFF)
// ============================================================
// Reads the signed-in admin's access token from the auth cookie and
// proxies to authboot-server:
//   GET /api/v1/admin/dashboard                          (platform)
//   GET /api/v1/admin/organizations/:id/dashboard        (org, when
//                                                         ?organization_id=)
// Returns a 200 with { data: null } on any failure so the overview page
// renders empty states instead of crashing.

import { NextRequest, NextResponse } from 'next/server';
import { authbootBaseUrl, getAccessToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ data: null }, { status: 200 });
  }

  const orgId = request.nextUrl.searchParams.get('organization_id');
  const path = orgId
    ? `/admin/organizations/${encodeURIComponent(orgId)}/dashboard`
    : '/admin/dashboard';

  let res: Response;
  try {
    res = await fetch(`${authbootBaseUrl()}${path}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch {
    return NextResponse.json({ data: null }, { status: 200 });
  }

  const body = await res.json().catch(() => null);
  if (!res.ok || !body || body.code !== 0) {
    return NextResponse.json({ data: null }, { status: 200 });
  }

  return NextResponse.json({ data: body });
}
