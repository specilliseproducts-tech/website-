'use client';
import { Toaster } from '@/components/ui/toaster';
import AuthProvider from '@/components/auth-provider';
import QueryProvider from '@/components/query-provider';
import DashboardLayout from '@/components/dashboard-layout';

export default function DashboardLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <QueryProvider>
        <DashboardLayout>
          {children}
          <Toaster />
        </DashboardLayout>
      </QueryProvider>
    </AuthProvider>
  );
}
