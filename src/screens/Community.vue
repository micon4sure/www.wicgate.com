<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { communityCards } from '../content/content';
import { useYoutube } from '../composables/useYoutube';
import { useEvents } from '../composables/useEvents';
import TwitchEmbed from '../components/TwitchEmbed.vue';

// Get videos data from composable
const {
  videos: videosByChannel,
  videosSorted: ytVideosSorted,
  loading: ytVidsLoading,
} = useYoutube();

// Events integration
const { events, isLoading: eventsLoading, formatDate, getCountdown } = useEvents();

// UI state: expanded toggle (persist to localStorage)
const EXPAND_KEY = 'community_videos_expanded';
const stored = typeof window !== 'undefined' ? window.localStorage.getItem(EXPAND_KEY) : null;
const expanded = ref(stored === '1');

watch(expanded, (val) => localStorage.setItem(EXPAND_KEY, val ? '1' : '0'));

const top6NYTVideos = computed(() => ytVideosSorted.value.slice(0, 6));

// Flatten grouped channels into an array for v-for and sort by channel title
const channelsList = computed(() => {
  return Object.entries(videosByChannel.value)
    .map(([channelId, group]) => ({
      channelId,
      channelTitle: group.channelTitle || 'Unknown Channel',
      videos: group.videos.slice(0, 6),
    }))
    .sort((a, b) => a.channelTitle.localeCompare(b.channelTitle));
});

const twitchUsernames = ['kickapoo149', 'pontertwitch'];
</script>

<template>
  <section id="community" class="com-hub section">
    <div class="container">
      <div class="text-center mb-xl">
        <h2>Community</h2>
        <p class="section-lead">Join the conversation across all platforms</p>
      </div>

      <div class="grid grid-3 mb-xl">
        <a
          v-for="c in communityCards"
          :key="c.title"
          :href="c.link"
          target="_blank"
          class="card com-card"
          :class="c.cls"
          :aria-label="`${c.action} - ${c.title}: ${c.desc}`"
        >
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
        </a>
      </div>

      <!-- Events Section -->
      <div class="mb-xl">
        <div class="vid-hdr">
          <h3>Events</h3>
          <p class="section-lead" style="margin: 0; font-size: 0.9rem">
            Tournaments, community nights, and special operations
          </p>
        </div>

        <!-- Combined Events Layout -->
        <div v-if="eventsLoading" class="events-container">
          <div class="events-grid">
            <div v-for="n in 3" :key="'s' + n" class="event-card skeleton">
              <div
                class="event-status skeleton-line"
                style="width: 80px; height: 20px; border-radius: 10px"
              ></div>
              <div class="event-content">
                <div class="skeleton-line" style="width: 70%; margin-bottom: 8px" />
                <div class="skeleton-line" style="width: 50%" />
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="events.length" class="events-container">
          <div class="events-grid">
            <component
              :is="e.link ? 'a' : 'div'"
              v-for="e in events"
              :key="e.id"
              :href="e.link"
              target="_blank"
              class="event-card"
            >
              <div
                v-if="e.coverUrl"
                class="event-image"
                :style="{ backgroundImage: 'url(' + e.coverUrl + ')' }"
              >
                <div class="event-image-overlay"></div>
                <div v-if="new Date(e.start).getTime() <= Date.now()" class="event-status live">
                  <span class="status-text">LIVE NOW</span>
                </div>
                <div v-else class="event-status">
                  <span class="status-text">{{ getCountdown(e.start) }}</span>
                </div>
              </div>
              <div class="event-content" :class="{ 'no-image': !e.coverUrl }">
                <div
                  v-if="!e.coverUrl && new Date(e.start).getTime() <= Date.now()"
                  class="event-status live"
                >
                  <span class="status-text">LIVE NOW</span>
                </div>
                <div v-else-if="!e.coverUrl" class="event-status">
                  <span class="status-text">{{ getCountdown(e.start) }}</span>
                </div>
                <h4 class="event-title">{{ e.name }}</h4>
                <p class="event-desc">{{ e.description }}</p>
                <div class="event-meta">
                  <span class="event-date">
                    <i class="fa-regular fa-calendar" aria-hidden="true"></i>
                    {{ formatDate(e.start) }}
                  </span>
                  <span v-if="e.link" class="event-link-icon">
                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
            </component>
          </div>
        </div>
        <div v-else-if="!eventsLoading" class="events-empty">
          <i class="fa-regular fa-calendar-xmark" aria-hidden="true"></i>
          <p>No events scheduled at the moment</p>
        </div>
      </div>

      <!-- Live Streams -->
      <div class="mb-xl">
        <div class="vid-hdr">
          <h3>Live Streams</h3>
        </div>
        <div class="grid grid-2" style="gap: 30px">
          <a
            v-for="u in twitchUsernames"
            :key="u"
            :href="`https://twitch.tv/${u}`"
            target="_blank"
            class="card"
            style="padding: 0; overflow: hidden; text-decoration: none; color: inherit"
            :aria-label="`Watch ${u} live on Twitch`"
          >
            <TwitchEmbed :channel="u" muted />
            <div
              style="
                padding: 12px 16px;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <strong style="font-size: 0.9rem">{{ u }}</strong>
            </div>
          </a>
        </div>
      </div>

      <!-- Latest Videos -->
      <div class="vid-section mb-xl">
        <div class="vid-hdr">
          <h3>Latest Videos</h3>
          <label class="toggle">
            <input v-model="expanded" type="checkbox" />
            <span class="slider"></span>
            <span class="lbl">Expand</span>
          </label>
        </div>

        <div v-if="ytVidsLoading" class="grid grid-3">
          <div v-for="n in 3" :key="n" class="card vid-card skeleton">
            <div class="vid-thumb" />
            <div class="vid-info">
              <div class="skeleton-line" style="width: 80%"></div>
              <div class="skeleton-line" style="width: 60%; margin-top: 6px"></div>
            </div>
          </div>
        </div>

        <div v-else>
          <!-- Always show 6 latest videos -->
          <div class="latest-videos-section">
            <div class="videos-grid">
              <div v-for="v in top6NYTVideos" :key="v.id || v.videoUrl" class="card vid-card">
                <a :href="v.videoUrl" target="_blank" class="vid-link">
                  <div
                    class="vid-thumb"
                    :style="{ backgroundImage: 'url(' + v.thumbnailUrl + ')' }"
                  >
                    <div class="play-over"><i class="fa-solid fa-play" aria-hidden="true"></i></div>
                  </div>
                  <div class="vid-info">
                    <h4 class="vid-title">{{ v.title }}</h4>
                    <div class="vid-meta">
                      <span v-if="v.author">{{ v.author }}</span>
                      <span v-if="v.views != null"> • {{ v.views.toLocaleString() }} views</span>
                      <span v-if="v.publishedAt">
                        • {{ new Date(v.publishedAt).toLocaleDateString() }}</span
                      >
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <!-- Channel sections slide down when expanded -->
          <Transition name="expand-y">
            <div v-if="expanded" class="by-channel">
              <div class="section-divider">
                <h4 class="section-title">By Content Creator</h4>
              </div>
              <div v-for="ch in channelsList" :key="ch.channelId" class="channel-section">
                <div class="channel-badge-container">
                  <a
                    :href="`https://www.youtube.com/channel/${ch.channelId}`"
                    target="_blank"
                    class="channel-badge"
                  >
                    <h4 class="channel-name">{{ ch.channelTitle }}</h4>
                    <div class="channel-badge-icon">
                      <i class="fa-solid fa-external-link" aria-hidden="true"></i>
                    </div>
                  </a>
                </div>
                <div class="videos-grid">
                  <div v-for="v in ch.videos" :key="v.id" class="card vid-card">
                    <a :href="v.videoUrl" target="_blank" class="vid-link">
                      <div
                        class="vid-thumb"
                        :style="{ backgroundImage: 'url(' + v.thumbnailUrl + ')' }"
                      >
                        <div class="play-over">
                          <i class="fa-solid fa-play" aria-hidden="true"></i>
                        </div>
                      </div>
                      <div class="vid-info">
                        <h4 class="vid-title">{{ v.title }}</h4>
                        <div class="vid-meta">
                          <span v-if="v.views != null">{{ v.views.toLocaleString() }} views</span>
                          <span v-if="v.publishedAt">
                            • {{ new Date(v.publishedAt).toLocaleDateString() }}</span
                          >
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <div v-if="ytVideosSorted.length === 0" class="text-muted">No videos available</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Responsive video grid */
.videos-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

/* Latest videos section */
.latest-videos-section {
  margin-bottom: 20px;
}

/* Latest videos section should match channel sections exactly */
@media (min-width: 1024px) {
  .latest-videos-section .videos-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Video card styles */
.vid-card {
  transition: var(--tr);
}

@media (hover: hover) {
  .vid-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-card);
  }
}

.vid-card:active {
  transform: scale(0.98);
}

.vid-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.vid-thumb {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background-size: cover;
  background-position: center;
  background-color: var(--s2);
  border-radius: 6px 6px 0 0;
  overflow: hidden;
}

.vid-info {
  padding: 12px 16px;
}

.vid-title {
  margin: 0 0 6px;
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--t);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.vid-meta {
  font-size: 0.8rem;
  color: var(--t3);
}

/* Section divider styling */
.section-divider {
  margin: 30px 0 24px 0;
  text-align: center;
}

.section-divider .section-title {
  margin: 0 0 16px;
  font-size: 1.1rem;
  color: var(--t);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--mg);
  display: inline-block;
}

/* Channel sections */
.by-channel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.channel-section {
  margin-bottom: 32px;
}

.channel-badge-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.channel-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.channel-badge::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.channel-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--t);
  letter-spacing: 0.025em;
}

.channel-badge-icon {
  font-size: 0.85rem;
  color: var(--t3);
  transition: all 0.3s ease;
}

@media (hover: hover) {
  .channel-badge:hover {
    transform: translateY(-2px) scale(1.02);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  }

  .channel-badge:hover::before {
    opacity: 1;
  }

  .channel-badge:hover .channel-name {
    color: #fff;
  }

  .channel-badge:hover .channel-badge-icon {
    color: var(--t);
    transform: translateX(2px);
  }
}

.channel-badge:active {
  transform: translateY(-1px) scale(1.01);
}

.channel-section .videos-grid {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

/* Force 3 columns for channel sections on larger screens */
@media (min-width: 1024px) {
  .channel-section .videos-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Slide-down expand transition */
.expand-y-enter-from,
.expand-y-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-y-enter-active,
.expand-y-leave-active {
  transition:
    max-height 0.4s ease,
    opacity 0.4s ease;
}

.expand-y-enter-to,
.expand-y-leave-from {
  max-height: 3000px;
  opacity: 1;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .videos-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }

  .channel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .channel-section .videos-grid {
    padding: 12px 16px 16px;
  }
}

@media (max-width: 480px) {
  .videos-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .vid-hdr {
    flex-wrap: wrap;
    gap: 10px;
  }

  .by-channel {
    gap: 16px;
  }
}

/* Events Styles - New Clean Design */
.events-container {
  margin-top: 20px;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.event-card {
  background: var(--grad-card);
  border: 1px solid var(--bd);
  border-radius: 8px;
  padding: 0;
  text-decoration: none;
  color: inherit;
  transition: var(--tr);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media (hover: hover) {
  .event-card:hover {
    border-color: rgba(85, 107, 47, 0.3);
    box-shadow: var(--shadow-card);
    transform: translateY(-2px);
  }
}

.event-card:active {
  transform: scale(0.98);
  border-color: rgba(85, 107, 47, 0.2);
}

.event-image {
  position: relative;
  height: 220px;
  background-size: cover;
  background-position: center;
  background-color: var(--s2);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 12px;
}

.event-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%);
}

.event-status {
  position: relative;
  z-index: 2;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: rgba(124, 179, 66, 0.9);
  color: #fff;
  border: 1px solid rgba(124, 179, 66, 0.3);
  backdrop-filter: blur(4px);
}

.event-status.live {
  background: rgba(229, 57, 53, 0.9);
  color: #fff;
  border-color: rgba(229, 57, 53, 0.3);
}

.event-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
}

.event-content.no-image {
  gap: 12px;
}

.event-content.no-image .event-status {
  align-self: flex-start;
  background: rgba(124, 179, 66, 0.1);
  color: var(--g);
  border: 1px solid rgba(124, 179, 66, 0.2);
  backdrop-filter: none;
}

.event-content.no-image .event-status.live {
  background: rgba(229, 57, 53, 0.1);
  color: #e53935;
  border-color: rgba(229, 57, 53, 0.3);
}

.event-title {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.3;
  color: var(--t);
}

.event-desc {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--t2);
  flex: 1;
}

.event-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--bd);
}

.event-date {
  font-size: 0.8rem;
  color: var(--t3);
  display: flex;
  align-items: center;
  gap: 6px;
}

.event-link-icon {
  color: var(--mg);
  font-size: 0.8rem;
}

.events-empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--t3);
}

.events-empty i {
  font-size: 2rem;
  margin-bottom: 12px;
  opacity: 0.5;
}

.events-empty p {
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .events-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .event-card {
    padding: 14px;
  }
}
</style>
