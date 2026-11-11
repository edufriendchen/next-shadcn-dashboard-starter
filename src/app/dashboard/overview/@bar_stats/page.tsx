import { Suspense } from 'react';
import { BarGraph } from '@/features/overview/components/bar-graph';
import { BarGraphSkeleton } from '@/features/overview/components/bar-graph-skeleton';

export default async function BarStats() {
  return (
    <Suspense fallback={<BarGraphSkeleton />}>
      <BarGraph />
    </Suspense>
  );
}
