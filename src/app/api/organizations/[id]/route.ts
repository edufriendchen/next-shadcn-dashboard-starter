// ============================================================
// Route Handler — Single Organization (get + update + delete)
// ============================================================
// BFF pattern: proxies to `${BACKEND_URL}/api/v1/admin/organizations/:id`.
//   GET    /api/organizations/:id  → GetOrganization
//   PUT    /api/organizations/:id  → UpdateOrganization
//   DELETE /api/organizations/:id  → DeleteOrganization
// ============================================================

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/bff';

type Params = { params: Promise<{ id: string }> };

const BASE = '/api/v1/admin/organizations';

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(request, `${BASE}/${id}`);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(request, `${BASE}/${id}`);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(request, `${BASE}/${id}`);
}
