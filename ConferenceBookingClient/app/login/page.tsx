// app/login/page.tsx — Login Route, route: /login  (Server Component)
//
// Server Components cannot use hooks or browser APIs directly.
// The actual login UI (LoginForm + router navigation) lives in LoginPageClient
// which is marked "use client". This file is a clean server-side entry point
// that simply renders the client boundary.

import LoginPageClient from './LoginPageClient';

export default function LoginPage() {
  return <LoginPageClient />;
}
