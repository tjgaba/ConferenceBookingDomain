# Resilient Client — Implementation Guide

**Mandate:** The Resilient Client (Axios, Interceptors & Race Conditions)  
**Scope:** Replace all raw `fetch()` calls in the Conference Booking frontend with a centralized, production-grade Axios HTTP client.

---

## Table of Contents

1. [Requirement 1 — The Singleton: Centralized API Client](#requirement-1--the-singleton-centralized-api-client)
2. [Requirement 2 — The Middleware: Request & Response Interceptors](#requirement-2--the-middleware-request--response-interceptors)
3. [Requirement 3 — The Refactor: Axios-Powered Hook](#requirement-3--the-refactor-axios-powered-hook)
4. [Requirement 4 — The Stress Test: Prove Your Defenses Work](#requirement-4--the-stress-test-prove-your-defenses-work)
5. [Global Constraints Checklist](#global-constraints-checklist)

---

## Requirement 1 — The Singleton: Centralized API Client

### What it requires
- Create `src/api/apiClient.js`.
- Export a single, pre-configured Axios instance that every hook and service imports.
- No component or hook may ever call `axios.create()` or `fetch()` directly.
- Base URL must come from `import.meta.env.VITE_API_BASE_URL`.
- Every request must enforce a **5-second timeout**.
- Default headers must include `Content-Type: application/json`.

### How it is implemented

**File created:** `ConferenceBookingClient/src/api/apiClient.js`

```js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
```

**Environment variable:**  
`ConferenceBookingClient/.env` must define:
```
VITE_API_BASE_URL=http://localhost:5000
```
Vite exposes any variable prefixed with `VITE_` to client code via `import.meta.env`. The dev server must be restarted after editing `.env`.

**Why a singleton?**  
`axios.create()` returns a new instance with its own interceptor chain. Calling it once at module level means the module system caches it — every `import apiClient from './api/apiClient'` receives the exact same object. This is the Node/ES-module equivalent of the Singleton design pattern.

**Why `import.meta.env` and not a hardcoded string?**  
Hardcoded URLs break when the backend port changes or the app is deployed to staging/production. Environment variables let you swap the target without touching source code.

---

## Requirement 2 — The Middleware: Request & Response Interceptors

### What it requires
- **Request interceptor:** Log every outgoing request's HTTP method and URL.
- **Response interceptor (success):** Return `response.data` directly so consumers never need `.data` chains.
- **Response interceptor (failure):** Log the error message then re-throw.

### How it is implemented

**File modified:** `ConferenceBookingClient/src/api/apiClient.js`

```js
// Request interceptor
apiClient.interceptors.request.use((config) => {
  log(`Sending ${config.method?.toUpperCase()} to ${config.url}`);
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,          // unwrap once, here, for everyone
  (error) => {
    log(`Request failed: ${error.message}`);
    return Promise.reject(error);        // re-throw so callers handle it
  }
);
```

**The double-unwrap trap:**  
Because the interceptor already returns `response.data`, every consumer receives the unwrapped payload directly. Accessing `.data` again in a hook or component will return `undefined`. The rule is: **unwrap in one place only** — the interceptor. All consuming code treats the resolved value as the final payload.

**Re-throwing on failure:**  
Returning `Promise.reject(error)` in the error handler keeps the error propagating. If you returned a resolved value (or forgot to re-throw), callers would never reach their `catch` blocks and errors would be silently swallowed.

**Logging utility:**  
To satisfy the ESLint `no-console` rule without using `eslint-disable`, all logging is routed through `src/utils/logger.js`:
```js
export const log = (...args) => {
  if (import.meta.env.DEV) console.log(...args);
};
```
This is development-only; `import.meta.env.DEV` is `false` in production builds.

---

## Requirement 3 — The Refactor: Axios-Powered Hook

### What it requires
- Refactor `useBookings.js` to use `apiClient` instead of `fetch()`.
- Maintain the three-state pattern: `loading`, `error`, `bookings` (initial value `[]`).
- Create an `AbortController` inside `useEffect`; pass its `signal` to every Axios call; call `controller.abort()` in the cleanup function.
- Distinguish four error categories in the `catch` block:
  | Category | Condition | UI Message |
  |---|---|---|
  | Cancelled request | `axios.isCancel(err)` | Silent — not shown |
  | Timeout | `err.code === 'ECONNABORTED'` | "The server took too long to respond." |
  | Network error | `!err.response` (and not cancel/timeout) | "Cannot reach the server. Check your network." |
  | Server error (4xx/5xx) | `err.response` exists | "Server error `<status>`: `<message>`" |

### How it is implemented

**File modified:** `ConferenceBookingClient/src/hooks/useBookings.js`

```js
import { useState, useEffect } from 'react';
import axios from 'axios';
import apiClient from '../api/apiClient';

const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        // The interceptor already unwraps .data — result IS the array
        const result = await apiClient.get('/api/bookings/public', {
          signal: controller.signal,
        });
        setBookings(result);
      } catch (err) {
        if (axios.isCancel(err)) return;   // intentional abort — stay silent

        if (err.code === 'ECONNABORTED') {
          setError('The server took too long to respond (timeout).');
        } else if (err.response) {
          const msg = err.response.data?.message ?? err.message;
          setError(`Server error ${err.response.status}: ${msg}`);
        } else {
          setError('Cannot reach the server. Check your network connection.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    return () => controller.abort();   // cleanup — cancel on unmount
  }, []);

  return { bookings, loading, error };
};

export default useBookings;
```

**Why `axios.isCancel` and not `err.name === 'AbortError'`?**  
Axios wraps browser abort events in its own `CanceledError` (formerly `Cancel`). Using `axios.isCancel()` is the correct, version-agnostic check. Using the raw DOM `AbortError` name works only when calling `fetch()`.

**Why `finally` for `setLoading(false)`?**  
`finally` runs regardless of whether the try block succeeded or threw. This guarantees the spinner is dismissed even if an error occurred, preventing a permanently frozen loading state.

---

## Requirement 4 — The Stress Test: Prove Your Defenses Work

### What it requires
Demonstrate each failure mode with a clear, professional error state (no crash, no frozen spinner).

### How each scenario is triggered and handled

| Scenario | How to trigger | Expected UI |
|---|---|---|
| **Timeout** | Stop the .NET API (`Ctrl+C`) while the UI is running, or add a delay in the backend longer than 5 s | "The server took too long to respond (timeout)." message replaces the spinner |
| **Network unreachable** | Disconnect from the network, or set Chrome DevTools Network to "Offline" | "Cannot reach the server. Check your network connection." |
| **Server 4xx** | Make a request to an endpoint that returns 401/403/404 (e.g., remove auth token) | "Server error 401: Unauthorized" (or whichever status + message) |
| **Server 5xx** | Introduce a deliberate exception in a backend controller, or use a tool like Fiddler to return a 500 | "Server error 500: Internal Server Error" |
| **Cancelled request** | Navigate away from the page before the request resolves | No error shown — the hook's cleanup aborts the request silently |

**How to verify the timeout specifically:**  
1. Set `timeout: 3000` temporarily in `apiClient.js` (3 s instead of 5 s).
2. In the .NET `BookingController`, add `await Task.Delay(5000)` before returning.
3. Reload the UI — after 3 s the error message should appear.
4. Revert both changes once verified.

---

## Global Constraints Checklist

| Constraint | Status | Notes |
|---|---|---|
| No raw `fetch()` or direct `axios.get()` in components/hooks | ☐ To verify | Grep for `fetch(` and `axios.get(` outside `apiClient.js` |
| No double-unwrapping `.data` | ☐ To verify | Interceptor unwraps; consumers do not access `.data` |
| Every `useEffect` with a request has a cleanup function | ☐ To verify | `return () => controller.abort()` in every hook |
| Error states are specific (not generic) | ☐ To verify | Four distinct messages mapped to four error categories |
| No `eslint-disable` or `@ts-ignore` | ☐ To verify | Logging via `logger.js` utility instead |

---

*This document is updated in-step with each requirement as implementation progresses.*
