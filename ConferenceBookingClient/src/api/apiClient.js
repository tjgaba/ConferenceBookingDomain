import axios from 'axios';

/**
 * Singleton Axios instance.
 * - baseURL is read from NEXT_PUBLIC_API_BASE_URL (.env.local)
 * - Every request times out after 5 seconds automatically.
 * - Content-Type is set to application/json for all requests.
 *
 * Import this instance wherever HTTP calls are needed.
 * Never call axios.create() or fetch() directly in components or hooks.
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Auth bridge ───────────────────────────────────────────────────────────────
// apiClient is a singleton that lives outside React. AuthProvider calls
// configureApiClient() on mount so the interceptors can read the live token
// from Context state and call logout() directly instead of via CustomEvent.
//
// _getToken   — reads the JWT from the AuthContext token state.
// _onUnauthorized — calls logout() from the AuthContext on a 401 response.
let _getToken = () => localStorage.getItem('token'); // fallback until AuthProvider mounts
let _onUnauthorized = null;

/**
 * Called by AuthProvider to wire the Context token getter and logout function
 * into the Axios interceptors. Must be called inside a useEffect so it always
 * has the latest token and logout reference.
 * @param {{ getToken: () => string|null, onUnauthorized: () => void }} handlers
 */
export function configureApiClient({ getToken, onUnauthorized }) {
  if (getToken) _getToken = getToken;
  if (onUnauthorized) _onUnauthorized = onUnauthorized;
}

// ── Request Interceptor ───────────────────────────────────────────────────────
// 1. Reads the JWT from AuthContext via _getToken() so the token source is the
//    Context state, not a direct localStorage read.
// 2. Logs every outgoing request — method + full URL — to the console.
apiClient.interceptors.request.use((config) => {
  const token = _getToken(); // token sourced from AuthContext state
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const fullUrl = `${config.baseURL ?? ''}${config.url}`;
  console.log(`Sending ${config.method?.toUpperCase()} to ${fullUrl}`);
  return config;
});

// ── Response Interceptor ──────────────────────────────────────────────────────
// Success: unwrap the Axios envelope once here so no consuming code ever
//          needs to write `.data` chains.
// Failure: log the error then re-throw so callers can still handle it.
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log(`Request failed: ${error.message}`);
    if (error.response?.status === 401) {
      // Guard: only trigger session expiry if a token was present.
      // This prevents an infinite loop when authService.logout() POSTs to
      // /auth/logout without a token and the server returns 401 again.
      const hadToken = !!localStorage.getItem('token');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      if (hadToken && _onUnauthorized) {
        // Directly calls logout() from AuthContext — no CustomEvent needed.
        _onUnauthorized();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
