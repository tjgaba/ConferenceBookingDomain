// app/dashboard/rooms/page.tsx — Rooms route (Server Component)
//
// URL: /dashboard/rooms
// Renders the same DashboardEntry SSR gate as the parent dashboard.
// App.jsx reads usePathname() to detect this route and shows only the
// Rooms section, hiding the Bookings section.

import DashboardEntry from '../DashboardEntry';

export default function RoomsPage() {
  return <DashboardEntry />;
}
