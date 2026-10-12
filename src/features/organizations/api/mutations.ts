import { mutationOptions } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { createOrganization, updateOrganization, deleteOrganization } from './service';
import { organizationKeys } from './queries';
import type { CreateOrganizationPayload, UpdateOrganizationPayload } from './types';

export const createOrganizationMutation = mutationOptions({
  mutationFn: (data: CreateOrganizationPayload) => createOrganization(data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: organizationKeys.all });
  }
});

export const updateOrganizationMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: number; values: UpdateOrganizationPayload }) =>
    updateOrganization(id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: organizationKeys.all });
  }
});

export const deleteOrganizationMutation = mutationOptions({
  mutationFn: (id: number) => deleteOrganization(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: organizationKeys.all });
  }
});
