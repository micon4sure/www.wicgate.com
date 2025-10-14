/**
 * Tests for auth store
 * Validates authentication, session management, and route guards
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from './auth';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('auth store', () => {
  let authStore: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    // Create fresh Pinia instance for each test
    setActivePinia(createPinia());

    // Clear localStorage
    localStorageMock.clear();

    // Ensure SSR is false (client-side mode)
    vi.stubEnv('SSR', false);

    // Get fresh store instance
    authStore = useAuthStore();

    // Clear timers (for mock delays)
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Initial State', () => {
    it('should have null user and token initially', () => {
      expect(authStore.currentUser).toBeNull();
      expect(authStore.authToken).toBeNull();
      expect(authStore.loading).toBe(false);
      expect(authStore.error).toBeNull();
    });

    it('should have correct computed properties for unauthenticated state', () => {
      expect(authStore.isAuthenticated).toBe(false);
      expect(authStore.isAdmin).toBe(false);
      expect(authStore.userName).toBeUndefined();
    });
  });

  describe('Login', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should login successfully with admin credentials', async () => {
      const loginPromise = authStore.login({ username: 'admin', password: 'admin123' });

      // Should set loading state immediately
      expect(authStore.loading).toBe(true);
      expect(authStore.error).toBeNull();

      // Fast-forward through mock delay
      await vi.advanceTimersByTimeAsync(500);
      await loginPromise;

      // Should set user and token
      expect(authStore.currentUser).toEqual({
        username: 'admin',
        role: 'admin',
      });
      expect(authStore.authToken).toMatch(/^mock_jwt_admin_\d+$/);
      expect(authStore.isAuthenticated).toBe(true);
      expect(authStore.isAdmin).toBe(true);
      expect(authStore.userName).toBe('admin');
      expect(authStore.loading).toBe(false);
      expect(authStore.error).toBeNull();

      // Should persist token to localStorage
      expect(localStorageMock.getItem('wicgate_auth_token')).toMatch(/^mock_jwt_admin_\d+$/);
    });

    it('should login successfully with user credentials', async () => {
      const loginPromise = authStore.login({ username: 'user', password: 'user123' });

      await vi.advanceTimersByTimeAsync(500);
      await loginPromise;

      expect(authStore.currentUser).toEqual({
        username: 'user',
        role: 'user',
      });
      expect(authStore.isAuthenticated).toBe(true);
      expect(authStore.isAdmin).toBe(false);
      expect(authStore.userName).toBe('user');
    });

    it('should fail login with invalid username', async () => {
      const loginPromise = authStore.login({ username: 'invalid', password: 'wrong' });

      const rejection = expect(loginPromise).rejects.toMatchObject({
        message: 'Invalid username or password',
        code: 'INVALID_CREDENTIALS',
      });

      await vi.advanceTimersByTimeAsync(500);
      await rejection;

      expect(authStore.currentUser).toBeNull();
      expect(authStore.authToken).toBeNull();
      expect(authStore.isAuthenticated).toBe(false);
      expect(authStore.error).toBe('Invalid username or password');
      expect(authStore.loading).toBe(false);

      // Should not persist anything to localStorage
      expect(localStorageMock.getItem('wicgate_auth_token')).toBeNull();
    });

    it('should fail login with invalid password', async () => {
      const loginPromise = authStore.login({ username: 'admin', password: 'wrongpassword' });

      const rejection = expect(loginPromise).rejects.toMatchObject({
        message: 'Invalid username or password',
        code: 'INVALID_CREDENTIALS',
      });

      await vi.advanceTimersByTimeAsync(500);
      await rejection;

      expect(authStore.error).toBe('Invalid username or password');
    });

    it('should not login during SSR', async () => {
      vi.stubEnv('SSR', true);

      await authStore.login({ username: 'admin', password: 'admin123' });

      // Should do nothing during SSR
      expect(authStore.currentUser).toBeNull();
      expect(authStore.authToken).toBeNull();
      expect(authStore.loading).toBe(false);
    });
  });

  describe('Logout', () => {
    beforeEach(async () => {
      vi.useFakeTimers();

      // Login first
      const loginPromise = authStore.login({ username: 'admin', password: 'admin123' });
      await vi.advanceTimersByTimeAsync(500);
      await loginPromise;
    });

    it('should clear user, token, and error on logout', () => {
      authStore.logout();

      expect(authStore.currentUser).toBeNull();
      expect(authStore.authToken).toBeNull();
      expect(authStore.error).toBeNull();
      expect(authStore.isAuthenticated).toBe(false);
      expect(authStore.isAdmin).toBe(false);

      // Should remove token from localStorage
      expect(localStorageMock.getItem('wicgate_auth_token')).toBeNull();
    });

    it('should not logout during SSR', () => {
      vi.stubEnv('SSR', true);

      // Store current state
      const userBefore = authStore.currentUser;
      const tokenBefore = authStore.authToken;

      authStore.logout();

      // Should do nothing during SSR
      expect(authStore.currentUser).toBe(userBefore);
      expect(authStore.authToken).toBe(tokenBefore);
    });
  });

  describe('Check Auth', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should restore session from valid token in localStorage', async () => {
      // Manually set a valid token in localStorage
      const validToken = 'mock_jwt_admin_1234567890';
      localStorageMock.setItem('wicgate_auth_token', validToken);

      const checkAuthPromise = authStore.checkAuth();

      expect(authStore.loading).toBe(true);

      await vi.advanceTimersByTimeAsync(200);
      await checkAuthPromise;

      expect(authStore.currentUser).toEqual({
        username: 'admin',
        role: 'admin',
      });
      expect(authStore.authToken).toBe(validToken);
      expect(authStore.isAuthenticated).toBe(true);
      expect(authStore.loading).toBe(false);
      expect(authStore.error).toBeNull();
    });

    it('should handle invalid token gracefully', async () => {
      // Set an invalid token
      localStorageMock.setItem('wicgate_auth_token', 'invalid_token');

      const checkAuthPromise = authStore.checkAuth();

      await vi.advanceTimersByTimeAsync(200);
      await checkAuthPromise;

      // Should logout and clear everything
      expect(authStore.currentUser).toBeNull();
      expect(authStore.authToken).toBeNull();
      expect(authStore.isAuthenticated).toBe(false);
      expect(authStore.error).toBe('Invalid or expired token');
      expect(authStore.loading).toBe(false);

      // Should remove invalid token from localStorage
      expect(localStorageMock.getItem('wicgate_auth_token')).toBeNull();
    });

    it('should handle expired token gracefully', async () => {
      // Set a token for non-existent user
      localStorageMock.setItem('wicgate_auth_token', 'mock_jwt_nonexistent_123');

      const checkAuthPromise = authStore.checkAuth();

      await vi.advanceTimersByTimeAsync(200);
      await checkAuthPromise;

      expect(authStore.currentUser).toBeNull();
      expect(authStore.authToken).toBeNull();
      expect(authStore.error).toBe('User not found');
    });

    it('should do nothing if no token in localStorage', async () => {
      await authStore.checkAuth();

      expect(authStore.currentUser).toBeNull();
      expect(authStore.authToken).toBeNull();
      expect(authStore.isAuthenticated).toBe(false);
      expect(authStore.loading).toBe(false);
      expect(authStore.error).toBeNull();
    });

    it('should not check auth if already authenticated', async () => {
      // Login first
      const loginPromise = authStore.login({ username: 'admin', password: 'admin123' });
      await vi.advanceTimersByTimeAsync(500);
      await loginPromise;

      const userBefore = authStore.currentUser;
      const tokenBefore = authStore.authToken;

      // Try checkAuth again
      await authStore.checkAuth();

      // Should not change anything
      expect(authStore.currentUser).toBe(userBefore);
      expect(authStore.authToken).toBe(tokenBefore);
    });

    it('should not check auth during SSR', async () => {
      vi.stubEnv('SSR', true);

      await authStore.checkAuth();

      expect(authStore.currentUser).toBeNull();
      expect(authStore.authToken).toBeNull();
      expect(authStore.loading).toBe(false);
    });
  });

  describe('Computed Properties', () => {
    beforeEach(async () => {
      vi.useFakeTimers();
    });

    it('should update isAuthenticated when user logs in', async () => {
      expect(authStore.isAuthenticated).toBe(false);

      const loginPromise = authStore.login({ username: 'user', password: 'user123' });
      await vi.advanceTimersByTimeAsync(500);
      await loginPromise;

      expect(authStore.isAuthenticated).toBe(true);
    });

    it('should update isAdmin based on user role', async () => {
      // Login as regular user
      let loginPromise = authStore.login({ username: 'user', password: 'user123' });
      await vi.advanceTimersByTimeAsync(500);
      await loginPromise;

      expect(authStore.isAdmin).toBe(false);

      // Logout and login as admin
      authStore.logout();

      loginPromise = authStore.login({ username: 'admin', password: 'admin123' });
      await vi.advanceTimersByTimeAsync(500);
      await loginPromise;

      expect(authStore.isAdmin).toBe(true);
    });

    it('should update userName based on current user', async () => {
      expect(authStore.userName).toBeUndefined();

      const loginPromise = authStore.login({ username: 'admin', password: 'admin123' });
      await vi.advanceTimersByTimeAsync(500);
      await loginPromise;

      expect(authStore.userName).toBe('admin');
    });
  });

  describe('Session Persistence', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should persist session across page reloads', async () => {
      // Login
      const loginPromise = authStore.login({ username: 'admin', password: 'admin123' });
      await vi.advanceTimersByTimeAsync(500);
      await loginPromise;

      const tokenAfterLogin = authStore.authToken;

      // Simulate page reload by creating fresh Pinia instance
      setActivePinia(createPinia());
      const newStore = useAuthStore();
      expect(newStore.isAuthenticated).toBe(false); // Not restored yet

      // Call checkAuth to restore session from localStorage
      const checkAuthPromise = newStore.checkAuth();
      await vi.advanceTimersByTimeAsync(200);
      await checkAuthPromise;

      // Should restore session from localStorage
      expect(newStore.currentUser).toEqual({
        username: 'admin',
        role: 'admin',
      });
      expect(newStore.authToken).toBe(tokenAfterLogin);
      expect(newStore.isAuthenticated).toBe(true);
    });
  });
});
