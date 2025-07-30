'use client';

import { z } from 'zod';
import { principalProductInsertSchema } from './schema';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PrincipalProductForm } from './form';
import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { useCreatePrincipalProduct } from '@/hooks/use-queries';

interface Props {
  children: JSX.Element;
}

export function CreatePrincipalProduct({ children }: Props) {
  const createPrincipalProductMutation = useCreatePrincipalProduct();

  async function createPrincipalProduct(
    data: z.infer<typeof principalProductInsertSchema>,
  ) {
    createPrincipalProductMutation.mutate(data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Principal Product</DialogTitle>
        </DialogHeader>
        <PrincipalProductForm
          onSubmit={createPrincipalProduct}
          submitAction={
            <DialogClose asChild>
              <Button
                type="submit"
                disabled={createPrincipalProductMutation.isPending}
              >
                {createPrincipalProductMutation.isPending
                  ? 'Creating...'
                  : 'Create Principal Product'}
              </Button>
            </DialogClose>
          }
        />
      </DialogContent>
    </Dialog>
  );
}
