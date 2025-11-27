/**
 * Tests for appDataStore
 * Validates API data fetching, SSR guards, and polling behavior
 *
 * Retry tests use hybrid timing strategy:
 * - Local dev: Fake timers for speed (~20ms per test)
 * - CI: Real timers for thorough validation (~7s per test)
 * Set TEST_REAL_TIMERS=true to force real timing behavior
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAppDataStore } from './appDataStore';
import type { DataResponse } from '../api-types';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

// Mock API response
const mockApiResponse: DataResponse = {
  profiles: [
    {
      profileId: 1,
      serverId: 1,
      profileName: 'TestPlayer1',
    },
    {
      profileId: 2,
      serverId: 1,
      profileName: 'TestPlayer2',
    },
  ],
  servers: [],
  ladder: [],
  lb_total: [],
  lb_totinf: [],
  lb_totarm: [],
  lb_totair: [],
  lb_totsup: [],
  lb_high: [],
  lb_highinf: [],
  lb_higharm: [],
  lb_highair: [],
  lb_highsup: [],
};

describe('appDataStore', () => {
  let store: ReturnType<typeof useAppDataStore>;

  beforeEach(() => {
    // Create fresh Pinia instance for each test
    setActivePinia(createPinia());

    // Reset mocks
    vi.clearAllMocks();
    mockFetch.mockReset();

    // Ensure SSR is false by default (client-side mode)
    vi.stubEnv('SSR', false);

    // Get fresh store instance
    store = useAppDataStore();

    // Reset store state (Pinia stores expose refs directly, not .value)
    store.data = {};
    // Note: loading is a computed ref (read-only), no need to reset
    store.error = null;
    store.lastFetchedAt = null;
    store.stop(); // Clear any existing intervals
  });

  afterEach(() => {
    store.stop();
  });

  describe('SSR guards', () => {
    it('should not fetch during SSR', async () => {
      // Mock SSR environment
      vi.stubEnv('SSR', true);

      await store.fetchData();

      expect(mockFetch).not.toHaveBeenCalled();
      expect(store.loading).toBe(false);
    });

    it('should not initialize during SSR', () => {
      vi.stubEnv('SSR', true);

      store.init();

      expect(mockFetch).not.toHaveBeenCalled();
      expect(store.isInitialized).toBe(false);
    });
  });

  describe('fetchData', () => {
    it('should fetch data successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      await store.fetchData();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/data'),
        expect.objectContaining({ cache: 'no-store' })
      );
      expect(store.data).toEqual(mockApiResponse);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
      expect(store.lastFetchedAt).toBeGreaterThan(0);
    });

    it('should handle fetch errors after retries', async () => {
      // Hybrid timing: fake timers in dev (fast), real timers in CI (thorough)
      const useRealTimers = process.env.TEST_REAL_TIMERS === 'true';

      if (!useRealTimers) {
        vi.useFakeTimers();
      }

      // Mock failure for all retry attempts (4 total: initial + 3 retries)
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          headers: { get: () => null },
          json: async () => ({}),
          text: async () => 'Internal Server Error',
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          headers: { get: () => null },
          json: async () => ({}),
          text: async () => 'Internal Server Error',
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          headers: { get: () => null },
          json: async () => ({}),
          text: async () => 'Internal Server Error',
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          headers: { get: () => null },
          json: async () => ({}),
          text: async () => 'Internal Server Error',
        });

      const fetchPromise = store.fetchData();

      // Fast-forward through retry delays (1s + 2s + 4s = 7s total)
      if (!useRealTimers) {
        await vi.advanceTimersByTimeAsync(7000);
      }

      await fetchPromise;

      // Error format changed with typed errors: "API Error (500): Internal Server Error"
      expect(store.error).toContain('Internal Server Error');
      expect(store.loading).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(5); // Initial + 3 retries + 1 clan fetch

      if (!useRealTimers) {
        vi.useRealTimers();
      }
    });

    it('should handle network errors after retries', async () => {
      // Hybrid timing: fake timers in dev (fast), real timers in CI (thorough)
      const useRealTimers = process.env.TEST_REAL_TIMERS === 'true';

      if (!useRealTimers) {
        vi.useFakeTimers();
      }

      // Mock failure for all retry attempts
      mockFetch
        .mockRejectedValueOnce(new Error('Network failure'))
        .mockRejectedValueOnce(new Error('Network failure'))
        .mockRejectedValueOnce(new Error('Network failure'))
        .mockRejectedValueOnce(new Error('Network failure'));

      const fetchPromise = store.fetchData();

      // Fast-forward through retry delays (1s + 2s + 4s = 7s total)
      if (!useRealTimers) {
        await vi.advanceTimersByTimeAsync(7000);
      }

      await fetchPromise;

      expect(store.error).toBe('Network failure');
      expect(store.loading).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(5); // Initial + 3 retries + 1 clan fetch

      if (!useRealTimers) {
        vi.useRealTimers();
      }
    });

    it('should not fetch if already loading', async () => {
      vi.useFakeTimers();

      // Mock a slow fetch to simulate an in-progress request
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                json: async () => mockApiResponse,
              });
            }, 100);
          })
      );
      // Mock for clan fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ clans: [] }),
      });

      // Start first fetch (won't complete for 100ms)
      const firstFetch = store.fetchData();

      // Try to start second fetch while first is still loading
      const secondFetch = store.fetchData();

      // Advance timers to complete the fetch
      await vi.advanceTimersByTimeAsync(200);

      // Wait for fetches to complete
      await firstFetch;
      await secondFetch;

      // Should have 2 calls: 1 data fetch + 1 clan fetch (second fetchData blocked by loading guard)
      expect(mockFetch).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });

    it('should clear error on successful fetch', async () => {
      store.error = 'Previous error';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      await store.fetchData();

      expect(store.error).toBeNull();
    });
  });

  describe('computed properties', () => {
    it('should calculate playerCount from profiles', () => {
      store.data = mockApiResponse;

      expect(store.playerCount).toBe(2);
    });

    it('should return 0 when no profiles', () => {
      store.data = {};

      expect(store.playerCount).toBe(0);
    });

    it('should correctly determine playersOnline', () => {
      store.data = mockApiResponse;
      expect(store.playersOnline).toBe(true);

      store.data = { profiles: [] };
      expect(store.playersOnline).toBe(false);
    });
  });

  describe('init and polling', () => {
    it('should initialize and fetch data', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      });

      store.init();

      // Wait for async fetch
      await vi.waitFor(() => expect(mockFetch).toHaveBeenCalled());

      expect(store.isInitialized).toBe(true);
    });

    it('should not initialize twice', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      });

      store.init();
      await vi.waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2)); // data + clans

      store.init();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should still only be 2 calls (data + clans from first init)
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should stop polling on stop()', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      });

      store.init();
      await vi.waitFor(() => expect(store.isInitialized).toBe(true));

      store.stop();

      expect(store.isInitialized).toBe(false);
    });

    it('should call fetchData on init', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      });

      store.init();

      // Wait for async operations
      await vi.waitFor(() => expect(mockFetch).toHaveBeenCalled());

      expect(mockFetch).toHaveBeenCalled();
      expect(store.isInitialized).toBe(true);
    });
  });

  describe('API endpoint configuration', () => {
    it('should use VITE_API_BASE from environment', async () => {
      const testApiBase = 'https://test.wicgate.com/api';
      vi.stubEnv('VITE_API_BASE', testApiBase);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      // Need to re-import to get new env value
      const { useAppDataStore: useTestStore } = await import('./appDataStore');
      const testStore = useTestStore();

      await testStore.fetchData();

      expect(mockFetch).toHaveBeenCalledWith(`${testApiBase}/data`, expect.any(Object));
    });
  });
});
