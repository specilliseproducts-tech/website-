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
import { useUpdateTeam } from '@/hooks/use-queries';
import { TeamForm } from './form';
import { TeamInsert, TeamSelect } from './schema';

interface UpdateTeamProps {
  data: TeamSelect;
  children: React.ReactNode;
}

export function UpdateTeam({ data, children }: UpdateTeamProps) {
  const [open, setOpen] = useState(false);
  const updateTeamMutation = useUpdateTeam();

  const handleSubmit = (formData: TeamInsert) => {
    updateTeamMutation.mutate(
      { id: data.id, data: formData },
      {
        onSuccess: (response) => {
          if (response.success) {
            setOpen(false);
          }
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Team Member</DialogTitle>
          <DialogDescription>
            Update the team member information.
          </DialogDescription>
        </DialogHeader>
        <TeamForm
          initialData={data}
          onSubmit={handleSubmit}
          isLoading={updateTeamMutation.isPending}
          submitText="Update Team Member"
        />
      </DialogContent>
    </Dialog>
  );
}
