<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import type { YouTubeVideo, CommunityEvent } from '../../api-types';
import YouTubeTheater from '../YouTubeTheater.vue';

// Track which event is expanded (by index)
const expandedEventIndex = ref(0);

const props = defineProps<{
  videos: YouTubeVideo[];
  events: CommunityEvent[];
  isSSR: boolean;
}>();

const emit = defineEmits<{
  navigate: [section: string];
}>();

// Manual override for view switching
const manualView = ref<'auto' | 'videos' | 'events'>('auto');

// Track seen video IDs in localStorage
const seenVideoIds = ref<Set<string>>(new Set());

onMounted(() => {
  // Load seen videos from localStorage
  const stored = localStorage.getItem('seenVideoIds');
  if (stored) {
    try {
      seenVideoIds.value = new Set(JSON.parse(stored));
    } catch {
      seenVideoIds.value = new Set();
    }
  }
});

// Mark videos as seen when viewing
watch(
  () => props.videos,
  (videos) => {
    if (videos.length > 0 && manualView.value !== 'events') {
      const ids = videos.slice(0, 3).map((v) => v.id);
      ids.forEach((id) => seenVideoIds.value.add(id));
      localStorage.setItem('seenVideoIds', JSON.stringify([...seenVideoIds.value]));
    }
  },
  { immediate: true }
);

// Latest videos (top 3)
const latestVideos = computed(() => props.videos.slice(0, 3));

// Count of unseen videos
const unseenCount = computed(() => {
  return latestVideos.value.filter((v) => !seenVideoIds.value.has(v.id)).length;
});

// Check if a video is new (unseen)
function isNewVideo(videoId: string): boolean {
  return !seenVideoIds.value.has(videoId);
}

// Smart switching: show event when there's ANY upcoming event (unless manually overridden)
const shouldShowEvent = computed(() => {
  if (manualView.value === 'videos') return false;
  if (manualView.value === 'events') return true;
  return props.events.length > 0;
});

// Expand an event by index
function expandEvent(index: number) {
  expandedEventIndex.value = index;
}

// Check if an event is expanded
function isExpanded(index: number): boolean {
  return expandedEventIndex.value === index;
}

// Switch to videos view
function showVideos() {
  manualView.value = 'videos';
  // Mark current videos as seen
  latestVideos.value.forEach((v) => seenVideoIds.value.add(v.id));
  localStorage.setItem('seenVideoIds', JSON.stringify([...seenVideoIds.value]));
}

// Switch to events view
function showEvents() {
  manualView.value = 'events';
}

// Format date helper
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Get countdown or "LIVE NOW" status
function getCountdown(startDate: string): string {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const diff = start - now;

  if (diff < 0) return 'LIVE NOW';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${minutes}m`;
}

function handleVideosClick() {
  emit('navigate', 'community');
}

const selectedVideo = ref<YouTubeVideo | null>(null);

function openVideo(video: YouTubeVideo) {
  selectedVideo.value = video;
}
</script>

<template>
  <div class="dashboard-card">
    <!-- Tab Navigation -->
    <div class="tab-nav-sub">
      <button
        class="tab-btn-sub flex items-center justify-center gap-2"
        :class="{ 'tab-btn-sub-active': shouldShowEvent }"
        @click="showEvents"
      >
        <i class="fa-regular fa-calendar" aria-hidden="true"></i>
        Events
        <span v-if="events.length > 0" class="widget-badge-count">{{ events.length }}</span>
      </button>
      <button
        class="tab-btn-sub flex items-center justify-center gap-2"
        :class="{ 'tab-btn-sub-active': !shouldShowEvent }"
        @click="showVideos"
      >
        <i class="fa-brands fa-youtube" aria-hidden="true"></i>
        Videos
        <span v-if="!shouldShowEvent && unseenCount > 0" class="widget-badge-new">{{
          unseenCount
        }}</span>
      </button>
    </div>

    <div class="relative h-[360px] sm:h-[410px]">
      <!-- Upcoming Event View -->
      <div
        class="absolute inset-0 transition-opacity duration-500 flex flex-col"
        :class="shouldShowEvent ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
        <div class="dashboard-card-body custom-scrollbar">
          <div v-if="isSSR" class="space-y-4">
            <div class="skeleton-placeholder h-48"></div>
          </div>

          <template v-else-if="events.length > 0">
            <div class="events-accordion">
              <div
                v-for="(event, index) in events"
                :key="event.name"
                class="event-accordion-item"
                :class="{ 'event-accordion-expanded': isExpanded(index) }"
              >
                <!-- Compact header (always visible) -->
                <div class="event-accordion-header" @click="expandEvent(index)">
                  <div
                    class="countdown-badge"
                    :class="
                      new Date(event.start).getTime() <= Date.now()
                        ? 'countdown-badge-live'
                        : 'countdown-badge-upcoming'
                    "
                  >
                    {{ getCountdown(event.start) }}
                  </div>
                  <span class="event-accordion-title">{{ event.name }}</span>
                  <span class="event-accordion-date">
                    <i class="fa-regular fa-calendar text-soviet" aria-hidden="true"></i>
                    {{ formatDate(event.start) }}
                  </span>
                </div>

                <!-- Expanded content -->
                <div v-if="isExpanded(index)" class="event-accordion-content">
                  <component
                    :is="event.link ? 'a' : 'div'"
                    :href="event.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="event-card"
                  >
                    <!-- Event with Cover Image -->
                    <div v-if="event.coverUrl" class="flex flex-col">
                      <div
                        class="relative h-40 bg-cover bg-center"
                        :style="{ backgroundImage: `url(${event.coverUrl})` }"
                      >
                        <div
                          class="absolute inset-0 bg-gradient-to-br from-black/20 to-black/50"
                        ></div>
                      </div>
                      <div class="p-4">
                        <p
                          class="text-sm text-t-secondary font-body m-0 mb-3 line-clamp-3 leading-relaxed"
                        >
                          {{ event.description }}
                        </p>
                      </div>
                    </div>

                    <!-- Event without Cover Image -->
                    <div v-else class="p-4">
                      <p class="text-sm text-t-secondary font-body m-0 leading-relaxed">
                        {{ event.description }}
                      </p>
                    </div>
                  </component>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Latest Videos View -->
      <div
        class="absolute inset-0 transition-opacity duration-500 flex flex-col"
        :class="!shouldShowEvent ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
        <div class="dashboard-card-body custom-scrollbar">
          <div v-if="isSSR" class="space-y-4">
            <div class="skeleton-placeholder h-20"></div>
            <div class="skeleton-placeholder h-20"></div>
            <div class="skeleton-placeholder h-20"></div>
          </div>

          <template v-else>
            <div v-if="latestVideos.length > 0" class="space-y-4">
              <div
                v-for="video in latestVideos"
                :key="video.id"
                class="video-item-card group"
                @click="openVideo(video)"
              >
                <div class="relative w-24 h-16 flex-shrink-0">
                  <img
                    :src="video.thumbnailUrl"
                    :alt="video.title"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div class="play-over-sm">
                    <i class="fa-solid fa-play" aria-hidden="true"></i>
                  </div>
                  <!-- New video indicator -->
                  <div v-if="isNewVideo(video.id)" class="absolute top-0 left-0">
                    <span class="widget-badge-new text-[9px] px-1 py-0.5">NEW</span>
                  </div>
                </div>
                <div class="flex-1 overflow-hidden">
                  <p class="text-sm font-body font-semibold text-t m-0 line-clamp-2 leading-snug">
                    {{ video.title }}
                  </p>
                  <div class="text-xs text-t3 font-body mt-1">
                    <span v-if="video.author">{{ video.author }}</span>
                    <span v-if="video.views != null">
                      {{ video.author ? ' • ' : '' }}{{ video.views.toLocaleString() }} views</span
                    >
                    <span v-if="video.publishedAt">
                      • {{ new Date(video.publishedAt).toLocaleDateString() }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="h-full flex items-center justify-center text-t3 font-body text-sm">
              No videos yet
            </div>
          </template>
        </div>
        <!-- Footer with link -->
        <div class="px-5 pb-4">
          <button class="dashboard-card-header-action" @click="handleVideosClick">
            Watch More →
          </button>
        </div>
      </div>
    </div>

    <YouTubeTheater
      v-if="selectedVideo"
      :video-id="selectedVideo.id"
      :title="selectedVideo.title"
      @close="selectedVideo = null"
    />
  </div>
</template>
