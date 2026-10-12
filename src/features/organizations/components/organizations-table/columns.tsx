'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import type { Organization } from '../../api/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Icons } from '@/components/icons';
import { CellAction } from './cell-action';
import { statusLabel } from './options';

function formatTimestamp(ts: number): string {
  if (!ts) return '—';
  // Backend sends unix time; treat values below 1e12 as seconds.
  const ms = ts < 1e12 ? ts * 1000 : ts;
  return new Date(ms).toLocaleString();
}

export const columns: ColumnDef<Organization>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Organization, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>{row.original.name}</span>
        <span className='text-muted-foreground text-xs'>{row.original.code}</span>
      </div>
    ),
    meta: {
      label: 'Name',
      placeholder: 'Search organizations...',
      variant: 'text' as const,
      icon: Icons.text
    },
    enableColumnFilter: true
  },
  {
    id: 'logo',
    accessorKey: 'logo',
    header: 'LOGO',
    enableSorting: false,
    cell: ({ row }) => {
      const logo = row.original.logo;
      return logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={row.original.name} className='h-8 w-8 rounded object-cover' />
      ) : (
        <span className='text-muted-foreground'>—</span>
      );
    }
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ cell }) => {
      const status = cell.getValue<Organization['status']>();
      const variant = status === 1 ? 'default' : status === 2 ? 'secondary' : 'outline';
      return <Badge variant={variant}>{statusLabel(status)}</Badge>;
    }
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: 'CREATED',
    enableSorting: false,
    cell: ({ cell }) => (
      <span className='text-muted-foreground text-sm'>
        {formatTimestamp(cell.getValue<number>())}
      </span>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
