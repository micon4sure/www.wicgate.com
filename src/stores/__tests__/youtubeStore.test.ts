import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useYoutubeStore } from '../youtubeStore';

// Sample YouTube Atom feed XML
const mockYouTubeFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/">
  <title>Test Channel</title>
  <author>
    <name>Test Author</name>
  </author>
  <entry>
    <yt:videoId>video123</yt:videoId>
    <title>Test Video 1</title>
    <published>2025-01-10T18:00:00Z</published>
    <updated>2025-01-10T18:00:00Z</updated>
    <link rel="alternate" href="https://www.youtube.com/watch?v=video123"/>
    <media:thumbnail url="https://i.ytimg.com/vi/video123/hqdefault.jpg"/>
    <author>
      <name>Test Author</name>
    </author>
    <yt:channelId>UC123</yt:channelId>
    <media:statistics views="1000"/>
  </entry>
  <entry>
    <yt:videoId>video456</yt:videoId>
    <title>Test Video 2</title>
    <published>2025-01-12T20:00:00Z</published>
    <updated>2025-01-12T20:00:00Z</updated>
    <link rel="alternate" href="https://www.youtube.com/watch?v=video456"/>
    <media:thumbnail url="https://i.ytimg.com/vi/video456/hqdefault.jpg"/>
    <author>
      <name>Test Author</name>
    </author>
    <yt:channelId>UC123</yt:channelId>
    <media:statistics views="2000"/>
  </entry>
</feed>`;

const mockYouTubeFeed2 = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/">
  <title>Another Channel</title>
  <author>
    <name>Another Author</name>
  </author>
  <entry>
    <yt:videoId>video789</yt:videoId>
    <title>Another Video</title>
    <published>2025-01-11T15:00:00Z</published>
    <link rel="alternate" href="https://www.youtube.com/watch?v=video789"/>
    <media:thumbnail url="https://i.ytimg.com/vi/video789/hqdefault.jpg"/>
  </entry>
</feed>`;

// Helper to mock successful fetch with XML feeds
function mockSuccessfulFetch(feeds: Record<string, string> = { channel1: mockYouTubeFeed }) {
  vi.mocked(global.fetch).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(feeds),
  } as Response);
}

describe('youtubeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should have empty videos and loading true on initialization', () => {
      mockSuccessfulFetch({});
      const store = useYoutubeStore();

      expect(store.videos).toEqual({});
      expect(store.loading).toBe(true);
    });
  });

  describe('fetchVideos', () => {
    it('should fetch and parse YouTube feeds', async () => {
      mockSuccessfulFetch({ channel1: mockYouTubeFeed });

      const store = useYoutubeStore();
      await vi.advanceTimersByTimeAsync(0);

      expect(store.loading).toBe(false);
      expect(Object.keys(store.videos)).toHaveLength(1);
      expect(store.videos['channel1']).toBeDefined();
      expect(store.videos['channel1']?.channelTitle).toBe('Test Author');
      expect(store.videos['channel1']?.videos).toHaveLength(2);
    });

    it('should parse video details correctly', async () => {
      mockSuccessfulFetch({ channel1: mockYouTubeFeed });

      const store = useYoutubeStore();
      await vi.advanceTimersByTimeAsync(0);

      const videos = store.videos['channel1']?.videos;
      expect(videos).toBeDefined();

      // Videos should be sorted by date descending within the channel
      const newerVideo = videos?.find((v) => v.id === 'video456');
      expect(newerVideo).toBeDefined();
      expect(newerVideo?.title).toBe('Test Video 2');
      expect(newerVideo?.views).toBe(2000);
      expect(newerVideo?.author).toBe('Test Author');
      expect(newerVideo?.channelId).toBe('UC123');
    });

    it('should handle multiple channels', async () => {
      mockSuccessfulFetch({
        channel1: mockYouTubeFeed,
        channel2: mockYouTubeFeed2,
      });

      const store = useYoutubeStore();
      await vi.advanceTimersByTimeAsync(0);

      expect(Object.keys(store.videos)).toHaveLength(2);
      expect(store.videos['channel1']?.videos).toHaveLength(2);
      expect(store.videos['channel2']?.videos).toHaveLength(1);
    });

    it('should set loading to false after fetch completes', async () => {
      mockSuccessfulFetch();

      const store = useYoutubeStore();
      expect(store.loading).toBe(true);

      await vi.advanceTimersByTimeAsync(0);
      expect(store.loading).toBe(false);
    });

    it('should handle fetch errors gracefully', async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

      const store = useYoutubeStore();
      await vi.advanceTimersByTimeAsync(0);

      expect(store.videos).toEqual({});
      expect(store.loading).toBe(false);
    });

    it('should handle non-ok HTTP response', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      const store = useYoutubeStore();
      await vi.advanceTimersByTimeAsync(0);

      expect(store.videos).toEqual({});
      expect(store.loading).toBe(false);
    });

    it('should skip channels with invalid XML', async () => {
      mockSuccessfulFetch({
        validChannel: mockYouTubeFeed,
        invalidChannel: 'not valid xml <><>',
      });

      const store = useYoutubeStore();
      await vi.advanceTimersByTimeAsync(0);

      // Should only have the valid channel
      expect(Object.keys(store.videos)).toHaveLength(1);
      expect(store.videos['validChannel']).toBeDefined();
      expect(store.videos['invalidChannel']).toBeUndefined();
    });

    it('should skip feeds with no entries', async () => {
      const emptyFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015">
  <title>Empty Channel</title>
</feed>`;

      mockSuccessfulFetch({
        emptyChannel: emptyFeed,
        validChannel: mockYouTubeFeed,
      });

      const store = useYoutubeStore();
      await vi.advanceTimersByTimeAsync(0);

      expect(Object.keys(store.videos)).toHaveLength(1);
      expect(store.videos['validChannel']).toBeDefined();
      expect(store.videos['emptyChannel']).toBeUndefined();
    });
  });

  describe('videosSorted', () => {
    it('should return all videos sorted by publishedAt descending', async () => {
      mockSuccessfulFetch({
        channel1: mockYouTubeFeed,
        channel2: mockYouTubeFeed2,
      });

      const store = useYoutubeStore();
      await vi.advanceTimersByTimeAsync(0);

      const sorted = store.videosSorted;

      // Should have all 3 videos from both channels
      expect(sorted).toHaveLength(3);

      // Should be sorted newest first
      // video456: 2025-01-12
      // video789: 2025-01-11
      // video123: 2025-01-10
      expect(sorted[0]?.id).toBe('video456');
      expect(sorted[1]?.id).toBe('video789');
      expect(sorted[2]?.id).toBe('video123');
    });

    it('should return empty array when no videos', async () => {
      mockSuccessfulFetch({});

      const store = useYoutubeStore();
      await vi.advanceTimersByTimeAsync(0);

      expect(store.videosSorted).toEqual([]);
    });
  });

  describe('XML parsing edge cases', () => {
    it('should handle feed with missing optional fields', async () => {
      const minimalFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/">
  <title>Minimal Channel</title>
  <entry>
    <yt:videoId>minvid</yt:videoId>
    <title>Minimal Video</title>
    <published>2025-01-10T18:00:00Z</published>
    <link rel="alternate" href="https://www.youtube.com/watch?v=minvid"/>
    <media:thumbnail url="https://i.ytimg.com/vi/minvid/hqdefault.jpg"/>
  </entry>
</feed>`;

      mockSuccessfulFetch({ minimal: minimalFeed });

      const store = useYoutubeStore();
      await vi.advanceTimersByTimeAsync(0);

      const video = store.videos['minimal']?.videos[0];
      expect(video).toBeDefined();
      expect(video?.id).toBe('minvid');
      expect(video?.title).toBe('Minimal Video');
      // Optional fields should be undefined
      expect(video?.views).toBeUndefined();
      expect(video?.author).toBeUndefined();
      expect(video?.channelId).toBeUndefined();
    });

    it('should use author name as channel title when available', async () => {
      mockSuccessfulFetch({ channel1: mockYouTubeFeed });

      const store = useYoutubeStore();
      await vi.advanceTimersByTimeAsync(0);

      // Should use author name "Test Author" instead of feed title "Test Channel"
      expect(store.videos['channel1']?.channelTitle).toBe('Test Author');
    });

    it('should handle feed with fallback video ID from generic id element', async () => {
      const fallbackIdFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:media="http://search.yahoo.com/mrss/">
  <title>Fallback Channel</title>
  <entry>
    <id>yt:video:fallbackid</id>
    <title>Fallback Video</title>
    <published>2025-01-10T18:00:00Z</published>
    <link rel="alternate" href="https://www.youtube.com/watch?v=fallbackid"/>
    <media:thumbnail url="https://i.ytimg.com/vi/fallbackid/hqdefault.jpg"/>
  </entry>
</feed>`;

      mockSuccessfulFetch({ fallback: fallbackIdFeed });

      const store = useYoutubeStore();
      await vi.advanceTimersByTimeAsync(0);

      const video = store.videos['fallback']?.videos[0];
      expect(video?.id).toBe('fallbackid');
    });
  });
});
