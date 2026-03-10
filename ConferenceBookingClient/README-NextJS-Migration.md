# Migrating from Vite SPA to Next.js App Router

## Table of Contents

1. [Why Migrate?](#1-why-migrate)
2. [Migration Strategy: In-Place vs create-next-app](#2-migration-strategy-in-place-vs-create-next-app)
3. [Installing Next.js](#3-installing-nextjs)
4. [Configuration Files](#4-configuration-files)
5. [File-Based Route Architecture](#5-file-based-route-architecture)
6. [The Root Layout — app/layout.tsx](#6-the-root-layout--applayouttsx)
7. [The Landing Page — app/page.tsx](#7-the-landing-page--apppagetsx)
8. [The Login Route — app/login/](#8-the-login-route--applogin)
9. [The Dashboard Route — app/dashboard/](#9-the-dashboard-route--appdashboard)
10. [Server vs Client Components Explained](#10-server-vs-client-components-explained)
11. [The SSR Gate Pattern](#11-the-ssr-gate-pattern)
12. [Environment Variables](#12-environment-variables)
13. [What Changed in Existing Files](#13-what-changed-in-existing-files)
14. [Final Route Map](#14-final-route-map)

---

## 1. Why Migrate?

The original application was a **Vite Single Page Application (SPA)**. In an SPA:

- The server sends a near-empty `index.html`.
- The browser downloads the full JavaScript bundle, runs it, and renders the page.
- Search engines receive an empty shell — poor SEO.
- The user sees a blank screen until the JS is parsed and executed — slower first paint.

**Next.js App Router** changes this by running React components on the server first:

| Concern | Vite SPA | Next.js App Router |
|---|---|---|
| First HTML sent to browser | Empty `<div id="root">` | Fully rendered HTML |
| SEO | Poor (bots see blank page) | Excellent (HTML is crawlable) |
| Routing | Manual (React Router or custom) | File-based — folder = route |
| Data fetching | Always client-side (fetch/axios in useEffect) | Can fetch on the server (no waterfall) |
| Bundle size | Entire app JS sent upfront | Per-route code splitting by default |

---

## 2. Migration Strategy: In-Place vs `create-next-app`

`npx create-next-app@latest` scaffolds a fresh project. That would mean manually copying every component, hook, service, and DTO file into the new folder — tedious and loses git history.

**Chosen approach: in-place migration**

Next.js is installed as a dependency into the existing `ConferenceBookingClient` folder. The `app/` directory is created alongside the existing `src/`. All existing files are untouched — only the entry layer is new.

```
ConferenceBookingClient/
├── app/            ← NEW: Next.js routes live here
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   │   ├── page.tsx
│   │   └── LoginPageClient.tsx
│   └── dashboard/
│       ├── page.tsx
│       ├── DashboardEntry.tsx
│       └── DashboardClient.tsx
├── src/            ← UNCHANGED: all React components, hooks, services
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── dto/
└── ...config files
```

---

## 3. Installing Next.js

```bash
# Next.js framework
npm install next

# TypeScript support (Next.js generates .tsx route files)
npm install --save-dev typescript @types/node
```

Then in [`package.json`](../package.json), replace the Vite scripts with Next.js scripts. The original Vite scripts are kept under `dev:vite` and `build:vite` as a fallback:

```json
"scripts": {
  "dev":        "next dev",
  "build":      "next build",
  "start":      "next start",
  "lint":       "next lint",
  "dev:vite":   "vite",
  "build:vite": "vite build"
}
```

---

## 4. Configuration Files

### [`next.config.mjs`](../next.config.mjs)

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
```

Minimal config. Next.js handles CSS imports, TypeScript, and code splitting out of the box.

### [`tsconfig.json`](../tsconfig.json)

Created to enable TypeScript for the new `app/` files. Key options:

```json
{
  "compilerOptions": {
    "jsx": "preserve",          // Next.js transforms JSX itself
    "moduleResolution": "bundler",
    "paths": { "@/*": ["./*"] } // Allows @/app/... absolute imports
  }
}
```

> Next.js auto-updates `tsconfig.json` on the first build — it adds `target: ES2017` and adjusts `jsx` to `react-jsx` automatically. You will see this reflected in the file after the first `next build`.

---

## 5. File-Based Route Architecture

This is the central concept of the Next.js App Router:

**In Vite** — you define routes in JavaScript (React Router, custom state, etc.):

```jsx
// Old approach — route logic scattered in JS
if (view === 'login') return <LoginForm />;
if (view === 'dashboard') return <App />;
```

**In Next.js** — the filesystem _is_ the router. Each folder inside `app/` becomes a URL segment. Each folder must contain a `page.tsx` (or `page.js`) file to be publicly accessible:

```
app/
├── page.tsx          →  /
├── login/
│   └── page.tsx      →  /login
└── dashboard/
    └── page.tsx      →  /dashboard
```

**The rule:** A folder without a `page.tsx` is not a route — it can hold layouts, loading states, or helper components that are _not_ directly URL-accessible.

---

## 6. The Root Layout — `app/layout.tsx`

**File:** [`app/layout.tsx`](../app/layout.tsx#L1)

```tsx
import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  title: 'Conference Booking System',
  description: 'Book conference rooms with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**Key concepts:**

- `layout.tsx` replaces `index.html`. It is the HTML shell that wraps every route.
- It is a **Server Component by default** — no `'use client'` directive, so no JavaScript is sent to the browser for this file.
- `export const metadata` is a Next.js convention for setting `<title>` and `<meta>` tags server-side — the browser receives them in the initial HTML, improving SEO.
- Global CSS (`index.css`) is imported here once and applied to every page automatically.
- `{children}` is a React slot — Next.js injects the matching `page.tsx` content here at request time.

---

## 7. The Landing Page — `app/page.tsx`

**File:** [`app/page.tsx`](../app/page.tsx#L1)

```tsx
import Link from 'next/link';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <main className={styles.main}>
      <h1>Conference Booking System</h1>
      <Link href="/login">Sign In</Link>
      <Link href="/dashboard">Go to Dashboard</Link>
    </main>
  );
}
```

**Key concepts:**

- **Pure Server Component** — no `'use client'`, no `useState`, no `useEffect`. Next.js renders this entirely on the server and sends static HTML.
- **`<Link>` instead of `<a>`** — Next.js's `Link` component prefetches the target route when it enters the viewport, making navigation near-instant. No JavaScript is required for basic navigation.
- **CSS Modules** ([`app/page.module.css`](../app/page.module.css)) — scoped CSS where class names are locally scoped to this file. `.hero` here cannot clash with `.hero` in another file.

---

## 8. The Login Route — `app/login/`

The login route is split across two files. This pattern — a Server Component page delegating to a Client Component — is the standard Next.js way to keep the server bundle lean while still supporting interactivity.

### [`app/login/page.tsx`](../app/login/page.tsx#L1) — Server Component (entry point)

```tsx
import LoginPageClient from './LoginPageClient';

export default function LoginPage() {
  return <LoginPageClient />;
}
```

This file is intentionally minimal. It is a Server Component. Its only job is to establish the `/login` route and hand rendering to the Client Component.

### [`app/login/LoginPageClient.tsx`](../app/login/LoginPageClient.tsx#L1) — Client Component

```tsx
'use client';

import { useRouter } from 'next/navigation';
import LoginForm from '../../src/components/LoginForm';
import { authService } from '../../src/services/authService';

export default function LoginPageClient() {
  const router = useRouter();

  const handleLogin = async (username: string, password: string) => {
    await authService.login(username, password);
    router.push('/dashboard');   // Programmatic navigation after login
  };

  return (
    <LoginForm
      onLogin={handleLogin}
      onCancel={() => router.push('/')}
    />
  );
}
```

**Key concepts:**

- [`'use client'`](../app/login/LoginPageClient.tsx#L9) at the top of the file is the **Client Boundary directive**. Everything in this file (and everything it imports) runs in the browser.
- `useRouter` from `next/navigation` replaces manual URL state (`window.location.href`). `router.push('/dashboard')` performs a client-side navigation — no full page reload.
- The existing `LoginForm` component is used unchanged — Next.js can import any existing `.jsx` component into a Client Component.
- `authService.login` stores the JWT in `localStorage`. This is fine here because the file is a Client Component — `localStorage` exists in the browser.

---

## 9. The Dashboard Route — `app/dashboard/`

The dashboard is more complex because the existing `App.jsx` uses `localStorage` at initialisation time (to read the JWT token). This causes a crash during Next.js server-side pre-rendering because `localStorage` does not exist on the server. The solution is a three-layer pattern:

```
page.tsx          →  Server Component entry point
  └─ DashboardEntry.tsx   →  Client Component SSR gate
        └─ DashboardClient.tsx  →  Client Component (browser-only)
              └─ App.jsx        →  Existing application (unchanged)
```

### [`app/dashboard/page.tsx`](../app/dashboard/page.tsx#L1) — Server Component

```tsx
import DashboardEntry from './DashboardEntry';

export default function DashboardPage() {
  return <DashboardEntry />;
}
```

Clean server entry point. As future requirements are added (e.g. server-side auth checks, per-route metadata), they go here without touching client code.

### [`app/dashboard/DashboardEntry.tsx`](../app/dashboard/DashboardEntry.tsx#L1) — Client Component (SSR Gate)

```tsx
'use client';

import dynamic from 'next/dynamic';

const DashboardClient = dynamic(() => import('./DashboardClient'), {
  ssr: false,
  loading: () => <div>Loading dashboard…</div>,
});

export default function DashboardEntry() {
  return <DashboardClient />;
}
```

**Why this file exists — the `ssr: false` constraint:**

`next/dynamic` with `{ ssr: false }` must be called from a **Client Component** — Next.js enforces this. If you call it from a Server Component page, the build fails with:

```
`ssr: false` is not allowed with `next/dynamic` in Server Components.
```

`DashboardEntry` is that required Client Component wrapper. It is marked `'use client'` and owns the dynamic import. [`ssr: false`](../app/dashboard/DashboardEntry.tsx#L13) tells Next.js: _do not attempt to render DashboardClient on the server at all — only run it in the browser_.

### [`app/dashboard/DashboardClient.tsx`](../app/dashboard/DashboardClient.tsx#L1) — Client Component

```tsx
'use client';

import App from '../../src/App';

export default function DashboardClient() {
  return <App />;
}
```

This is the browser-only boundary. It imports the existing `App.jsx` without any modification. All the existing state management, hooks, SignalR connection, and API calls work exactly as before.

---

## 10. Server vs Client Components Explained

This is the central mental model of the Next.js App Router:

| | Server Component | Client Component |
|---|---|---|
| **Runs on** | Server (Node.js) | Browser |
| **Directive** | None (default) | `'use client'` at top of file |
| **Can use** | `async/await`, databases, secrets | `useState`, `useEffect`, browser APIs |
| **Cannot use** | `useState`, `useEffect`, `localStorage` | — |
| **JS sent to browser** | None | Yes |
| **SEO** | Excellent (HTML in response) | Depends |

**The rule for this project:**

- If a component only displays data and doesn't need browser APIs → **Server Component** (`page.tsx`, `layout.tsx`)
- If a component uses React hooks, event handlers, or `localStorage` → **Client Component** (add `'use client'`)

The "use client" directive defines a **boundary**. Everything imported by a Client Component is also treated as client-side code, even if that import doesn't have its own `'use client'` directive.

```
layout.tsx          (Server)
├── page.tsx        (Server)        ← "/" route
├── login/
│   ├── page.tsx       (Server)     ← "/login" route entry
│   └── LoginPageClient.tsx (Client) ← LoginForm + useRouter live here
└── dashboard/
    ├── page.tsx       (Server)     ← "/dashboard" route entry
    ├── DashboardEntry.tsx (Client) ← ssr:false gate
    └── DashboardClient.tsx (Client) ← wraps App.jsx
```

---

## 11. The SSR Gate Pattern

During `next build`, Next.js pre-renders every page to generate static HTML. When it pre-renders `/dashboard`, it runs `DashboardClient` on the server — and immediately crashes:

```
ReferenceError: localStorage is not defined
```

This happens because `authService.isAuthenticated()` reads `localStorage` at module evaluation time, and `localStorage` simply does not exist in Node.js.

The fix is `next/dynamic` with `{ ssr: false }`:

```tsx
// DashboardEntry.tsx
const DashboardClient = dynamic(() => import('./DashboardClient'), {
  ssr: false,  // ← "never run this on the server"
});
```

During pre-render, Next.js sees `ssr: false` and skips `DashboardClient` entirely. In the browser, `DashboardClient` loads normally as a lazy import. The `loading:` prop provides the HTML skeleton shown while the JS loads.

**Why `DashboardEntry` must be a Client Component:**  
Next.js only allows `ssr: false` to be called from Client Components. Calling `dynamic(..., { ssr: false })` inside a Server Component is a build error. `DashboardEntry` exists solely to be that required Client Component wrapper.

---

## 12. Environment Variables

### Old Vite approach (`.env`)

```
VITE_API_BASE_URL=http://localhost:5230/api
VITE_HUB_URL=http://localhost:5230/hubs/booking
```

Accessed in code via `import.meta.env.VITE_API_BASE_URL` — a Vite-only API.

### New Next.js approach (`.env.local`)

**File:** [`.env.local`](../.env.local#L1)

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5230/api
NEXT_PUBLIC_HUB_URL=http://localhost:5230/hubs/booking
```

Accessed via `process.env.NEXT_PUBLIC_API_BASE_URL` — the standard Node.js/Next.js way.

**The `NEXT_PUBLIC_` prefix** is required for any variable that needs to be available in the browser. Without it, the variable is server-only and will be `undefined` in client-side code.

| Prefix | Available in | Use for |
|---|---|---|
| `NEXT_PUBLIC_` | Browser + Server | API URLs, public config |
| _(no prefix)_ | Server only | Secrets, DB credentials |

### Updated files

- [`src/api/apiClient.js` line 13](../src/api/apiClient.js#L13) — `import.meta.env.VITE_API_BASE_URL` → `process.env.NEXT_PUBLIC_API_BASE_URL`
- [`src/hooks/useSignalR.js` line 19](../src/hooks/useSignalR.js#L19) — `import.meta.env.VITE_HUB_URL` → `process.env.NEXT_PUBLIC_HUB_URL`

---

## 13. What Changed in Existing Files

Only two existing source files were modified. Everything else in `src/` is untouched.

### [`src/api/apiClient.js`](../src/api/apiClient.js#L13)

```diff
- baseURL: import.meta.env.VITE_API_BASE_URL,
+ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
```

### [`src/hooks/useSignalR.js`](../src/hooks/useSignalR.js#L19)

```diff
- const HUB_URL = import.meta.env.VITE_HUB_URL ?? 'http://localhost:5230/hubs/booking';
+ const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL ?? 'http://localhost:5230/hubs/booking';
```

Both changes replace Vite's `import.meta.env` (which only works when bundled by Vite) with `process.env` (which works in both Node.js and browser environments when Next.js inlines the values at build time).

---

## 14. Final Route Map

```
URL             File                                            Render
─────────────────────────────────────────────────────────────────────────
/               app/page.tsx                                    Server (static)
/login          app/login/page.tsx
                  └─ app/login/LoginPageClient.tsx              Client
/dashboard      app/dashboard/page.tsx
                  └─ app/dashboard/DashboardEntry.tsx  (gate)   Client
                        └─ app/dashboard/DashboardClient.tsx    Client (no SSR)
                              └─ src/App.jsx                    (unchanged)
```

Run the development server with:

```bash
npm run dev
```

The app is now served by Next.js on `http://localhost:3000` (default Next.js port). The `.NET API` continues to run separately on `http://localhost:5230`.
