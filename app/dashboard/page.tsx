import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/company">
          <div className="bg-secondary overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-6">
              <h3 className="text-lg font-medium text-primary">Companies</h3>
              <p className="mt-2 text-sm text-secondary-content">
                Manage company information and settings
              </p>
            </div>
          </div>
        </Link>
        <Link href="/account">
          <div className="bg-secondary overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-6">
              <h3 className="text-lg font-medium text-primary">Accounts</h3>
              <p className="mt-2 text-sm text-secondary-content">
                Manage chart of accounts
              </p>
            </div>
          </div>
        </Link>
        <Link href="/voucher-type">
          <div className="bg-secondary overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-6">
              <h3 className="text-lg font-medium text-primary">
                Voucher Types
              </h3>
              <p className="mt-2 text-sm text-secondary-content">
                Configure voucher types and settings
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
