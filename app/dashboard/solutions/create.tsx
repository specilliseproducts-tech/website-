'use client';

import { z } from 'zod';
import { solutionInsertSchema } from './schema';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SolutionForm } from './form';
import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { useCreateSolution } from '@/hooks/use-queries';

interface Props {
  children: JSX.Element;
}

export function CreateSolution({ children }: Props) {
  const createSolutionMutation = useCreateSolution();

  async function createSolution(data: z.infer<typeof solutionInsertSchema>) {
    console.log('Creating solution with data:', data);
    createSolutionMutation.mutate(data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Solution</DialogTitle>
        </DialogHeader>
        <SolutionForm
          onSubmit={createSolution}
          submitAction={
            <DialogClose asChild>
              <Button type="submit" disabled={createSolutionMutation.isPending}>
                {createSolutionMutation.isPending
                  ? 'Creating...'
                  : 'Create Solution'}
              </Button>
            </DialogClose>
          }
        />
      </DialogContent>
    </Dialog>
  );
}
