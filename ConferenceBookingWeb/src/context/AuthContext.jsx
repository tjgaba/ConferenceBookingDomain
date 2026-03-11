'use client';
// AuthContext.jsx — Shared authentication state for the entire application.
//
// Wraps useAuth in a React Context so that layout-level components (Header,
// rendered inside app/AppShell.tsx) and page-level components (App.jsx) can
// both read the same auth state instance without prop-drilling through the
// Next.js layout → page → component tree.
//
// Usage:
//   - Wrap the tree: <AuthProvider>{children}</AuthProvider>
//   - Consume state:  const { isLoggedIn, currentUser, login, logout } = useAuthContext()

import { createContext, useContext, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { configureApiClient } from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // useAuth is called once here. Every component in the tree that calls
  // useAuthContext() reads from this single instance — no state divergence.
  const auth = useAuth();

  // ── Axios Interceptor Integration ──────────────────────────────────────────
  // Wire the live Context token and logout() into the Axios singleton so:
  //   • Request interceptor reads the token directly from Context state.
  //   • 401 response interceptor calls logout() from Context (not CustomEvent).
  // Re-runs whenever token or logout reference changes.
  useEffect(() => {
    configureApiClient({
      getToken: () => auth.token,
      onUnauthorized: auth.logout,
    });
  }, [auth.token, auth.logout]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx;
}

// Convenience alias: const { user, token, login, logout } = useAuth()
export const useAuth = useAuthContext;

// NOTE: useAuth is exported as a convenience alias for useAuthContext, so you can use: const { user, token, login, logout } = useAuth()
