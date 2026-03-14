'use client';
// app/dashboard/rooms/page.tsx — Rooms management, route: /dashboard/rooms
//
// 'use client' is required because next/dynamic with { ssr: false } must be
// called from a Client Component (Next.js 16 Turbopack enforces this).
// RoomsPageClient reads JWT from localStorage — browser-only.

import dynamic from 'next/dynamic';
import RoomsLoading from './loading';

const RoomsPageClient = dynamic(() => import('./RoomsPageClient'), {
  ssr: false,
  // Skeleton shown while the client bundle loads
  loading: () => <RoomsLoading />,
});

export default function RoomsPage() {
  return <RoomsPageClient />;
}
