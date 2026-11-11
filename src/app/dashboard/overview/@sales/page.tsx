import { Suspense } from 'react';
import { RecentUsers } from '@/features/overview/components/recent-users';
import { RecentUsersSkeleton } from '@/features/overview/components/recent-users-skeleton';

export default async function Sales() {
  return (
    <Suspense fallback={<RecentUsersSkeleton />}>
      <RecentUsers />
    </Suspense>
  );
}
