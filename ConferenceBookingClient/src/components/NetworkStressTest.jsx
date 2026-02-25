// NetworkStressTest.jsx — Requirement 4: The Stress Test.
//
// Proves each failure mode defined in the mandate is handled gracefully:
//   1. Timeout       — server does not respond within 5 s
//   2. Network error — server is completely unreachable
//   3. 401 Auth      — server rejects the request (4xx)
//   4. 404 Not Found — valid server, resource does not exist (4xx)
//   5. Cancel        — request aborted before response arrives
//
// Rules respected:
//   • All HTTP traffic flows through apiClient (the singleton).
//   • No fetch() or axios.get() anywhere in this file.
//   • axios is imported ONLY for axios.isCancel() — not for making requests.
//   • Error states are specific — no generic "Something went wrong".

import { useState, useRef } from 'react';
import axios from 'axios';
import apiClient from '../api/apiClient';
import './NetworkStressTest.css';

// ── Per-test configuration ────────────────────────────────────────────────────
const TESTS = [
  {
    id: 'timeout',
    label: 'Timeout',
    description: 'Fires a request with a 1 ms timeout — forces ECONNABORTED before the server can reply.',
    buttonClass: 'btn-timeout',
  },
  {
    id: 'network',
    label: 'Network Error',
    description: 'Targets a port nothing is listening on — no response, no TCP connection.',
    buttonClass: 'btn-network',
  },
  {
    id: 'auth',
    label: '401 Unauthorized',
    description: 'Sends a deliberately invalid Bearer token — server rejects with 401.',
    buttonClass: 'btn-auth',
  },
  {
    id: 'notfound',
    label: '404 Not Found',
    description: 'Requests a booking ID that cannot exist — server replies with 404.',
    buttonClass: 'btn-notfound',
  },
  {
    id: 'cancel',
    label: 'Cancel / Abort',
    description: 'Starts a real request then aborts it immediately — silently ignored, no error shown.',
    buttonClass: 'btn-cancel',
  },
];

// ── Error classifier (mirrors the logic in useBookings.js) ───────────────────
function classifyError(err) {
  if (axios.isCancel(err)) {
    return { type: 'cancelled', message: null }; // intentional — silent
  }
  if (err.code === 'ECONNABORTED') {
    return { type: 'timeout', message: 'The server took too long to respond (timeout).' };
  }
  if (err.response) {
    const msg = err.response.data?.message ?? err.response.data ?? err.message;
    return {
      type: 'server',
      message: `Server error ${err.response.status}: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`,
    };
  }
  return { type: 'network', message: 'Cannot reach the server. Check your network connection.' };
}

// ── Component ─────────────────────────────────────────────────────────────────
function NetworkStressTest() {
  const [activeTest, setActiveTest]   = useState(null);   // which test is running
  const [status, setStatus]           = useState('idle'); // idle | loading | success | error | cancelled
  const [resultMessage, setResultMessage] = useState('');
  const abortRef = useRef(null);

  const runTest = async (testId) => {
    // Cancel any in-flight test before starting a new one
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setActiveTest(testId);
    setStatus('loading');
    setResultMessage('');

    try {
      switch (testId) {
        // ── 1. Timeout ──────────────────────────────────────────────────────
        // Override the instance timeout to 10 ms — any real request will exceed it.
        case 'timeout':
          await apiClient.get('/Booking', {
            timeout: 10,
            signal: controller.signal,
            params: { page: 1, pageSize: 1 },
          });
          break;

        // ── 2. Network error ────────────────────────────────────────────────
        // Absolute URL bypasses baseURL; port 19999 has nothing listening.
        case 'network':
          await apiClient.get('http://localhost:19999/unreachable', {
            signal: controller.signal,
          });
          break;

        // ── 3. 401 Unauthorized ─────────────────────────────────────────────
        // Force an invalid token on this one request — server will reject it.
        case 'auth':
          await apiClient.get('/Booking', {
            headers: { Authorization: 'Bearer invalid.token.stress-test' },
            signal: controller.signal,
            params: { page: 1, pageSize: 1 },
          });
          break;

        // ── 4. 404 Not Found ────────────────────────────────────────────────
        // Booking ID 2147483647 (Int32.MaxValue) cannot exist in the database.
        case 'notfound':
          await apiClient.get('/Booking/2147483647', {
            signal: controller.signal,
          });
          break;

        // ── 5. Cancel ───────────────────────────────────────────────────────
        // Start the request then abort it synchronously — catches CanceledError.
        case 'cancel':
          controller.abort(); // abort before the promise even settles
          await apiClient.get('/Booking', {
            signal: controller.signal,
            params: { page: 1, pageSize: 1 },
          });
          break;

        default:
          break;
      }

      // If we reach here the request unexpectedly succeeded
      setStatus('success');
      setResultMessage('Request succeeded (no failure was triggered).');
    } catch (err) {
      const { type, message } = classifyError(err);

      if (type === 'cancelled') {
        setStatus('cancelled');
        setResultMessage('Request was cancelled before a response arrived. This is intentional cleanup — no error is shown to the user.');
      } else {
        setStatus('error');
        setResultMessage(message);
      }
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setActiveTest(null);
    setStatus('idle');
    setResultMessage('');
  };

  return (
    <section className="stress-test" aria-label="Network stress test panel">
      <div className="stress-test__header">
        <h2 className="stress-test__title">Requirement 4 — Stress Test Panel</h2>
        <p className="stress-test__subtitle">
          Each button triggers a specific failure mode. The result box shows exactly what the user
          would see — no crashes, no frozen spinners, no generic messages.
        </p>
      </div>

      <div className="stress-test__buttons">
        {TESTS.map((t) => (
          <button
            key={t.id}
            className={`stress-btn ${t.buttonClass} ${activeTest === t.id && status === 'loading' ? 'stress-btn--loading' : ''}`}
            onClick={() => runTest(t.id)}
            disabled={status === 'loading'}
            title={t.description}
          >
            {activeTest === t.id && status === 'loading' ? 'Running…' : t.label}
          </button>
        ))}
        <button className="stress-btn btn-reset" onClick={reset} disabled={status === 'idle'}>
          Reset
        </button>
      </div>

      {/* ── Result area ─────────────────────────────────────────────────── */}
      {status !== 'idle' && (
        <div className={`stress-test__result stress-test__result--${status}`} role="status">
          <div className="stress-test__result-badge">{status.toUpperCase()}</div>

          {status === 'loading' && (
            <p>Waiting for response…</p>
          )}

          {status === 'cancelled' && (
            <p className="stress-test__cancelled">
              {resultMessage}
            </p>
          )}

          {status === 'error' && (
            <p className="stress-test__error-msg">{resultMessage}</p>
          )}

          {status === 'success' && (
            <p>{resultMessage}</p>
          )}
        </div>
      )}

      {/* ── Per-test description ─────────────────────────────────────────── */}
      {activeTest && (
        <p className="stress-test__description">
          <strong>What this test does:</strong>{' '}
          {TESTS.find((t) => t.id === activeTest)?.description}
        </p>
      )}
    </section>
  );
}

export default NetworkStressTest;
