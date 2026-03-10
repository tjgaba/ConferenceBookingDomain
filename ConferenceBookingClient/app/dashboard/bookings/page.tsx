// app/dashboard/bookings/page.tsx — Bookings route (Server Component)
//
// URL: /dashboard/bookings
// Renders the same DashboardEntry SSR gate as the parent dashboard.
// App.jsx reads usePathname() to detect this route and shows only the
// Bookings section, hiding the Rooms section.

import DashboardEntry from '../DashboardEntry';

export default function BookingsPage() {
  return <DashboardEntry />;
}
