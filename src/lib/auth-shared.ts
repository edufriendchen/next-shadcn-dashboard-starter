// ============================================================
// AuthBoot shared auth constants (client-safe — no next/headers)
// ============================================================
// Pure constants + helpers that both server (BFF routes, middleware) and
// client (AuthProvider, overview charts) can import without pulling the
// server-only `next/headers` API into the browser bundle.

export const AUTH_COOKIE_ACCESS = 'auth_token';
export const AUTH_COOKIE_REFRESH = 'auth_refresh_token';

// Active organization id for org-scoped dashboard data. Set by
// /api/auth/switch-org; read by the overview layout (server) and the
// dashboard query options (client) so their query keys match.
export const ACTIVE_ORG_COOKIE = 'active_org';

export function parseOrgId(value: string | null | undefined): number | null {
  if (!value) return null;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
