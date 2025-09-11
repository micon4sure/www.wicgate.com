<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { communityCards } from '../content/content'
import { useYoutube, type Video } from '../composables/useYoutube'
import TwitchEmbed from '../components/TwitchEmbed.vue'

// Keep both grouped videos and top-3 from composable
const { videos: videosByChannel, videosSorted: ytVideosSorted, loading: ytVidsLoading } = useYoutube()

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
          <div class="card-icon">{{ c.icon }}</div>
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
          <a :href="c.link" target="_blank" class="card-act">{{ c.action }} <span>→</span></a>
        </div>
      </div>

      <!-- Live Streams -->
      <div class="mb-xl">
        <div class="vid-hdr">
          <h3>Live Streams</h3>
          <a href="https://twitch.tv/directory/game/World%20in%20Conflict" target="_blank" class="card-act">Browse
            Twitch →</a>
        </div>
        <div class="grid grid-2" style="gap:30px">
          <div v-for="u in twitchUsernames" :key="u" class="card" style="padding:0;overflow:hidden">
            <TwitchEmbed :channel="u" muted />
            <div style="padding:12px 16px;display:flex;justify-content:space-between;align-items:center">
              <strong style="font-size:.9rem">{{ u }}</strong>
              <a :href="`https://twitch.tv/${u}`" target="_blank" class="card-act" style="font-size:.75rem">Open →</a>
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
              <div v-for="v in (expanded ? top6NYTVideos : top3NYTVideos)" :key="v" class="card vid-card">
                <a :href="v.videoUrl" target="_blank" style="text-decoration:none;color:inherit;display:block">
                  <div class="vid-thumb" :style="{ backgroundImage: 'url(' + v.thumbnailUrl + ')' }">
                    <div class="play-over">▶</div>
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
                <div class="vid-hdr" style="margin-top:10px">
                  <h4 style="margin:0">{{ ch.channelTitle }}</h4>
                  <a :href="`https://www.youtube.com/channel/${ch.channelId}`" target="_blank"
                    class="card-act text-sm">Open Channel →</a>
                </div>
                <div class="grid grid-3">
                  <div v-for="v in ch.videos" :key="v.id" class="card vid-card">
                    <a :href="v.videoUrl" target="_blank" style="text-decoration:none;color:inherit;display:block">
                      <div class="vid-thumb" :style="{ backgroundImage: 'url(' + v.thumbnailUrl + ')' }">
                        <div class="play-over">▶</div>
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
  cursor: pointer
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

.expand-y-enter-active,
.expand-y-leave-active {
  transition: max-height .35s ease, opacity .35s ease
}

.expand-y-enter-to,
.expand-y-leave-from {
  max-height: 2000px;
  opacity: 1
}
</style>
