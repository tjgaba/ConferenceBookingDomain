// app/dashboard/DashboardEntry.tsx — DEPRECATED
//
// This generic SSR gate is no longer used. Each route now directly uses
// next/dynamic inside its own page.tsx:
//
//   app/dashboard/page.tsx          → dynamic(DashboardHomeClient, { ssr: false })
//   app/dashboard/bookings/page.tsx → dynamic(BookingsPageClient,  { ssr: false })
//   app/dashboard/rooms/page.tsx    → dynamic(RoomsPageClient,     { ssr: false })

export {};
