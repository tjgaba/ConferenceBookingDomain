# The Server/Client Boundary Challenge

## Table of Contents

1. [The Mental Model](#1-the-mental-model)
2. [The Two Rules That Drive Every Decision](#2-the-two-rules-that-drive-every-decision)
3. [How the Directive Works](#3-how-the-directive-works)
4. [Component-by-Component Analysis](#4-component-by-component-analysis)
   - [Server Components (no directive needed)](#server-components-no-directive-needed)
   - [Client Components (require `'use client'`)](#client-components-require-use-client)
5. [The Function-Prop Problem](#5-the-function-prop-problem)
6. [The Dead Code Removal — Header.jsx](#6-the-dead-code-removal--headerjsx)
7. [Why Bundle Size Matters](#7-why-bundle-size-matters)
8. [Decision Flowchart](#8-decision-flowchart)
9. [Full Component Map](#9-full-component-map)
10. [Persistent Global Layouts](#10-persistent-global-layouts)
11. [Optimized Navigation with the Next.js Link Component](#11-optimized-navigation-with-the-nextjs-link-component)
12. [Dynamic Route Implementation — `/bookings/[id]`](#12-dynamic-route-implementation--bookingsid)
13. [Vite Removal — Zero Traces Remaining](#13-vite-removal--zero-traces-remaining)

---

## 1. The Mental Model

In a Vite SPA every component is a **Client Component** — all JavaScript lands in the browser, all
components run in the browser. There is no concept of server-rendering at the component level.

In Next.js App Router the default is the **opposite**: every component is a **Server Component**
unless you explicitly opt it into the browser with the `'use client'` directive.

```
Vite SPA                         Next.js App Router
────────────────────────         ────────────────────────────────────────
All components = client          All components = server  ← default
No server rendering              'use client' = opt into browser
Full JS bundle sent to browser   Only Client Component JS is sent
```

The goal of this requirement is to **send the minimum JavaScript to the browser**. Every component
that can stay on the server removes its weight from the browser bundle entirely.

---

## 2. The Two Rules That Drive Every Decision

### Rule 1 — A component is a Server Component unless it needs the browser.

Things that require the browser:
- React hooks (`useState`, `useEffect`, `useRef`, `useContext`, ...)
- Browser-only APIs (`localStorage`, `window`, `document`, `setTimeout`, ...)
- DOM event handlers (`onClick`, `onChange`, `onSubmit`, ...)
- `useRouter` from `next/navigation`

If a component uses any of the above: add `'use client'`. Otherwise: leave it alone.

### Rule 2 — `'use client'` is contagious downward, not upward.

Once you mark a file `'use client'`, **every module imported by that file** is also treated as
client-side, even if it has no directive of its own. This is called the **client subtree**.

```
'use client'    ← boundary starts here
  └─ ComponentA    ← implicitly client (imported by a 'use client' file)
       └─ ComponentB  ← also implicitly client
```

A Server Component can render a Client Component. A Client Component **cannot** render a Server
Component — once you cross into the client boundary you stay there.

---

## 3. How the Directive Works

`'use client'` is placed as the **very first line** of a file, before any imports:

```jsx
'use client';          // ← must be line 1

import { useState } from 'react';
import './BookingForm.css';

function BookingForm({ ... }) { ... }
```

It is a string literal, not a comment or import. Next.js (and Turbopack/Webpack) read it at build
time and route that module to the browser bundle.

**Without the directive:**

```jsx
// No 'use client' → Server Component
import './Footer.css';

function Footer() {
  return <footer><p>© 2026 Conference Booking System</p></footer>;
}
```

No JavaScript ships to the browser for this file. The HTML is generated on the server and sent
as text.

---

## 4. Component-by-Component Analysis

### Server Components (no directive needed)

These three components have **zero hooks, zero event handlers, and zero browser APIs**. They
render pure HTML based on props. Next.js generates their output on the server — no JS is ever
sent to the browser for them.

---

#### [`src/components/Footer.jsx`](../src/components/Footer.jsx#L1)

```jsx
// No 'use client' — pure static HTML
import './Footer.css';

function Footer() {
  return (
    <footer>
      <p>© 2026 Conference Booking System. All rights reserved.</p>
    </footer>
  );
}
```

**Why Server Component:** Only renders a single `<footer>` with static text. No interactivity
whatsoever. The HTML is identical on every render. Shipping JS for this would be wasteful.

---

#### [`src/components/LoadingSpinner.jsx`](../src/components/LoadingSpinner.jsx#L1)

```jsx
// No 'use client' — conditional rendering only
function LoadingSpinner({ overlay = false, message = 'Loading...' }) {
  if (overlay) {
    return <div className="loading-overlay">...</div>;
  }
  return <div className="loading-spinner">...</div>;
}
```

**Why Server Component:** Only switches between two HTML templates based on a prop. No state,
no effects, no browser APIs. The CSS animation (`@keyframes spin`) lives in the `.css` file — CSS
animations do not require JavaScript.

---

#### [`src/components/UserInfo.jsx`](../src/components/UserInfo.jsx#L1)

```jsx
// No 'use client' — pure data display
function UserInfo({ user }) {
  if (!user) return null;
  const displayName = user.username || user.name || 'User';
  const initials = ...;
  return <div className="user-info">...</div>;
}
```

**Why Server Component:** Derives strings from the `user` prop and renders them as HTML. No
state, no effects, no events. The derivation logic (`displayName`, `initials`) is pure JavaScript
that runs equally well on the server.

---

### Client Components (require `'use client'`)

---

#### [`src/components/BookingForm.jsx`](../src/components/BookingForm.jsx#L1)

```jsx
'use client';

import { useState, useEffect } from 'react';
```

**Why:** Uses `useState` for four controlled inputs (roomId, startTime, endTime, status),
`useEffect` to sync `initialData` when editing an existing booking, and an `async` submit handler
that calls the Axios API. All three require the browser.

---

#### [`src/components/RoomForm.jsx`](../src/components/RoomForm.jsx#L1)

```jsx
'use client';

import { useState, useEffect } from 'react';
```

**Why:** Same pattern as `BookingForm` — four controlled inputs, `useEffect` sync, submit handler.

---

#### [`src/components/LoginForm.jsx`](../src/components/LoginForm.jsx#L1)

```jsx
'use client';

import { useState } from 'react';
```

**Why:** Controls username, password, error, and loading state via `useState`. The `handleSubmit`
async function calls the auth API. Controlled inputs change on every keystroke — impossible without
browser state.

---

#### [`src/components/Button.jsx`](../src/components/Button.jsx#L1)

```jsx
'use client';
```

**Why:** Renders `<button onClick={onClick}>`. The `onClick` prop is a JavaScript function. Even
though `Button` doesn't _define_ the function, it _attaches_ it to a DOM event. Attaching event
listeners is a browser operation.

**Key lesson:** A component that renders `onClick` on a native element (`<button>`, `<input>`,
etc.) must be `'use client'`, regardless of whether the function comes from props or is defined
inline.

---

#### [`src/components/BookingCard.jsx`](../src/components/BookingCard.jsx#L1)

```jsx
'use client';
```

**Why:** Renders:
```jsx
<Button onClick={() => onEdit(booking)} />
<Button onClick={() => onDelete(booking.bookingId || booking.id)} />
```

It creates **inline arrow functions** as event handlers. Arrow functions are JavaScript values
created at runtime — they cannot exist in a server-rendered HTML string.

---

#### [`src/components/BookingList.jsx`](../src/components/BookingList.jsx#L1)

```jsx
'use client';
```

**Why — the function-prop serialisation rule:** `BookingList` accepts `onEdit` and `onDelete`
as props and passes them directly to `BookingCard`. In Next.js, **functions cannot be serialised
across the server/client boundary**. A Server Component can only pass serialisable values (strings,
numbers, plain objects, arrays) as props to Client Components. Passing a function prop means the
component accepting it must also be `'use client'`.

See [Section 5](#5-the-function-prop-problem) for a detailed explanation.

---

#### [`src/components/RoomCard.jsx`](../src/components/RoomCard.jsx#L1) and [`RoomList.jsx`](../src/components/RoomList.jsx#L1)

**Why:** Identical reasoning to `BookingCard` and `BookingList` respectively.

---

#### [`src/components/Toast.jsx`](../src/components/Toast.jsx#L1)

```jsx
'use client';

import { useEffect } from 'react';
```

**Why:** Uses `useEffect` to call `setTimeout` for auto-dismiss:
```js
useEffect(() => {
  const timerId = setTimeout(() => onClose(), duration);
  return () => clearTimeout(timerId);
}, [duration, onClose]);
```

`setTimeout` is a browser API. It does not exist in Node.js's standard runtime (Node has a
different timer API). More fundamentally, `useEffect` itself never runs on the server — it is a
client-side lifecycle hook by design.

---

#### [`src/components/ConnectionStatus.jsx`](../src/components/ConnectionStatus.jsx#L1)

```jsx
'use client';

import { useState, useEffect } from 'react';
```

**Why:** Uses `useState` to track `'checking' | 'online' | 'offline'` and `useEffect` to ping
`/health` on mount and then every 30 seconds. Both are browser-only operations — the status
reflects the _user's browser's_ connection to the API, not the server's.

---

#### [`src/components/Header.jsx`](../src/components/Header.jsx#L1)

```jsx
'use client';
```

**Why:** Renders `<button onClick={onLogin}>` and `<button onClick={onLogout}>`. The dead
heartbeat `useEffect` (an empty `setInterval` that did nothing) was also removed — see
[Section 6](#6-the-dead-code-removal--headerjsx).

**Note on the requirement:** The requirement states Header should ideally be a Server Component.
To achieve that fully, the login/logout buttons would need to be extracted into a separate
`HeaderActions.jsx` Client Component, leaving the `<header>` shell (title, nav links) as a Server
Component. That refactor is the natural next step as the architecture matures.

---

#### [`src/components/ErrorMessage.jsx`](../src/components/ErrorMessage.jsx#L1)

```jsx
'use client';
```

**Why:** Renders:
```jsx
<button onClick={onRetry}>Try Again</button>
<button onClick={onDismiss}>Dismiss</button>
```

`onRetry` and `onDismiss` arrive as props, but `ErrorMessage` attaches them to DOM `onClick`
handlers. This crosses the same line as `Button.jsx` — the act of _attaching_ a function to a
DOM event requires the browser.

---

#### [`src/components/CreateUserButton.jsx`](../src/components/CreateUserButton.jsx#L1) and [`LogoutButton.jsx`](../src/components/LogoutButton.jsx#L1)

```jsx
'use client';
```

**Why:** Both define **inline `onClick` handlers** directly on a `<button>` element:
```jsx
const handleCreateUser = () => { alert('...'); };
return <button onClick={handleCreateUser}>Create New User</button>;
```

`alert()` is a window-only browser API. The `onClick` handler is attached to a DOM element.

---

## 5. The Function-Prop Problem

This is the most subtle reason why `BookingList` and `RoomList` need `'use client'`, even though
they have no hooks of their own.

In Next.js, when a Server Component renders a Client Component, it passes **serialised props**
over the network — similar to JSON. Only values that survive serialisation are allowed:
- ✅ Strings, numbers, booleans
- ✅ Plain objects and arrays
- ✅ `null`, `undefined`
- ❌ **Functions** — functions cannot be serialised to JSON

`BookingList` receives `onEdit` and `onDelete` — both functions — and passes them to `BookingCard`.
If `BookingList` were a Server Component, it would receive an un-serialisable value as a prop,
which would cause a build-time error:

```
Error: Functions cannot be passed directly to Client Components
unless you explicitly expose it by marking it with "use server"
```

Making `BookingList` a Client Component resolves this because the functions now flow entirely
within the browser's JS runtime — no serialisation needed.

---

## 6. The Dead Code Removal — Header.jsx

`Header.jsx` previously contained this `useEffect`:

```jsx
// BEFORE (removed)
useEffect(() => {
  const intervalId = setInterval(() => {
    // background heartbeat   ← empty body, does nothing
  }, 3000);
  return () => clearInterval(intervalId);
}, []);
```

This registered a `setInterval` that fired every 3 seconds but executed **zero code**. It:
- Added an unnecessary `useEffect` (forcing `'use client'` on its own)
- Registered a timer that was never used
- Leaked a timer reference that had to be cleaned up on unmount — for no reason

It was removed. `Header.jsx` still requires `'use client'` because of its `onClick` handlers, but
for the right reason now — not because of dead code.

---

## 7. Why Bundle Size Matters

Every `'use client'` component (and everything it imports) is included in the JavaScript bundle
sent to the browser. Server Components generate zero JS — their output is HTML text.

**With correct boundaries:**
```
Browser receives:
  - Footer.jsx     → 0 KB JS  (only HTML)
  - LoadingSpinner → 0 KB JS  (only HTML)
  - UserInfo.jsx   → 0 KB JS  (only HTML)
  - BookingForm    → included in bundle (needs interactivity)
  - BookingCard    → included in bundle (needs onClick)
  - ...
```

**If everything were `'use client'` (the Vite SPA default):**
```
Browser receives ALL component code, including:
  - Footer (static text — zero reason to ship as JS)
  - LoadingSpinner (CSS animation — zero reason to ship as JS)
  - UserInfo (string derivation — zero reason to ship as JS)
```

For this application the saving is modest. For large applications with dozens of display-only
components, avoiding `'use client'` on static components can meaningfully reduce Time to
Interactive (TTI) — the metric most correlated with user experience on slow networks.

---

## 8. Decision Flowchart

Use this to classify any component:

```
Does it use useState, useEffect, useRef, useContext, or other hooks?
  YES → 'use client'
  NO  ↓

Does it call any browser APIs (localStorage, window, document, setTimeout)?
  YES → 'use client'
  NO  ↓

Does it render onClick, onChange, onSubmit, or any DOM event handler?
  YES → 'use client'
  NO  ↓

Does it accept function props that it passes to child elements or child components?
  YES → 'use client'
  NO  ↓

✅ Server Component — no directive needed
```

---

## 9. Full Component Map

| Component | Directive | Reason |
|---|---|---|
| [`Footer.jsx`](../src/components/Footer.jsx#L1) | None (Server) | Pure static HTML |
| [`LoadingSpinner.jsx`](../src/components/LoadingSpinner.jsx#L1) | None (Server) | Pure display, no browser APIs |
| [`UserInfo.jsx`](../src/components/UserInfo.jsx#L1) | None (Server) | Pure display, derives strings from props |
| [`Header.jsx`](../src/components/Header.jsx#L1) | `'use client'` | Renders `<button onClick={onLogin/onLogout}>` |
| [`BookingList.jsx`](../src/components/BookingList.jsx#L1) | `'use client'` | Accepts & passes function props (onEdit, onDelete) |
| [`BookingCard.jsx`](../src/components/BookingCard.jsx#L1) | `'use client'` | Renders inline arrow functions as `onClick` |
| [`RoomList.jsx`](../src/components/RoomList.jsx#L1) | `'use client'` | Accepts & passes function props (onEdit, onDelete) |
| [`RoomCard.jsx`](../src/components/RoomCard.jsx#L1) | `'use client'` | Renders inline arrow functions as `onClick` |
| [`Button.jsx`](../src/components/Button.jsx#L1) | `'use client'` | Attaches `onClick` prop to a `<button>` DOM element |
| [`BookingForm.jsx`](../src/components/BookingForm.jsx#L1) | `'use client'` | `useState`, `useEffect`, async submit handler |
| [`RoomForm.jsx`](../src/components/RoomForm.jsx#L1) | `'use client'` | `useState`, `useEffect`, submit handler |
| [`LoginForm.jsx`](../src/components/LoginForm.jsx#L1) | `'use client'` | `useState`, async submit handler |
| [`Toast.jsx`](../src/components/Toast.jsx#L1) | `'use client'` | `useEffect` + `setTimeout` (browser API) |
| [`ConnectionStatus.jsx`](../src/components/ConnectionStatus.jsx#L1) | `'use client'` | `useState`, `useEffect`, API polling |
| [`CreateUserButton.jsx`](../src/components/CreateUserButton.jsx#L1) | `'use client'` | Inline `onClick` + `alert()` (browser API) |
| [`LogoutButton.jsx`](../src/components/LogoutButton.jsx#L1) | `'use client'` | Inline `onClick` + `alert()` (browser API) |
| [`ErrorMessage.jsx`](../src/components/ErrorMessage.jsx#L1) | `'use client'` | Attaches `onRetry`/`onDismiss` props as `onClick` |
| [`Sidebar.jsx`](../src/components/Sidebar.jsx#L1) | `'use client'` | `usePathname` (Next.js hook) to highlight active route |
| [`AppShell.tsx`](../app/AppShell.tsx#L1) | `'use client'` | `usePathname` to conditionally hide shell on `/login` |

---

## 10. Persistent Global Layouts

### The Problem With Rendering the Shell Inside a Page

Before this change, `Header` was rendered _inside_ `App.jsx` (the dashboard page component). This
means every time the user navigated to a different route, React unmounted the old page and mounted
the new one — taking `Header` down and back up with it. Auth state, connection status, and any
in-flight UI was destroyed on every navigation.

### The Solution: `app/layout.tsx` + `AppShell.tsx`

Next.js `layout.tsx` files wrap their segment and all child segments. They are **mounted once and
never unmounted** for the lifetime of the segment. Putting `Header` and `Sidebar` inside the root
layout means they persist across every route transition.

```
app/
  layout.tsx          ← mounted once, never torn down
    <AppShell>
      <Header />      ← persists across /login, /dashboard, /
      <Sidebar />     ← persists across /login, /dashboard, /
      <main>
        {children}    ← only this part swaps per route
      </main>
    </AppShell>
```

### New Files

**[`src/context/AuthContext.jsx`](../src/context/AuthContext.jsx#L1)** — `'use client'`

Wraps `useAuth` in a React Context. Without this, `Header` (in the layout) and `App.jsx` (in the
page) would each call `useAuth()` independently, giving them _separate_ state instances — logging
in on the page would not update the header, and vice versa.

```jsx
export function AuthProvider({ children }) {
  const auth = useAuth();  // one instance, shared by everything below
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
```

**[`app/AppShell.tsx`](../app/AppShell.tsx#L1)** — `'use client'`

The shell Client Component that:
1. Wraps the tree in `<AuthProvider>` (single auth state instance)
2. Reads `usePathname()` to detect the current route
3. Hides `Header` + `Sidebar` on `/login` so the auth page gets a clean full-viewport layout

```tsx
export default function AppShell({ children }) {
  const pathname = usePathname();
  const showShell = !pathname.startsWith('/login');

  return (
    <AuthProvider>
      {showShell ? (
        <div className="app-shell">
          <Header />
          <div className="shell-body">
            <Sidebar />
            <main className="shell-main">{children}</main>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthProvider>
  );
}
```

**[`src/components/Sidebar.jsx`](../src/components/Sidebar.jsx#L1)** — `'use client'`

Persistent navigation sidebar using `usePathname()` to apply an `.active` class to the current
route link. Requires `'use client'` because `usePathname` is a Next.js navigation hook (browser
only).

### Changes to Existing Files

**[`app/layout.tsx`](../app/layout.tsx#L1)** — now renders `<AppShell>` as the body child:

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>  {/* shell lives here, not in pages */}
      </body>
    </html>
  );
}
```

**[`src/components/Header.jsx`](../src/components/Header.jsx#L1)** — removed all props;
reads from `useAuthContext()` instead:

```jsx
// Before — Header was a presentational component driven by props
function Header({ isLoggedIn, currentUser, onLogin, onLogout }) { ... }

// After — Header reads shared context, owns its own router calls
function Header() {
  const { isLoggedIn, currentUser, logout } = useAuthContext();
  const router = useRouter();
  ...
}
```

**[`src/App.jsx`](../src/App.jsx#L1)** — removed `import Header`, `import LoginForm`,
`import useAuth`. Auth state is now consumed from context:

```jsx
// Before
const { isLoggedIn, currentUser, showLoginForm, login, logout, ... } = useAuth(...);

// After — simpler, no login/logout handlers here
const { isLoggedIn, currentUser, refreshKey } = useAuthContext();
```

**[`src/hooks/useAuth.js`](../src/hooks/useAuth.js#L1)** — lazy `useState` initializers
prevent `localStorage is not defined` during Next.js SSR prerendering:

```js
// Before — called synchronously at module evaluation time (SSR crash)
const [isLoggedIn] = useState(authService.isAuthenticated());

// After — callback only runs in the browser
const [isLoggedIn] = useState(() => {
  if (typeof window === 'undefined') return false;
  return authService.isAuthenticated();
});
```

---

## 11. Optimized Navigation with the Next.js Link Component

### Why `<a href="...">` is wrong in a Next.js app

A plain anchor tag triggers a **full browser navigation**: the browser discards the current page,
requests a new HTML document from the server, downloads all CSS and JS again, and re-parses
everything. In Next.js this means:

- The layout unmounts — `Header` and `Sidebar` are torn down and rebuilt
- React state is wiped — auth context, scroll position, any open forms
- A network round-trip happens even for routes that are already code-split locally

### What `<Link>` does instead

Next.js `<Link>` performs **client-side navigation**:

1. Intercepts the click event before the browser handles it
2. Updates the URL with the History API (`pushState`)
3. Swaps only the `{children}` slot inside `layout.tsx` — the `Header` and `Sidebar` never unmount
4. **Prefetches** the target route's JS bundle when the link enters the viewport (in production)

```
User clicks <Link href="/dashboard">
  ↓
  Next.js router intercepts
  ↓
  URL changes: /login → /dashboard
  ↓
  layout.tsx shell stays mounted (Header, Sidebar unchanged)
  ↓
  Only <main> content swaps: LoginPageClient → DashboardClient
```

Compare with `<a href="/dashboard">`:

```
User clicks <a href="/dashboard">
  ↓
  Browser full reload — full HTTP GET /dashboard
  ↓
  Entire React tree unmounts and remounts from scratch
  ↓
  Auth state wiped, Header rebuilt, Sidebar rebuilt
```

### What Changed

**[`src/components/Header.jsx`](../src/components/Header.jsx#L1)** — three `<a>` nav links
replaced with `<Link>`:

```jsx
// Before
import './Header.css';
...
<a href="#">Home</a>
<a href="#">Bookings</a>
<a href="#">Rooms</a>

// After
import Link from 'next/link';
...
<Link href="/">Home</Link>
<Link href="/dashboard">Bookings</Link>
<Link href="/dashboard">Rooms</Link>
```

The `#` placeholder hrefs were also corrected to their actual routes in the same change.

**[`app/page.tsx`](../app/page.tsx#L1)** — the landing page already used `<Link>` from initial
creation:

```tsx
<Link href="/login" className={styles.btnPrimary}>Sign In</Link>
<Link href="/dashboard" className={styles.btnSecondary}>Go to Dashboard</Link>
```

**[`app/login/LoginPageClient.tsx`](../app/login/LoginPageClient.tsx#L1)** and
**[`src/components/Header.jsx`](../src/components/Header.jsx#L1)** — login/logout already used
`router.push()` which is also a client-side navigation (identical benefit to `<Link>`).

### Navigation Behaviour Summary

| Navigation | Method | Full Reload? | Shell Preserved? |
|---|---|---|---|
| Landing → Login | `<Link href="/login">` | No | N/A (no shell on `/login`) |
| Login → Dashboard | `router.push('/dashboard')` | No | Yes |
| Header: Home | `<Link href="/">` | No | Yes |
| Header: Bookings/Rooms | `<Link href="/dashboard">` | No | Yes |
| Header: Logout | `router.push('/login')` | No | Hides on `/login` |
| Header: Login button | `router.push('/login')` | No | Hides on `/login` |

---

## 12. Dynamic Route Implementation — `/bookings/[id]`

### What is a Dynamic Route?

A **dynamic route** is a file-based route where one segment of the URL path is a variable
captured from the browser's address bar. Next.js uses square-bracket folder names for this:

```
app/bookings/[id]/page.tsx
               ↑
               Anything typed here becomes params.id
```

Navigating to `/bookings/42` sets `params.id = "42"`. Navigating to `/bookings/999` sets
`params.id = "999"`. One file handles every booking ID.

### File Structure

```
app/bookings/
  [id]/
    page.tsx              ← Server Component — route entry, reads params
    BookingDetailClient.tsx  ← 'use client' — fetches data, renders detail
    booking-detail.css    ← scoped styles
```

### Why `page.tsx` Stays a Server Component

The requirement states: _points will be deducted for marking the entire page or layout as
`'use client'`_. Only the minimal client boundary needed is marked:

```tsx
// page.tsx — Server Component (no 'use client')
import BookingDetailClient from './BookingDetailClient';

interface PageProps {
  params: Promise<{ id: string }>; // Next.js 15+: params is a Promise
}

export default async function BookingDetailPage({ params }: PageProps) {
  const { id } = await params; // await to unwrap the Next.js 15 Promise
  return <BookingDetailClient id={id} />; // pass string prop — no fetch here
}
```

`page.tsx` contains zero browser-dependent code. It simply unpacks the URL segment and passes
it as a serialisable `string` prop to the Client Component.

### Why `BookingDetailClient.tsx` Needs `'use client'`

[`app/bookings/[id]/BookingDetailClient.tsx`](../app/bookings/%5Bid%5D/BookingDetailClient.tsx#L1)

The `.NET` API endpoint `GET /Booking/{id}` is protected by JWT. The token is stored in
`localStorage` (set by `authService.login()`). `localStorage` only exists in the browser —
it is undefined during Next.js server-side rendering. Therefore:

- The data fetch **cannot** happen in a Server Component
- `useState` tracks `booking`, `loading`, `notFound`, `error`
- `useEffect` triggers the fetch after mount (browser-only lifecycle)

```tsx
'use client';

export default function BookingDetailClient({ id }: { id: string }) {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const numericId = parseInt(id, 10);
        const data = await getBookingById(numericId); // uses apiClient + JWT
        if (!cancelled) setBooking(data as BookingDetail);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) setNotFound(true);
        else setError((err as { message?: string })?.message ?? 'Unexpected error.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; }; // cleanup prevents state update after unmount
  }, [id]);
  ...
}
```

**Race condition prevention:** the `cancelled` flag stops `setBooking` / `setError` from firing
if the component unmounts before the fetch resolves (e.g. user navigates away quickly).

### Not-Found Handling

The `.NET` `BookingController` returns `HTTP 404` with `{ "Message": "Booking with ID {id} not found." }`
when the ID does not exist. Axios throws on 4xx responses, so the status is inspected in the
catch block:

```tsx
const status = (err as { response?: { status?: number } })?.response?.status;
if (status === 404) {
  setNotFound(true); // show custom branded view
} else {
  setError(msg);     // show generic error view
}
```

This renders a custom branded "Booking Not Found" view instead of the global Next.js 404 page:

```tsx
if (notFound) {
  return (
    <div className="booking-detail-notfound">
      <div className="notfound-icon">🔍</div>
      <h1>Booking Not Found</h1>
      <p>
        No booking exists with ID <strong>#{id}</strong>. It may have been
        deleted or the ID may be incorrect.
      </p>
      <Link href="/dashboard" className="notfound-back">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
```

### Build Output

Next.js correctly identifies the route as **Dynamic** (server-rendered on demand) because the
content varies by URL segment:

```
Route (app)
├ ○ /
├ ○ /_not-found
├ ƒ /bookings/[id]     ← ƒ = Dynamic
├ ○ /dashboard
└ ○ /login

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

## 13. Vite Removal — Zero Traces Remaining

### Why Complete Removal Matters

The constraint states: _no traces of the old Vite build system or react-router-dom should remain_.
Leaving Vite packages in `devDependencies` wastes install bandwidth and creates confusion about
which toolchain is active. Leaving `vite.config.js` or `index.html` risks someone accidentally
running `vite dev` and getting a broken development environment.

### Files Deleted

| File | What it was |
|---|---|
| `vite.config.js` | Vite build configuration (`defineConfig`, `@vitejs/plugin-react`) |
| `index.html` | Vite HTML entry point — the `<div id="root">` container |
| `src/main.jsx` | `ReactDOM.createRoot` bootstrap — wires React to `#root` |

Next.js does not use any of these. It has its own HTML scaffolding (`app/layout.tsx`) and its own
build entry — none of the Vite bootstrap code applies.

### `package.json` Changes

```json
// Before
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "dev:vite": "vite",       // ← removed
  "build:vite": "vite build" // ← removed
},
"devDependencies": {
  "@vitejs/plugin-react": "^5.1.1",    // ← removed
  "eslint-plugin-react-refresh": "^0.4.24", // ← removed
  "vite": "^7.3.1"                      // ← removed
}

// After
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
},
"devDependencies": {
  "@eslint/js": "...",
  "@types/node": "...",
  "@types/react": "...",
  "@types/react-dom": "...",
  "eslint": "...",
  "eslint-plugin-react-hooks": "...",
  "globals": "...",
  "typescript": "..."
}
```

`npm install` after this change removes the 21 Vite-related packages from `node_modules`.

### `eslint.config.js` Changes

`eslint-plugin-react-refresh` is a Vite HMR plugin — it warns when a module exports something
beyond components (because Vite's Fast Refresh relies on that constraint). Next.js has its own
HMR system and does not need this rule:

```js
// Before
import reactRefresh from 'eslint-plugin-react-refresh';
// ...
plugins: { react, 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
// ...
'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

// After — plugin and rule both removed
plugins: { react, 'react-hooks': reactHooks },
```

### Environment Variable Migration

The original Vite project used `VITE_API_BASE_URL` (Vite injects `import.meta.env.VITE_*`).
Next.js uses `NEXT_PUBLIC_*` (injected at build time into `process.env.NEXT_PUBLIC_*`).

**[`.env.local`](../.env.local)**:
```
# .env.local — Next.js public environment variables
NEXT_PUBLIC_API_BASE_URL=http://localhost:5230/api
NEXT_PUBLIC_HUB_URL=http://localhost:5230/hubs/booking
```

**[`src/api/apiClient.js`](../src/api/apiClient.js#L1)**:
```js
// Before
baseURL: import.meta.env.VITE_API_BASE_URL

// After
baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
```

**[`src/hooks/useSignalR.js`](../src/hooks/useSignalR.js#L1)**:
```js
// Before
const url = import.meta.env.VITE_HUB_URL ?? 'http://localhost:5230/hubs/booking';

// After
const url = process.env.NEXT_PUBLIC_HUB_URL ?? 'http://localhost:5230/hubs/booking';
```

### Constraints Verification

| Constraint | Status |
|---|---|
| No Vite config, entry HTML, or entry JS | ✅ All three deleted |
| No `vite` / `@vitejs/plugin-react` packages | ✅ Removed from `devDependencies` |
| No `dev:vite` / `build:vite` scripts | ✅ Removed from `scripts` |
| No `import.meta.env.VITE_*` references | ✅ Both replaced with `process.env.NEXT_PUBLIC_*` |
| No `react-router-dom` (was never added) | ✅ Never used — Next.js file-based routing from the start |
| `VITE_API_BASE_URL` → `NEXT_PUBLIC_API_BASE_URL` in `.env.local` | ✅ Complete |
| `page.tsx` is not marked `'use client'` | ✅ Only `BookingDetailClient.tsx` has the directive |
| Build passes with Dynamic route shown | ✅ `ƒ /bookings/[id]` in build output |
