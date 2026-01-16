import { ref, computed, onMounted } from 'vue';
import type { TwitchStream, TwitchStreamsResponse } from '../api-types';

const API = import.meta.env.VITE_API_BASE || 'https://www.wicgate.com/api';

// Default channels to check (can be overridden)
const DEFAULT_CHANNELS = ['kickapoo149', 'pontertwitch'];

// Shared state across all component instances
const streams = ref<Map<string, TwitchStream>>(new Map());
const isLoading = ref(true);
const error = ref<string | null>(null);
let hasFetched = false;

/**
 * Replace {width} and {height} placeholders in Twitch thumbnail URL
 */
export function getThumbnailUrl(url: string, width = 440, height = 248): string {
  return url.replace('{width}', String(width)).replace('{height}', String(height));
}

/**
 * Fetch stream status for given channels
 */
async function fetchStreams(channels: string[]): Promise<void> {
  if (import.meta.server || hasFetched) return;

  hasFetched = true;
  isLoading.value = true;
  error.value = null;

  try {
    const usersParam = channels.join(',');
    const response = await fetch(`${API}/twitch/streams?users=${usersParam}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: TwitchStreamsResponse = await response.json();

    // Build map of channel -> stream data (transform nested API response to flat structure)
    const streamMap = new Map<string, TwitchStream>();
    for (const user of data.data) {
      // Only add live streams (have is_live: true and stream data)
      if (user.is_live && user.stream) {
        streamMap.set(user.login.toLowerCase(), {
          user_login: user.login,
          user_name: user.display_name,
          game_name: user.stream.game_name,
          title: user.stream.title,
          viewer_count: user.stream.viewer_count,
          thumbnail_url: user.stream.thumbnail_url,
        });
      }
    }
    streams.value = streamMap;

    if (import.meta.env.DEV) {
      console.log(
        `Twitch: ${streamMap.size}/${data.data.length} live`,
        Array.from(streamMap.keys())
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    error.value = message;
    if (import.meta.env.DEV) {
      console.error('Failed to fetch Twitch streams:', message);
    }
  } finally {
    isLoading.value = false;
  }
}

/**
 * Composable for Twitch stream status
 * @param channels - Array of Twitch channel names to check (uses defaults if not provided)
 */
export function useTwitchStreams(channels?: string[]) {
  onMounted(() => {
    // Always fetch all default channels on first call
    fetchStreams(channels ?? DEFAULT_CHANNELS);
  });

  /**
   * Get stream data for a channel (null if offline)
   */
  function getStream(channel: string): TwitchStream | null {
    return streams.value.get(channel.toLowerCase()) ?? null;
  }

  /**
   * Check if a channel is live
   */
  function isLive(channel: string): boolean {
    return streams.value.has(channel.toLowerCase());
  }

  /**
   * Computed: number of live streams
   */
  const liveCount = computed(() => streams.value.size);

  return {
    streams,
    isLoading,
    error,
    getStream,
    isLive,
    liveCount,
    getThumbnailUrl,
  };
}
