import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-8 w-28' />
      <div className='mx-auto w-full max-w-3xl space-y-6 rounded-lg border bg-card p-6'>
        <Skeleton className='h-6 w-32' />
        <div className='flex items-center gap-4'>
          <Skeleton className='size-10 rounded-full' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-5 w-48' />
            <Skeleton className='h-4 w-64' />
          </div>
        </div>
        <div className='grid gap-4 md:grid-cols-2'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='space-y-2'>
              <Skeleton className='h-3 w-16' />
              <Skeleton className='h-4 w-full' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
