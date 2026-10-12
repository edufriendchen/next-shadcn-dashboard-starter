// ============================================================
// Route Handler — Organization Logo Upload
// ============================================================
// BFF pattern: proxies multipart/form-data to
// `${BACKEND_URL}/api/v1/admin/organizations/:id/logo`.
// The file part is named `logo` (backend reads it via c.FormFile('logo')).
//   POST /api/organizations/:id/logo → UploadOrganizationLogo
// ============================================================

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/bff';

type Params = { params: Promise<{ id: string }> };

const BASE = '/api/v1/admin/organizations';

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToBackend(request, `${BASE}/${id}/logo`);
}
