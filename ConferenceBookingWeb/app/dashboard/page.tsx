'use client';
// app/dashboard/page.tsx — Dashboard overview, route: /dashboard
//
// 'use client' is required because next/dynamic with { ssr: false } must be
// called from a Client Component (Next.js 16 Turbopack enforces this).
// DashboardHomeClient reads JWT from localStorage, which is browser-only.

import dynamic from 'next/dynamic';
import DashboardLoading from './loading';

const DashboardHomeClient = dynamic(() => import('./DashboardHomeClient'), {
  ssr: false,
  // Skeleton shown while the client bundle loads
  loading: () => <DashboardLoading />,
});

export default function DashboardPage() {
  return <DashboardHomeClient />;
}
