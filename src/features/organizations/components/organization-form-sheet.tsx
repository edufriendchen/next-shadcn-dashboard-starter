'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { useAppForm } from '@/lib/form';
import { LoadingButton } from '@/components/ui/loading-button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import { useMutation } from '@tanstack/react-query';
import { createOrganizationMutation, updateOrganizationMutation } from '../api/mutations';
import type { Organization } from '../api/types';
import { toast } from 'sonner';
import { organizationSchema, type OrganizationFormValues } from '../schemas/organization';
import { STATUS_OPTIONS } from './organizations-table/options';

interface OrganizationFormSheetProps {
  organization?: Organization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrganizationFormSheet({
  organization,
  open,
  onOpenChange
}: OrganizationFormSheetProps) {
  const isEdit = !!organization;

  const createMutation = useMutation({
    ...createOrganizationMutation,
    onSuccess: () => {
      toast.success('Organization created');
      onOpenChange(false);
      form.reset();
    },
    onError: () => toast.error("Couldn't create organization. Try again.")
  });

  const updateMutation = useMutation({
    ...updateOrganizationMutation,
    onSuccess: () => {
      toast.success('Organization updated');
      onOpenChange(false);
    },
    onError: () => toast.error("Couldn't update organization. Try again.")
  });

  const form = useAppForm({
    defaultValues: {
      name: organization?.name ?? '',
      code: organization?.code ?? '',
      logo: organization?.logo ?? '',
      status: organization ? String(organization.status) : '1'
    } as OrganizationFormValues,
    validators: {
      onSubmit: organizationSchema
    },
    onSubmit: async ({ value }) => {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: organization.id,
          values: {
            name: value.name,
            code: value.code,
            logo: value.logo,
            status: value.status ? Number(value.status) : undefined
          }
        });
      } else {
        await createMutation.mutateAsync({
          name: value.name,
          code: value.code,
          logo: value.logo || undefined
        });
      }
    }
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>{isEdit ? 'Edit Organization' : 'New Organization'}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? 'Update the organization details below.'
              : 'Fill in the details to create a new organization.'}
          </SheetDescription>
        </SheetHeader>

        <div className='flex-1 overflow-auto'>
          <form
            id='organization-form-sheet'
            className='space-y-4 p-4 md:p-4'
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField
                name='name'
                children={(field) => (
                  <field.TextField label='Name' required placeholder='Acme Inc.' />
                )}
              />

              <form.AppField
                name='code'
                children={(field) => <field.TextField label='Code' required placeholder='acme' />}
              />

              <form.AppField
                name='logo'
                children={(field) => (
                  <field.TextField label='Logo URL' placeholder='https://…/logo.png' />
                )}
              />

              {isEdit && (
                <form.AppField
                  name='status'
                  children={(field) => (
                    <field.SelectField
                      label='Status'
                      options={STATUS_OPTIONS}
                      placeholder='Select status'
                    />
                  )}
                />
              )}
            </FieldGroup>
          </form>
        </div>

        <SheetFooter>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <LoadingButton loading={isPending} type='submit' form='organization-form-sheet'>
            {isEdit ? 'Update Organization' : 'Create Organization'}
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function OrganizationFormSheetTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icons.add className='mr-2 h-4 w-4' /> Add Organization
      </Button>
      <OrganizationFormSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
