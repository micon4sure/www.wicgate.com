<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { communityCards } from '../content/content'
import { useYoutube, type Video } from '../composables/useYoutube'
import { useEvents } from '../composables/useEvents'
import TwitchEmbed from '../components/TwitchEmbed.vue'

// Keep both grouped videos and top-3 from composable
const { videos: videosByChannel, videosSorted: ytVideosSorted, loading: ytVidsLoading } = useYoutube()

// Events integration
const { events, isLoading: eventsLoading, formatDate, getCountdown } = useEvents()

// Split events into ongoing (big hero) and upcoming (grid)
const ongoingEvents = computed(() =>
  events.value.filter(e => new Date(e.start).getTime() <= Date.now())
)
const upcomingEvents = computed(() =>
  events.value.filter(e => new Date(e.start).getTime() > Date.now())
)

// UI state: expanded toggle (persist to localStorage)
const EXPAND_KEY = 'community_videos_expanded'
const stored = typeof window !== 'undefined' ? window.localStorage.getItem(EXPAND_KEY) : null
const expanded = ref(stored === '1')

watch(expanded, (val) => localStorage.setItem(EXPAND_KEY, val ? '1' : '0'))

const top3NYTVideos = computed(() => ytVideosSorted.value.slice(0, 3))
const top6NYTVideos = computed(() => ytVideosSorted.value.slice(0, 6))

// Flatten grouped channels into an array for v-for and sort by channel title
const channelsList = computed(() => {
  return Object.entries(videosByChannel.value).map(([channelId, group]) => ({
    channelId,
    channelTitle: group.channelTitle || 'Unknown Channel',
    videos: group.videos.slice(0, 6)
  })).sort((a, b) => a.channelTitle.localeCompare(b.channelTitle))
})

const twitchUsernames = ['kickapoo149', 'pontertwitch']
</script>

<template>
  <section id="community" class="com-hub section">
    <div class="container">
      <div class="text-center mb-xl">
        <h2>Community</h2>
        <p class="section-lead">Join the conversation across all
          platforms</p>
      </div>

      <div class="grid grid-3 mb-xl">
        <div v-for="c in communityCards" :key="c.title" class="card com-card" :class="c.cls">
          <div class="com-card-color-bar" />
          <div class="card-icon"><i :class="c.icon" aria-hidden="true"></i></div>
          <h3>{{ c.title }}</h3>
          <div class="card-stats">
            <div>
              <div class="stat-val">{{ c.members }}</div>
              <div class="stat-lbl">{{ c.stat1 }}</div>
            </div>
            <div>
              <div class="stat-val">{{ c.online }}</div>
              <div class="stat-lbl">{{ c.stat2 }}</div>
            </div>
          </div>
          <p class="card-desc">{{ c.desc }}</p>
          <a :href="c.link" target="_blank" class="card-act">{{ c.action }} <span><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span></a>
        </div>
      </div>

      <!-- Events Section -->
      <div class="mb-xl">
        <div class="vid-hdr">
          <h3>Events</h3>
          <p class="section-lead" style="margin: 0; font-size: 0.9rem;">Tournaments, community nights, and special operations</p>
        </div>
        
        <!-- Ongoing Events (Hero) -->
        <div v-if="!eventsLoading && ongoingEvents.length" class="evt-heroes mb-lg">
          <component v-for="e in ongoingEvents" :key="'hero-' + e.id" :is="e.link ? 'a' : 'div'" :href="e.link"
            target="_blank" class="card evt-hero">
            <div class="evt-hero-cover" :style="{ backgroundImage: e.coverUrl ? 'url(' + e.coverUrl + ')' : undefined }">
              <div class="evt-hero-overlay" />
              <div class="evt-hero-badges">
                <span class="live-badge">LIVE NOW</span>
                <span class="evt-start">Started: {{ formatDate(e.start) }}</span>
              </div>
              <div class="evt-hero-content">
                <h4 class="evt-hero-title">{{ e.name }}</h4>
                <p class="evt-hero-desc">{{ e.description }}</p>
                <div v-if="e.link" class="evt-hero-link">Open details <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></div>
              </div>
            </div>
          </component>
        </div>

        <!-- Upcoming Events Grid -->
        <div v-if="eventsLoading" class="grid grid-3">
          <div v-for="n in 3" :key="'s' + n" class="card evt-card skeleton">
            <div class="evt-cover" />
            <div class="evt-info">
              <div class="skeleton-line" style="width:70%" />
              <div class="skeleton-line" style="width:50%;margin-top:6px" />
            </div>
          </div>
        </div>
        <div v-else-if="upcomingEvents.length" class="grid grid-3">
          <component v-for="e in upcomingEvents" :key="e.id" :is="e.link ? 'a' : 'div'" :href="e.link" target="_blank"
            class="card evt-card">
            <div class="evt-cover" :style="{ backgroundImage: e.coverUrl ? 'url(' + e.coverUrl + ')' : undefined }">
              <div class="evt-badge">
                <span class="evt-date">{{ formatDate(e.start) }}</span>
                <span class="evt-count"><i class="fa-regular fa-hourglass-half" aria-hidden="true"></i> {{ getCountdown(e.start) }}</span>
              </div>
            </div>
            <div class="evt-info">
              <h4 class="evt-title">{{ e.name }}</h4>
              <p class="evt-desc text-muted">{{ e.description }}</p>
              <div class="evt-link" v-if="e.link">Open details <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></div>
            </div>
          </component>
        </div>
        <div v-else-if="!eventsLoading && upcomingEvents.length === 0 && ongoingEvents.length === 0" class="text-muted text-center" style="padding: 20px;">
          No events scheduled at the moment
        </div>
      </div>

      <!-- Live Streams -->
      <div class="mb-xl">
        <div class="vid-hdr">
          <h3>Live Streams</h3>
          <a href="https://twitch.tv/directory/game/World%20in%20Conflict" target="_blank" class="card-act">Browse
            Twitch <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
        </div>
        <div class="grid grid-2" style="gap:30px">
          <div v-for="u in twitchUsernames" :key="u" class="card" style="padding:0;overflow:hidden">
            <TwitchEmbed :channel="u" muted />
            <div style="padding:12px 16px;display:flex;justify-content:space-between;align-items:center">
              <strong style="font-size:.9rem">{{ u }}</strong>
              <a :href="`https://twitch.tv/${u}`" target="_blank" class="card-act" style="font-size:.75rem">Open <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>
      </div>

      <!-- Latest Videos -->
      <div class="vid-section mb-xl">
        <div class="vid-hdr">
          <h3>Latest Videos</h3>
          <label class="toggle">
            <input type="checkbox" v-model="expanded" />
            <span class="slider"></span>
            <span class="lbl">Expand</span>
          </label>
        </div>

        <div v-if="ytVidsLoading" class="grid grid-3">
          <div v-for="n in 3" :key="n" class="card vid-card skeleton">
            <div class="vid-thumb" />
            <div class="vid-info">
              <div class="skeleton-line" style="width:80%"></div>
              <div class="skeleton-line" style="width:60%;margin-top:6px"></div>
            </div>
          </div>
        </div>

        <div v-else>
          <!-- Single row that animates from 3 to 6 items -->
          <div class="vid-row-wrap">
            <TransitionGroup name="vids" tag="div" class="video-row" :class="{ expanded }">
              <div v-for="v in (expanded ? top6NYTVideos : top3NYTVideos)" :key="v.id || v.videoUrl" class="card vid-card">
                <a :href="v.videoUrl" target="_blank" style="text-decoration:none;color:inherit;display:block">
                  <div class="vid-thumb" :style="{ backgroundImage: 'url(' + v.thumbnailUrl + ')' }">
                    <div class="play-over"><i class="fa-solid fa-play" aria-hidden="true"></i></div>
                  </div>
                  <div class="vid-info">
                    <h4 class="vid-title" :class="{ small: expanded }">{{ v.title }}</h4>
                    <div class="vid-meta">
                      <span v-if="v.author">{{ v.author }}</span>
                      <span v-if="v.views != null"> • {{ v.views.toLocaleString() }} views</span>
                      <span v-if="v.publishedAt"> • {{ new Date(v.publishedAt).toLocaleDateString() }}</span>
                    </div>
                  </div>
                </a>
              </div>
            </TransitionGroup>
          </div>

          <div v-if="ytVideosSorted.length === 0" class="text-muted">No videos available </div>

          <!-- By Channel slides down when expanded -->
          <Transition name="expand-y">
            <div v-if="expanded" class="by-channel mt-lg">
              <div v-for="ch in channelsList" :key="ch.channelId" class="mb-lg">
                <div class="vid-hdr channel-header" style="margin-top:10px">
                  <h4 style="margin:0">{{ ch.channelTitle }}</h4>
                  <a :href="`https://www.youtube.com/channel/${ch.channelId}`" target="_blank"
                    class="card-act text-sm">Open Channel <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
                </div>
                <div class="grid grid-3">
                  <div v-for="v in ch.videos" :key="v.id" class="card vid-card">
                    <a :href="v.videoUrl" target="_blank" style="text-decoration:none;color:inherit;display:block">
                      <div class="vid-thumb" :style="{ backgroundImage: 'url(' + v.thumbnailUrl + ')' }">
                        <div class="play-over"><i class="fa-solid fa-play" aria-hidden="true"></i></div>
                      </div>
                      <div class="vid-info">
                        <h4 class="vid-title small">{{ v.title }}</h4>
                        <div class="vid-meta">
                          <span v-if="v.views != null">{{ v.views.toLocaleString() }} views</span>
                          <span v-if="v.publishedAt"> • {{ new Date(v.publishedAt).toLocaleDateString() }}</span>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Toggle switch */
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  min-height: 44px;
  padding: 10px 0;
  -webkit-tap-highlight-color: transparent;
}

.toggle input {
  display: none
}

.toggle .slider {
  position: relative;
  width: 44px;
  height: 24px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
  transition: var(--tr)
}

.toggle .slider::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #999;
  transition: var(--tr);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4)
}

.toggle input:checked+.slider {
  background: linear-gradient(135deg, var(--mg) 0%, var(--mg-dark) 100%);
  border-color: rgba(124, 179, 66, 0.5)
}

.toggle input:checked+.slider::after {
  left: 22px;
  background: #fff
}

.toggle .lbl {
  font-size: .9rem;
  color: var(--t2);
  user-select: none
}

/* Compact video cards when expanded */
.vid-card .vid-title {
  margin: 0 0 6px;
  font-size: 0.95rem;
  line-height: 1.4
}

.vid-card .vid-title.small {
  margin: 0 0 4px;
  font-size: 0.88rem;
  line-height: 1.35
}

/* One-row, animated layout (3 -> 9) */
.vid-row-wrap {
  overflow: hidden
}

.video-row {
  display: flex;
  gap: 20px;
  transition: height .3s ease
}

.video-row .vid-card {
  flex: 0 0 calc((100% / 3) - 13px);
  /* start as 3 items */
  transition: flex-basis .35s cubic-bezier(0.4, 0, 0.2, 1), transform .3s ease, box-shadow .3s ease
}

.video-row.expanded .vid-card {
  flex-basis: calc((100% / 6) - 18px);
}

.video-row .vid-thumb {
  padding-bottom: 56.25%;
  transition: padding-bottom .35s cubic-bezier(0.4, 0, 0.2, 1)
}

.video-row.expanded .vid-thumb {
  padding-bottom: 42%
}

/* TransitionGroup item animations */
.vids-enter-from {
  opacity: 0;
  transform: translateY(10px)
}

.vids-enter-active {
  transition: opacity .25s ease, transform .25s ease
}

.vids-leave-to {
  opacity: 0;
  transform: translateY(-10px)
}

.vids-leave-active {
  transition: opacity .2s ease, transform .2s ease;
  position: absolute
}

/* Slide-down expand transition for by-channel section */
.expand-y-enter-from,
.expand-y-leave-to {
  max-height: 0;
  opacity: 0
}

/* Mobile responsive fixes for expanded videos */
@media (max-width: 768px) {
  .video-row .vid-card {
    flex: 0 0 calc(50% - 10px) !important;
  }
  
  .video-row.expanded .vid-card {
    flex-basis: calc(50% - 10px) !important;
  }
  
  .video-row.expanded .vid-thumb {
    padding-bottom: 56.25% !important;
  }
  
  .vid-hdr {
    flex-wrap: wrap;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .video-row .vid-card {
    flex: 0 0 100% !important;
  }
  
  .video-row.expanded .vid-card {
    flex-basis: 100% !important;
  }
  
  .video-row {
    flex-direction: column;
  }
  
  .video-row.expanded .vid-thumb {
    padding-bottom: 56.25% !important;
  }
  
  .grid.grid-3 {
    grid-template-columns: 1fr !important;
  }
  
  .grid.grid-2 {
    grid-template-columns: 1fr !important;
    gap: 15px !important;
  }
}

.expand-y-enter-active,
.expand-y-leave-active {
  transition: max-height .35s ease, opacity .35s ease
}

.expand-y-enter-to,
.expand-y-leave-from {
  max-height: 2000px;
  opacity: 1
}

/* Events Styles */
.evt-heroes {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.evt-hero {
  padding: 0;
  overflow: hidden;
  text-decoration: none;
  color: inherit
}

.evt-hero-cover {
  position: relative;
  background: linear-gradient(135deg, rgba(0, 0, 0, .25), rgba(0, 0, 0, .5));
  background-size: cover;
  background-position: center;
  min-height: 280px
}

.evt-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, .1) 0%, rgba(0, 0, 0, .55) 60%, rgba(0, 0, 0, .75) 100%)
}

.evt-hero-badges {
  position: absolute;
  top: 14px;
  left: 14px;
  display: flex;
  gap: 10px;
  z-index: 2
}

.live-badge {
  background: #e53935;
  color: #fff;
  font-weight: 700;
  font-size: .8rem;
  padding: 6px 10px;
  border-radius: 999px;
  letter-spacing: .02em;
  box-shadow: 0 1px 6px rgba(0, 0, 0, .35)
}

.evt-start {
  background: rgba(0, 0, 0, .5);
  color: #fff;
  font-size: .8rem;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, .15)
}

.evt-hero-content {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 16px;
  z-index: 2;
  max-width: 900px
}

.evt-hero-title {
  margin: 0 0 8px;
  font-size: clamp(1.4rem, 2.8vw, 1.8rem);
  line-height: 1.15
}

.evt-hero-desc {
  margin: 0 0 10px;
  font-size: clamp(.9rem, 1.4vw, 1rem);
  color: var(--t2)
}

.evt-hero-link {
  font-size: .9rem;
  color: #fff;
  opacity: .9
}

.evt-card {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

.evt-cover {
  position: relative;
  background: linear-gradient(135deg, rgba(0, 0, 0, .2), rgba(0, 0, 0, .4));
  background-size: cover;
  background-position: center;
  padding-bottom: 48%;
}

.evt-badge {
  position: absolute;
  left: 12px;
  bottom: 12px;
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, .55);
  border: 1px solid rgba(255, 255, 255, .15);
  border-radius: 999px;
  padding: 6px 10px;
  font-size: .8rem;
}

.evt-date {
  color: #fff
}

.evt-count {
  color: var(--mg);
  font-weight: 600
}

.evt-info {
  padding: 14px 16px 16px
}

.evt-title {
  margin: 0 0 6px;
  font-size: 1.05rem;
  line-height: 1.35
}

.evt-desc {
  margin: 0 0 8px;
  font-size: .92rem
}

.evt-link {
  font-size: .85rem;
  color: var(--t2)
}

.skeleton .evt-cover {
  background: rgba(255, 255, 255, 0.06)
}

.channel-header {
  background: var(--s2);
  border-left: 4px solid var(--mg);
  border-radius: 0 6px 6px 0;
  padding: 14px 18px;
  margin-bottom: 18px !important;
  position: relative;
  overflow: hidden;
}

.channel-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(85, 107, 47, 0.08) 0%, transparent 60%);
  pointer-events: none;
}

.channel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>
