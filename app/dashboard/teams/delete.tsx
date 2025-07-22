'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeleteTeam } from '@/hooks/use-queries';
import { TeamSelect } from './schema';

interface DeleteTeamProps {
  data: TeamSelect;
  children: React.ReactNode;
}

export function DeleteTeam({ data, children }: DeleteTeamProps) {
  const [open, setOpen] = useState(false);
  const deleteTeamMutation = useDeleteTeam();

  const handleDelete = () => {
    deleteTeamMutation.mutate(data.id, {
      onSuccess: (response) => {
        if (response.success) {
          setOpen(false);
        }
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{data.name}</strong> from the
            team roster. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteTeamMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteTeamMutation.isPending
              ? 'Deleting...'
              : 'Delete Team Member'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
