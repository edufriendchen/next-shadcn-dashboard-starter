// ============================================================
// Route Handler — User Addresses (list) — BFF
// ============================================================
// GET → GET {BACKEND_URL}/api/v1/admin/organizations/{orgId}/users/{id}/addresses
//       (orgId from the active_org cookie; response normalized to the
//        frontend address shape with ISO timestamps)

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authbootBaseUrl, getAccessToken } from '@/lib/auth';
import { ACTIVE_ORG_COOKIE, parseOrgId } from '@/lib/auth-shared';
import { normalizeUserAddresses } from '@/lib/user-mapper';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const token = await getAccessToken();
  const cookieStore = await cookies();
  const orgId = parseOrgId(cookieStore.get(ACTIVE_ORG_COOKIE)?.value);

  if (!token || !orgId) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated / no org', addresses: [] },
      { status: 200 }
    );
  }

  let res: Response;
  try {
    res = await fetch(`${authbootBaseUrl()}/admin/organizations/${orgId}/users/${id}/addresses`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to reach the backend', addresses: [] },
      { status: 200 }
    );
  }

  const body = await res.json().catch(() => null);
  if (!res.ok || !body || body.code !== 0) {
    return NextResponse.json(
      { success: false, message: body?.message ?? 'Failed to load addresses', addresses: [] },
      { status: 200 }
    );
  }

  return NextResponse.json({
    success: true,
    message: body.message,
    addresses: normalizeUserAddresses(body.addresses)
  });
}
