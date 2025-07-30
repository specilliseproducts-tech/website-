import { Button } from '@/components/ui/button';
import { CreateSolution } from './create';
import { SolutionTable } from './table';
import { Suspense } from 'react';

function SolutionsPageContent() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Solutions</h1>
          <p className="text-muted-foreground">Manage your solution catalog</p>
        </div>
        <CreateSolution>
          <Button>Create Solution</Button>
        </CreateSolution>
      </div>

      <SolutionTable />
    </div>
  );
}

export default function SolutionsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading solutions...</div>}>
      <SolutionsPageContent />
    </Suspense>
  );
}
