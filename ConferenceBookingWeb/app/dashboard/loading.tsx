// app/dashboard/loading.tsx
// Requirement 3: Resilient UI Patterns (Next.js App Router file conventions)
//
// SERVER COMPONENT — no 'use client' directive intentionally omitted.
// Next.js streams this as HTML before JS arrives → instant visual feedback.
// The skeleton JSX lives in DashboardLoadingSkeleton.tsx ('use client') so the
// same component can be used as the next/dynamic `loading` prop in page.tsx.

import DashboardLoadingSkeleton from './DashboardLoadingSkeleton';

export default function DashboardLoading() {
  return <DashboardLoadingSkeleton />;
}
