import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore, ADMIN_API_URL, USER_API_URL } from '../auth';
import axios from 'axios';
import type { LoginCredentials, AuthError } from '../../types/auth';

// Mock axios
vi.mock('axios');

const AUTH_TOKEN_KEY = 'wicgate_auth_token';
const AUTH_USERNAME_KEY = 'wicgate_username';
const AUTH_TYPE_KEY = 'wicgate_auth_type';

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initial state', () => {
    it('should have null user on initialization', () => {
      const store = useAuthStore();

      expect(store.currentUser).toBeNull();
      expect(store.authToken).toBeNull();
      expect(store.authType).toBeNull();
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('should not be authenticated initially', () => {
      const store = useAuthStore();

      expect(store.isAuthenticated).toBe(false);
      expect(store.isAdmin).toBe(false);
      expect(store.isUser).toBe(false);
      expect(store.userName).toBeUndefined();
    });
  });

  describe('loginAdmin', () => {
    it('should login admin successfully', async () => {
      const store = useAuthStore();

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { token: 'admin-token-123' },
      });

      const credentials: LoginCredentials = {
        username: 'admin',
        password: 'password123',
      };

      await store.loginAdmin(credentials);

      expect(store.isAuthenticated).toBe(true);
      expect(store.isAdmin).toBe(true);
      expect(store.isUser).toBe(false);
      expect(store.authToken).toBe('admin-token-123');
      expect(store.currentUser?.username).toBe('admin');
      expect(store.currentUser?.role).toBe('admin');
    });

    it('should call correct admin API endpoint', async () => {
      const store = useAuthStore();

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { token: 'admin-token-123' },
      });

      await store.loginAdmin({ username: 'admin', password: 'pass' });

      expect(axios.post).toHaveBeenCalledWith(ADMIN_API_URL + '/login', {
        username: 'admin',
        password: 'pass',
      });
    });

    it('should persist admin session to localStorage', async () => {
      const store = useAuthStore();

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { token: 'admin-token-123' },
      });

      await store.loginAdmin({ username: 'admin', password: 'pass' });

      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe('admin-token-123');
      expect(localStorage.getItem(AUTH_USERNAME_KEY)).toBe('admin');
      expect(localStorage.getItem(AUTH_TYPE_KEY)).toBe('admin');
    });

    it('should handle admin login failure', async () => {
      const store = useAuthStore();

      vi.mocked(axios.post).mockRejectedValueOnce({
        response: { data: { error: 'Invalid credentials' } },
      });

      await expect(
        store.loginAdmin({ username: 'admin', password: 'wrong' })
      ).rejects.toMatchObject({
        message: 'Invalid credentials',
        code: 'LOGIN_FAILED',
      } as AuthError);

      expect(store.isAuthenticated).toBe(false);
      expect(store.error).toBe('Invalid credentials');
    });

    it('should handle network error during admin login', async () => {
      const store = useAuthStore();

      vi.mocked(axios.post).mockRejectedValueOnce({
        message: 'Network Error',
      });

      await expect(store.loginAdmin({ username: 'admin', password: 'pass' })).rejects.toMatchObject(
        {
          message: 'Network Error',
        }
      );

      expect(store.error).toBe('Network Error');
    });

    it('should set loading state during login', async () => {
      const store = useAuthStore();

      let resolveLogin: (value: unknown) => void;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });

      vi.mocked(axios.post).mockReturnValueOnce(loginPromise as ReturnType<typeof axios.post>);

      const loginAction = store.loginAdmin({ username: 'admin', password: 'pass' });

      // Loading should be true during login
      expect(store.loading).toBe(true);

      resolveLogin!({ data: { token: 'token' } });
      await loginAction;

      // Loading should be false after login
      expect(store.loading).toBe(false);
    });
  });

  describe('loginUser', () => {
    it('should login user successfully', async () => {
      const store = useAuthStore();

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { token: 'user-token-456', email: 'user@example.com' },
      });

      await store.loginUser({ username: 'user@example.com', password: 'userpass' });

      expect(store.isAuthenticated).toBe(true);
      expect(store.isUser).toBe(true);
      expect(store.isAdmin).toBe(false);
      expect(store.authToken).toBe('user-token-456');
      expect(store.currentUser?.username).toBe('user@example.com');
      expect(store.currentUser?.role).toBe('user');
    });

    it('should call correct user API endpoint', async () => {
      const store = useAuthStore();

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { token: 'user-token', email: 'test@test.com' },
      });

      await store.loginUser({ username: 'test@test.com', password: 'pass' });

      expect(axios.post).toHaveBeenCalledWith(USER_API_URL + '/api/user/login', {
        email: 'test@test.com',
        password: 'pass',
      });
    });

    it('should persist user session to localStorage', async () => {
      const store = useAuthStore();

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { token: 'user-token-456', email: 'user@example.com' },
      });

      await store.loginUser({ username: 'user@example.com', password: 'pass' });

      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe('user-token-456');
      expect(localStorage.getItem(AUTH_USERNAME_KEY)).toBe('user@example.com');
      expect(localStorage.getItem(AUTH_TYPE_KEY)).toBe('user');
    });

    it('should handle user login failure', async () => {
      const store = useAuthStore();

      vi.mocked(axios.post).mockRejectedValueOnce({
        response: { data: { error: 'Invalid email or password' } },
      });

      await expect(
        store.loginUser({ username: 'user@test.com', password: 'wrong' })
      ).rejects.toMatchObject({
        message: 'Invalid email or password',
      });

      expect(store.isAuthenticated).toBe(false);
      expect(store.error).toBe('Invalid email or password');
    });
  });

  describe('logout', () => {
    it('should clear user session', async () => {
      const store = useAuthStore();

      // First login
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { token: 'admin-token' },
      });
      await store.loginAdmin({ username: 'admin', password: 'pass' });

      expect(store.isAuthenticated).toBe(true);

      // Then logout
      store.logout();

      expect(store.currentUser).toBeNull();
      expect(store.authToken).toBeNull();
      expect(store.authType).toBeNull();
      expect(store.isAuthenticated).toBe(false);
      expect(store.isAdmin).toBe(false);
    });

    it('should clear localStorage on logout', async () => {
      const store = useAuthStore();

      // First login
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { token: 'admin-token' },
      });
      await store.loginAdmin({ username: 'admin', password: 'pass' });

      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe('admin-token');

      // Then logout
      store.logout();

      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
      expect(localStorage.getItem(AUTH_USERNAME_KEY)).toBeNull();
      expect(localStorage.getItem(AUTH_TYPE_KEY)).toBeNull();
    });

    it('should clear error on logout', async () => {
      const store = useAuthStore();

      // Cause an error
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: { data: { error: 'Login failed' } },
      });

      try {
        await store.loginAdmin({ username: 'admin', password: 'wrong' });
      } catch {
        // Expected to throw
      }

      expect(store.error).toBe('Login failed');

      store.logout();

      expect(store.error).toBeNull();
    });
  });

  describe('checkAuth', () => {
    it('should restore admin session from localStorage', async () => {
      const store = useAuthStore();

      // Set up localStorage as if previously logged in
      localStorage.setItem(AUTH_TOKEN_KEY, 'saved-admin-token');
      localStorage.setItem(AUTH_USERNAME_KEY, 'savedadmin');
      localStorage.setItem(AUTH_TYPE_KEY, 'admin');

      await store.checkAuth();

      expect(store.isAuthenticated).toBe(true);
      expect(store.isAdmin).toBe(true);
      expect(store.authToken).toBe('saved-admin-token');
      expect(store.currentUser?.username).toBe('savedadmin');
      expect(store.currentUser?.role).toBe('admin');
    });

    it('should restore user session from localStorage', async () => {
      const store = useAuthStore();

      localStorage.setItem(AUTH_TOKEN_KEY, 'saved-user-token');
      localStorage.setItem(AUTH_USERNAME_KEY, 'user@saved.com');
      localStorage.setItem(AUTH_TYPE_KEY, 'user');

      await store.checkAuth();

      expect(store.isAuthenticated).toBe(true);
      expect(store.isUser).toBe(true);
      expect(store.authToken).toBe('saved-user-token');
      expect(store.currentUser?.username).toBe('user@saved.com');
      expect(store.currentUser?.role).toBe('user');
    });

    it('should not restore if token is missing', async () => {
      const store = useAuthStore();

      localStorage.setItem(AUTH_USERNAME_KEY, 'savedadmin');
      localStorage.setItem(AUTH_TYPE_KEY, 'admin');
      // Missing token

      await store.checkAuth();

      expect(store.isAuthenticated).toBe(false);
    });

    it('should not restore if username is missing', async () => {
      const store = useAuthStore();

      localStorage.setItem(AUTH_TOKEN_KEY, 'saved-token');
      localStorage.setItem(AUTH_TYPE_KEY, 'admin');
      // Missing username

      await store.checkAuth();

      expect(store.isAuthenticated).toBe(false);
    });

    it('should not restore if auth type is missing', async () => {
      const store = useAuthStore();

      localStorage.setItem(AUTH_TOKEN_KEY, 'saved-token');
      localStorage.setItem(AUTH_USERNAME_KEY, 'savedadmin');
      // Missing auth type

      await store.checkAuth();

      expect(store.isAuthenticated).toBe(false);
    });

    it('should skip if already authenticated', async () => {
      const store = useAuthStore();

      // Login first
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { token: 'fresh-token' },
      });
      await store.loginAdmin({ username: 'admin', password: 'pass' });

      // Set different values in localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, 'old-token');
      localStorage.setItem(AUTH_USERNAME_KEY, 'oldadmin');
      localStorage.setItem(AUTH_TYPE_KEY, 'admin');

      // checkAuth should skip since already authenticated
      await store.checkAuth();

      // Should still have the fresh token, not the old one
      expect(store.authToken).toBe('fresh-token');
      expect(store.currentUser?.username).toBe('admin');
    });
  });

  describe('computed properties', () => {
    it('userName should return current user username', async () => {
      const store = useAuthStore();

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: { token: 'token' },
      });
      await store.loginAdmin({ username: 'testadmin', password: 'pass' });

      expect(store.userName).toBe('testadmin');
    });

    it('userName should be undefined when not logged in', () => {
      const store = useAuthStore();

      expect(store.userName).toBeUndefined();
    });

    it('isAuthenticated requires both user and token', async () => {
      const store = useAuthStore();

      // Manually set partial state (shouldn't happen in practice)
      store.currentUser = { username: 'test', role: 'admin' };
      expect(store.isAuthenticated).toBe(false); // No token

      store.authToken = 'token';
      expect(store.isAuthenticated).toBe(true); // Now has both
    });
  });
});
