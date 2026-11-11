// ============================================================
// AuthProvider — client-side auth context (replaces ClerkProvider)
// ============================================================
// Loads the signed-in admin profile + organization list through the
// /api/auth/* BFF routes and exposes them to the tree. If the access
// token expired, a refresh is attempted once before signing out.

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { AuthUser, Organization } from '@/lib/auth-types';
import { ACTIVE_ORG_COOKIE } from '@/lib/auth-shared';
import {
  fetchCurrentUser,
  fetchOrganizations,
  logout,
  refreshSession,
  switchOrganization
} from '@/lib/auth-client';

interface AuthContextValue {
  user: AuthUser | null;
  organizations: Organization[];
  activeOrganizationId: number | null;
  isLoaded: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  switchOrg: (organizationId: number) => Promise<{ success: boolean; message: string }>;
  refresh: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const [activeOrganizationId, setActiveOrganizationId] = React.useState<number | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const loadSession = React.useCallback(async () => {
    let current = await fetchCurrentUser();
    if (!current) {
      // Access token may have expired — try a refresh before giving up.
      const refreshed = await refreshSession();
      if (refreshed) current = await fetchCurrentUser();
    }
    if (!current) {
      setUser(null);
      setOrganizations([]);
      setIsLoaded(true);
      return;
    }
    setUser(current);
    setIsLoaded(true);
    // Org list is best-effort; a failure shouldn't break the session.
    const orgs = await fetchOrganizations();
    setOrganizations(orgs);

    // Sync the active-org state with the active_org cookie (set by the BFF
    // on switch, or auto-defaulted to the first org below), so the
    // OrgSwitcher check mark matches what the overview dashboard shows.
    const cookieOrg = document.cookie
      .split('; ')
      .find((entry) => entry.startsWith(`${ACTIVE_ORG_COOKIE}=`));
    const cookieOrgId = cookieOrg ? Number(cookieOrg.split('=')[1]) : 0;
    if (orgs.some((org) => org.id === cookieOrgId)) {
      setActiveOrganizationId(cookieOrgId);
    } else if (orgs.length > 0) {
      // Default the active org to the first one (mirrors the OrgSwitcher
      // fallback) so the org-scoped overview dashboard renders right away.
      const firstOrgId = orgs[0].id;
      setActiveOrganizationId(firstOrgId);
      document.cookie = `${ACTIVE_ORG_COOKIE}=${firstOrgId}; path=/; SameSite=Lax`;
    }
  }, []);

  React.useEffect(() => {
    // Session load is async — the setState calls happen after the fetch
    // settles, so this is not a synchronous setState-in-effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSession();
  }, [loadSession]);

  const signOut = React.useCallback(async () => {
    await logout();
    setUser(null);
    setOrganizations([]);
    setActiveOrganizationId(null);
    router.replace('/auth/sign-in');
  }, [router]);

  const switchOrg = React.useCallback(async (organizationId: number) => {
    const result = await switchOrganization(organizationId);
    if (result.success) {
      setActiveOrganizationId(organizationId);
    }
    return result;
  }, []);

  const refresh = React.useCallback(async () => {
    await loadSession();
  }, [loadSession]);

  const value = React.useMemo(
    () => ({
      user,
      organizations,
      activeOrganizationId,
      isLoaded,
      isAuthenticated: !!user,
      signOut,
      switchOrg,
      refresh
    }),
    [user, organizations, activeOrganizationId, isLoaded, signOut, switchOrg, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
