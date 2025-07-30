'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { JSX } from 'react';
import { z } from 'zod';
import { solutionSelectSchema } from './schema';
import { Button } from '@/components/ui/button';
import { useDeleteSolution } from '@/hooks/use-queries';

export function DeleteSolution({
  data,
  children,
}: {
  data: z.infer<typeof solutionSelectSchema>;
  children: JSX.Element;
}) {
  const deleteSolutionMutation = useDeleteSolution();

  async function onConfirmDelete() {
    deleteSolutionMutation.mutate(data.id);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Solution</DialogTitle>
          <DialogDescription>
            Are you absolutely sure you want to delete solution{' '}
            <b>{data.title}</b>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={deleteSolutionMutation.isPending}
            >
              {deleteSolutionMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
