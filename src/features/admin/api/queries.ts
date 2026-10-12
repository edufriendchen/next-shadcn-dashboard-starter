import { queryOptions } from '@tanstack/react-query';
import { getAdmins, getAdminById } from './service';
import type { Admin, AdminFilters } from './types';

export type { Admin };

export const adminKeys = {
  all: ['admins'] as const,
  list: (filters: AdminFilters) => [...adminKeys.all, 'list', filters] as const,
  detail: (id: number) => [...adminKeys.all, 'detail', id] as const
};

export const adminsQueryOptions = (filters: AdminFilters) =>
  queryOptions({
    queryKey: adminKeys.list(filters),
    queryFn: () => getAdmins(filters)
  });

export const adminQueryOptions = (id: number) =>
  queryOptions({
    queryKey: adminKeys.detail(id),
    queryFn: () => getAdminById(id)
  });
