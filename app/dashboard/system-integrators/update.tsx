'use client';

import { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SystemIntegratorForm } from './form';
import { useUpdateSystemIntegrator } from '@/hooks/use-queries';
import type { SystemIntegratorInsert, SystemIntegratorSelect } from './schema';

interface UpdateSystemIntegratorProps {
  systemIntegrator: SystemIntegratorSelect;
}

export function UpdateSystemIntegrator({
  systemIntegrator,
}: UpdateSystemIntegratorProps) {
  const [open, setOpen] = useState(false);
  const updateMutation = useUpdateSystemIntegrator();

  const handleSubmit = (data: SystemIntegratorInsert) => {
    updateMutation.mutate(
      {
        id: systemIntegrator.id,
        ...data,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update System Integrator</DialogTitle>
          <DialogDescription>
            Make changes to the system integrator information.
          </DialogDescription>
        </DialogHeader>
        <SystemIntegratorForm
          initialData={systemIntegrator}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
