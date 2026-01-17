import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAppDataStore } from '../appDataStore';
import type { OnlineResponse } from '../../api-types';

// Mock data for /api/online endpoint
const mockOnlineResponse: OnlineResponse = {
  servers: [{ serverId: 1, serverName: 'EU Server #1' }],
  profiles: [
    { profileId: 1, serverId: 1, profileName: 'Player1', shortName: null, tagFormat: null },
  ],
};

// Helper to mock successful responses
function mockSuccessfulFetch() {
  vi.mocked(global.fetch).mockImplementation(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockOnlineResponse),
    } as Response);
  });
}

describe('appDataStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    const store = useAppDataStore();
    store.stop();
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should have empty data on initialization', () => {
      const store = useAppDataStore();

      expect(store.servers).toEqual([]);
      expect(store.profiles).toEqual([]);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
      expect(store.isOnline).toBe(true);
      expect(store.playerCount).toBe(0);
      expect(store.playersOnline).toBe(false);
    });

    it('should not be initialized before init() is called', () => {
      const store = useAppDataStore();

      expect(store.isInitialized).toBe(false);
    });
  });

  describe('fetchData', () => {
    it('should fetch data successfully', async () => {
      const store = useAppDataStore();
      mockSuccessfulFetch();

      await store.fetchData();

      expect(store.servers).toEqual(mockOnlineResponse.servers);
      expect(store.profiles).toEqual(mockOnlineResponse.profiles);
      expect(store.error).toBeNull();
      expect(store.isOnline).toBe(true);
    });

    it('should update playerCount when data is fetched', async () => {
      const store = useAppDataStore();
      mockSuccessfulFetch();

      await store.fetchData();

      expect(store.playerCount).toBe(1);
      expect(store.playersOnline).toBe(true);
    });

    it('should show loading only during initial load', async () => {
      const store = useAppDataStore();
      mockSuccessfulFetch();

      // Before first fetch, loading should be false (nothing happening)
      expect(store.loading).toBe(false);

      // First fetch - this is initial load
      await store.fetchData();

      // After successful fetch, loading should be false
      expect(store.loading).toBe(false);
    });

    it('should call only the /online endpoint', async () => {
      const store = useAppDataStore();
      mockSuccessfulFetch();

      await store.fetchData();

      // Should have called fetch once for /online
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Check the URL
      const calls = vi.mocked(global.fetch).mock.calls;
      expect(calls[0]?.[0]).toContain('/online');
    });

    it('should prevent overlapping fetch calls', async () => {
      const store = useAppDataStore();

      let resolveFirst: () => void;
      const firstFetchPromise = new Promise<void>((resolve) => {
        resolveFirst = resolve;
      });

      vi.mocked(global.fetch).mockImplementation(async () => {
        await firstFetchPromise;
        return {
          ok: true,
          json: () => Promise.resolve(mockOnlineResponse),
        } as Response;
      });

      // Start first fetch
      const promise1 = store.fetchData();

      // Try to start second fetch while first is in progress
      const promise2 = store.fetchData();

      // Second fetch should return immediately (no-op)
      await promise2;

      // Complete first fetch
      resolveFirst!();
      await promise1;

      // Only one fetch should have been made
      // (second fetchData call was a no-op due to loading guard)
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('init', () => {
    it('should mark store as initialized', async () => {
      const store = useAppDataStore();
      mockSuccessfulFetch();

      store.init();

      expect(store.isInitialized).toBe(true);
    });

    it('should only initialize once', async () => {
      const store = useAppDataStore();
      mockSuccessfulFetch();

      store.init();

      // Wait for the initial fetchData to complete
      await vi.advanceTimersByTimeAsync(0);

      const callsAfterFirstInit = vi.mocked(global.fetch).mock.calls.length;

      // Call init again - should be a no-op
      store.init();
      store.init();

      await vi.advanceTimersByTimeAsync(0);

      // No additional calls should have been made
      expect(vi.mocked(global.fetch).mock.calls.length).toBe(callsAfterFirstInit);
    });

    it('should set up polling interval', async () => {
      const store = useAppDataStore();
      mockSuccessfulFetch();

      store.init();

      // Wait for initial fetch to complete
      await vi.advanceTimersByTimeAsync(0);

      const callsAfterInit = vi.mocked(global.fetch).mock.calls.length;

      // Advance time by polling interval (90 seconds)
      await vi.advanceTimersByTimeAsync(90000);

      // Should have fetched again (1 more call for /online)
      expect(vi.mocked(global.fetch).mock.calls.length).toBe(callsAfterInit + 1);
    });
  });

  describe('stop', () => {
    it('should stop polling and clean up', async () => {
      const store = useAppDataStore();
      mockSuccessfulFetch();

      store.init();
      expect(store.isInitialized).toBe(true);

      // Wait for initial fetch
      await vi.advanceTimersByTimeAsync(0);

      store.stop();
      expect(store.isInitialized).toBe(false);

      // Record current call count
      const callsBefore = vi.mocked(global.fetch).mock.calls.length;

      // Advance time past polling interval
      await vi.advanceTimersByTimeAsync(90000);

      // No more fetches should have occurred
      expect(vi.mocked(global.fetch).mock.calls.length).toBe(callsBefore);
    });
  });

  describe('visibility change handling', () => {
    it('should pause polling when tab is hidden', async () => {
      const store = useAppDataStore();
      mockSuccessfulFetch();

      store.init();
      await vi.advanceTimersByTimeAsync(0);

      // Record call count after init
      const callsBefore = vi.mocked(global.fetch).mock.calls.length;

      // Simulate tab becoming hidden
      Object.defineProperty(document, 'hidden', { value: true, writable: true });
      document.dispatchEvent(new Event('visibilitychange'));

      // Advance past polling interval
      await vi.advanceTimersByTimeAsync(90000);

      // No new fetches should have occurred
      expect(vi.mocked(global.fetch).mock.calls.length).toBe(callsBefore);

      // Cleanup
      Object.defineProperty(document, 'hidden', { value: false, writable: true });
    });

    it('should resume polling when tab becomes visible', async () => {
      const store = useAppDataStore();
      mockSuccessfulFetch();

      store.init();
      await vi.advanceTimersByTimeAsync(0);

      // Hide tab
      Object.defineProperty(document, 'hidden', { value: true, writable: true });
      document.dispatchEvent(new Event('visibilitychange'));

      const callsBefore = vi.mocked(global.fetch).mock.calls.length;

      // Show tab again
      Object.defineProperty(document, 'hidden', { value: false, writable: true });
      document.dispatchEvent(new Event('visibilitychange'));

      // Should trigger immediate fetch when becoming visible
      await vi.advanceTimersByTimeAsync(0);

      // Should have fetched again
      expect(vi.mocked(global.fetch).mock.calls.length).toBeGreaterThan(callsBefore);
    });
  });

  describe('online/offline handling', () => {
    it('should recover when coming back online', async () => {
      const store = useAppDataStore();
      mockSuccessfulFetch();

      store.init();
      await vi.advanceTimersByTimeAsync(0);

      const callsBefore = vi.mocked(global.fetch).mock.calls.length;

      // Simulate coming back online
      window.dispatchEvent(new Event('online'));

      await vi.advanceTimersByTimeAsync(0);

      // Should trigger a fetch
      expect(vi.mocked(global.fetch).mock.calls.length).toBeGreaterThan(callsBefore);
    });
  });

  describe('error handling', () => {
    it('should set error and isOnline=false on persistent failure', async () => {
      const store = useAppDataStore();

      // Mock all fetches to fail (including retries)
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

      // Start fetch
      const fetchPromise = store.fetchData();

      // Advance past all retry delays (1s + 2s + 4s = 7s)
      await vi.advanceTimersByTimeAsync(7000);
      await fetchPromise;

      expect(store.error).toBe('Network error');
      expect(store.isOnline).toBe(false);
    });

    it('should handle non-ok HTTP response', async () => {
      const store = useAppDataStore();

      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ error: 'Server error' }),
      } as Response);

      const fetchPromise = store.fetchData();

      // Advance past all retry delays
      await vi.advanceTimersByTimeAsync(7000);
      await fetchPromise;

      expect(store.error).toBeTruthy();
      expect(store.isOnline).toBe(false);
    });

    it('should clear error on successful fetch after failure', async () => {
      const store = useAppDataStore();

      // First, cause an error
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));
      const failPromise = store.fetchData();
      await vi.advanceTimersByTimeAsync(7000);
      await failPromise;

      expect(store.error).toBeTruthy();

      // Then succeed
      mockSuccessfulFetch();
      await store.fetchData();

      expect(store.error).toBeNull();
      expect(store.isOnline).toBe(true);
    });
  });

  describe('lastFetchedAt', () => {
    it('should update lastFetchedAt on successful fetch', async () => {
      const store = useAppDataStore();
      mockSuccessfulFetch();

      expect(store.lastFetchedAt).toBeNull();

      vi.setSystemTime(new Date('2025-01-01T12:00:00Z'));
      await store.fetchData();

      expect(store.lastFetchedAt).toBe(new Date('2025-01-01T12:00:00Z').getTime());
    });
  });
});
