'use client';
// app/dashboard/bookings/BookingsLoadingSkeleton.tsx
//
// Extracted client component so it can be used in TWO places without conflict:
//   1. loading.tsx (Server Component) imports this → streamed as HTML by Next.js
//   2. page.tsx (Client Component) uses this as the next/dynamic loading prop
//
// Keeping the actual skeleton logic here (client) satisfies both consumers.

import styles from '../loading.module.css';

const CARD_COUNT = 5;

export default function BookingsLoadingSkeleton() {
  return (
    <div className={styles.container}>

      {/* ── Stat card (Total Bookings count) ──────────────────────────── */}
      <div className={styles.statStrip}>
        <div className={`${styles.sk} ${styles.statCard}`} aria-hidden="true" />
      </div>

      {/* ── Section header ─────────────────────────────────────────────── */}
      <div className={styles.sectionHeader} aria-hidden="true">
        <div className={`${styles.sk} ${styles.heading}`} />
        <div className={`${styles.sk} ${styles.btnGhost}`} />
      </div>

      {/* ── Filter bar: [Search]  [Category ▾]  [Location ▾] ─────────── */}
      <div className={styles.filterBar} aria-hidden="true">
        {([0, 1, 2] as const).map(i => (
          <div key={i} className={styles.filterGroup}>
            <div className={`${styles.sk} ${styles.filterLabel}`} />
            <div className={`${styles.sk} ${styles.filterInput}`} />
          </div>
        ))}
      </div>

      {/* ── Booking card skeletons ─────────────────────────────────────── */}
      <ul className={styles.list} aria-label="Loading bookings" aria-busy="true">
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <li key={i} className={styles.card} aria-hidden="true">
            <div className={`${styles.sk} ${styles.cardTitle}`} />
            <div className={`${styles.sk} ${styles.lineLong}`} />
            <div className={`${styles.sk} ${styles.lineMed}`} />
            <div className={`${styles.sk} ${styles.badge}`} />
            <div className={styles.actions}>
              <div className={`${styles.sk} ${styles.actLg}`} />
              <div className={`${styles.sk} ${styles.actSm}`} />
              <div className={`${styles.sk} ${styles.actSm}`} />
            </div>
          </li>
        ))}
      </ul>

      <span
        role="status"
        aria-live="polite"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
      >
        Loading bookings…
      </span>
    </div>
  );
}
