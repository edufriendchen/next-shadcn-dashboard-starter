import { mutationOptions } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import {
  createOrganization,
  updateOrganization,
  deleteOrganization,
  leaveOrganization,
  setOAuthConfig,
  deleteOAuthConfig
} from './service';
import { organizationKeys } from './queries';
import type {
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
  OAuthConfigPayload
} from './types';

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

export const leaveOrganizationMutation = mutationOptions({
  mutationFn: (id: number) => leaveOrganization(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: organizationKeys.all });
  }
});

export const setOAuthConfigMutation = mutationOptions({
  mutationFn: ({
    id,
    provider,
    values
  }: {
    id: number;
    provider: string;
    values: OAuthConfigPayload;
  }) => setOAuthConfig(id, provider, values),
  onSuccess: (_data, { id }) => {
    getQueryClient().invalidateQueries({ queryKey: organizationKeys.oauth(id) });
  }
});

export const deleteOAuthConfigMutation = mutationOptions({
  mutationFn: ({ id, provider }: { id: number; provider: string }) =>
    deleteOAuthConfig(id, provider),
  onSuccess: (_data, { id }) => {
    getQueryClient().invalidateQueries({ queryKey: organizationKeys.oauth(id) });
  }
});
