'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
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
import { useCreateSystemIntegrator } from '@/hooks/use-queries';
import type { SystemIntegratorInsert } from './schema';

interface CreateSystemIntegratorProps {
  children: React.ReactNode;
}

export function CreateSystemIntegrator({
  children,
}: CreateSystemIntegratorProps) {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateSystemIntegrator();

  const handleSubmit = (data: SystemIntegratorInsert) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create System Integrator</DialogTitle>
          <DialogDescription>
            Add a new system integrator to showcase your integration
            capabilities.
          </DialogDescription>
        </DialogHeader>
        <SystemIntegratorForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
