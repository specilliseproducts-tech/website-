'use client';

import { useState, useEffect } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Pencil, Trash2, Search, X } from 'lucide-react';
import { SimpleUpdateCollaborator } from './simple-update';
import { useRouter, useSearchParams } from 'next/navigation';

interface Collaborator {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  logo: string;
  website: string;
}

function CollaboratorSearch() {
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
    params.set('page', '1');
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
          placeholder="Search collaborators by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button onClick={() => handleSearch(searchTerm)}>Search</Button>
    </div>
  );
}

export function SimpleCollaboratorTable() {
  const searchParams = useSearchParams();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const search = searchParams.get('search') || '';

  const fetchCollaborators = async () => {
    try {
      const searchQuery = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await fetch(`/api/collaborators${searchQuery}`);
      const data = await response.json();
      if (data.success && data.data?.collaborators) {
        setCollaborators(data.data.collaborators);
      }
    } catch (error) {
      console.error('Failed to fetch collaborators:', error);
    }
  };

  useEffect(() => {
    const loadCollaborators = async () => {
      setIsLoading(true);
      await fetchCollaborators();
      setIsLoading(false);
    };

    loadCollaborators();
  }, [search]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/collaborators/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Collaborator deleted successfully',
        });
        // Remove the deleted collaborator from the list
        setCollaborators((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete collaborator',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete collaborator',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (collaborators.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No collaborators found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CollaboratorSearch />
      {search && (
        <div className="text-sm text-muted-foreground">
          {collaborators.length > 0 ? (
            <>
              Found {collaborators.length} collaborator
              {collaborators.length !== 1 ? 's' : ''} matching "{search}"
            </>
          ) : (
            <>No collaborators found matching "{search}"</>
          )}
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collaborators.map((collaborator) => (
              <TableRow key={collaborator.id}>
                <TableCell className="font-medium">
                  {collaborator.name}
                </TableCell>
                <TableCell>{collaborator.description}</TableCell>
                <TableCell>
                  <img
                    src={collaborator.logo}
                    alt={collaborator.name}
                    className="h-8 w-8 object-contain rounded"
                  />
                </TableCell>
                <TableCell>
                  <a
                    href={collaborator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {collaborator.website}
                  </a>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <SimpleUpdateCollaborator
                      data={collaborator}
                      onUpdate={fetchCollaborators}
                    >
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </SimpleUpdateCollaborator>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(collaborator.id)}
                      disabled={deletingId === collaborator.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
