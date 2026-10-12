// ============================================================
// Route Handler — Single Admin (get + update + delete)
// ============================================================
// BFF pattern: proxies to `${BACKEND_URL}/admin/:id`.
// See src/app/api/admin/route.ts for pattern documentation.
// ============================================================

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/bff';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(request, `/admin/${id}`);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(request, `/admin/${id}`);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(request, `/admin/${id}`);
}
