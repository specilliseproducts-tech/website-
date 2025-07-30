'use client';

import { z } from 'zod';
import {
  principalProductInsertSchema,
  principalProductSelectSchema,
} from './schema';
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
import { useUpdatePrincipalProduct } from '@/hooks/use-queries';

interface Props {
  data: z.infer<typeof principalProductSelectSchema>;
  children: JSX.Element;
}

export function UpdatePrincipalProduct({ data, children }: Props) {
  const updatePrincipalProductMutation = useUpdatePrincipalProduct();

  async function updatePrincipalProduct(
    updateData: z.infer<typeof principalProductInsertSchema>,
  ) {
    updatePrincipalProductMutation.mutate({ id: data.id, data: updateData });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Principal Product</DialogTitle>
        </DialogHeader>
        <PrincipalProductForm
          data={data}
          onSubmit={updatePrincipalProduct}
          submitAction={
            <DialogClose asChild>
              <Button
                type="submit"
                disabled={updatePrincipalProductMutation.isPending}
              >
                {updatePrincipalProductMutation.isPending
                  ? 'Updating...'
                  : 'Update Principal Product'}
              </Button>
            </DialogClose>
          }
        />
      </DialogContent>
    </Dialog>
  );
}
