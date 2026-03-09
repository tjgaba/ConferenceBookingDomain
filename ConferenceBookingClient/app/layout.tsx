// app/layout.tsx — Root Layout (Server Component)
//
// Replaces the Vite index.html shell. Every route in this app is wrapped by
// this layout. Because it is a Server Component it renders on the server and
// sends fully-formed HTML to the browser, enabling SSR and improving SEO.
//
// Global CSS is imported here once so it applies to every page.

import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  title: 'Conference Booking System',
  description: 'Book conference rooms with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
