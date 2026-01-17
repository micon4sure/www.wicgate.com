import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { OnlineResponse, ServerEntry, OnlineProfile } from '../api-types';
import { API_POLLING_INTERVAL, API_RETRY_DELAYS, MAX_API_RETRIES } from '../constants';
import { getErrorMessage, apiErrorFromResponse } from '../types/errors';

const API = import.meta.env.VITE_API_BASE || 'https://www.wicgate.com/api';

/**
 * App Data Store - Real-time online player data only.
 *
 * This store handles real-time data that needs frequent updates:
 * - Online servers
 * - Online player profiles
 *
 * For cacheable data (leaderboards, ladder, clans), use the server-side
 * composables: useStatisticsData, useEventsData, useVideosData.
 */
export const useAppDataStore = defineStore('appData', () => {
  // Real-time data: servers and online profiles
  const servers = ref<ServerEntry[]>([]);
  const profiles = ref<OnlineProfile[]>([]);

  // Loading and error state
  const loadingInternal = ref(false);
  const isInitialLoad = ref(true);
  const loading = computed(() => loadingInternal.value && isInitialLoad.value);
  const error = ref<string | null>(null);
  const lastFetchedAt = ref<number | null>(null);

  // Computed: player count and online status
  const playerCount = computed(() => profiles.value.length);
  const playersOnline = computed(() => playerCount.value > 0);
  const isOnline = ref(true);

  // Polling management
  let intervalId: number | undefined;
  const isInitialized = ref(false);
  let visibilityChangeHandler: (() => void) | undefined;
  let onlineHandler: (() => void) | undefined;
  let recoveryTimeoutId: number | undefined;
  let currentAbortController: AbortController | undefined;

  /**
   * Fetches real-time online data with retry logic and exponential backoff
   */
  async function fetchDataWithRetry(retryCount = 0, signal?: AbortSignal): Promise<void> {
    try {
      const fetchOptions: RequestInit = { cache: 'no-store' };
      if (signal) {
        fetchOptions.signal = signal;
      }
      const r = await fetch(`${API}/online`, fetchOptions);
      if (!r.ok) {
        throw await apiErrorFromResponse(r, '/api/online');
      }
      const json: OnlineResponse = await r.json();

      // Update real-time data
      servers.value = json.servers;
      profiles.value = json.profiles;

      lastFetchedAt.value = Date.now();
      error.value = null;
      isOnline.value = true;

      if (recoveryTimeoutId) {
        clearTimeout(recoveryTimeoutId);
        recoveryTimeoutId = undefined;
      }

      // Mark initial load as complete after first successful fetch
      if (isInitialLoad.value) {
        isInitialLoad.value = false;
      }

      // Resume polling if it was stopped due to being offline
      if (!intervalId && isInitialized.value && typeof window !== 'undefined') {
        intervalId = window.setInterval(fetchData, API_POLLING_INTERVAL);
      }
    } catch (e: unknown) {
      // If request was aborted, don't retry
      if (e instanceof DOMException && e.name === 'AbortError') {
        return;
      }

      // If we haven't exhausted retries, try again
      if (retryCount < MAX_API_RETRIES) {
        const delay = API_RETRY_DELAYS[retryCount] || 4000;
        if (import.meta.env.DEV) {
          console.log(`[API] Retry ${retryCount + 1}/${MAX_API_RETRIES} after ${delay}ms`);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchDataWithRetry(retryCount + 1, signal);
      }

      // All retries exhausted - stop polling until manually recovered
      error.value = getErrorMessage(e);
      isOnline.value = false;

      // Stop polling when offline to prevent unnecessary requests
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
      if (typeof window !== 'undefined') {
        if (recoveryTimeoutId) {
          clearTimeout(recoveryTimeoutId);
        }
        recoveryTimeoutId = window.setTimeout(() => {
          recoveryTimeoutId = undefined;
          if (isInitialized.value) {
            fetchData();
          }
        }, API_POLLING_INTERVAL);
      }
    }
  }

  async function fetchData() {
    // Never fetch during SSG build
    if (import.meta.server) return;

    // Prevent overlapping calls
    if (loadingInternal.value) return;

    // Cancel any previous in-flight request
    if (currentAbortController) {
      currentAbortController.abort();
    }
    currentAbortController = new AbortController();

    loadingInternal.value = true;
    await fetchDataWithRetry(0, currentAbortController.signal);
    loadingInternal.value = false;
  }

  function init() {
    // Never initialize during SSG build
    if (import.meta.server) return;
    if (isInitialized.value) return;

    isInitialized.value = true;
    fetchData();

    // Only set interval if window is available (browser context)
    if (typeof window !== 'undefined') {
      intervalId = window.setInterval(fetchData, API_POLLING_INTERVAL);

      // Pause polling when tab is hidden
      visibilityChangeHandler = () => {
        if (document.hidden) {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = undefined;
          }
        } else {
          // Resume polling when tab becomes visible, but only if we're online
          if (!intervalId && isInitialized.value && isOnline.value) {
            fetchData(); // Fetch immediately
            intervalId = window.setInterval(fetchData, API_POLLING_INTERVAL);
          }
        }
      };
      document.addEventListener('visibilitychange', visibilityChangeHandler);

      onlineHandler = () => {
        if (recoveryTimeoutId) {
          clearTimeout(recoveryTimeoutId);
          recoveryTimeoutId = undefined;
        }
        if (isInitialized.value) {
          fetchData();
          if (!intervalId) {
            intervalId = window.setInterval(fetchData, API_POLLING_INTERVAL);
          }
        }
      };
      window.addEventListener('online', onlineHandler);
    }
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
    if (visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', visibilityChangeHandler);
      visibilityChangeHandler = undefined;
    }
    if (typeof window !== 'undefined' && onlineHandler) {
      window.removeEventListener('online', onlineHandler);
      onlineHandler = undefined;
    }
    if (recoveryTimeoutId) {
      clearTimeout(recoveryTimeoutId);
      recoveryTimeoutId = undefined;
    }
    if (currentAbortController) {
      currentAbortController.abort();
      currentAbortController = undefined;
    }
    isInitialized.value = false;
  }

  return {
    // Real-time data
    servers,
    profiles,
    // Loading/error state
    loading,
    error,
    // Computed
    playerCount,
    playersOnline,
    lastFetchedAt,
    isOnline,
    // Actions
    fetchData,
    init,
    stop,
    isInitialized,
  };
});
