'use client';

import Link from 'next/link';
import { useAuthContext } from '../src/context/AuthContext';
import styles from './page.module.css';

export default function LandingActions() {
  const { isLoggedIn } = useAuthContext();

  return (
    <div className={styles.actions}>
      {!isLoggedIn && (
        <Link href="/login" className={styles.btnPrimary}>
          Sign In
        </Link>
      )}
      <Link href="/dashboard" className={styles.btnSecondary}>
        Go to Dashboard
      </Link>
    </div>
  );
}
