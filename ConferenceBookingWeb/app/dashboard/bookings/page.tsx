'use client';
// app/dashboard/bookings/page.tsx — Bookings management, route: /dashboard/bookings
//
// 'use client' is required because next/dynamic with { ssr: false } must be
// called from a Client Component (Next.js 16 Turbopack enforces this).
// BookingsPageClient reads JWT from localStorage — browser-only.

import dynamic from 'next/dynamic';

const BookingsPageClient = dynamic(() => import('./BookingsPageClient'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>
      Loading bookings…
    </div>
  ),
});

export default function BookingsPage() {
  return <BookingsPageClient />;
}
