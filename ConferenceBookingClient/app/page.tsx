// app/page.tsx — Landing Page, route: /  (Server Component)
//
// This is a pure Server Component: no useState, no useEffect, no client-side JS.
// Next.js renders it on the server and sends static HTML — ideal for SEO and
// fast first-paint. Interactive navigation is handled via <Link> (no JS needed
// for the links themselves).

import Link from 'next/link';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Conference Booking System</h1>
        <p className={styles.subtitle}>
          Schedule and manage conference rooms across all office locations — fast,
          simple, and always in sync.
        </p>

        <div className={styles.actions}>
          {/* Next.js <Link> prefetches the target route on hover — zero-cost navigation */}
          <Link href="/login" className={styles.btnPrimary}>
            Sign In
          </Link>
          <Link href="/dashboard" className={styles.btnSecondary}>
            Go to Dashboard
          </Link>
        </div>
      </div>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <h2>Real-Time Availability</h2>
          <p>See live room availability powered by SignalR WebSocket updates.</p>
        </div>
        <div className={styles.featureCard}>
          <h2>Multi-Location Support</h2>
          <p>Manage rooms across London, Cape Town, Johannesburg, Bloemfontein and Durban.</p>
        </div>
        <div className={styles.featureCard}>
          <h2>Secure &amp; Role-Based</h2>
          <p>JWT authentication with admin controls for room and user management.</p>
        </div>
      </section>
    </main>
  );
}
