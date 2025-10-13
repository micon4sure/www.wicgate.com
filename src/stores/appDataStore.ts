import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { DataResponse } from '../api-types';
import { AnalyticsEvents } from '../utils/analytics';
import { API_POLLING_INTERVAL, API_RETRY_DELAYS, MAX_API_RETRIES } from '../constants';
import { isApiError, getErrorMessage, apiErrorFromResponse } from '../types/errors';

const API = import.meta.env.VITE_API_BASE || 'https://www.wicgate.com/api';

export const useAppDataStore = defineStore('appData', () => {
  const data = ref<Partial<DataResponse>>({});
  const loadingInternal = ref(false);
  const isInitialLoad = ref(true);
  const loading = computed(() => loadingInternal.value && isInitialLoad.value);
  const error = ref<string | null>(null);
  const lastFetchedAt = ref<number | null>(null);
  const playerCount = computed(() => data.value.profiles?.length || 0);
  const playersOnline = computed(() => playerCount.value > 0);
  const isOnline = ref(true);

  let intervalId: number | undefined;
  const isInitialized = ref(false);
  let visibilityChangeHandler: (() => void) | undefined;

  /**
   * Fetches data with retry logic and exponential backoff
   */
  async function fetchDataWithRetry(retryCount = 0): Promise<void> {
    try {
      const r = await fetch(`${API}/data`, { cache: 'no-store' });
      if (!r.ok) {
        // Create typed API error with response context
        throw await apiErrorFromResponse(r, '/api/data');
      }
      const json: DataResponse = await r.json();
      data.value = json;
      lastFetchedAt.value = Date.now();
      error.value = null; // Clear any previous errors
      isOnline.value = true;

      // Mark initial load as complete after first successful fetch
      if (isInitialLoad.value) {
        isInitialLoad.value = false;
      }

      // Resume polling if it was stopped due to being offline
      if (!intervalId && isInitialized.value && typeof window !== 'undefined') {
        intervalId = window.setInterval(fetchData, API_POLLING_INTERVAL);
      }
    } catch (e: unknown) {
      // If we haven't exhausted retries, try again
      if (retryCount < MAX_API_RETRIES) {
        const delay = API_RETRY_DELAYS[retryCount] || 4000;
        if (import.meta.env.DEV) {
          console.log(`[API] Retry ${retryCount + 1}/${MAX_API_RETRIES} after ${delay}ms`);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchDataWithRetry(retryCount + 1);
      }

      // All retries exhausted - stop polling until manually recovered
      // Use typed error handling to extract user-friendly message
      error.value = getErrorMessage(e);
      isOnline.value = false;

      // Log error with context for analytics
      if (isApiError(e)) {
        AnalyticsEvents.apiError(`/api/data (${e.statusCode || 'unknown'})`);
      } else {
        AnalyticsEvents.apiError('/api/data');
      }

      // Stop polling when offline to prevent unnecessary requests
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
    }
  }

  async function fetchData() {
    // Never fetch during SSG build
    if (import.meta.env.SSR) return;

    // Prevent overlapping calls
    if (loadingInternal.value) return;

    loadingInternal.value = true;
    await fetchDataWithRetry();
    loadingInternal.value = false;
  }

  function init() {
    // Never initialize during SSG build
    if (import.meta.env.SSR) return;
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
    isInitialized.value = false;
  }

  return {
    data,
    loading,
    error,
    playerCount,
    playersOnline,
    lastFetchedAt,
    isOnline,
    fetchData,
    init,
    stop,
    isInitialized,
  };
});
