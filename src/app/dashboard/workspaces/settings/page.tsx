import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { cookies } from 'next/headers';
import { ACTIVE_ORG_COOKIE, parseOrgId } from '@/lib/auth-shared';
import { GeneralSettingsCard } from '@/features/organizations/components/general-settings-card';
import { LoginMethodsSettings } from '@/features/organizations/components/login-methods-settings';
import { DangerZoneCard } from '@/features/organizations/components/danger-zone-card';
import { workspaceSettingsInfoContent } from '@/config/infoconfig';

export const metadata = {
  title: 'Dashboard: Workspace Settings'
};

export default async function WorkspaceSettingsPage() {
  const cookieStore = await cookies();
  const orgId = parseOrgId(cookieStore.get(ACTIVE_ORG_COOKIE)?.value);

  return (
    <PageContainer
      pageTitle='Workspace Settings'
      pageDescription='Manage the active workspace: general info, sign-in methods, and ownership.'
      infoContent={workspaceSettingsInfoContent}
    >
      {orgId ? (
        <div className='max-w-3xl space-y-4'>
          <GeneralSettingsCard orgId={orgId} />
          <LoginMethodsSettings orgId={orgId} />
          <DangerZoneCard orgId={orgId} />
        </div>
      ) : (
        <Card className='max-w-3xl'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Icons.workspace className='size-5' />
              No active workspace
            </CardTitle>
            <CardDescription>
              Select or create a workspace first, then you can configure its settings.
            </CardDescription>
          </CardHeader>
          <CardContent className='text-muted-foreground text-sm'>
            Use the workspace switcher in the header to activate one.
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
