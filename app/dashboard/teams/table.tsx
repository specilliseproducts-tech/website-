'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Eye, Pencil, Trash2 } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTeams } from '@/hooks/use-queries';
import { format } from 'date-fns';
import { UpdateTeam } from './update';
import { DeleteTeam } from './delete';
import { TeamSelect } from './schema';

export const columns: ColumnDef<TeamSelect>[] = [
  {
    accessorKey: 'imagePath',
    header: 'Photo',
    size: 100,
    cell: ({ row }) => {
      const team = row.original;
      return (
        <div className="w-12 h-12">
          <img
            src={team.imagePath}
            alt={team.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const team = row.original;
      return (
        <div>
          <div className="font-medium">{team.name}</div>
          <div className="text-sm text-muted-foreground">{team.position}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'position',
    header: 'Position',
    cell: ({ row }) => {
      return <Badge variant="outline">{row.getValue('position')}</Badge>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Added',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return <span>{format(date, 'MMM d, yyyy')}</span>;
    },
  },
  {
    header: 'Actions',
    size: 120,
    meta: {
      align: 'right',
    },
    cell: ({ row }) => {
      const team = row.original;
      return (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(team.imagePath, '_blank')}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <UpdateTeam data={team}>
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </UpdateTeam>
          <DeleteTeam data={team}>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </DeleteTeam>
        </div>
      );
    },
  },
];

export const DEFAULT_PAGE = 1;
export const DEFAULT_PER_PAGE = 10;

function TeamSearch() {
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
    router.push('/dashboard/teams');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
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

export function TeamDataTable({
  data,
  page,
  perPage,
  total,
}: {
  data: TeamSelect[];
  page: number;
  perPage: number;
  total: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const table = useReactTable({
    data: data || [], // Ensure data is always an array
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / perPage),
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : header.column.columnDef.header?.toString()}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
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
                  No team members found.
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
          {Math.min(page * perPage, total)} of {total} team members
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
          <span className="text-sm">
            Page {page} of {Math.ceil(total / perPage)}
          </span>
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

export function TeamTable() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || DEFAULT_PAGE.toString());
  const perPage = parseInt(
    searchParams.get('perPage') || DEFAULT_PER_PAGE.toString(),
  );
  const search = searchParams.get('search') || '';

  const { data, isLoading, error } = useTeams({
    page,
    perPage,
    search,
  });

  // Debug logging
  console.log('TeamTable - isLoading:', isLoading);
  console.log('TeamTable - error:', error);
  console.log('TeamTable - data:', data);
  console.log('TeamTable - data.teams:', data?.teams);

  if (error) {
    console.error('TeamTable - Error:', error);
    return (
      <div className="text-center py-8 text-destructive">
        Error loading team members: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <TeamSearch />
        <div className="text-center py-8">Loading team members...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <TeamSearch />
        <div className="text-center py-8">No data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TeamSearch />
      <TeamDataTable
        data={data.teams || []}
        page={data.pagination?.page || 1}
        perPage={data.pagination?.perPage || DEFAULT_PER_PAGE}
        total={data.pagination?.totalCount || 0}
      />
    </div>
  );
}
