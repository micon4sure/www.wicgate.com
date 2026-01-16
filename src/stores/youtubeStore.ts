import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { formatDate } from '../utils';
import { memoizeWithDeps } from '../utils/memoize';
import type { YouTubeVideo } from '../api-types';

const API = import.meta.env.VITE_API_BASE || 'https://www.wicgate.com/api';

export const useYoutubeStore = defineStore('youtube', () => {
  // Map of channelId -> { channelTitle, videos[] }
  const videos = ref<Record<string, { channelTitle: string; videos: YouTubeVideo[] }>>({});
  const loading = ref(true);

  // Fetch videos from API
  async function fetchVideos() {
    if (import.meta.server) {
      loading.value = false;
      return;
    }

    try {
      const url = API + '/videos';
      // API returns: Record<channelId, atomXmlString>
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: Record<string, string> = await response.json();

      const parsed: Record<string, { channelTitle: string; videos: YouTubeVideo[] }> = {};

      for (const [channelId, xml] of Object.entries(data)) {
        try {
          const group = parseYouTubeFeed(xml);
          if (group && group.videos.length > 0) {
            parsed[channelId] = group;
          }
        } catch (e) {
          if (import.meta.env.DEV)
            console.warn(`Failed to parse feed for channel ${channelId}:`, e);
        }
      }

      videos.value = parsed;
      if (import.meta.env.DEV)
        console.log(`Fetched and parsed ${Object.keys(parsed).length} channels from ${url}`);
    } catch (err: unknown) {
      if (import.meta.env.DEV) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('Failed to fetch videos:', message);
      }
    } finally {
      loading.value = false;
    }
  }

  // Memoized sorting function - only recomputes when video count changes
  const sortVideos = memoizeWithDeps(
    (vids: Record<string, { channelTitle: string; videos: YouTubeVideo[] }>) => {
      const all: YouTubeVideo[] = Object.values(vids).flatMap((channel) => channel.videos);
      return all.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    },
    (vids) => [
      Object.keys(vids).length,
      Object.values(vids).reduce((sum, ch) => sum + ch.videos.length, 0),
    ]
  );

  // Videos from all channels sorted by publishedAt desc
  const videosSorted = computed(() => sortVideos(videos.value));

  // Auto-fetch on store creation
  fetchVideos();

  return {
    videos,
    videosSorted,
    loading,
    fetchVideos,
    formatDate,
  };
});

/**
 * Parses a YouTube Atom feed and returns channel title and all entries mapped to Video, sorted by date desc.
 */
function parseYouTubeFeed(xml: string): { channelTitle: string; videos: YouTubeVideo[] } | null {
  // Validate input
  if (!xml || typeof xml !== 'string') {
    throw new Error('Invalid XML input: expected non-empty string');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  // Check for parser errors
  const parserError = doc.getElementsByTagName('parsererror');
  if (parserError && parserError.length > 0) {
    const errorText = parserError[0]?.textContent || 'Unknown parsing error';
    throw new Error(`XML parsing failed: ${errorText}`);
  }

  // Validate document structure
  const documentElement = doc.documentElement;
  if (!documentElement || documentElement.nodeName === 'html') {
    throw new Error('Invalid XML structure: not a valid feed document');
  }

  const entriesList = Array.from(doc.getElementsByTagName('entry'));
  if (!entriesList || entriesList.length === 0) {
    if (import.meta.env.DEV) {
      console.warn('[YouTube Feed] No entries found in feed');
    }
    return null;
  }

  // feed-level channel title (prefer <author><name> if present)
  let channelTitle = doc.getElementsByTagName('title')[0]?.textContent || '';
  const feedAuthorName = doc
    .getElementsByTagName('author')[0]
    ?.getElementsByTagName('name')[0]?.textContent;
  if (feedAuthorName) channelTitle = feedAuthorName;

  const videos: YouTubeVideo[] = entriesList
    .map((entry) => mapEntryToVideo(entry))
    .filter((v): v is YouTubeVideo => !!v)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return { channelTitle, videos };
}

function mapEntryToVideo(entry: Element): YouTubeVideo | null {
  const firstText = (el: Element, tag: string): string | undefined =>
    el.getElementsByTagName(tag)[0]?.textContent || undefined;

  const text = (tag: string) => firstText(entry, tag);

  // video id (prefer yt:videoId, fallback to trailing part of <id>)
  const rawId =
    entry.getElementsByTagName('yt:videoId')[0]?.textContent ||
    entry.getElementsByTagName('videoId')[0]?.textContent ||
    undefined;
  const idFromGeneric = text('id');
  const cleanIdFromGeneric =
    idFromGeneric && idFromGeneric.includes(':')
      ? idFromGeneric.split(':').pop() || idFromGeneric
      : idFromGeneric;
  const ytId = rawId || cleanIdFromGeneric || '';

  const title = text('title') || '';
  const publishedAt = text('published') || text('updated') || '';
  const updatedAt = text('updated') || undefined;

  let thumbnailUrl = entry.getElementsByTagName('media:thumbnail')[0]?.getAttribute('url') || '';
  if (!thumbnailUrl) {
    thumbnailUrl = entry.getElementsByTagName('thumbnail')[0]?.getAttribute?.('url') || '';
  }

  // video URL
  const links = Array.from(entry.getElementsByTagName('link'));
  const alt = links.find((l) => l.getAttribute('rel') === 'alternate');
  const videoUrl =
    alt?.getAttribute('href') || (ytId ? `https://www.youtube.com/watch?v=${ytId}` : '');

  // author/channel name
  const author =
    entry.getElementsByTagName('author')[0]?.getElementsByTagName('name')[0]?.textContent ||
    entry.getElementsByTagName('name')[0]?.textContent ||
    undefined;

  // channelId
  const channelId =
    entry.getElementsByTagName('yt:channelId')[0]?.textContent ||
    entry.getElementsByTagName('channelId')[0]?.textContent ||
    undefined;

  // views from <media:community><media:statistics views="..."/>
  let views: number | undefined;
  const statsEl =
    entry.getElementsByTagName('media:statistics')[0] ||
    entry.getElementsByTagName('statistics')[0];
  const viewsAttr = statsEl?.getAttribute?.('views');
  if (viewsAttr && !Number.isNaN(Number(viewsAttr))) {
    views = Number(viewsAttr);
  }

  if (!ytId || !title || !publishedAt || !thumbnailUrl || !videoUrl) return null;

  const video: YouTubeVideo = {
    id: ytId,
    title,
    publishedAt,
    thumbnailUrl,
    videoUrl,
  };

  // Only include optional properties if they have defined values
  if (updatedAt) video.updatedAt = updatedAt;
  if (author) video.author = author;
  if (views !== undefined) video.views = views;
  if (channelId) video.channelId = channelId;

  return video;
}
