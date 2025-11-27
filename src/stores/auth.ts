import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import type { User, LoginCredentials, AuthError } from '../types/auth';

const AUTH_TOKEN_KEY = 'wicgate_auth_token';
const AUTH_USERNAME_KEY = 'wicgate_username';
const AUTH_TYPE_KEY = 'wicgate_auth_type';

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
    if (import.meta.env.SSR) return;

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
   * Login as user (email/password against user API)
   */
  async function loginUser(credentials: LoginCredentials): Promise<void> {
    if (import.meta.env.SSR) return;

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
    if (import.meta.env.SSR) return;

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

      // Restore session from localStorage (token validity checked on API calls)
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
  };
});
