// ============================================================
// POST /api/auth/refresh — rotate the refresh token
// ============================================================
// Proxies POST {BACKEND_URL}/api/v1/admin/auth/refresh-token with the
// stored refresh token, re-issuing access + refresh cookies. On failure
// the session is treated as dead and cookies are cleared.

import { NextRequest, NextResponse } from 'next/server';
import { authbootBaseUrl, clearAuthCookies, getRefreshToken, setAuthCookies } from '@/lib/auth';

export async function POST(_request: NextRequest) {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return NextResponse.json({ code: 1, message: 'Not authenticated' }, { status: 401 });
  }

  let res: Response;
  try {
    res = await fetch(`${authbootBaseUrl()}/admin/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
  } catch {
    return NextResponse.json(
      { code: 1, message: 'Failed to reach the auth service' },
      { status: 502 }
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.code !== 0) {
    await clearAuthCookies();
    return NextResponse.json(
      { code: data.code ?? 1, message: data.message ?? 'Session expired' },
      { status: 401 }
    );
  }

  await setAuthCookies(
    data.access_token,
    data.refresh_token,
    data.access_token_expires_at,
    data.refresh_token_expires_at
  );

  return NextResponse.json(data);
}
