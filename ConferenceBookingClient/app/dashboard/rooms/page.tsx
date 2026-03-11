'use client';
// app/dashboard/rooms/page.tsx — Rooms management route
//
// URL: /dashboard/rooms
// 'use client' is required because next/dynamic with { ssr: false } must be
// called from a Client Component (Next.js 16 Turbopack enforces this).

import dynamic from 'next/dynamic';

const RoomsPageClient = dynamic(() => import('./RoomsPageClient'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>
      Loading rooms…
    </div>
  ),
});

export default function RoomsPage() {
  return <RoomsPageClient />;
}
