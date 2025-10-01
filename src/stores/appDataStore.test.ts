/**
 * Tests for appDataStore
 * Validates API data fetching, SSR guards, and polling behavior
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
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
    // Reset mocks
    vi.clearAllMocks();
    mockFetch.mockReset();

    // Ensure SSR is false by default (client-side mode)
    vi.stubEnv('SSR', false);

    // Get fresh store instance
    store = useAppDataStore();

    // Reset store state
    store.data.value = {};
    store.loading.value = false;
    store.error.value = null;
    store.lastFetchedAt.value = null;
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
      expect(store.loading.value).toBe(false);
    });

    it('should not initialize during SSR', () => {
      vi.stubEnv('SSR', true);

      store.init();

      expect(mockFetch).not.toHaveBeenCalled();
      expect(store.isInitialized.value).toBe(false);
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
      expect(store.data.value).toEqual(mockApiResponse);
      expect(store.loading.value).toBe(false);
      expect(store.error.value).toBeNull();
      expect(store.lastFetchedAt.value).toBeGreaterThan(0);
    });

    it('should handle fetch errors after retries', async () => {
      // Mock failure for all retry attempts (4 total: initial + 3 retries)
      mockFetch
        .mockResolvedValueOnce({ ok: false, statusText: 'Internal Server Error' })
        .mockResolvedValueOnce({ ok: false, statusText: 'Internal Server Error' })
        .mockResolvedValueOnce({ ok: false, statusText: 'Internal Server Error' })
        .mockResolvedValueOnce({ ok: false, statusText: 'Internal Server Error' });

      await store.fetchData();

      expect(store.error.value).toBe('Internal Server Error');
      expect(store.loading.value).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(4); // Initial + 3 retries
    });

    it('should handle network errors after retries', async () => {
      // Mock failure for all retry attempts
      mockFetch
        .mockRejectedValueOnce(new Error('Network failure'))
        .mockRejectedValueOnce(new Error('Network failure'))
        .mockRejectedValueOnce(new Error('Network failure'))
        .mockRejectedValueOnce(new Error('Network failure'));

      await store.fetchData();

      expect(store.error.value).toBe('Network failure');
      expect(store.loading.value).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(4); // Initial + 3 retries
    });

    it('should not fetch if already loading', async () => {
      store.loading.value = true;

      await store.fetchData();

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should clear error on successful fetch', async () => {
      store.error.value = 'Previous error';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      await store.fetchData();

      expect(store.error.value).toBeNull();
    });
  });

  describe('computed properties', () => {
    it('should calculate playerCount from profiles', () => {
      store.data.value = mockApiResponse;

      expect(store.playerCount.value).toBe(2);
    });

    it('should return 0 when no profiles', () => {
      store.data.value = {};

      expect(store.playerCount.value).toBe(0);
    });

    it('should correctly determine playersOnline', () => {
      store.data.value = mockApiResponse;
      expect(store.playersOnline.value).toBe(true);

      store.data.value = { profiles: [] };
      expect(store.playersOnline.value).toBe(false);
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

      expect(store.isInitialized.value).toBe(true);
    });

    it('should not initialize twice', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      });

      store.init();
      await vi.waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

      store.init();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should still only be called once
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should stop polling on stop()', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      });

      store.init();
      await vi.waitFor(() => expect(store.isInitialized.value).toBe(true));

      store.stop();

      expect(store.isInitialized.value).toBe(false);
    });

    it('should call fetchData on init', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      });

      store.init();

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockFetch).toHaveBeenCalled();
      expect(store.isInitialized.value).toBe(true);
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
