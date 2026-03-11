// app/dashboard/layout.tsx — Dashboard segment layout (Server Component shell).
//
// This layout wraps every route under /dashboard with <ProtectedRoute>.
// <ProtectedRoute> is a Client Component; it reads the JWT token from the
// shared AuthContext and redirects unauthenticated guests to /login.
//
// The layout itself has no 'use client' so the outer shell remains a Server
// Component — only ProtectedRoute and its children opt into the client bundle.

import ProtectedRoute from '../../src/components/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
