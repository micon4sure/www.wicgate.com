import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { User, LoginResponse, LoginCredentials, AuthError } from '../types/auth';

const AUTH_TOKEN_KEY = 'wicgate_auth_token';

// Mock users database
const MOCK_USERS = {
  admin: { username: 'admin', password: 'admin123', role: 'admin' as const },
  user: { username: 'user', password: 'user123', role: 'user' as const },
};

// Production safety check
if (!import.meta.env.DEV && typeof window !== 'undefined') {
  console.error(
    '[AUTH] ⚠️ CRITICAL: Mock authentication detected in production build! ' +
      'Replace with real authentication backend before deploying.'
  );
}

/**
 * Mock API delay to simulate network latency
 */
function mockDelay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock POST /api/auth/login
 * Validates credentials and returns user + token
 */
async function mockLogin(credentials: LoginCredentials): Promise<LoginResponse> {
  await mockDelay();

  const mockUser = Object.values(MOCK_USERS).find(
    (u) => u.username === credentials.username && u.password === credentials.password
  );

  if (!mockUser) {
    throw {
      message: 'Invalid username or password',
      code: 'INVALID_CREDENTIALS',
    } as AuthError;
  }

  // Generate mock JWT token (just a simple string for demo)
  const token = `mock_jwt_${mockUser.username}_${Date.now()}`;

  return {
    user: {
      username: mockUser.username,
      role: mockUser.role,
    },
    token,
  };
}

/**
 * Mock GET /api/auth/me
 * Validates token and returns user info
 */
async function mockGetMe(token: string): Promise<User> {
  await mockDelay(200);

  // Parse mock token to extract username
  const match = token.match(/^mock_jwt_(\w+)_\d+$/);
  if (!match) {
    throw {
      message: 'Invalid or expired token',
      code: 'INVALID_TOKEN',
    } as AuthError;
  }

  const username = match[1];
  const mockUser = Object.values(MOCK_USERS).find((u) => u.username === username);

  if (!mockUser) {
    throw {
      message: 'User not found',
      code: 'USER_NOT_FOUND',
    } as AuthError;
  }

  return {
    username: mockUser.username,
    role: mockUser.role,
  };
}

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
   * Login with username and password
   */
  async function login(credentials: LoginCredentials): Promise<void> {
    // Never run during SSR
    if (import.meta.env.SSR) return;

    loading.value = true;
    error.value = null;

    try {
      const response = await mockLogin(credentials);

      currentUser.value = response.user;
      authToken.value = response.token;

      // Persist token to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      }
    } catch (e: unknown) {
      const authError = e as AuthError;
      error.value = authError.message || 'Login failed';
      throw authError;
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

    // Clear token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
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
      // Try to restore token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;

      if (!token) {
        // No token found, user is not logged in
        loading.value = false;
        return;
      }

      // Validate token with mock API
      const user = await mockGetMe(token);

      currentUser.value = user;
      authToken.value = token;
    } catch (e: unknown) {
      // Token is invalid or expired, clear it
      const authError = e as AuthError;
      const errorMessage = authError.message || 'Session expired';

      // Clear auth state but preserve error message
      currentUser.value = null;
      authToken.value = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }

      // Set error AFTER clearing state
      error.value = errorMessage;
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
