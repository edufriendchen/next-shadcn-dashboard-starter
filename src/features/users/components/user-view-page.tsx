'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format';
import { userByIdOptions } from '../api/queries';
import UserAddressList from './user-address-list';

type UserViewPageProps = {
  userId: string;
};

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='space-y-1'>
      <span className='text-muted-foreground text-xs tracking-wide uppercase'>{label}</span>
      <div className='text-sm'>{children}</div>
    </div>
  );
}

export default function UserViewPage({ userId }: UserViewPageProps) {
  const { data } = useSuspenseQuery(userByIdOptions(Number(userId)));

  if (!data?.success || !data?.user) {
    notFound();
  }

  const user = data.user;
  const fullName = `${user.first_name} ${user.last_name}`.trim() || 'Unnamed user';
  const initials = (user.first_name || 'U').slice(0, 2).toUpperCase();
  const statusVariant =
    user.status === 'Active' ? 'default' : user.status === 'Inactive' ? 'secondary' : 'outline';

  return (
    <div className='space-y-4'>
      <Link
        href='/dashboard/users'
        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
      >
        <Icons.chevronLeft className='mr-2 h-4 w-4' /> Back to Users
      </Link>

      <Card className='mx-auto w-full max-w-3xl'>
        <CardHeader>
          <CardTitle className='text-left text-2xl font-bold'>User Details</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex items-center gap-4'>
            <Avatar size='lg'>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className='flex-1 space-y-1'>
              <p className='text-lg font-semibold'>{fullName}</p>
              <p className='text-muted-foreground text-sm'>{user.email || '—'}</p>
              <div className='flex gap-2'>
                {user.role && (
                  <Badge variant='outline' className='capitalize'>
                    {user.role}
                  </Badge>
                )}
                <Badge variant={statusVariant}>{user.status}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className='grid gap-4 md:grid-cols-2'>
            <DetailRow label='Email'>{user.email || '—'}</DetailRow>
            <DetailRow label='Phone'>{user.phone || '—'}</DetailRow>
            {user.role && (
              <DetailRow label='Role'>
                <span className='capitalize'>{user.role}</span>
              </DetailRow>
            )}
            <DetailRow label='Status'>
              <Badge variant={statusVariant}>{user.status}</Badge>
            </DetailRow>
            <DetailRow label='User ID'>{user.id}</DetailRow>
            <DetailRow label='Organization ID'>{user.organization_id ?? '—'}</DetailRow>
            <DetailRow label='Created'>{formatDate(user.created_at)}</DetailRow>
            <DetailRow label='Last Updated'>{formatDate(user.updated_at)}</DetailRow>
          </div>
        </CardContent>
      </Card>

      <UserAddressList userId={userId} />
    </div>
  );
}
