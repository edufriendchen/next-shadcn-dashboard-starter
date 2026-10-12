// ============================================================
// Route Handler — Organizations (list + create)
// ============================================================
// BFF pattern: proxies to `${BACKEND_URL}/api/v1/admin/organizations`.
// Generated from organization.proto (OrganizationHandler).
//   GET  /api/organizations        → ListOrganizations
//   POST /api/organizations        → CreateOrganization
// ============================================================

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/bff';

const BASE = '/api/v1/admin/organizations';

export async function GET(request: NextRequest) {
  const { search } = request.nextUrl;
  return proxyToBackend(request, `${BASE}${search}`);
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, BASE);
}
