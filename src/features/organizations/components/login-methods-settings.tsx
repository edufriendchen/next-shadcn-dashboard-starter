'use client';

import { useState } from 'react';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/ui/loading-button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { deleteOAuthConfigMutation, setOAuthConfigMutation } from '../api/mutations';
import { organizationKeys, oauthConfigsQueryOptions } from '../api/queries';
import type { OAuthProviderConfig } from '../api/types';
import {
  LOGIN_METHODS,
  LOGIN_METHOD_BY_PROVIDER,
  OAUTH_CREDENTIAL_FIELDS,
  OAUTH_MASTER_PROVIDER,
  type LoginMethodDefinition
} from '../constants/login-methods';

type LoginMethodsSettingsProps = {
  orgId: number;
};

function hasMaskedSecret(settings: Record<string, string>): boolean {
  // The backend masks credential values (`ab****`) on read. Re-submitting the
  // map would overwrite the real secret with the mask, so enabled-only updates
  // on stored credentials are blocked until the backend supports partial
  // settings updates.
  return Object.values(settings).some((value) => value.includes('*'));
}

function MethodRow({
  method,
  config,
  pending,
  disabled = false,
  onToggle
}: {
  method: LoginMethodDefinition;
  config?: OAuthProviderConfig;
  pending: boolean;
  disabled?: boolean;
  onToggle: (method: LoginMethodDefinition, enabled: boolean) => void;
}) {
  const enabled = config?.enabled ?? method.kind === 'builtin';
  const configured = method.kind === 'builtin' || Object.keys(config?.settings ?? {}).length > 0;

  return (
    <div className='flex items-center gap-3 py-3 first:pt-0 last:pb-0'>
      <div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-md'>
        <method.icon className='size-4' />
      </div>
      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-sm font-medium'>{method.name}</span>
          {method.kind === 'oauth' && (
            <Badge variant={configured ? 'outline' : 'secondary'}>
              {configured ? 'Configured' : 'No credentials'}
            </Badge>
          )}
        </div>
        <p className='text-muted-foreground text-xs'>{method.description}</p>
      </div>
      <Switch
        checked={enabled}
        disabled={pending || disabled}
        aria-label={`${enabled ? 'Disable' : 'Enable'} ${method.name} sign-in`}
        onCheckedChange={(checked) => onToggle(method, checked)}
      />
    </div>
  );
}

function OAuthConfigDialog({
  method,
  pending,
  onClose,
  onSave
}: {
  method: LoginMethodDefinition;
  pending: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
}) {
  const fields = OAUTH_CREDENTIAL_FIELDS[method.provider] ?? [];
  const [values, setValues] = useState<Record<string, string>>({});
  const complete = fields.every((field) => (values[field.name] ?? '').trim().length > 0);

  function handleSave() {
    if (Object.values(values).some((value) => value.includes('*'))) {
      toast.error('The values look masked (contain *). Enter the real credentials.');
      return;
    }
    onSave(values);
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure {method.name} sign-in</DialogTitle>
          <DialogDescription>
            Enter the OAuth credentials for {method.name}. Once saved, {method.name} sign-in is
            enabled for this workspace.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-3 py-4'>
          {fields.map((field) => (
            <div key={field.name} className='grid gap-1.5'>
              <Label htmlFor={`oauth-${method.provider}-${field.name}`}>{field.label}</Label>
              <Input
                id={`oauth-${method.provider}-${field.name}`}
                type={field.secret ? 'password' : 'text'}
                value={values[field.name] ?? ''}
                placeholder={field.placeholder}
                autoComplete='off'
                onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button type='button' variant='outline' />}>Cancel</DialogClose>
          <LoadingButton type='button' loading={pending} disabled={!complete} onClick={handleSave}>
            Save &amp; enable
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function LoginMethodsSettings({ orgId }: LoginMethodsSettingsProps) {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(oauthConfigsQueryOptions(orgId));

  const configs = new Map((data?.configs ?? []).map((config) => [config.provider, config]));
  const masterEnabled = configs.get(OAUTH_MASTER_PROVIDER)?.enabled ?? false;
  const [configMethod, setConfigMethod] = useState<LoginMethodDefinition | null>(null);

  function invalidateOauth() {
    queryClient.invalidateQueries({ queryKey: organizationKeys.oauth(orgId) });
  }

  const toggleMutation = useMutation({
    // mutationFn only — onSuccess below keeps the oauth cache invalidation.
    mutationFn: setOAuthConfigMutation.mutationFn,
    onSuccess: (_data, variables) => {
      invalidateOauth();
      const method = LOGIN_METHOD_BY_PROVIDER.get(variables.provider);
      if (method) {
        toast.success(
          `${method.name} sign-in ${variables.values.enabled ? 'enabled' : 'disabled'}`
        );
      } else {
        toast.success(
          `Third-party authorization ${variables.values.enabled ? 'enabled' : 'disabled'}`
        );
      }
    },
    onError: () => toast.error("Couldn't update the sign-in method. Try again.")
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOAuthConfigMutation.mutationFn,
    onSuccess: (_data, variables) => {
      invalidateOauth();
      const method = LOGIN_METHOD_BY_PROVIDER.get(variables.provider);
      toast.success(`${method?.name ?? 'Provider'} sign-in disabled (credentials removed)`);
    },
    onError: () => toast.error("Couldn't disable the sign-in method. Try again.")
  });

  const saveConfigMutation = useMutation({
    mutationFn: setOAuthConfigMutation.mutationFn,
    onSuccess: () => {
      invalidateOauth();
      if (configMethod) toast.success(`${configMethod.name} sign-in enabled`);
      setConfigMethod(null);
    },
    onError: () => toast.error("Couldn't save the provider configuration. Try again.")
  });

  function handleMasterToggle(enabled: boolean) {
    toggleMutation.mutate({
      id: orgId,
      provider: OAUTH_MASTER_PROVIDER,
      values: { settings: {}, enabled }
    });
  }

  function handleToggle(method: LoginMethodDefinition, enabled: boolean) {
    const existing = configs.get(method.provider);
    const settings = existing?.settings ?? {};

    if (method.kind === 'oauth') {
      if (enabled) {
        if (Object.keys(settings).length > 0) {
          // Provider already has stored (masked) credentials — a PUT would
          // overwrite them with the mask, so block re-enabling until the
          // backend supports partial settings updates.
          if (hasMaskedSecret(settings)) {
            toast.error(
              'This provider has stored credentials. Re-enabling is blocked until the backend supports partial settings updates.'
            );
            return;
          }
          toggleMutation.mutate({
            id: orgId,
            provider: method.provider,
            values: { settings, enabled: true }
          });
          return;
        }
        // No credentials stored yet — collect them first.
        setConfigMethod(method);
        return;
      }

      // Disabling. Stored settings are masked, so a rewrite would corrupt
      // them — removing the config also clears its credentials.
      if (hasMaskedSecret(settings)) {
        deleteMutation.mutate({ id: orgId, provider: method.provider });
        return;
      }
      toggleMutation.mutate({
        id: orgId,
        provider: method.provider,
        values: { settings: {}, enabled: false }
      });
      return;
    }

    // Built-in email/phone — plain org-level flag.
    toggleMutation.mutate({ id: orgId, provider: method.provider, values: { settings, enabled } });
  }

  function handleSaveCredentials(values: Record<string, string>) {
    if (!configMethod) return;
    saveConfigMutation.mutate({
      id: orgId,
      provider: configMethod.provider,
      values: { settings: values, enabled: true }
    });
  }

  const builtinMethods = LOGIN_METHODS.filter((method) => method.kind === 'builtin');
  const oauthMethods = LOGIN_METHODS.filter((method) => method.kind === 'oauth');
  const masterPending =
    toggleMutation.isPending && toggleMutation.variables?.provider === OAUTH_MASTER_PROVIDER;

  return (
    <div className='max-w-3xl space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Icons.login className='size-5' />
            Login methods
          </CardTitle>
          <CardDescription>
            Choose which sign-in methods are available to users in this workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <section>
            <h3 className='text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase'>
              Built-in
            </h3>
            <div className='divide-y'>
              {builtinMethods.map((method) => (
                <MethodRow
                  key={method.provider}
                  method={method}
                  config={configs.get(method.provider)}
                  pending={
                    toggleMutation.isPending &&
                    toggleMutation.variables?.provider === method.provider
                  }
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </section>

          <section>
            <div className='mb-2 flex items-start justify-between gap-4'>
              <div>
                <h3 className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                  Third-party authorization
                </h3>
                <p className='text-muted-foreground mt-0.5 text-xs'>
                  {masterEnabled
                    ? 'Providers below can be enabled individually.'
                    : 'Turn on the master switch to configure providers.'}
                </p>
              </div>
              <Switch
                checked={masterEnabled}
                disabled={masterPending}
                aria-label='Toggle third-party authorization'
                onCheckedChange={handleMasterToggle}
              />
            </div>
            <div className='divide-y'>
              {oauthMethods.map((method) => (
                <MethodRow
                  key={method.provider}
                  method={method}
                  config={configs.get(method.provider)}
                  disabled={!masterEnabled}
                  pending={
                    (toggleMutation.isPending &&
                      toggleMutation.variables?.provider === method.provider) ||
                    (deleteMutation.isPending &&
                      deleteMutation.variables?.provider === method.provider)
                  }
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </section>
        </CardContent>
      </Card>

      <div className={cn('text-muted-foreground flex items-start gap-2 px-1 text-xs')}>
        <Icons.info className='mt-0.5 size-4 shrink-0' />
        <p>
          Third-party providers need their credentials (stored per workspace, masked on read) before
          they can be enabled. The master switch and provider flags are org-level settings — the
          backend still needs to enforce them (and implement the provider adapters) at login time.
        </p>
      </div>

      {configMethod && (
        <OAuthConfigDialog
          method={configMethod}
          pending={saveConfigMutation.isPending}
          onClose={() => setConfigMethod(null)}
          onSave={handleSaveCredentials}
        />
      )}
    </div>
  );
}
