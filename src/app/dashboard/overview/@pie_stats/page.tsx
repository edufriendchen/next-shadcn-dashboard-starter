import { Suspense } from 'react';
import { PieGraph } from '@/features/overview/components/pie-graph';
import { PieGraphSkeleton } from '@/features/overview/components/pie-graph-skeleton';

export default async function Stats() {
  return (
    <Suspense fallback={<PieGraphSkeleton />}>
      <PieGraph />
    </Suspense>
  );
}
