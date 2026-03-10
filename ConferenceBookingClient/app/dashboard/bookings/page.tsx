// app/dashboard/bookings/page.tsx — Bookings management route (Server Component)
//
// URL: /dashboard/bookings
// next/dynamic with { ssr: false } prevents BookingsPageClient from running
// during the server pre-render pass (it reads JWT from localStorage).

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
