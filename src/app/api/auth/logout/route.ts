// ============================================================
// POST /api/auth/logout — revoke the admin session + clear cookies
// ============================================================
// Calls POST {BACKEND_URL}/api/v1/admin/auth/logout with the current
// access token (best-effort), then always clears the auth cookies.

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ACTIVE_ORG_COOKIE, authbootBaseUrl, clearAuthCookies, getAccessToken } from '@/lib/auth';

export async function POST(_request: NextRequest) {
  const token = await getAccessToken();
  if (token) {
    try {
      await fetch(`${authbootBaseUrl()}/admin/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      // Backend unreachable — still clear local session.
    }
  }

  await clearAuthCookies();
  // Drop the active-org selection too.
  const cookieStore = await cookies();
  cookieStore.delete(ACTIVE_ORG_COOKIE);
  return NextResponse.json({ code: 0, message: 'Success' });
}
