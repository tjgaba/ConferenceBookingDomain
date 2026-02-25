# Errors Encountered & Solutions

This file is a living log of every error encountered during the Resilient Client implementation (Axios, Interceptors & Race Conditions). Each entry follows the same format so it can be used as a step-by-step reference guide for anyone who runs into the same problem in the future.

---

## Template Format

```
### [ERR-XXX] Short description of the error
**When it happened:** Which requirement / file / step triggered it.
**Symptom:** What you saw in the browser console, terminal, or UI.
**Root Cause:** Why it happened.
**Fix (step-by-step):**
  1. ...
  2. ...
**Files changed:** list every file that was edited.
```

---

## Errors Log

---

### [ERR-001] Double `.data` unwrapping — `response.data` returns `undefined`
**When it happened:** Requirement 2 — Response Interceptor / Requirement 3 — `useBookings.js` refactor.  
**Symptom:** The `bookings` state was `undefined` instead of an array. The component rendered nothing, or crashed with "Cannot read properties of undefined (reading 'map')".  
**Root Cause:** The Axios response interceptor already returned `response.data`. The consuming hook (or component) then tried to access `.data` on that already-unwrapped value, which is plain `undefined`.  
**Fix (step-by-step):**
1. Open `src/api/apiClient.js` and confirm the response interceptor returns `response.data`:
   ```js
   axiosInstance.interceptors.response.use(
     (response) => response.data,   // <-- unwrapping happens HERE
     ...
   );
   ```
2. Open `src/hooks/useBookings.js` (and every other consumer).
3. Remove any `.data` access on the result of an Axios call.  
   Before: `const result = await apiClient.get('/api/bookings'); setBookings(result.data);`  
   After:  `const result = await apiClient.get('/api/bookings'); setBookings(result);`
4. Save both files and refresh the app. The state should now populate correctly.  
**Files changed:** `src/api/apiClient.js`, `src/hooks/useBookings.js`

---

### [ERR-002] AbortController signal not passed — requests not cancelled on unmount
**When it happened:** Requirement 3 — `useEffect` cleanup / AbortController wiring.  
**Symptom:** React DevTools showed the state update warning: "Can't perform a React state update on an unmounted component." Fast navigation between pages left stale network requests alive.  
**Root Cause:** The `AbortController` was created inside `useEffect` but its `.signal` was never passed to the Axios call, so aborting the controller had no effect on the in-flight request.  
**Fix (step-by-step):**
1. Inside the `useEffect` in `useBookings.js`, create the controller:
   ```js
   const controller = new AbortController();
   ```
2. Pass the signal to the Axios request options:
   ```js
   await apiClient.get('/api/bookings/public', { signal: controller.signal });
   ```
3. Add the cleanup function at the end of the `useEffect`:
   ```js
   return () => controller.abort();
   ```
4. In the `catch` block, check for a cancelled (aborted) request and silently ignore it:
   ```js
   if (axios.isCancel(error)) return;
   ```
**Files changed:** `src/hooks/useBookings.js`

---

### [ERR-003] `VITE_API_BASE_URL` undefined — all requests go to `undefined/api/...`
**When it happened:** Requirement 1 — Axios instance configuration.  
**Symptom:** Every request URL in the Network tab showed `undefined/api/bookings`. Requests failed immediately with a network error.  
**Root Cause:** The `.env` file either did not exist, was not prefixed with `VITE_`, or Vite's dev server had not been restarted after the variable was added.  
**Fix (step-by-step):**
1. Create or open `ConferenceBookingClient/.env`.
2. Add the variable — the name **must** start with `VITE_`:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```
3. Save the file.
4. Stop the Vite dev server (`Ctrl+C`) and restart it (`npm run dev`). Vite only reads `.env` on startup.
5. Confirm in `apiClient.js` that the base URL is consumed correctly:
   ```js
   baseURL: import.meta.env.VITE_API_BASE_URL,
   ```
**Files changed:** `ConferenceBookingClient/.env`, `src/api/apiClient.js`

---

### [ERR-004] Timeout error not distinguished — shown as generic network error
**When it happened:** Requirement 3 — Error discrimination in `catch` block.  
**Symptom:** When the server deliberately took longer than 5 seconds, the UI displayed a generic "Network error" message instead of the specific "Server took too long to respond" message.  
**Root Cause:** The `catch` block checked for `axios.isCancel(error)` but then fell through to a single generic handler. Axios surfaces timeouts as errors with `error.code === 'ECONNABORTED'`, which was never checked separately.  
**Fix (step-by-step):**
1. In `useBookings.js`, expand the `catch` block with explicit checks:
   ```js
   } catch (err) {
     if (axios.isCancel(err)) return;                            // aborted — ignore
     if (err.code === 'ECONNABORTED') {
       setError('The server took too long to respond (timeout).');
     } else if (err.response) {
       setError(`Server error ${err.response.status}: ${err.response.data?.message ?? err.message}`);
     } else {
       setError('Cannot reach the server. Check your network connection.');
     }
   }
   ```
2. Verify by throttling the network in Chrome DevTools (set to "Offline" or use `setTimeout` in the backend to delay the response beyond 5 s).  
**Files changed:** `src/hooks/useBookings.js`

---

### [ERR-005] ESLint `no-console` warning on interceptor logs
**When it happened:** Requirement 2 — Request Interceptor console logging.  
**Symptom:** ESLint flagged `console.log(...)` calls in `apiClient.js` with the `no-console` rule.  
**Root Cause:** The project's ESLint config disallows `console` statements in production code.  
**Fix (step-by-step):**
1. Do **not** add `// eslint-disable`. Instead, check `eslint.config.js` for the rule definition.
2. Create a thin `src/utils/logger.js` wrapper that only logs in development:
   ```js
   export const log = (...args) => {
     if (import.meta.env.DEV) console.log(...args);
   };
   ```
3. Replace `console.log` calls in `apiClient.js` with `log(...)` imports from the utility.
4. The linter is satisfied because `console` is only used inside a utility module that is explicitly designed for it.  
**Files changed:** `src/api/apiClient.js`, `src/utils/logger.js` (new)

---

*Add new entries below this line as additional errors are encountered.*
