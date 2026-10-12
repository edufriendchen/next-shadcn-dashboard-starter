import PageContainer from '@/components/layout/page-container';
import OrganizationListingPage from '@/features/organizations/components/organization-listing';
import { searchParamsCache } from '@/lib/searchparams';
import type { SearchParams } from 'nuqs/server';
import { organizationsInfoContent } from '@/features/organizations/info-content';
import { OrganizationFormSheetTrigger } from '@/features/organizations/components/organization-form-sheet';

export const metadata = {
  title: 'Dashboard: Organizations'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function OrganizationsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='Organizations'
      pageDescription='Manage organizations (BFF proxy + React Query).'
      infoContent={organizationsInfoContent}
      pageHeaderAction={<OrganizationFormSheetTrigger />}
    >
      <OrganizationListingPage />
    </PageContainer>
  );
}
