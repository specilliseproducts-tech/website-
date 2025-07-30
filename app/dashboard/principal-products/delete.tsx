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
import { principalProductSelectSchema } from './schema';
import { Button } from '@/components/ui/button';
import { useDeletePrincipalProduct } from '@/hooks/use-queries';

export function DeletePrincipalProduct({
  data,
  children,
}: {
  data: z.infer<typeof principalProductSelectSchema>;
  children: JSX.Element;
}) {
  const deletePrincipalProductMutation = useDeletePrincipalProduct();

  async function onConfirmDelete() {
    deletePrincipalProductMutation.mutate(data.id);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Principal Product</DialogTitle>
          <DialogDescription>
            Are you absolutely sure you want to delete principal product{' '}
            <b>{data.title}</b>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={deletePrincipalProductMutation.isPending}
            >
              {deletePrincipalProductMutation.isPending
                ? 'Deleting...'
                : 'Delete'}
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
