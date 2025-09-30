import { ref, computed } from 'vue';
import type { DataResponse } from '../api-types';
import { AnalyticsEvents } from '../utils/analytics';

const API = import.meta.env.VITE_API_BASE || 'https://www.wicgate.com/api';

const data = ref<Partial<DataResponse>>({});
const loading = ref(false);
const error = ref<string | null>(null);
const lastFetchedAt = ref<number | null>(null);
const playerCount = computed(() => data.value.profiles?.length || 0);
const playersOnline = computed(() => playerCount.value > 0);
const isOnline = ref(true);

let intervalId: number | undefined;
const isInitialized = ref(false);

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff: 1s, 2s, 4s

/**
 * Fetches data with retry logic and exponential backoff
 */
async function fetchDataWithRetry(retryCount = 0): Promise<void> {
  try {
    const r = await fetch(`${API}/data`, { cache: 'no-store' });
    if (!r.ok) throw new Error(r.statusText);
    const json: DataResponse = await r.json();
    data.value = json;
    lastFetchedAt.value = Date.now();
    error.value = null; // Clear any previous errors
    isOnline.value = true;
  } catch (e: any) {
    // If we haven't exhausted retries, try again
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAYS[retryCount] || 4000;
      if (import.meta.env.DEV) {
        console.log(`[API] Retry ${retryCount + 1}/${MAX_RETRIES} after ${delay}ms`);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchDataWithRetry(retryCount + 1);
    }

    // All retries exhausted
    error.value = e?.message || 'Failed to load';
    isOnline.value = false;
    AnalyticsEvents.apiError('/api/data');
  }
}

async function fetchData() {
  // Never fetch during SSG build
  if (import.meta.env.SSR) return;

  // Prevent overlapping calls
  if (loading.value) return;

  loading.value = true;
  await fetchDataWithRetry();
  loading.value = false;
}

function init() {
  // Never initialize during SSG build
  if (import.meta.env.SSR) return;
  if (isInitialized.value) return;

  isInitialized.value = true;
  fetchData();

  // Only set interval if window is available (browser context)
  // Increased to 90 seconds for better server performance
  if (typeof window !== 'undefined') {
    intervalId = window.setInterval(fetchData, 90000);

    // Pause polling when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = undefined;
        }
      } else {
        // Resume polling when tab becomes visible
        if (!intervalId && isInitialized.value) {
          fetchData(); // Fetch immediately
          intervalId = window.setInterval(fetchData, 90000);
        }
      }
    });
  }
}

function stop() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = undefined;
  }
  isInitialized.value = false;
}

export function useAppDataStore() {
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
}
