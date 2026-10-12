// ============================================================
// Route Handler — Read Single Notification
// ============================================================
// BFF: proxies to
// `${BACKEND_URL}/api/v1/admin/notifications/:id/read` (ReadNotification).
//   POST /api/notifications/:id/read
// ============================================================

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/bff';

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(request, `/api/v1/admin/notifications/${id}/read`);
}
