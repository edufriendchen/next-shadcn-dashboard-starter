// ============================================================
// AuthBoot auth helpers (server-only)
// ============================================================
// Manages the httpOnly token cookies the dashboard uses to talk to
// authboot-server. Access tokens live ~15 min, so /api/auth/refresh
// rotates the refresh token and re-issues a fresh access token.
//
// Client-safe pieces (constants + parseOrgId) live in ./auth-shared and
// are re-exported here for server-side consumers.

import { cookies } from 'next/headers';
import {
  AUTH_COOKIE_ACCESS,
  AUTH_COOKIE_REFRESH,
  ACTIVE_ORG_COOKIE,
  parseOrgId
} from './auth-shared';
export {
  AUTH_COOKIE_ACCESS,
  AUTH_COOKIE_REFRESH,
  ACTIVE_ORG_COOKIE,
  parseOrgId
} from './auth-shared';

// Base URL of authboot-server's API (BACKEND_URL is already the host root).
export function authbootBaseUrl(): string {
  const base = (process.env.BACKEND_URL ?? 'http://localhost:8888').replace(/\/+$/, '');
  return `${base}/api/v1`;
}

export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(AUTH_COOKIE_ACCESS)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(AUTH_COOKIE_REFRESH)?.value;
}

function cookieOptions(expiresAt?: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    ...(expiresAt ? { expires: new Date(expiresAt * 1000) } : {})
  };
}

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  accessTokenExpiresAt?: number,
  refreshTokenExpiresAt?: number
): Promise<void> {
  const store = await cookies();
  store.set(AUTH_COOKIE_ACCESS, accessToken, cookieOptions(accessTokenExpiresAt));
  store.set(AUTH_COOKIE_REFRESH, refreshToken, cookieOptions(refreshTokenExpiresAt));
}

export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  store.delete(AUTH_COOKIE_ACCESS);
  store.delete(AUTH_COOKIE_REFRESH);
}
