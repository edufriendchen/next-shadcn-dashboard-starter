import { queryOptions } from '@tanstack/react-query';
import { getOrganizations, getOrganizationById, getOAuthConfigs } from './service';
import type { Organization, OrganizationFilters } from './types';

export type { Organization };

export const organizationKeys = {
  all: ['organizations'] as const,
  list: (filters: OrganizationFilters) => [...organizationKeys.all, 'list', filters] as const,
  detail: (id: number) => [...organizationKeys.all, 'detail', id] as const,
  oauth: (id: number) => [...organizationKeys.all, 'oauth', id] as const
};

export const organizationsQueryOptions = (filters: OrganizationFilters) =>
  queryOptions({
    queryKey: organizationKeys.list(filters),
    queryFn: () => getOrganizations(filters)
  });

export const organizationQueryOptions = (id: number) =>
  queryOptions({
    queryKey: organizationKeys.detail(id),
    queryFn: () => getOrganizationById(id)
  });

export const oauthConfigsQueryOptions = (id: number) =>
  queryOptions({
    queryKey: organizationKeys.oauth(id),
    queryFn: () => getOAuthConfigs(id)
  });
