// ============================================================
// Route Handler — Admins (list + create)
// ============================================================
// BFF pattern: this Next.js route proxies requests to the external
// backend service. The frontend service layer
// (src/features/admin/api/service.ts) calls this route via apiClient;
// this route forwards to `${BACKEND_URL}/admin`.
//
// Set BACKEND_URL in your environment (see env.example.txt).
// ============================================================

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/bff';

export async function GET(request: NextRequest) {
  const { search } = request.nextUrl;
  return proxyToBackend(request, `/admin${search}`);
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/admin');
}
