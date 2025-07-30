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

interface SimpleCreateCollaboratorProps {
  children: React.ReactNode;
}

export function SimpleCreateCollaborator({
  children,
}: SimpleCreateCollaboratorProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: CollaboratorInsert) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/collaborators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Collaborator created successfully',
        });
        setOpen(false);
        // Refresh the page to show the new collaborator
        window.location.reload();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create collaborator',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create collaborator',
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
          <DialogTitle>Add Collaborator</DialogTitle>
          <DialogDescription>
            Add a new technology partner and collaborator.
          </DialogDescription>
        </DialogHeader>
        <CollaboratorForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitText="Add Collaborator"
        />
      </DialogContent>
    </Dialog>
  );
}
