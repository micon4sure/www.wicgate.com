import { ref, onMounted, onUnmounted, watch } from 'vue';
import { formatDate, getCountdown as getCountdownUtil } from '../utils';
import { EVENT_COUNTDOWN_INTERVAL } from '../constants';
import type { CommunityEvent } from '../api-types';

const API = import.meta.env.VITE_API_BASE || 'https://www.wicgate.com/api';

export function useEvents() {
  const events = ref<CommunityEvent[]>([]);
  const now = ref(new Date());
  const isLoading = ref(true);
  let timer: number | undefined;

  onMounted(async () => {
    // Skip data fetching during SSG build
    if (import.meta.env.SSR) {
      isLoading.value = false;
      return;
    }

    try {
      const url = API + (import.meta.env.MODE === 'production' ? '/events' : '/events-test');
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: CommunityEvent[] = await response.json();

      // Sort by date ascending (native sort instead of lodash orderBy)
      events.value = data.sort((a, b) => {
        const dateA = new Date(a.start).getTime();
        const dateB = new Date(b.start).getTime();
        return dateA - dateB;
      });

      isLoading.value = false;
      if (import.meta.env.DEV) console.log(`Fetched ${events.value.length} events from ${url}`);
    } catch (err: unknown) {
      if (import.meta.env.DEV) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('Failed to fetch events:', message, err);
      }
      isLoading.value = false;
    }

    // Only start countdown timer if events exist
    if (typeof window !== 'undefined' && events.value.length > 0) {
      timer = window.setInterval(() => {
        now.value = new Date();
      }, EVENT_COUNTDOWN_INTERVAL);
    }
  });

  // Watch events and start/stop timer accordingly (optimization: no timer when no events)
  watch(events, (newEvents) => {
    if (typeof window === 'undefined') return;

    if (newEvents.length > 0 && timer === undefined) {
      timer = window.setInterval(() => {
        now.value = new Date();
      }, EVENT_COUNTDOWN_INTERVAL);
    } else if (newEvents.length === 0 && timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  });

  onUnmounted(() => {
    if (timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  });

  // Wrapper for getCountdown that uses the reactive 'now' ref
  function getCountdown(raw: string): string {
    return getCountdownUtil(raw, now.value);
  }

  return {
    events,
    formatDate,
    getCountdown,
    isLoading,
  };
}
