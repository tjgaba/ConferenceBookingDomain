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

export default apiClient;
