'use client';
// app/dashboard/bookings/error.tsx — Bookings Error Boundary
// Requirement 3: Resilient UI Patterns (Next.js App Router file conventions)
//
// Catches unhandled render-time errors thrown within /dashboard/bookings.
// Designed for the "API offline" scenario: shows a clear message and lets the
// user attempt a segment-level reset without a full browser refresh.
//
// `reset()` re-renders the segment children — the component re-mounts and
// retries its useEffect data fetches automatically.
//
// 'use client' is REQUIRED by Next.js for all error.tsx files.

import { useEffect } from 'react';

export default function BookingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Bookings Error Boundary]', error);
  }, [error]);

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 20px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '540px',
          width: '100%',
          textAlign: 'center',
          padding: '3rem 2.5rem',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,0,0,.1)',
          borderTop: '4px solid #e74c3c',
        }}
      >
        <div style={{ fontSize: '2.75rem', marginBottom: '1rem' }}>📅</div>

        <h2
          style={{
            color: '#c0392b',
            margin: '0 0 0.75rem',
            fontSize: '1.4rem',
          }}
        >
          Bookings could not be loaded
        </h2>

        <p
          style={{
            color: '#555',
            lineHeight: 1.6,
            marginBottom: error.digest ? '0.5rem' : '2rem',
          }}
        >
          {error.message ||
            'An unexpected error occurred. The API may be offline or unreachable.'}
        </p>

        {error.digest && (
          <p
            style={{
              color: '#aaa',
              fontSize: '0.72rem',
              fontFamily: 'monospace',
              marginBottom: '2rem',
            }}
          >
            Error ID: {error.digest}
          </p>
        )}

        <button
          onClick={reset}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 36px',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.02em',
          }}
        >
          ↺ &nbsp;Reset
        </button>

        <p style={{ color: '#bbb', fontSize: '0.78rem', marginTop: '1.5rem' }}>
          Clicking Reset re-renders this section only — no full page reload.
        </p>
      </div>
    </div>
  );
}
