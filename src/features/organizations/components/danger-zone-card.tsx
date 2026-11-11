'use client';

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useAuth } from '@/components/auth/auth-provider';
import { ACTIVE_ORG_COOKIE } from '@/lib/auth-shared';
import { organizationKeys, organizationQueryOptions } from '../api/queries';
import { deleteOrganizationMutation, leaveOrganizationMutation } from '../api/mutations';

type DangerZoneCardProps = {
  orgId: number;
};

/**
 * Irreversible workspace actions. Both flows clear the client-side
 * `active_org` cookie (it is not httpOnly, so the browser can drop it) and
 * bounce to the workspace picker so the next server render never reads a
 * removed organization.
 */
export function DangerZoneCard({ orgId }: DangerZoneCardProps) {
  const router = useRouter();
  const { refresh } = useAuth();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(organizationQueryOptions(orgId));
  const organizationName = data?.organization?.name ?? 'this workspace';

  const leaveMutation = useMutation({
    // mutationFn only — onSuccess keeps the org cache invalidation.
    mutationFn: leaveOrganizationMutation.mutationFn,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.all });
      toast.success(`You left ${organizationName}`);
      await resetActiveWorkspace();
    },
    onError: () => toast.error("Couldn't leave the workspace. Try again.")
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrganizationMutation.mutationFn,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.all });
      toast.success('Workspace deleted');
      await resetActiveWorkspace();
    },
    onError: () => toast.error("Couldn't delete the workspace. Try again.")
  });

  async function resetActiveWorkspace() {
    document.cookie = `${ACTIVE_ORG_COOKIE}=; Max-Age=0; path=/`;
    await refresh();
    router.push('/dashboard/workspaces');
  }

  return (
    <Card className='border-destructive/40'>
      <CardHeader>
        <CardTitle className='text-destructive flex items-center gap-2'>
          <Icons.warning className='size-5' />
          Danger zone
        </CardTitle>
        <CardDescription>
          Irreversible actions for the active workspace. The AuthBoot backend enforces role and
          membership checks on every call.
        </CardDescription>
      </CardHeader>
      <CardContent className='divide-y'>
        <div className='flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0'>
          <div>
            <p className='text-sm font-medium'>Leave workspace</p>
            <p className='text-muted-foreground text-xs'>
              You will lose access to {organizationName} until you are invited back.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant='outline' size='sm' />}>
              Leave
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave {organizationName}?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will lose access to this workspace and its data until an owner invites you
                  back.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={leaveMutation.isPending}
                  onClick={() => leaveMutation.mutate(orgId)}
                >
                  Leave workspace
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className='flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0'>
          <div>
            <p className='text-destructive text-sm font-medium'>Delete workspace</p>
            <p className='text-muted-foreground text-xs'>
              Permanently delete {organizationName} and all of its data.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant='destructive' size='sm' />}>
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {organizationName}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. All members, roles, login configurations, and data
                  for this workspace will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant='destructive'
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(orgId)}
                >
                  Delete workspace
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
