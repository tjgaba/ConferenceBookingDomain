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
  const [isLoggedIn, setIsLoggedIn]     = useState(authService.isAuthenticated());
  const [currentUser, setCurrentUser]   = useState(authService.getCurrentUser());
  const [showLoginForm, setShowLoginForm] = useState(false);
  // Incrementing refreshKey forces the data-fetch effect in App to re-run
  // even when isLoggedIn was already true (stale-token / DB-reset scenario).
  const [refreshKey, setRefreshKey]     = useState(0);

  // ── Req 8 / Response Interceptor ────────────────────────────────────────────
  // Listen for the CustomEvent dispatched by apiClient's 401 response interceptor.
  // Clears all auth state and opens the login form without a full page reload.
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsLoggedIn(false);
      setCurrentUser(null);
      setShowLoginForm(true);
      onSessionExpired?.(); // Let the caller (App) show a toast or any UI feedback
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [onSessionExpired]);

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
    setIsLoggedIn(false);
    setCurrentUser(null);
  }, []);

  return {
    isLoggedIn,
    currentUser,
    showLoginForm,
    setShowLoginForm,
    refreshKey,
    login,
    logout,
  };
}

export default useAuth;
