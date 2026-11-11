// ============================================================
// authboot-server User → dashboard User mapping (server-only)
// ============================================================
// The backend org-user model exposes {id, organization_id, nickname,
// avatar, status, created_at, updated_at} — no email/phone/role in the
// list view. These helpers normalize it into the frontend table's User
// shape so the React Query layer and table components stay unchanged.

import type { User, UserAddress } from '@/features/users/api/types';

// Backend common.Status values (pkg/constants): 1 = enabled, 2 = disabled.
const STATUS_ENABLED = 1;

export function backendStatusToLabel(status: number | undefined): string {
  return status === STATUS_ENABLED ? 'Active' : 'Inactive';
}

export function toIsoString(unixSeconds: number | undefined): string {
  if (!unixSeconds) return new Date(0).toISOString();
  return new Date(unixSeconds * 1000).toISOString();
}

export interface BackendUser {
  id?: number;
  organization_id?: number;
  nickname?: string;
  avatar?: string;
  status?: number;
  created_at?: number;
  updated_at?: number;
}

export function normalizeUser(raw: BackendUser): User {
  return {
    id: raw.id ?? 0,
    first_name: raw.nickname ?? '',
    last_name: '',
    email: '',
    phone: '',
    status: backendStatusToLabel(raw.status),
    role: '',
    created_at: toIsoString(raw.created_at),
    updated_at: toIsoString(raw.updated_at),
    avatar: raw.avatar ?? '',
    organization_id: raw.organization_id
  };
}

export function normalizeUsers(raw: BackendUser[] | undefined): User[] {
  return (raw ?? []).map(normalizeUser);
}

// Backend UserAddress (idl/address.proto) — timestamps are unix seconds.
export interface BackendUserAddress {
  id?: number;
  receiver_name?: string;
  receiver_phone?: string;
  province?: string;
  city?: string;
  district?: string;
  detail?: string;
  is_default?: boolean;
  created_at?: number;
  updated_at?: number;
}

export function normalizeUserAddress(raw: BackendUserAddress): UserAddress {
  return {
    id: raw.id ?? 0,
    receiver_name: raw.receiver_name ?? '',
    receiver_phone: raw.receiver_phone ?? '',
    province: raw.province ?? '',
    city: raw.city ?? '',
    district: raw.district ?? '',
    detail: raw.detail ?? '',
    is_default: Boolean(raw.is_default),
    created_at: raw.created_at ? toIsoString(raw.created_at) : '',
    updated_at: raw.updated_at ? toIsoString(raw.updated_at) : ''
  };
}

export function normalizeUserAddresses(raw: BackendUserAddress[] | undefined): UserAddress[] {
  return (raw ?? []).map(normalizeUserAddress);
}
