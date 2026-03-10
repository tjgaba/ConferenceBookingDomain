'use client';
// AppShell.tsx — Root application shell (Client Component).
//
// Responsibilities:
//   1. Wraps the entire app in <AuthProvider> so every component in the
//      tree (layout components AND page components) shares one auth state.
//   2. Renders the persistent Header and Sidebar on every route except /login,
//      which needs a clean, shell-free layout for the authentication UI.
//
// Why 'use client':
//   - usePathname is a Next.js hook (browser-only) used to detect the current
//     route so the shell is conditionally hidden on the /login page.
//   - <AuthProvider> contains useAuth which uses useState/useEffect.

import { usePathname } from 'next/navigation';
import { AuthProvider } from '../src/context/AuthContext';
import Header from '../src/components/Header';
import Sidebar from '../src/components/Sidebar';
import './AppShell.css';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide the shell (Header + Sidebar) on the /login page so the
  // authentication UI has a clean, full-viewport layout.
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
