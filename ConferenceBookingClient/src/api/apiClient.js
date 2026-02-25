import axios from 'axios';

/**
 * Singleton Axios instance.
 * - baseURL is read from the VITE_API_BASE_URL environment variable.
 * - Every request times out after 5 seconds automatically.
 * - Content-Type is set to application/json for all requests.
 *
 * Import this instance wherever HTTP calls are needed.
 * Never call axios.create() or fetch() directly in components or hooks.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ───────────────────────────────────────────────────────
// Logs every outgoing request before it leaves the client.
// In production apps this is where auth tokens or trace IDs are attached.
apiClient.interceptors.request.use((config) => {
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
    return Promise.reject(error);
  }
);

export default apiClient;
