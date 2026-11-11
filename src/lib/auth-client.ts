// ============================================================
// Client-side AuthBoot auth helpers
// ============================================================
// All calls go through the /api/auth/* BFF routes — the browser never
// touches raw tokens (they live in httpOnly cookies).

import type { AdminAccount, Organization } from '@/lib/auth-types';

export interface AuthResult {
  success: boolean;
  message: string;
}

function toAuthUser(account: AdminAccount) {
  return {
    id: account.id,
    email: account.email,
    nickname: account.nickname,
    avatar: account.avatar,
    signature: account.signature,
    createdAt: account.created_at
  };
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      device_id: 'dashboard-web',
      device_name: 'Web Dashboard'
    })
  });
  const data = await res.json().catch(() => ({ message: 'Unexpected response' }));
  if (!res.ok || data.code !== 0) {
    return { success: false, message: data.message ?? 'Login failed' };
  }
  return { success: true, message: data.message ?? 'Success' };
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
}

export async function refreshSession(): Promise<boolean> {
  const res = await fetch('/api/auth/refresh', { method: 'POST' });
  const data = await res.json().catch(() => ({}));
  return res.ok && data.code === 0;
}

export async function fetchCurrentUser() {
  const res = await fetch('/api/auth/me');
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  if (!data || data.code !== 0 || !data.profile) return null;
  return toAuthUser(data.profile as AdminAccount);
}

export async function fetchOrganizations(): Promise<Organization[]> {
  const res = await fetch('/api/auth/organizations');
  if (!res.ok) return [];
  const data = await res.json().catch(() => null);
  if (!data || data.code !== 0) return [];
  return (data.organizations as Organization[] | undefined) ?? [];
}

export async function createOrganization(
  name: string,
  code: string
): Promise<AuthResult & { id?: number }> {
  const res = await fetch('/api/auth/organizations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, code })
  });
  const data = await res.json().catch(() => ({ message: 'Unexpected response' }));
  if (!res.ok || data.code !== 0) {
    return { success: false, message: data.message ?? 'Failed to create organization' };
  }
  return { success: true, message: data.message ?? 'Success', id: data.organization?.id };
}

export async function switchOrganization(organizationId: number): Promise<AuthResult> {
  const res = await fetch('/api/auth/switch-org', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ organization_id: organizationId })
  });
  const data = await res.json().catch(() => ({ message: 'Unexpected response' }));
  if (!res.ok || data.code !== 0) {
    return { success: false, message: data.message ?? 'Failed to switch organization' };
  }
  return { success: true, message: data.message ?? 'Success' };
}

export async function updateProfile(patch: {
  nickname?: string;
  avatar?: string;
  signature?: string;
}): Promise<AuthResult> {
  const res = await fetch('/api/auth/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });
  const data = await res.json().catch(() => ({ message: 'Unexpected response' }));
  if (!res.ok || data.code !== 0) {
    return { success: false, message: data.message ?? 'Failed to update profile' };
  }
  return { success: true, message: data.message ?? 'Success' };
}
