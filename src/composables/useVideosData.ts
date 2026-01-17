import { computed } from 'vue';
import { useFetch, useRuntimeConfig } from '#imports';
import type { YouTubeVideo } from '../api-types';

export interface VideosData {
  videos: Record<string, { channelTitle: string; videos: YouTubeVideo[] }>;
  videosSorted: YouTubeVideo[];
}

/**
 * Parses a YouTube Atom feed and returns channel title and all entries mapped to Video, sorted by date desc.
 * Uses regex-based parsing for SSR compatibility (no DOMParser required).
 */
function parseYouTubeFeed(xml: string): { channelTitle: string; videos: YouTubeVideo[] } | null {
  if (!xml || typeof xml !== 'string') {
    return null;
  }

  try {
    // Extract channel title (author name or feed title)
    const authorNameMatch = xml.match(/<author>[\s\S]*?<name>([^<]+)<\/name>/);
    const titleMatch = xml.match(/<feed[^>]*>[\s\S]*?<title[^>]*>([^<]+)<\/title>/);
    const channelTitle = authorNameMatch?.[1] || titleMatch?.[1] || 'Unknown Channel';

    // Extract all entries
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const videos: YouTubeVideo[] = [];

    let match;
    while ((match = entryRegex.exec(xml)) !== null) {
      const entry = match[1];
      if (!entry) continue;

      // Extract video data from entry
      const videoIdMatch =
        entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) ||
        entry.match(/<videoId>([^<]+)<\/videoId>/);
      const idMatch = entry.match(/<id>([^<]+)<\/id>/);
      const titleMatch = entry.match(/<title[^>]*>([^<]+)<\/title>/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
      const updatedMatch = entry.match(/<updated>([^<]+)<\/updated>/);
      const thumbnailMatch = entry.match(/<media:thumbnail[^>]*url="([^"]+)"/);
      const authorMatch = entry.match(/<author>[\s\S]*?<name>([^<]+)<\/name>/);
      const channelIdMatch = entry.match(/<yt:channelId>([^<]+)<\/yt:channelId>/);
      const viewsMatch = entry.match(/<media:statistics[^>]*views="(\d+)"/);

      // Get video ID
      let ytId = videoIdMatch?.[1];
      if (!ytId && idMatch?.[1]) {
        const idParts = idMatch[1].split(':');
        ytId = idParts[idParts.length - 1];
      }

      const title = titleMatch?.[1];
      const publishedAt = publishedMatch?.[1] || updatedMatch?.[1];
      const thumbnailUrl = thumbnailMatch?.[1];

      // Skip invalid entries
      if (!ytId || !title || !publishedAt || !thumbnailUrl) continue;

      const video: YouTubeVideo = {
        id: ytId,
        title,
        publishedAt,
        thumbnailUrl,
        videoUrl: `https://www.youtube.com/watch?v=${ytId}`,
      };

      if (updatedMatch?.[1]) video.updatedAt = updatedMatch[1];
      if (authorMatch?.[1]) video.author = authorMatch[1];
      if (channelIdMatch?.[1]) video.channelId = channelIdMatch[1];
      if (viewsMatch?.[1]) video.views = parseInt(viewsMatch[1], 10);

      videos.push(video);
    }

    // Sort by published date descending
    videos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return { channelTitle, videos };
  } catch {
    return null;
  }
}

/**
 * Server-side data fetching composable for YouTube videos.
 * Uses Nuxt's useFetch with ISR caching - data is fetched on the server
 * and cached for subsequent requests.
 *
 * IMPORTANT: This is NOT an async function - it returns useFetch directly
 * to preserve Nuxt's composable context. The calling page should NOT await this.
 *
 * Note: XML parsing is done with regex for SSR compatibility.
 */
export function useVideosData() {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  // Fetch raw XML data from API
  const {
    data: rawXmlData,
    pending,
    error,
  } = useFetch<Record<string, string>>('/videos', {
    baseURL: apiBase,
    key: 'videos-raw-data',
    // Use cached data if available (prevents duplicate fetches after hydration)
    // Note: Use optional chaining as nuxtApp.static may be undefined
    getCachedData: (key, nuxtApp) => nuxtApp.payload?.data?.[key] || nuxtApp.static?.data?.[key],
  });

  // Transform: parse XML feeds into structured video data (computed for reactivity)
  const parsedData = computed<VideosData>(() => {
    const response = rawXmlData.value;
    if (!response) return { videos: {}, videosSorted: [] };

    const parsed: Record<string, { channelTitle: string; videos: YouTubeVideo[] }> = {};

    for (const [channelId, xml] of Object.entries(response)) {
      try {
        const group = parseYouTubeFeed(xml);
        if (group && group.videos.length > 0) {
          parsed[channelId] = group;
        }
      } catch {
        // Silently skip failed feeds
      }
    }

    // Create sorted list of all videos
    const allVideos: YouTubeVideo[] = Object.values(parsed).flatMap((channel) => channel.videos);
    allVideos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return {
      videos: parsed,
      videosSorted: allVideos,
    };
  });

  // Parsed video data with safe defaults
  const videos = computed(() => parsedData.value.videos);
  const videosSorted = computed(() => parsedData.value.videosSorted);

  return {
    videos,
    videosSorted,
    loading: pending,
    error,
  };
}
