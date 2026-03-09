// app/dashboard/page.tsx — Dashboard Route, route: /dashboard  (Server Component)
//
// Server-side entry point for the main application view.
// DashboardEntry is a Client Component that applies next/dynamic with
// { ssr: false }, which prevents the dashboard from being pre-rendered server-
// side — necessary because the dashboard reads JWT state from localStorage at
// initialisation time (localStorage does not exist on the server).

import DashboardEntry from './DashboardEntry';

export default function DashboardPage() {
  return <DashboardEntry />;
}
