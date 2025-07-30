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
import { CollaboratorForm } from './form';
import { CollaboratorInsert } from './schema';
import { toast } from '@/hooks/use-toast';

interface Collaborator {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  logo: string;
  website: string;
}

interface SimpleUpdateCollaboratorProps {
  data: Collaborator;
  children: React.ReactNode;
  onUpdate?: () => void;
}

export function SimpleUpdateCollaborator({
  data,
  children,
  onUpdate,
}: SimpleUpdateCollaboratorProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: CollaboratorInsert) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/collaborators/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Collaborator updated successfully',
        });
        setOpen(false);
        // Call the onUpdate callback to refresh the table
        onUpdate?.();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update collaborator',
          variant: 'destructive',
        });
      }
    } catch (error) {
      const e = error as Error;
      toast({
        title: 'Error',
        description: e.message || 'Failed to update collaborator',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Collaborator</DialogTitle>
          <DialogDescription>
            Update the collaborator information.
          </DialogDescription>
        </DialogHeader>
        <CollaboratorForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitText={isLoading ? 'Updating...' : 'Update Collaborator'}
          defaultValues={{
            name: data.name,
            description: data.description,
            longDescription: data.longDescription,
            logo: data.logo,
            website: data.website,
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
