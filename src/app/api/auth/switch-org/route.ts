// ============================================================
// POST /api/auth/switch-org — switch the active organization
// ============================================================
// Proxies POST {BACKEND_URL}/api/v1/admin/auth/switch-organization with
// the stored access token, re-scoping the token to the chosen org and
// updating the access cookie.

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ACTIVE_ORG_COOKIE, authbootBaseUrl, getAccessToken, setAuthCookies } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ code: 1, message: 'Not authenticated' }, { status: 401 });
  }

  let body: { organization_id?: number } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ code: 1, message: 'Invalid JSON body' }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(`${authbootBaseUrl()}/admin/auth/switch-organization`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
  } catch {
    return NextResponse.json(
      { code: 1, message: 'Failed to reach the auth service' },
      { status: 502 }
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.code !== 0) {
    return NextResponse.json(
      { code: data.code ?? 1, message: data.message ?? 'Failed to switch organization' },
      { status: 401 }
    );
  }

  // The switched token keeps the same server-side session; only the access
  // token is re-scoped. Refresh token is untouched.
  if (data.access_token) {
    await setAuthCookies(data.access_token, data.refresh_token ?? '', data.access_token_expires_at);
  }

  // Remember the active org for the overview dashboard (org-scoped data).
  const cookieStore = await cookies();
  if (body.organization_id) {
    cookieStore.set(ACTIVE_ORG_COOKIE, String(body.organization_id), {
      httpOnly: false,
      sameSite: 'lax',
      path: '/'
    });
  }

  return NextResponse.json(data);
}
