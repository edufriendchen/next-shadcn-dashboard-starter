// ============================================================
// Route Handler — Leave Organization
// ============================================================
// BFF pattern: proxies to
// `${BACKEND_URL}/api/v1/admin/organizations/:id/leave`.
// The actor is taken from the auth context (JWT) on the backend — no body.
//   POST /api/organizations/:id/leave → LeaveOrganization
// ============================================================

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/bff';

type Params = { params: Promise<{ id: string }> };

const BASE = '/api/v1/admin/organizations';

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(request, `${BASE}/${id}/leave`);
}
