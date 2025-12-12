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
  if (import.meta.env.SSR || hasFetched) return;

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

    // Build map of channel -> stream data (only live streams are in the response)
    const streamMap = new Map<string, TwitchStream>();
    for (const stream of data.data) {
      streamMap.set(stream.user_login.toLowerCase(), stream);
    }
    streams.value = streamMap;

    if (import.meta.env.DEV) {
      console.log(`Twitch: ${data.data.length} live streams`, Array.from(streamMap.keys()));
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
