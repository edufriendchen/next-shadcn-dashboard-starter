// ============================================================
// GET /api/auth/me — current admin profile
// ============================================================
// Proxies GET {BACKEND_URL}/api/v1/admin/me using the stored access
// token. Returns 401 when not authenticated / token invalid.

import { NextRequest, NextResponse } from 'next/server';
import { authbootBaseUrl, getAccessToken } from '@/lib/auth';

export async function GET() {
  return proxyMe('GET');
}

// PUT /api/auth/me — update the signed-in admin's own profile
// (nickname/avatar/signature). Proxies PUT {BACKEND_URL}/api/v1/admin/me.
export async function PUT(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ code: 1, message: 'Invalid JSON body' }, { status: 400 });
  }
  return proxyMe('PUT', body);
}

async function proxyMe(method: 'GET' | 'PUT', body?: unknown) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ code: 1, message: 'Not authenticated' }, { status: 401 });
  }

  let res: Response;
  try {
    res = await fetch(`${authbootBaseUrl()}/admin/me`, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        Authorization: `Bearer ${token}`
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {})
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
      { code: data.code ?? 1, message: data.message ?? 'Not authenticated' },
      { status: 401 }
    );
  }

  return NextResponse.json(data);
}
