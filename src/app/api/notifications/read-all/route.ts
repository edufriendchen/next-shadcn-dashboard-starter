// ============================================================
// Route Handler — Read All Notifications
// ============================================================
// BFF: proxies to
// `${BACKEND_URL}/api/v1/admin/notifications/read-all` (ReadAllNotifications).
//   POST /api/notifications/read-all
// ============================================================

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/bff';

export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/api/v1/admin/notifications/read-all');
}
