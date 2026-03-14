'use client';
// app/dashboard/bookings/page.tsx — Bookings management, route: /dashboard/bookings
//
// 'use client' is required because next/dynamic with { ssr: false } must be
// called from a Client Component (Next.js 16 Turbopack enforces this).
// BookingsPageClient reads JWT from localStorage — browser-only.

import dynamic from 'next/dynamic';
import BookingsLoading from './loading';

const BookingsPageClient = dynamic(() => import('./BookingsPageClient'), {
  ssr: false,
  // Skeleton shown while the client bundle loads — mirrors the real layout
  // so there is no content-shift when the component mounts.
  loading: () => <BookingsLoading />,
});

export default function BookingsPage() {
  return <BookingsPageClient />;
}
