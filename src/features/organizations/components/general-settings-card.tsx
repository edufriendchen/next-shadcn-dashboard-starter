'use client';

import { useRef, useState } from 'react';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { FieldGroup } from '@/components/ui/field';
import { Icons } from '@/components/icons';
import { useAppForm } from '@/lib/form';
import { organizationKeys, organizationQueryOptions } from '../api/queries';
import { updateOrganizationMutation } from '../api/mutations';
import { uploadOrganizationLogo } from '../api/service';
import { workspaceGeneralSchema } from '../schemas/organization';

type GeneralSettingsCardProps = {
  orgId: number;
};

/**
 * Edits the active workspace's name, code, and logo. The logo is uploaded
 * through the multipart logo endpoint (which returns the stored URL); name
 * and code go through the regular organization update API.
 */
export function GeneralSettingsCard({ orgId }: GeneralSettingsCardProps) {
  const { data } = useSuspenseQuery(organizationQueryOptions(orgId));
  const organization = data?.organization;
  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState(organization?.logo ?? '');

  const updateMutation = useMutation({
    // mutationFn only — onSuccess below keeps the org cache invalidation.
    mutationFn: updateOrganizationMutation.mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.all });
      toast.success('Workspace settings saved');
    },
    onError: () => toast.error("Couldn't save workspace settings. Try again.")
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadOrganizationLogo(orgId, file),
    onSuccess: (result) => {
      setLogoUrl(result.logo);
      toast.success('Logo uploaded');
    },
    onError: () => toast.error("Couldn't upload the logo. Try again.")
  });

  const form = useAppForm({
    defaultValues: {
      name: organization?.name ?? '',
      code: organization?.code ?? ''
    },
    validators: {
      onSubmit: workspaceGeneralSchema
    },
    onSubmit: async ({ value }) => {
      await updateMutation.mutateAsync({
        id: orgId,
        values: {
          name: value.name,
          code: value.code,
          logo: logoUrl || undefined
        }
      });
    }
  });

  if (!organization) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Icons.settings className='size-5' />
          General
        </CardTitle>
        <CardDescription>
          Update the workspace name, code, and logo shown across the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center gap-4'>
          <div className='bg-muted flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg'>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt='Workspace logo' className='size-full object-cover' />
            ) : (
              <Icons.workspace className='text-muted-foreground size-6' />
            )}
          </div>
          <div className='space-y-1.5'>
            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                disabled={uploadMutation.isPending}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadMutation.isPending ? (
                  <Icons.spinner className='size-3.5 animate-spin' />
                ) : (
                  <Icons.upload className='size-3.5' />
                )}
                {logoUrl ? 'Replace logo' : 'Upload logo'}
              </Button>
              {logoUrl && (
                <Button type='button' variant='ghost' size='sm' onClick={() => setLogoUrl('')}>
                  Remove
                </Button>
              )}
            </div>
            <p className='text-muted-foreground text-xs'>Square image, PNG or JPG.</p>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/png,image/jpeg,image/webp'
              className='hidden'
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) uploadMutation.mutate(file);
                // Allow re-selecting the same file.
                event.target.value = '';
              }}
            />
          </div>
        </div>

        <form
          id='general-settings-form'
          className='space-y-4'
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField
              name='name'
              children={(field) => (
                <field.TextField label='Workspace name' required placeholder='Acme Inc.' />
              )}
            />
            <form.AppField
              name='code'
              children={(field) => (
                <field.TextField label='Workspace code' required placeholder='acme' />
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className='justify-end'>
        <LoadingButton
          loading={updateMutation.isPending}
          type='submit'
          form='general-settings-form'
        >
          Save changes
        </LoadingButton>
      </CardFooter>
    </Card>
  );
}
