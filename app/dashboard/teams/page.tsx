import { Button } from '@/components/ui/button';
import { CreateTeam } from './create';
import { TeamTable } from './table';
import { Suspense } from 'react';

function TeamsPageContent() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Team Members</h1>
          <p className="text-muted-foreground">
            Manage your team members and their information
          </p>
        </div>
        <CreateTeam>
          <Button>Add Team Member</Button>
        </CreateTeam>
      </div>

      <TeamTable />
    </div>
  );
}

export default function TeamsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading teams...</div>}>
      <TeamsPageContent />
    </Suspense>
  );
}
