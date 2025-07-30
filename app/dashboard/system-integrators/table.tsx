'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSystemIntegrators } from '@/hooks/use-queries';
import { UpdateSystemIntegrator } from './update';
import { DeleteSystemIntegrator } from './delete';
import { SystemIntegratorSelect } from './schema';

export const columns: ColumnDef<SystemIntegratorSelect>[] = [
  {
    accessorKey: 'icon',
    header: 'Icon',
    size: 100,
    cell: ({ row }) => {
      const systemIntegrator = row.original;
      return (
        <div className="w-12 h-12">
          <img
            src={systemIntegrator.icon}
            alt={systemIntegrator.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const systemIntegrator = row.original;
      return (
        <div>
          <div className="font-medium">{systemIntegrator.title}</div>
          <div className="text-sm text-muted-foreground">
            {systemIntegrator.slug}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const systemIntegrator = row.original;
      return (
        <div className="max-w-[300px]">
          <p className="text-sm text-muted-foreground truncate">
            {systemIntegrator.description}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Added',
    cell: ({ row }) => {
      const systemIntegrator = row.original;
      return (
        <div className="text-sm text-muted-foreground">
          {new Date(systemIntegrator.createdAt).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    size: 100,
    cell: ({ row }) => {
      const systemIntegrator = row.original;
      return (
        <div className="flex items-center gap-2">
          <UpdateSystemIntegrator systemIntegrator={systemIntegrator} />
          <DeleteSystemIntegrator systemIntegrator={systemIntegrator} />
        </div>
      );
    },
  },
];

export const DEFAULT_PAGE = 1;
export const DEFAULT_PER_PAGE = 10;

function SystemIntegratorSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || '',
  );

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set('search', value.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset to first page when searching
    router.push(`?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    router.push('/dashboard/system-integrators');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-1 gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search system integrators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(searchTerm);
              }
            }}
            className="pl-8"
          />
        </div>
        {searchTerm && (
          <Button onClick={clearSearch} variant="outline" size="sm">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={() => handleSearch(searchTerm)} variant="outline">
          Search
        </Button>
        {searchTerm && (
          <Button onClick={clearFilters} variant="outline">
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

export function SystemIntegratorDataTable({
  data,
  page,
  perPage,
  total,
}: {
  data: SystemIntegratorSelect[];
  page: number;
  perPage: number;
  total: number;
}) {
  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / perPage),
  });

  const handlePageChange = (newPage: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('page', newPage.toString());
    router.push(`?${searchParams.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {typeof header.column.columnDef.header === 'function'
                          ? header.column.columnDef.header(header.getContext())
                          : header.column.columnDef.header}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.columnDef.cell
                        ? typeof cell.column.columnDef.cell === 'function'
                          ? cell.column.columnDef.cell(cell.getContext())
                          : cell.column.columnDef.cell
                        : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No system integrators found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * perPage + 1} to{' '}
          {Math.min(page * perPage, total)} of {total} system integrators
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= Math.ceil(total / perPage)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SystemIntegratorTable() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || DEFAULT_PAGE.toString());
  const perPage = parseInt(
    searchParams.get('perPage') || DEFAULT_PER_PAGE.toString(),
  );
  const search = searchParams.get('search') || '';

  const { data, isLoading, error } = useSystemIntegrators({
    page,
    perPage,
    search,
  });

  // Debug logging
  console.log('SystemIntegratorTable - isLoading:', isLoading);
  console.log('SystemIntegratorTable - error:', error);
  console.log('SystemIntegratorTable - data:', data);
  console.log(
    'SystemIntegratorTable - data.systemIntegrators:',
    data?.systemIntegrators,
  );

  if (error) {
    console.error('SystemIntegratorTable - Error:', error);
    return (
      <div className="text-center py-8 text-destructive">
        Error loading system integrators: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SystemIntegratorSearch />
        <div className="text-center py-8">Loading system integrators...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <SystemIntegratorSearch />
        <div className="text-center py-8">No data available</div>
      </div>
    );
  }

  // Handle empty state
  const systemIntegrators = data.systemIntegrators || [];
  const pagination = data.pagination || null;

  console.log(
    'SystemIntegratorTable - systemIntegrators array:',
    systemIntegrators,
  );
  console.log(
    'SystemIntegratorTable - systemIntegrators length:',
    systemIntegrators.length,
  );

  if (systemIntegrators.length === 0) {
    return (
      <div className="space-y-4">
        <SystemIntegratorSearch />
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            No system integrators found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SystemIntegratorSearch />
      <SystemIntegratorDataTable
        data={systemIntegrators}
        page={pagination?.page || 1}
        perPage={pagination?.perPage || DEFAULT_PER_PAGE}
        total={pagination?.totalCount || 0}
      />
    </div>
  );
}
