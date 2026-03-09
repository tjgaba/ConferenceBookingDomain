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
