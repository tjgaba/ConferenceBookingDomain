'use client';
// app/dashboard/DashboardLoadingSkeleton.tsx
//
// Extracted client component — used by both:
//   1. loading.tsx (Server Component) → SSR-streamed skeleton
//   2. page.tsx (Client Component)    → next/dynamic loading prop

import styles from './loading.module.css';

export default function DashboardLoadingSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.statStrip}>
        <div className={`${styles.sk} ${styles.statCard}`} aria-hidden="true" />
        <div className={`${styles.sk} ${styles.statCard}`} aria-hidden="true" />
      </div>

      <div className={styles.sectionHeader} aria-hidden="true">
        <div className={`${styles.sk} ${styles.heading}`} />
      </div>

      <div className={styles.sectionHeader} style={{ marginTop: '16px' }} aria-hidden="true">
        <div className={`${styles.sk} ${styles.heading}`} />
      </div>

      <span
        role="status"
        aria-live="polite"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
      >
        Loading dashboard…
      </span>
    </div>
  );
}
