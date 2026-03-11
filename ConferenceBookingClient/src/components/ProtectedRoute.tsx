'use client';
// ProtectedRoute.tsx — Route Guard Component.
//
// Wraps any subtree that requires authentication.
// If no valid JWT token is found in the auth state, the user is
// programmatically redirected to /login using Next.js useRouter.
//
// Usage:
//   <ProtectedRoute>{children}</ProtectedRoute>
//
// NOTE: usePathname is used to capture the current route so it can be
// passed as a ?from= query param, allowing the login page to redirect
// the user back after a successful login.

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // After hydration, if there is no token the user is a guest — redirect to /login.
    // The current path is passed as ?from= so the login page can send them back.
    if (token === null) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [token, router, pathname]);

  // While hydrating (token is null before localStorage is read) render nothing
  // to avoid a flash of protected content before the redirect fires.
  if (!token) return null;

  return <>{children}</>;
}
