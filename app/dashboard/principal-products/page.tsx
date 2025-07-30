import { Button } from '@/components/ui/button';
import { CreatePrincipalProduct } from './create';
import { PrincipalProductTable } from './table';
import { Suspense } from 'react';

function PrincipalProductsPageContent() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Principal Products</h1>
          <p className="text-muted-foreground">
            Manage your principal product catalog
          </p>
        </div>
        <CreatePrincipalProduct>
          <Button>Create Principal Product</Button>
        </CreatePrincipalProduct>
      </div>

      <PrincipalProductTable />
    </div>
  );
}

export default function PrincipalProductsPage() {
  return (
    <Suspense
      fallback={<div className="p-6">Loading principal products...</div>}
    >
      <PrincipalProductsPageContent />
    </Suspense>
  );
}
