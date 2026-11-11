// ============================================================
// User Service — Data Access Layer (BFF → authboot-server)
// ============================================================
// All calls go through the /api/users BFF routes, which proxy to
// authboot-server's admin organization-user API using the signed-in
// admin's token + active organization.

import { apiClient } from '@/lib/api-client';
import type {
  UserFilters,
  UsersResponse,
  UserByIdResponse,
  UserAddressesResponse,
  UserMutationPayload
} from './types';

export async function getUsers(filters: UserFilters): Promise<UsersResponse> {
  const query = new URLSearchParams();
  if (filters.page) query.set('page', String(filters.page));
  if (filters.limit) query.set('limit', String(filters.limit));
  if (filters.search) query.set('search', filters.search);
  if (filters.sort) query.set('sort', filters.sort);

  const qs = query.toString();
  return apiClient<UsersResponse>(`/users${qs ? `?${qs}` : ''}`);
}

export async function getUserById(id: number): Promise<UserByIdResponse> {
  return apiClient<UserByIdResponse>(`/users/${id}`);
}

export async function getUserAddresses(id: number): Promise<UserAddressesResponse> {
  return apiClient<UserAddressesResponse>(`/users/${id}/addresses`);
}

export async function createUser(data: UserMutationPayload) {
  return apiClient(`/users`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateUser(id: number, data: UserMutationPayload) {
  return apiClient(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteUser(id: number) {
  return apiClient(`/users/${id}`, {
    method: 'DELETE'
  });
}
