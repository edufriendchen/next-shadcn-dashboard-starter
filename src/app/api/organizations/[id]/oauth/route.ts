// ============================================================
// Route Handler — Organization login methods (OAuth configs)
// ============================================================
// GET /api/organizations/:id/oauth
//   → GET {BACKEND_URL}/api/v1/admin/organizations/:id/oauth
// ============================================================

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/bff';

type Params = { params: Promise<{ id: string }> };

const BASE = '/api/v1/admin/organizations';

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(request, `${BASE}/${id}/oauth`);
}
