'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { useSuspenseQuery } from '@tanstack/react-query';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { organizationsQueryOptions } from '../../api/queries';
import { columns } from './columns';

export function OrganizationsTable() {
  const [params] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    name: parseAsString
  });

  const filters = {
    page: params.page,
    page_size: params.perPage,
    ...(params.name && { search: params.name })
  };

  const { data } = useSuspenseQuery(organizationsQueryOptions(filters));

  const pageCount = Math.ceil(data.total / params.perPage);

  const { table } = useDataTable({
    data: data.organizations,
    columns,
    pageCount,
    shallow: true,
    debounceMs: 500,
    initialState: {
      columnPinning: { right: ['actions'] }
    }
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
