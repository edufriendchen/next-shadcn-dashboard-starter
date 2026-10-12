'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth, useOrganizationList } from '@clerk/nextjs';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type OrganizationListResource = ReturnType<typeof useOrganizationList>;

interface OrganizationListProps {
  afterSelectOrganizationUrl?: string;
  afterCreateOrganizationUrl?: string;
  className?: string;
}

/**
 * Self-owned replacement for Clerk's <OrganizationList />.
 *
 * Uses the `useOrganizationList` hook plus the project's shadcn components so the
 * layout, states, and copy are fully editable — unlike the black-box Clerk widget.
 */
export function OrganizationList({
  afterSelectOrganizationUrl = '/dashboard/overview',
  afterCreateOrganizationUrl = '/dashboard/overview',
  className
}: OrganizationListProps) {
  const router = useRouter();
  const { orgId } = useAuth();
  const { isLoaded, setActive, userMemberships, createOrganization } = useOrganizationList({
    userMemberships: {
      infinite: true,
      keepPreviousData: false
    }
  });

  const [selectingId, setSelectingId] = useState<string | null>(null);

  const handleSelect = async (organizationId: string) => {
    if (!setActive || selectingId) return;
    setSelectingId(organizationId);
    try {
      await setActive({ organization: organizationId });
      router.push(afterSelectOrganizationUrl);
    } catch (error) {
      console.error('Failed to select organization:', error);
      setSelectingId(null);
    }
  };

  // Loading skeleton — mirrors the card + divided rows below
  if (!isLoaded) {
    return (
      <div className={cn('mx-auto w-full max-w-md', className)}>
        <div className='bg-card overflow-hidden rounded-xl border shadow-sm'>
          <div className='border-b px-5 py-4'>
            <Skeleton className='h-5 w-32' />
            <Skeleton className='mt-2 h-4 w-48' />
          </div>
          <div className='divide-y'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='flex items-center gap-3 px-5 py-3'>
                <Skeleton className='size-9 rounded-md' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-3 w-20' />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const memberships = userMemberships?.data ?? [];

  return (
    <div className={cn('mx-auto w-full max-w-md', className)}>
      <div className='bg-card overflow-hidden rounded-xl border shadow-sm'>
        <div className='border-b px-5 py-4'>
          <p className='text-base font-semibold'>Organizations</p>
          <p className='text-muted-foreground text-sm'>Select a workspace to continue</p>
        </div>

        {memberships.length > 0 ? (
          <ul className='divide-y'>
            {memberships.map((membership) => {
              const org = membership.organization;
              const isActive = org.id === orgId;
              return (
                <li key={membership.id}>
                  <button
                    type='button'
                    onClick={() => handleSelect(org.id)}
                    disabled={selectingId !== null}
                    className='hover:bg-accent flex w-full items-center gap-3 px-5 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-70'
                  >
                    <div className='bg-muted flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md'>
                      {org.hasImage && org.imageUrl ? (
                        <Image
                          src={org.imageUrl}
                          alt={org.name}
                          width={36}
                          height={36}
                          className='size-full object-cover'
                        />
                      ) : (
                        <Icons.galleryVerticalEnd className='size-4' />
                      )}
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium'>{org.name}</p>
                      <p className='text-muted-foreground truncate text-xs capitalize'>
                        {membership.role}
                      </p>
                    </div>
                    {selectingId === org.id ? (
                      <Icons.spinner className='text-muted-foreground size-4 shrink-0 animate-spin' />
                    ) : isActive ? (
                      <Icons.check className='text-primary size-4 shrink-0' />
                    ) : (
                      <Icons.chevronRight className='text-muted-foreground size-4 shrink-0' />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className='px-5 py-10 text-center'>
            <p className='text-sm font-medium'>No workspaces yet</p>
            <p className='text-muted-foreground mt-1 text-sm'>
              Create your first workspace to get started.
            </p>
          </div>
        )}

        <div className='border-t'>
          <CreateOrganizationDialog
            createOrganization={createOrganization}
            setActive={setActive}
            afterCreateOrganizationUrl={afterCreateOrganizationUrl}
            onCreated={() => userMemberships?.revalidate?.()}
          />
        </div>
      </div>
    </div>
  );
}

interface CreateOrganizationDialogProps {
  createOrganization: OrganizationListResource['createOrganization'];
  setActive: OrganizationListResource['setActive'];
  afterCreateOrganizationUrl: string;
  onCreated?: () => void | Promise<void>;
}

function CreateOrganizationDialog({
  createOrganization,
  setActive,
  afterCreateOrganizationUrl,
  onCreated
}: CreateOrganizationDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!createOrganization || !trimmed || isPending) return;
    setIsPending(true);
    try {
      const org = await createOrganization({ name: trimmed });
      await onCreated?.();
      await setActive?.({ organization: org.id });
      setName('');
      setOpen(false);
      router.push(afterCreateOrganizationUrl);
    } catch (error) {
      console.error('Failed to create organization:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type='button'
            className='hover:bg-accent flex w-full items-center gap-3 px-5 py-3 text-left transition-colors'
          />
        }
      >
        <div className='flex size-9 shrink-0 items-center justify-center rounded-md border border-dashed'>
          <Icons.add className='size-4' />
        </div>
        <span className='text-sm font-medium'>Create workspace</span>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleCreate}>
          <DialogHeader>
            <DialogTitle>Create workspace</DialogTitle>
            <DialogDescription>
              Give your new workspace a name. You can invite teammates later.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-2 py-4'>
            <Label htmlFor='organization-name'>Name</Label>
            <Input
              id='organization-name'
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder='Acme Inc.'
              autoFocus
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button type='button' variant='outline' />}>Cancel</DialogClose>
            <LoadingButton type='submit' loading={isPending} disabled={!name.trim()}>
              Create
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
