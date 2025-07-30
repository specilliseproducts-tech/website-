import { Button } from '@/components/ui/button';
import { CreateSystemIntegrator } from './create';
import { SystemIntegratorTable } from './table';
import { Suspense } from 'react';

export const metadata = {
  title: 'System Integrators | Dashboard',
  description: 'Manage system integrators and their information',
};

function SystemIntegratorsPageContent() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">System Integrators</h1>
          <p className="text-muted-foreground">
            Manage your system integrators and their information
          </p>
        </div>
        <CreateSystemIntegrator>
          <Button>Add System Integrator</Button>
        </CreateSystemIntegrator>
      </div>

      <SystemIntegratorTable />
    </div>
  );
}

export default function SystemIntegratorsPage() {
  return (
    <Suspense
      fallback={<div className="p-6">Loading system integrators...</div>}
    >
      <SystemIntegratorsPageContent />
    </Suspense>
  );
}
