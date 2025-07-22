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
import { useCreateTeam } from '@/hooks/use-queries';
import { TeamForm } from './form';
import { TeamInsert } from './schema';

interface CreateTeamProps {
  children: React.ReactNode;
}

export function CreateTeam({ children }: CreateTeamProps) {
  const [open, setOpen] = useState(false);
  const createTeamMutation = useCreateTeam();

  const handleSubmit = (formData: TeamInsert) => {
    createTeamMutation.mutate(formData, {
      onSuccess: (response) => {
        if (response.success) {
          setOpen(false);
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add a new team member to the company roster.
          </DialogDescription>
        </DialogHeader>
        <TeamForm
          onSubmit={handleSubmit}
          isLoading={createTeamMutation.isPending}
          submitText="Add Team Member"
        />
      </DialogContent>
    </Dialog>
  );
}
