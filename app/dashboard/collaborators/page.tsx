import { Button } from '@/components/ui/button';
import { SimpleCreateCollaborator } from './simple-create';
import { SimpleCollaboratorTable } from './simple-table';
import { Suspense } from 'react';

function CollaboratorsPageContent() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Collaborators</h1>
          <p className="text-muted-foreground">
            Manage your technology partners and collaborators
          </p>
        </div>
        <SimpleCreateCollaborator>
          <Button>Add Collaborator</Button>
        </SimpleCreateCollaborator>
      </div>

      <SimpleCollaboratorTable />
    </div>
  );
}

export default function CollaboratorsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading collaborators...</div>}>
      <CollaboratorsPageContent />
    </Suspense>
  );
}
