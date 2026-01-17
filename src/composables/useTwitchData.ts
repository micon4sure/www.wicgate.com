import { computed } from 'vue';
import { useFetch, useRuntimeConfig } from '#imports';
import type { TwitchStream, TwitchStreamsResponse } from '../api-types';

const DEFAULT_CHANNELS = ['kickapoo149', 'pontertwitch'];

/** Streams indexed by lowercase username */
export type TwitchStreamsMap = Record<string, TwitchStream>;

/**
 * Server-side data fetching composable for Twitch streams.
 * Uses Nuxt's useFetch with ISR caching - data is fetched on the server
 * and cached for subsequent requests.
 *
 * IMPORTANT: This is NOT an async function - it returns useFetch directly
 * to preserve Nuxt's composable context. The calling page should NOT await this.
 */
export function useTwitchData(channels: string[] = DEFAULT_CHANNELS) {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;
  const usersParam = channels.join(',');

  // Fetch raw Twitch API response
  const {
    data: rawData,
    pending,
    error,
  } = useFetch<TwitchStreamsResponse>(`/twitch/streams?users=${usersParam}`, {
    baseURL: apiBase,
    key: 'twitch-streams',
    // Use cached data if available (prevents duplicate fetches after hydration)
    getCachedData: (key, nuxtApp) => nuxtApp.payload?.data?.[key] || nuxtApp.static?.data?.[key],
  });

  // Transform: convert nested API response to flat streams map (computed for reactivity)
  const streams = computed<TwitchStreamsMap>(() => {
    const response = rawData.value;
    if (!response?.data) return {};

    const result: TwitchStreamsMap = {};
    for (const user of response.data) {
      if (user.is_live && user.stream) {
        result[user.login.toLowerCase()] = {
          user_login: user.login,
          user_name: user.display_name,
          game_name: user.stream.game_name,
          title: user.stream.title,
          viewer_count: user.stream.viewer_count,
          thumbnail_url: user.stream.thumbnail_url,
        };
      }
    }
    return result;
  });

  const liveCount = computed(() => Object.keys(streams.value).length);

  return {
    streams,
    loading: pending,
    error,
    liveCount,
  };
}
