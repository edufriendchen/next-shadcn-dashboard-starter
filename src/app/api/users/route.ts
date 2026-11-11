// ============================================================
// Route Handler — Users (list) — BFF to authboot-server
// ============================================================
// GET  → GET {BACKEND_URL}/api/v1/admin/organizations/{orgId}/users
//        (orgId from the active_org cookie; pagination mapped to the
//         backend's page/page_size; response normalized to the table shape)
// POST → 501 — the backend exposes no admin "create user" endpoint.

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authbootBaseUrl, getAccessToken } from '@/lib/auth';
import { ACTIVE_ORG_COOKIE, parseOrgId } from '@/lib/auth-shared';
import { normalizeUsers } from '@/lib/user-mapper';

export async function GET(request: NextRequest) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated', users: [], total_users: 0 },
      { status: 200 }
    );
  }

  const cookieStore = await cookies();
  const orgId = parseOrgId(cookieStore.get(ACTIVE_ORG_COOKIE)?.value);
  if (!orgId) {
    return NextResponse.json(
      {
        success: true,
        message: 'No active organization',
        users: [],
        total_users: 0,
        offset: 0,
        limit: 10
      },
      { status: 200 }
    );
  }

  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);
  const pageSize = Number.isInteger(limit) && limit > 0 ? limit : 10;

  let res: Response;
  try {
    // organization_id must also appear as a query param: the backend IDL
    // binds ListUsersRequest via form/query (the path annotation is missing).
    res = await fetch(
      `${authbootBaseUrl()}/admin/organizations/${orgId}/users?organization_id=${orgId}&page=${page}&page_size=${pageSize}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to reach the backend', users: [], total_users: 0 },
      { status: 200 }
    );
  }

  const body = await res.json().catch(() => null);
  if (!res.ok || !body || body.code !== 0) {
    return NextResponse.json(
      {
        success: false,
        message: body?.message ?? 'Failed to load users',
        users: [],
        total_users: 0
      },
      { status: 200 }
    );
  }

  return NextResponse.json({
    success: true,
    time: new Date().toISOString(),
    message: body.message,
    total_users: body.total ?? 0,
    offset: (page - 1) * pageSize,
    limit: pageSize,
    users: normalizeUsers(body.users)
  });
}

export async function POST() {
  return NextResponse.json(
    { success: false, message: '创建用户接口尚未在 authboot-server 实现' },
    { status: 501 }
  );
}
