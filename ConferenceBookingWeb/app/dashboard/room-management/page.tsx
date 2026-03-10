'use client';
// app/dashboard/room-management/page.tsx
// Route: /dashboard/room-management
//
// 'use client' + dynamic import with ssr:false required because the client
// component reads localStorage (JWT) and uses browser-only SignalR hooks.

import dynamic from 'next/dynamic';

const RoomManagementPageClient = dynamic(
  () => import('./RoomManagementPageClient'),
  {
    ssr: false,
    loading: () => (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>
        Loading room management…
      </div>
    ),
  }
);

export default function RoomManagementPage() {
  return <RoomManagementPageClient />;
}
