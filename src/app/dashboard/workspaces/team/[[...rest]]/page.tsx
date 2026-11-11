import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { teamInfoContent } from '@/config/infoconfig';

export default function TeamPage() {
  return (
    <PageContainer
      pageTitle='Team Management'
      pageDescription='Manage your workspace team, members, roles, security and more.'
      infoContent={teamInfoContent}
    >
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Icons.teams className='h-5 w-5' />
            Team Management
          </CardTitle>
          <CardDescription>
            Member, role, and invitation management is provided by the AuthBoot backend (membership
            &amp; invitation APIs). The management UI will be wired up to those endpoints next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground text-sm'>
            This page currently shows a placeholder — team member management is not implemented yet
            on the dashboard side.
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
