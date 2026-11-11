'use client';

import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { billingInfoContent } from '@/config/infoconfig';
import { useAuth } from '@/components/auth/auth-provider';

export default function BillingPage() {
  const { isLoaded } = useAuth();

  return (
    <PageContainer
      isLoading={!isLoaded}
      infoContent={billingInfoContent}
      pageTitle='Billing & Plans'
      pageDescription='Manage your subscription and usage limits'
    >
      <div className='space-y-6'>
        {/* Info Alert */}
        <Alert>
          <Icons.info className='h-4 w-4' />
          <AlertDescription>
            Subscription plans are managed by the AuthBoot backend. No plans are configured yet for
            this deployment.
          </AlertDescription>
        </Alert>

        {/* Available Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>Choose a plan that fits your organization's needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-muted-foreground text-sm'>
              Plan management is not wired up yet — this page will list the plans exposed by the
              AuthBoot billing API once it ships.
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
