import type { InfobarContent } from '@/components/ui/infobar';

export const organizationsInfoContent: InfobarContent = {
  title: 'Organizations — BFF + React Query',
  sections: [
    {
      title: 'Overview',
      description:
        'Manage organizations backed by a real API. The service layer calls Next.js route handlers under /api/organizations, which proxy to the external backend (/api/v1/admin/organizations) via the shared BFF proxy in src/lib/bff.ts.',
      links: []
    },
    {
      title: 'Server Prefetch + Client Hydration',
      description:
        'The server component reads pagination via searchParamsCache, prefetches organizationsQueryOptions, and hands the dehydrated cache to HydrationBoundary. The client table reads the same params via nuqs and calls useSuspenseQuery with matching filters.',
      links: []
    }
  ]
};
