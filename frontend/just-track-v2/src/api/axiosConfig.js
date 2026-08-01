// src/api/axiosConfig.js
import axios from 'axios';
import { authStorage } from './authStorage';

const apiClient = axios.create({
  baseURL: 'https://just-track-v2-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach the JWT (if we have one) to every outgoing request.
// AuthController's /auth/login and /auth/signup calls run before a token
// exists, so there's nothing to attach yet on those — harmless no-op.
apiClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend ever returns 401 on an authenticated endpoint (expired or
// invalid token — JwtAuthFilter just lets the request fall through as
// unauthenticated rather than throwing), clear the stale session and let
// the rest of the app know so it can bounce back to the login screen
// instead of showing a confusing "failed to load" error.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStorage.clear();
      window.dispatchEvent(new Event('jt:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default apiClient;