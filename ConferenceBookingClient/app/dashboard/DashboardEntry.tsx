// app/dashboard/DashboardEntry.tsx — Client Component (SSR gate)
//
// next/dynamic with { ssr: false } must be called from a Client Component.
// This thin wrapper is that boundary — it prevents DashboardClient from running
// during the server pre-render pass, avoiding "localStorage is not defined"
// errors that arise because the dashboard reads JWT state from localStorage at
// initialisation time.

'use client';

import dynamic from 'next/dynamic';

const DashboardClient = dynamic(() => import('./DashboardClient'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>
      Loading dashboard…
    </div>
  ),
});

export default function DashboardEntry() {
  return <DashboardClient />;
}
