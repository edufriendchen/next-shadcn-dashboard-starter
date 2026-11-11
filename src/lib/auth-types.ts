// ============================================================
// AuthBoot Admin Auth — shared type contracts
// ============================================================
// Mirrors the relevant messages from authboot-server IDLs
// (admin.proto / organization.proto) that the dashboard consumes.

// Platform Account (admin.pb.go AdminAccount)
export interface AdminAccount {
  id: number;
  email: string;
  nickname: string;
  avatar: string;
  background_image: string;
  signature: string;
  status: number;
  created_at: number;
  updated_at: number;
}

// Organization (organization.pb.go Organization)
export interface Organization {
  id: number;
  name: string;
  code: string;
  logo: string;
  status: number;
  created_at: number;
  updated_at: number;
}

// Admin login / refresh-token response (auth.proto AdminLoginResponse)
export interface AdminLoginResponse {
  code: number;
  message: string;
  access_token: string;
  refresh_token: string;
  access_token_expires_at: number;
  refresh_token_expires_at: number;
}

// Admin auth context decoded from a validated token
export interface AdminAuthContext {
  account_id: number;
  organization_id: number;
  membership_id: number;
  role_id: number;
  session_id: string;
}

// Standard API envelope: code === 0 means success
export interface ApiEnvelope<T = unknown> {
  code: number;
  message: string;
  [key: string]: unknown;
  data?: T;
}

// Frontend-normalized auth user (derived from AdminAccount)
export interface AuthUser {
  id: number;
  email: string;
  nickname: string;
  avatar: string;
  signature: string;
  createdAt: number;
}
