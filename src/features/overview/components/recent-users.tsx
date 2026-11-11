'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { useSuspenseQuery } from '@tanstack/react-query';
import { dashboardQueryOptions, isOrgDashboard } from '@/features/overview/api/queries';
import { getActiveOrgId } from '@/features/overview/api/service';

/**
 * Latest registered users in the active organization, from the AuthBoot
 * dashboard. Falls back to an empty state when no organization is active.
 */
export function RecentUsers() {
  const orgId = getActiveOrgId();
  const { data } = useSuspenseQuery(dashboardQueryOptions(orgId));
  const org = isOrgDashboard(data) ? data : null;
  const users = org?.recent_users ?? [];

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>Latest registrations in this organization</CardDescription>
      </CardHeader>
      <CardContent>
        {org && users.length > 0 ? (
          <div className='space-y-8'>
            {users.map((user) => (
              <div key={user.user_id} className='flex items-center'>
                <Avatar className='h-9 w-9'>
                  <AvatarImage src={user.avatar || ''} alt={user.nickname || 'User'} />
                  <AvatarFallback>
                    {(user.nickname || 'User').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='ml-4 space-y-1'>
                  <p className='text-sm leading-none font-medium'>
                    {user.nickname || 'Unnamed user'}
                  </p>
                  <p className='text-muted-foreground text-sm'>{user.identity || 'No contact'}</p>
                </div>
                <div className='text-muted-foreground ml-auto text-sm'>
                  {format(new Date(user.created_at * 1000), 'MMM d, yyyy')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-muted-foreground flex h-[260px] items-center justify-center text-sm'>
            Organization-level data appears once a workspace is active.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
