<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useYoutube } from '../composables/useYoutube';
import { useEvents } from '../composables/useEvents';
import TwitchEmbed from '../components/TwitchEmbed.vue';
import EventsSkeleton from '../components/skeletons/EventsSkeleton.vue';
import VideosSkeleton from '../components/skeletons/VideosSkeleton.vue';

// SSR detection
const isSSR = import.meta.env.SSR;

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

watch(expanded, (val) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(EXPAND_KEY, val ? '1' : '0');
  }
});

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

        <!-- Simple community links -->
        <div class="community-links">
          <a href="https://discord.gg/WnxwfMTyBe" target="_blank" class="community-link discord">
            <i class="fa-brands fa-discord" aria-hidden="true"></i>
            Join Discord (287 members)
          </a>
          <a href="https://youtube.com/@wicgate" target="_blank" class="community-link youtube">
            <i class="fa-brands fa-youtube" aria-hidden="true"></i>
            Watch Videos (1.2K subs)
          </a>
          <a href="https://twitch.tv/directory/game/World%20in%20Conflict" target="_blank" class="community-link twitch">
            <i class="fa-brands fa-twitch" aria-hidden="true"></i>
            Live Streams
          </a>
        </div>
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
        <EventsSkeleton v-if="isSSR || eventsLoading" />
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
        <div class="live-streams-container">
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

        <VideosSkeleton v-if="isSSR || ytVidsLoading" />

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
              <div class="vid-hdr by-channel-hdr">
                <h3>By Content Creator</h3>
              </div>
              <!-- Individual Creator Sections -->
              <div v-for="ch in channelsList" :key="ch.channelId" class="channel-section">
                <div class="creator-card-container">
                  <a
                    :href="`https://www.youtube.com/channel/${ch.channelId}`"
                    target="_blank"
                    class="card creator-card"
                    :aria-label="`View ${ch.channelTitle} YouTube channel`"
                  >
                    <div class="creator-info">
                      <h4 class="creator-name">{{ ch.channelTitle }}</h4>
                      <div class="creator-badge-icon">
                        <i class="fa-solid fa-external-link" aria-hidden="true"></i>
                      </div>
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
  border-radius: 0;
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
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
}

.vid-meta {
  font-size: 0.8rem;
  color: var(--t3);
  font-family: 'Rajdhani', sans-serif;
  font-weight: 500;
}

/* Channel sections */
.by-channel-hdr {
  margin-top: 30px;
}

.by-channel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Individual Creator Sections */
.channel-section {
  margin-bottom: 32px;
}

.creator-card-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.creator-card {
  background: linear-gradient(
    180deg,
    rgba(var(--panel-main-rgb), 0.96) 0%,
    rgba(var(--panel-dark-rgb), 0.98) 100%
  );
  border: 1px solid var(--divider-strong);
  border-radius: 0;
  padding: 12px 24px;
  text-decoration: none;
  color: inherit;
  transition: var(--tr);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 12px 28px rgba(4, 9, 14, 0.55);
  min-height: 50px;
  min-width: 250px;
  max-width: 350px;
  width: 100%;
}

@media (hover: hover) {
  .creator-card:hover {
    background: linear-gradient(
      180deg,
      rgba(var(--sw-rgb), 0.85) 0%,
      rgba(var(--sw-rgb), 0.68) 100%
    );
    border-color: rgba(var(--sw-rgb), 0.75);
    box-shadow: 0 0 30px rgba(var(--sw-rgb), 0.32);
    transform: translateY(-2px);
  }

  .creator-card:hover .creator-name {
    color: var(--ink);
  }
}

.creator-card:active {
  transform: scale(0.98);
  border-color: rgba(var(--sw-rgb), 0.55);
}

.creator-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex: 1;
}

.creator-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--t2);
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.creator-badge-icon {
  font-size: 0.9rem;
  color: rgba(var(--sw-rgb), 0.75);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

@media (hover: hover) {
  .creator-card:hover .creator-badge-icon {
    color: var(--ink);
    transform: translateX(3px);
  }
}

/* Force 3 columns for channel videos on larger screens */
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

  .creator-card {
    padding: 10px 20px;
    min-height: 45px;
    min-width: 220px;
    max-width: 300px;
  }

  .creator-name {
    font-size: 0.9rem;
  }

  .channel-section {
    margin-bottom: 28px;
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

  .creator-card {
    padding: 8px 16px;
    min-height: 40px;
    min-width: unset;
    max-width: unset;
    width: 100%;
  }

  .creator-name {
    font-size: 0.85rem;
  }

  .creator-badge-icon {
    font-size: 0.75rem;
  }

  .channel-section {
    margin-bottom: 24px;
  }

  .creator-card-container {
    margin-bottom: 16px;
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
  background: linear-gradient(
    180deg,
    rgba(var(--panel-main-rgb), 0.96) 0%,
    rgba(var(--panel-dark-rgb), 0.98) 100%
  );
  border: 1px solid var(--divider-strong);
  border-radius: 0;
  padding: 0;
  text-decoration: none;
  color: inherit;
  transition: var(--tr);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 12px 28px rgba(4, 9, 14, 0.55);
}

@media (hover: hover) {
  .event-card:hover {
    border-color: rgba(var(--sw-rgb), 0.75);
    box-shadow: 0 0 30px rgba(var(--sw-rgb), 0.32);
    transform: translateY(-2px);
  }
}

.event-card:active {
  transform: scale(0.98);
  border-color: rgba(var(--sw-rgb), 0.55);
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
  border-bottom: 1px solid var(--divider-strong);
}

.event-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%);
}

.event-status {
  position: relative;
  z-index: 2;
  padding: 6px 16px;
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.8px;
  background: linear-gradient(
    180deg,
    rgba(var(--panel-slate-rgb), 0.9) 0%,
    rgba(var(--panel-slate-dark-rgb), 0.9) 100%
  );
  color: var(--t);
  border: 1px solid rgba(var(--sw-rgb), 0.5);
  text-transform: uppercase;
  font-family: 'Oswald', sans-serif;
}

.event-status.live {
  background: var(--brand-youtube);
  color: #fff;
  border-color: var(--brand-youtube-bright);
  box-shadow: 0 0 20px rgba(var(--brand-youtube-rgb), 0.6);
  animation: militaryPulse 2s ease-in-out infinite;
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
  background: linear-gradient(
    180deg,
    rgba(var(--panel-slate-rgb), 0.9) 0%,
    rgba(var(--panel-slate-dark-rgb), 0.9) 100%
  );
  color: var(--t);
  border: 1px solid rgba(var(--sw-rgb), 0.5);
}

.event-content.no-image .event-status.live {
  background: var(--brand-youtube);
  color: #fff;
  border-color: var(--brand-youtube-bright);
}

.event-title {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.3;
  color: var(--t);
  font-family: 'Oswald', sans-serif;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.event-desc {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--t2);
  flex: 1;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 500;
}

.event-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--divider-soft);
}

.event-date {
  font-size: 0.8rem;
  color: var(--t3);
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 500;
}

.event-link-icon {
  color: rgba(var(--sw-rgb), 0.75);
  font-size: 0.8rem;
}

.events-empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--t3);
  border: 1px solid var(--divider-soft);
  background: linear-gradient(
    180deg,
    rgba(var(--panel-main-rgb), 0.85) 0%,
    rgba(var(--panel-dark-rgb), 0.9) 100%
  );
}

.events-empty i {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: rgba(var(--sw-rgb), 0.7);
  opacity: 0.85;
}

.events-empty p {
  margin: 0;
  font-size: 1rem;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 500;
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

/* Live Streams Military Styling */
.live-streams-container .card {
  background: linear-gradient(
    180deg,
    rgba(var(--panel-main-rgb), 0.96) 0%,
    rgba(var(--panel-dark-rgb), 0.98) 100%
  );
  border: 1px solid var(--divider-strong);
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 12px 26px rgba(4, 9, 14, 0.5);
  transition: var(--tr);
}

@media (hover: hover) {
  .live-streams-container .card:hover {
    border-color: rgba(var(--sw-rgb), 0.75);
    box-shadow: 0 0 30px rgba(var(--sw-rgb), 0.28);
    transform: translateY(-2px);
  }
}

.live-streams-container .card > div:last-child {
  border-top: 1px solid var(--divider-soft);
  padding: 12px 16px;
}

.live-streams-container .card strong {
  color: var(--sw);
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Military Animation */
@keyframes militaryPulse {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(var(--brand-youtube-rgb), 0.6);
  }
  50% {
    box-shadow: 0 0 30px rgba(var(--brand-youtube-rgb), 0.9);
  }
}
</style>
