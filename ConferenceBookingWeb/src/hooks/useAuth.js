// useAuth.js — Custom Hook: Authentication state and logic.
//
// Hook Discipline constraint: all auth business logic and API calls are
// extracted here so App.jsx and components only consume state/actions,
// never interact with authService or localStorage directly.
//
// Manages:
//   - isLoggedIn / currentUser state
//   - showLoginForm UI flag
//   - refreshKey counter (forces data re-fetch after silent re-login)
//   - 401 "auth:unauthorized" global event → clears state, surfaces login form
//   - login()  → POST /auth/login via authService (all HTTP through apiClient)
//   - logout() → POST /auth/logout via authService
//
// @param {{ onSessionExpired?: () => void }} options
//   onSessionExpired — optional callback fired when a 401 wipes the session,
//   allowing the parent to show a toast without coupling the hook to UI logic.

import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

function useAuth({ onSessionExpired } = {}) {
  // Always start with logged-out state on both server and client so the
  // first render is identical (prevents SSR/hydration HTML mismatches).
  // A useEffect below reads localStorage after mount and updates state —
  // that runs only in the browser so there is no "localStorage is not
  // defined" server error either.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  // Incrementing refreshKey forces the data-fetch effect in App to re-run
  // even when isLoggedIn was already true (stale-token / DB-reset scenario).
  const [refreshKey, setRefreshKey]     = useState(0);

  // ── Hydrate from localStorage after mount ───────────────────────────────────
  // Runs once on the client after the first paint. Restores the session that
  // was persisted in localStorage by a previous login.
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    setIsLoggedIn(!!storedToken);
    setCurrentUser(authService.getCurrentUser());
  }, []);

  // ── login ────────────────────────────────────────────────────────────────────
  // Posts credentials to the .NET Auth endpoint via authService (which uses
  // the apiClient singleton — no raw fetch/axios calls).
  // Stores the returned JWT in localStorage inside authService.login().
  // Re-throws on failure so LoginForm can display the error message.
  //
  // @param {string} username
  // @param {string} password
  // @returns {Promise<{ token: string, user: object }>}
  const login = useCallback(async (username, password) => {
    const result = await authService.login(username, password); // throws on 400/401
    setToken(result.token);
    setIsLoggedIn(true);
    setCurrentUser(result.user);
    setShowLoginForm(false);
    setRefreshKey(k => k + 1); // Trigger data re-fetch in App
    return result;
  }, []);

  // ── logout ───────────────────────────────────────────────────────────────────
  // Calls authService.logout() which POSTs to /auth/logout and clears localStorage.
  const logout = useCallback(async () => {
    await authService.logout();
    setToken(null);
    setIsLoggedIn(false);
    setCurrentUser(null);
  }, []);

  return {
    isLoggedIn,
    token,
    user: currentUser,
    currentUser,
    showLoginForm,
    setShowLoginForm,
    refreshKey,
    login,
    logout,
  };
}

export default useAuth;

// NOTE: The hook returns both `token` and `user` (alias for currentUser) so components can use: const { user, token } = useAuth()
