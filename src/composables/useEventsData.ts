import { computed } from 'vue';
import { useFetch, useRuntimeConfig } from '#imports';
import type { CommunityEvent } from '../api-types';

/**
 * Server-side data fetching composable for community events.
 * Uses Nuxt's useFetch with ISR caching - data is fetched on the server
 * and cached for subsequent requests.
 *
 * IMPORTANT: This is NOT an async function - it returns useFetch directly
 * to preserve Nuxt's composable context. The calling page should NOT await this.
 */
export function useEventsData() {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  // Use /events-test in development for easier testing
  const endpoint = import.meta.env.MODE === 'production' ? '/events' : '/events-test';

  const { data, pending, error } = useFetch<CommunityEvent[]>(endpoint, {
    baseURL: apiBase,
    key: 'events-data',
    // Transform: sort events by date ascending
    transform: (events) => {
      if (!events) return [];
      return [...events].sort((a, b) => {
        const dateA = new Date(a.start).getTime();
        const dateB = new Date(b.start).getTime();
        return dateA - dateB;
      });
    },
    // Use cached data if available (prevents duplicate fetches after hydration)
    // Note: Use optional chaining as nuxtApp.static may be undefined
    getCachedData: (key, nuxtApp) => nuxtApp.payload?.data?.[key] || nuxtApp.static?.data?.[key],
  });

  // Events data with safe default
  const events = computed<CommunityEvent[]>(() => data.value ?? []);

  return {
    events,
    loading: pending,
    error,
  };
}
