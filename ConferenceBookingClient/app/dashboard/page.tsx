// app/dashboard/page.tsx — Dashboard overview, route: /dashboard  (Server Component)
//
// Server-side entry point. next/dynamic with { ssr: false } prevents
// DashboardHomeClient from running during the server pre-render pass, because
// it reads JWT state from localStorage which does not exist on the server.

import dynamic from 'next/dynamic';

const DashboardHomeClient = dynamic(() => import('./DashboardHomeClient'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>
      Loading dashboard…
    </div>
  ),
});

export default function DashboardPage() {
  return <DashboardHomeClient />;
}
