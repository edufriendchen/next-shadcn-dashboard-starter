// ============================================================
// Route Handler — Notifications (list)
// ============================================================
// BFF pattern: proxies to
// `${BACKEND_URL}/api/v1/admin/notifications` (ListNotifications).
//   GET /api/notifications → ListNotifications
// ============================================================

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/bff';

export async function GET(request: NextRequest) {
  const { search } = request.nextUrl;
  return proxyToBackend(request, `/api/v1/admin/notifications${search}`);
}
