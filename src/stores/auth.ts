import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import type { User, LoginCredentials, AuthError } from '../types/auth';

const AUTH_TOKEN_KEY = 'wicgate_auth_token';
const AUTH_USERNAME_KEY = 'wicgate_username';

// Server URL - use proxy in dev, direct in production
export const SERVER_URL = import.meta.env.DEV ? '/admin-api' : 'https://www.wicgate.com:8080';

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null);
  const authToken = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!currentUser.value && !!authToken.value);
  const isAdmin = computed(() => currentUser.value?.role === 'admin');
  const userName = computed(() => currentUser.value?.username);

  /**
   * Login with username and password via real backend
   */
  async function login(credentials: LoginCredentials): Promise<void> {
    // Never run during SSR
    if (import.meta.env.SSR) return;

    loading.value = true;
    error.value = null;

    try {
      const response = await axios.post(SERVER_URL + '/login', {
        username: credentials.username,
        password: credentials.password,
      });

      const token = response.data.token;

      currentUser.value = {
        username: credentials.username,
        role: 'admin', // Backend doesn't return role, assume admin if login succeeds
      };
      authToken.value = token;

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USERNAME_KEY, credentials.username);
      }
    } catch (e: unknown) {
      const axiosError = e as { response?: { data?: { error?: string } }; message?: string };
      const message = axiosError.response?.data?.error || axiosError.message || 'Login failed';
      error.value = message;
      throw { message, code: 'LOGIN_FAILED' } as AuthError;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Logout and clear session
   */
  function logout(): void {
    // Never run during SSR
    if (import.meta.env.SSR) return;

    currentUser.value = null;
    authToken.value = null;
    error.value = null;

    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USERNAME_KEY);
    }
  }

  /**
   * Check authentication status and restore session from localStorage
   */
  async function checkAuth(): Promise<void> {
    // Never run during SSR
    if (import.meta.env.SSR) return;

    // Already authenticated, no need to check
    if (isAuthenticated.value) return;

    loading.value = true;
    error.value = null;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
      const username =
        typeof window !== 'undefined' ? localStorage.getItem(AUTH_USERNAME_KEY) : null;

      if (!token || !username) {
        loading.value = false;
        return;
      }

      // Validate token by making a simple API call
      await axios.get(SERVER_URL + '/servers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Token is valid
      currentUser.value = { username, role: 'admin' };
      authToken.value = token;
    } catch {
      // Token is invalid, clear it
      currentUser.value = null;
      authToken.value = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USERNAME_KEY);
      }
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    currentUser,
    authToken,
    loading,
    error,
    // Getters
    isAuthenticated,
    isAdmin,
    userName,
    // Actions
    login,
    logout,
    checkAuth,
  };
});
