'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCreateCollaborator } from '@/hooks/use-queries';
import { CollaboratorForm } from './form';
import { CollaboratorInsert } from './schema';

interface CreateCollaboratorProps {
  children: React.ReactNode;
}

export function CreateCollaborator({ children }: CreateCollaboratorProps) {
  const [open, setOpen] = useState(false);
  const createCollaboratorMutation = useCreateCollaborator();

  const handleSubmit = (formData: CollaboratorInsert) => {
    createCollaboratorMutation.mutate(formData, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Collaborator</DialogTitle>
          <DialogDescription>
            Add a new technology partner and collaborator.
          </DialogDescription>
        </DialogHeader>
        <CollaboratorForm
          onSubmit={handleSubmit}
          isLoading={createCollaboratorMutation.isPending}
          submitText="Add Collaborator"
        />
      </DialogContent>
    </Dialog>
  );
}
