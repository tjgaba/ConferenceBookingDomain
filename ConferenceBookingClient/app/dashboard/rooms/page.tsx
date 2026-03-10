// app/dashboard/rooms/page.tsx — Rooms management route (Server Component)
//
// URL: /dashboard/rooms
// next/dynamic with { ssr: false } prevents RoomsPageClient from running
// during the server pre-render pass (it reads JWT from localStorage).

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
