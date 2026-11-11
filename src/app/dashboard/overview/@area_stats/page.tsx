import { Suspense } from 'react';
import { AreaGraph } from '@/features/overview/components/area-graph';
import { AreaGraphSkeleton } from '@/features/overview/components/area-graph-skeleton';

export default async function AreaStats() {
  return (
    <Suspense fallback={<AreaGraphSkeleton />}>
      <AreaGraph />
    </Suspense>
  );
}
