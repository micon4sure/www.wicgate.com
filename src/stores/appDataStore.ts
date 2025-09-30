import { ref, computed } from 'vue';
import type { DataResponse } from '../api-types';

const API = import.meta.env.VITE_API_BASE || 'https://www.wicgate.com/api';

const data = ref<Partial<DataResponse>>({});
const loading = ref(false);
const error = ref<string | null>(null);
const lastFetchedAt = ref<number | null>(null);
const playerCount = computed(() => data.value.profiles?.length || 0);
const playersOnline = computed(() => playerCount.value > 0);

let intervalId: number | undefined;
const isInitialized = ref(false);

async function fetchData() {
  // Never fetch during SSG build
  if (import.meta.env.SSR) return;

  // allow overlapping calls to be coalesced by the browser; we just guard UI state
  if (loading.value) {
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const r = await fetch(`${API}/data`, { cache: 'no-store' });
    if (!r.ok) throw new Error(r.statusText);
    const json: DataResponse = await r.json();
    data.value = json;
    lastFetchedAt.value = Date.now();
  } catch (e: any) {
    error.value = e?.message || 'Failed to load';
  } finally {
    loading.value = false;
  }
}

function init() {
  // Never initialize during SSG build
  if (import.meta.env.SSR) return;
  if (isInitialized.value) return;

  isInitialized.value = true;
  fetchData();

  // Only set interval if window is available (browser context)
  if (typeof window !== 'undefined') {
    intervalId = window.setInterval(fetchData, 60000);
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
    fetchData,
    init,
    stop,
    isInitialized,
  };
}
