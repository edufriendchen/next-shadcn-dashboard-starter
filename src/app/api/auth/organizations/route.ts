// ============================================================
// GET/POST /api/auth/organizations — admin organization list
// ============================================================
// GET  → GET {BACKEND_URL}/api/v1/admin/organizations
// POST → POST {BACKEND_URL}/api/v1/admin/organizations (create org)
// Both carry the stored access token.

import { NextRequest, NextResponse } from 'next/server';
import { authbootBaseUrl, getAccessToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ code: 1, message: 'Not authenticated' }, { status: 401 });
  }

  const { search } = request.nextUrl;
  const res = await fetch(`${authbootBaseUrl()}/admin/organizations${search}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).catch(() => null);

  if (!res) {
    return NextResponse.json(
      { code: 1, message: 'Failed to reach the auth service' },
      { status: 502 }
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.code !== 0) {
    return NextResponse.json(
      { code: data.code ?? 1, message: data.message ?? 'Failed to load organizations' },
      { status: 401 }
    );
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ code: 1, message: 'Not authenticated' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ code: 1, message: 'Invalid JSON body' }, { status: 400 });
  }

  const res = await fetch(`${authbootBaseUrl()}/admin/organizations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body)
  }).catch(() => null);

  if (!res) {
    return NextResponse.json(
      { code: 1, message: 'Failed to reach the auth service' },
      { status: 502 }
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.code !== 0) {
    return NextResponse.json(
      { code: data.code ?? 1, message: data.message ?? 'Failed to create organization' },
      { status: res.status === 401 ? 401 : 400 }
    );
  }
  return NextResponse.json(data);
}
