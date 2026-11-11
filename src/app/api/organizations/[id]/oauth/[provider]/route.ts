// ============================================================
// Route Handler — Organization login method (single provider)
// ============================================================
// PUT    /api/organizations/:id/oauth/:provider
//   → PUT {BACKEND_URL}/api/v1/admin/organizations/:id/oauth/:provider
// DELETE /api/organizations/:id/oauth/:provider
//   → DELETE {BACKEND_URL}/api/v1/admin/organizations/:id/oauth/:provider
// ============================================================

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/bff';

type Params = { params: Promise<{ id: string; provider: string }> };

const BASE = '/api/v1/admin/organizations';

export async function PUT(request: NextRequest, { params }: Params) {
  const { id, provider } = await params;
  return proxyToBackend(request, `${BASE}/${id}/oauth/${encodeURIComponent(provider)}`);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id, provider } = await params;
  return proxyToBackend(request, `${BASE}/${id}/oauth/${encodeURIComponent(provider)}`);
}
