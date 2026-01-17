import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';
import type { User, LoginCredentials, AuthError } from '../types/auth';

const AUTH_TOKEN_KEY = 'wicgate_auth_token';
const AUTH_USERNAME_KEY = 'wicgate_username';
const AUTH_TYPE_KEY = 'wicgate_auth_type';

/**
 * Check if a JWT token is expired
 * @param token JWT token string
 * @returns true if token is expired, false if valid or non-JWT format
 */
function isTokenExpired(token: string): boolean {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    // Non-JWT tokens (opaque tokens) are assumed valid for backwards compatibility
    if (parts.length !== 3) return false;

    // Decode payload (base64url to JSON)
    const payload = parts[1];
    if (!payload) return false;

    // Base64url decode: replace - with +, _ with /, add padding
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const decoded = globalThis.atob(padded);
    const data = JSON.parse(decoded) as { exp?: number };

    // Check expiration (exp is in seconds, Date.now() is in milliseconds)
    if (!data.exp) return false; // No expiration claim = never expires
    return data.exp * 1000 < Date.now();
  } catch {
    // Parsing error on non-JWT format - assume valid for backwards compatibility
    return false;
  }
}

// Server URLs - always use production server for admin API (no local admin server)
export const ADMIN_API_URL = 'https://www.wicgate.com:8080';
export const USER_API_URL = 'https://www.wicgate.com';

// For backwards compatibility
export const SERVER_URL = ADMIN_API_URL;

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null);
  const authToken = ref<string | null>(null);
  const authType = ref<'admin' | 'user' | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!currentUser.value && !!authToken.value);
  const isAdmin = computed(() => authType.value === 'admin');
  const isUser = computed(() => authType.value === 'user');
  const userName = computed(() => currentUser.value?.username);

  /**
   * Login as admin (username/password against admin API)
   */
  async function loginAdmin(credentials: LoginCredentials): Promise<void> {
    if (import.meta.server) return;

    loading.value = true;
    error.value = null;

    try {
      const response = await axios.post(ADMIN_API_URL + '/login', {
        username: credentials.username,
        password: credentials.password,
      });

      const token = response.data.token;

      currentUser.value = {
        username: credentials.username,
        role: 'admin',
      };
      authToken.value = token;
      authType.value = 'admin';

      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USERNAME_KEY, credentials.username);
        localStorage.setItem(AUTH_TYPE_KEY, 'admin');
      }
    } catch (e) {
      const axiosError = e as AxiosError<{ error?: string }>;
      const errorMessage = axiosError.response?.data?.error || axiosError.message || 'Login failed';
      error.value = errorMessage;
      throw { message: errorMessage, code: 'LOGIN_FAILED' } as AuthError;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Login as user (email/password against user API)
   */
  async function loginUser(credentials: LoginCredentials): Promise<void> {
    if (import.meta.server) return;

    loading.value = true;
    error.value = null;

    try {
      const response = await axios.post(USER_API_URL + '/api/user/login', {
        email: credentials.username,
        password: credentials.password,
      });

      const token = response.data.token;
      const email = response.data.email;

      currentUser.value = {
        username: email,
        role: 'user',
      };
      authToken.value = token;
      authType.value = 'user';

      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USERNAME_KEY, email);
        localStorage.setItem(AUTH_TYPE_KEY, 'user');
      }
    } catch (e) {
      const axiosError = e as AxiosError<{ error?: string }>;
      const errorMessage = axiosError.response?.data?.error || axiosError.message || 'Login failed';
      error.value = errorMessage;
      throw { message: errorMessage, code: 'LOGIN_FAILED' } as AuthError;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Logout and clear session
   */
  function logout(): void {
    // Never run during SSR
    if (import.meta.server) return;

    currentUser.value = null;
    authToken.value = null;
    authType.value = null;
    error.value = null;

    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USERNAME_KEY);
      localStorage.removeItem(AUTH_TYPE_KEY);
    }
  }

  /**
   * Check authentication status and restore session from localStorage
   */
  async function checkAuth(): Promise<void> {
    // Never run during SSR
    if (import.meta.server) return;

    // Already authenticated, no need to check
    if (isAuthenticated.value) return;

    loading.value = true;
    error.value = null;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
      const username =
        typeof window !== 'undefined' ? localStorage.getItem(AUTH_USERNAME_KEY) : null;
      const storedAuthType =
        typeof window !== 'undefined' ? localStorage.getItem(AUTH_TYPE_KEY) : null;

      if (!token || !username || !storedAuthType) {
        loading.value = false;
        return;
      }

      // Check if token is expired before restoring session
      if (isTokenExpired(token)) {
        // Clear expired token from localStorage
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USERNAME_KEY);
        localStorage.removeItem(AUTH_TYPE_KEY);
        loading.value = false;
        return;
      }

      // Restore session from localStorage (token is valid)
      currentUser.value = {
        username,
        role: storedAuthType === 'admin' ? 'admin' : 'user',
      };
      authToken.value = token;
      authType.value = storedAuthType as 'admin' | 'user';
    } finally {
      loading.value = false;
    }
  }

  /**
   * Set error message (for validation errors in components)
   */
  function setError(message: string | null): void {
    error.value = message;
  }

  return {
    // State
    currentUser,
    authToken,
    authType,
    loading,
    error,
    // Getters
    isAuthenticated,
    isAdmin,
    isUser,
    userName,
    // Actions
    loginAdmin,
    loginUser,
    logout,
    checkAuth,
    setError,
  };
});
