import axios from 'axios'
import _ from 'lodash'
import { ref, onMounted, onUnmounted, computed } from 'vue'

export interface Video {
  id: string
  title: string
  publishedAt: string
  updatedAt?: string
  thumbnailUrl: string
  videoUrl: string
  author?: string          // channel / uploader name from <author><name>
  views?: number           // from <media:statistics views="...">
  channelId?: string       // from <yt:channelId>
}

const API = import.meta.env.VITE_API_BASE || 'https://www.wicgate.com/api';

export function useYoutube() {
  // Map of channelId -> { channelTitle, videos[] }
  const videos = ref<Record<string, { channelTitle: string; videos: Video[] }>>({})
  const now = ref(new Date())
  const loading = ref(true)
  let timer: number

  onMounted(async () => {
    try {
      const url = API + '/videos'
      // API returns: Record<channelId, atomXmlString>
      const response = await axios.get<Record<string, string>>(url)
      const data = response.data

      const parsed: Record<string, { channelTitle: string; videos: Video[] }> = {}

      for (const [channelId, xml] of Object.entries(data)) {
        try {
          const group = parseYouTubeFeed(xml)
          if (group && group.videos.length > 0) {
            parsed[channelId] = group
          }
        } catch (e) {
          console.warn(`Failed to parse feed for channel ${channelId}:`, e)
        }
      }

      videos.value = parsed
      console.log(`Fetched and parsed ${Object.keys(parsed).length} channels from ${url}`)
    } catch (err: any) {
      console.error('Failed to fetch events:', err?.message ?? err)
    } finally {
      loading.value = false
    }

    timer = window.setInterval(() => {
      now.value = new Date()
    }, 1000)
  })

  onUnmounted(() => {
    clearInterval(timer)
  })

  function formatDate(raw: string): string {
    return new Date(raw).toLocaleString()
  }

  // videos from all channels sorted by publishedAt desc (top 3)
  const videosSorted = computed(() => {
    const all: Video[] = _.map(videos.value, (channel, channelId) => channel.videos).flat()
    return all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  })

  return {
    videos,
    videosSorted,
    formatDate,
    loading
  }
}

/**
 * Parses a YouTube Atom feed and returns channel title and all entries mapped to Video, sorted by date desc.
 */
function parseYouTubeFeed(xml: string): { channelTitle: string; videos: Video[] } | null {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')

  const parserError = doc.getElementsByTagName('parsererror')
  if (parserError && parserError.length > 0) {
    throw new Error('Invalid XML received')
  }

  const entriesList = Array.from(doc.getElementsByTagName('entry'))
  if (!entriesList || entriesList.length === 0) return null

  // feed-level channel title (prefer <author><name> if present)
  let channelTitle = doc.getElementsByTagName('title')[0]?.textContent || ''
  const feedAuthorName = doc.getElementsByTagName('author')[0]?.getElementsByTagName('name')[0]?.textContent
  if (feedAuthorName) channelTitle = feedAuthorName

  const videos: Video[] = entriesList
    .map(entry => mapEntryToVideo(entry))
    .filter((v): v is Video => !!v)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return { channelTitle, videos }
}

function mapEntryToVideo(entry: Element): Video | null {
  const firstText = (el: Element, tag: string): string | undefined =>
    el.getElementsByTagName(tag)[0]?.textContent || undefined

  const text = (tag: string) => firstText(entry, tag)

  // video id (prefer yt:videoId, fallback to trailing part of <id>)
  const rawId = entry.getElementsByTagName('yt:videoId')[0]?.textContent
    || entry.getElementsByTagName('videoId')[0]?.textContent
    || undefined
  const idFromGeneric = text('id')
  const cleanIdFromGeneric = idFromGeneric && idFromGeneric.includes(':')
    ? (idFromGeneric.split(':').pop() || idFromGeneric)
    : idFromGeneric
  const ytId = rawId || cleanIdFromGeneric || ''

  const title = text('title') || ''
  const publishedAt = text('published') || text('updated') || ''
  const updatedAt = text('updated') || undefined

  let thumbnailUrl =
    entry.getElementsByTagName('media:thumbnail')[0]?.getAttribute('url') || ''
  if (!thumbnailUrl) {
    thumbnailUrl = entry.getElementsByTagName('thumbnail')[0]?.getAttribute?.('url') || ''
  }

  // video URL
  const links = Array.from(entry.getElementsByTagName('link'))
  const alt = links.find(l => l.getAttribute('rel') === 'alternate')
  const videoUrl = alt?.getAttribute('href') || (ytId ? `https://www.youtube.com/watch?v=${ytId}` : '')

  // author/channel name
  const author =
    entry.getElementsByTagName('author')[0]?.getElementsByTagName('name')[0]?.textContent
    || entry.getElementsByTagName('name')[0]?.textContent
    || undefined

  // channelId
  const channelId =
    entry.getElementsByTagName('yt:channelId')[0]?.textContent
    || entry.getElementsByTagName('channelId')[0]?.textContent
    || undefined

  // views from <media:community><media:statistics views="..."/>
  let views: number | undefined
  const statsEl =
    entry.getElementsByTagName('media:statistics')[0]
    || entry.getElementsByTagName('statistics')[0]
  const viewsAttr = statsEl?.getAttribute?.('views')
  if (viewsAttr && !Number.isNaN(Number(viewsAttr))) {
    views = Number(viewsAttr)
  }

  if (!ytId || !title || !publishedAt || !thumbnailUrl || !videoUrl) return null

  return {
    id: ytId,
    title,
    publishedAt,
    updatedAt,
    thumbnailUrl,
    videoUrl,
    author,
    views,
    channelId
  }
}
