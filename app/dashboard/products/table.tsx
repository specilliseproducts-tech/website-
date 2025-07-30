'use client';

import Image from 'next/image';
import { z } from 'zod';
import { productSelectSchema } from './schema';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pencil, Trash2, Eye, Search, X } from 'lucide-react';
import { UpdateProduct } from './update';
import { DeleteProduct } from './delete';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/use-queries';

type Product = z.infer<typeof productSelectSchema>;

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'imagePath',
    header: 'Image',
    size: 80,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="w-12 h-12">
          <Image
            src={product.imagePath}
            alt={product.name}
            width={48}
            height={48}
            className="w-full h-full object-cover rounded"
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div>
          <div className="font-medium">{product.name}</div>
          <div className="text-sm text-muted-foreground">{product.slug}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      return <Badge variant="outline">{row.getValue('category')}</Badge>;
    },
  },
  {
    accessorKey: 'shortDescription',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('shortDescription') as string;
      return (
        <div className="max-w-[200px] truncate" title={description}>
          {description}
        </div>
      );
    },
  },

  {
    header: 'Actions',
    size: 120,
    meta: {
      align: 'right',
    },
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(`/products/${product.slug}`, '_blank')}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <UpdateProduct data={product}>
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </UpdateProduct>
          <DeleteProduct data={product}>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </DeleteProduct>
        </div>
      );
    },
  },
];

export const DEFAULT_PAGE = 1;
export const DEFAULT_PER_PAGE = 10;

function ProductSearch() {
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search products by name, category, or description..."
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
      <Button onClick={() => handleSearch(searchTerm)} variant="outline">
        Search
      </Button>
    </div>
  );
}

export function ProductTable({
  data,
  page,
  perPage,
  total,
}: {
  data: Product[];
  page: number;
  perPage: number;
  total: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / perPage),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: perPage,
      },
    },
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
                    className={
                      (header.column.columnDef.meta as { align?: string })
                        ?.align === 'right'
                        ? 'text-right'
                        : ''
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        (cell.column.columnDef.meta as { align?: string })
                          ?.align === 'right'
                          ? 'text-right'
                          : ''
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * perPage + 1} to{' '}
          {Math.min(page * perPage, total)} of {total} products
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

export function EnhancedProductTable() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '10');
  const search = searchParams.get('search') || '';

  const { data: productsData, isLoading } = useProducts({
    page,
    perPage,
    search,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <ProductSearch />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loading...</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>
      </div>
    );
  }

  const products = productsData?.products || [];
  const total = productsData?.pagination.totalCount || 0;

  return (
    <div className="space-y-4">
      <ProductSearch />
      {search && (
        <div className="text-sm text-muted-foreground">
          {total > 0 ? (
            <>
              Found {total} product{total !== 1 ? 's' : ''} matching &quot;
              {search}&quot;
            </>
          ) : (
            <>No products found matching &quot;{search}&quot;</>
          )}
        </div>
      )}
      <ProductTable
        data={products}
        page={page}
        perPage={perPage}
        total={total}
      />
    </div>
  );
}
