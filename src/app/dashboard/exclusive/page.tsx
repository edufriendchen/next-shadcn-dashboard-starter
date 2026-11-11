'use client';

import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useAuth } from '@/components/auth/auth-provider';

export default function ExclusivePage() {
  const { user, isLoaded } = useAuth();

  return (
    <PageContainer isLoading={!isLoaded}>
      <div className='space-y-6'>
        <div>
          <h1 className='flex items-center gap-2 text-3xl font-bold tracking-tight'>
            <Icons.badgeCheck className='h-7 w-7 text-green-600' />
            Exclusive Area
          </h1>
          <p className='text-muted-foreground'>
            Welcome, <span className='font-semibold'>{user?.nickname || user?.email}</span>! This
            page is a demo of plan-gated content — in production the gate would be enforced by the
            AuthBoot RBAC/billing API.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Thank You for Checking Out the Exclusive Page</CardTitle>
            <CardDescription>This means you have access to this plan-gated area.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-lg'>Have a wonderful day!</div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
