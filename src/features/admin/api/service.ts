// ============================================================
// Admin Service — Data Access Layer
// ============================================================
// This is the ONLY file you modify when connecting to your backend.
// Queries (queries.ts) and components import from here — they never change.
//
// Pattern: BFF — Route Handlers proxy to an external backend
//   → these functions call the Next.js route handlers at /api/admin
//     via apiClient
//   → the route handlers (src/app/api/admin/) proxy the request to your
//     external backend service (Laravel, Go, Java, etc.)
//
// Set the external backend base URL via the BACKEND_URL env var.
// ============================================================

import { apiClient } from '@/lib/api-client';
import type { AdminFilters, AdminsResponse, AdminResponse, AdminMutationPayload } from './types';

function buildQuery(filters: AdminFilters): string {
  const params = new URLSearchParams();
  if (filters.page != null) params.set('page', String(filters.page));
  if (filters.limit != null) params.set('limit', String(filters.limit));
  if (filters.roles) params.set('roles', filters.roles);
  if (filters.status) params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);
  if (filters.sort) params.set('sort', filters.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function getAdmins(filters: AdminFilters): Promise<AdminsResponse> {
  return apiClient<AdminsResponse>(`/admin${buildQuery(filters)}`);
}

export async function getAdminById(id: number): Promise<AdminResponse> {
  return apiClient<AdminResponse>(`/admin/${id}`);
}

export async function createAdmin(data: AdminMutationPayload): Promise<AdminResponse> {
  return apiClient<AdminResponse>('/admin', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateAdmin(id: number, data: AdminMutationPayload): Promise<AdminResponse> {
  return apiClient<AdminResponse>(`/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteAdmin(id: number): Promise<AdminResponse> {
  return apiClient<AdminResponse>(`/admin/${id}`, {
    method: 'DELETE'
  });
}
