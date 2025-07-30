import { useCollaborators, useDeleteCollaborator } from '@/hooks/use-queries';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export function CollaboratorTable() {
  const { data, isLoading } = useCollaborators();
  const deleteCollaborator = useDeleteCollaborator();
  const collaborators = data?.collaborators || [];

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
              <TableCell className="font-medium">{collaborator.name}</TableCell>
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
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteCollaborator.mutate(collaborator.id)}
                    disabled={deleteCollaborator.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
