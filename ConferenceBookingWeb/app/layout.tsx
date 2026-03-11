// app/layout.tsx — Root Layout (Server Component)
//

//
// Wraps every route in the application. <AppShell> (a Client Component) is
// rendered here to provide the persistent Header + Sidebar shell and the
// global AuthProvider context tree.
//
// layout.tsx itself remains a Server Component — AppShell owns the 'use client'
// boundary so the layout bundle stays minimal.

import type { Metadata } from 'next';
import AppShell from './AppShell';
import '../Global.css';

export const metadata: Metadata = {
  title: 'Conference Booking System',
  description: 'Book conference rooms with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
/* NOTE: In Next.js App Router, it is common to keep layout.tsx as a Server Component for 
performance and security, and use a Client Component (like AppShell) to wrap client-
only providers (such as AuthProvider) and UI that needs React state or browser APIs. 
This pattern keeps server-rendered code fast and minimal, while still allowing global 
client-side state where needed.*/