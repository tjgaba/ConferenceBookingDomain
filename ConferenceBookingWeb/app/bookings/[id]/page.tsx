// app/bookings/[id]/page.tsx — Dynamic Booking Detail Route (Server Component)
//
// Next.js file-based routing: the [id] folder segment creates a dynamic route.
// Any URL matching /bookings/<anything> lands here, and Next.js passes the
// captured segment as params.id.
//
// This page is intentionally a Server Component — no 'use client'.
// It only reads params and delegates rendering to BookingDetailClient, which
// is the minimal Client Component boundary required for the data fetch
// (apiClient needs localStorage for the JWT, which is browser-only).
//
// Not-Found handling lives inside BookingDetailClient so a custom branded
// message is shown instead of the generic Next.js 404 page.

import BookingDetailClient from './BookingDetailClient';

// In Next.js 15+ dynamic params arrive as a Promise.
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <BookingDetailClient id={id} />;
}
