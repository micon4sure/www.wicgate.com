<script setup lang="ts">
import { computed } from 'vue';
import type { YouTubeVideo, CommunityEvent } from '../../api-types';

const props = defineProps<{
  videos: YouTubeVideo[];
  events: CommunityEvent[];
  isSSR: boolean;
}>();

const emit = defineEmits<{
  navigate: [section: string];
}>();

// Latest videos (top 3)
const latestVideos = computed(() => props.videos.slice(0, 3));

// Smart switching: show event when there's ANY upcoming event
const shouldShowEvent = computed(() => {
  return props.events.length > 0;
});

// Get the first (next) upcoming event
const nextEvent = computed(() => {
  return props.events[0] || null;
});

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

// Navigation handlers
function handleVideosClick() {
  emit('navigate', 'community-videos');
}

function openVideo(url: string) {
  window.open(url, '_blank');
}
</script>

<template>
  <div
    class="relative bg-gradient-to-br from-panel/95 to-panel-dark/98 border-2 border-teal/30 overflow-hidden transition-all duration-300 hover:border-teal/50 hover:shadow-[0_0_30px_rgba(0,217,255,0.25)]"
  >
    <div class="relative h-[400px] sm:h-[450px]">
      <!-- Upcoming Event View -->
      <div
        class="absolute inset-0 transition-opacity duration-500 flex flex-col"
        :class="shouldShowEvent ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
        <div class="flex items-center justify-between p-5 border-b border-teal/20">
          <div class="flex items-center gap-3">
            <i class="fa-regular fa-calendar text-teal text-xl" aria-hidden="true"></i>
            <h3 class="text-xl font-military font-bold text-t uppercase tracking-wide m-0">
              Upcoming Event
            </h3>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-5 custom-scrollbar">
          <div v-if="isSSR" class="space-y-4">
            <div class="h-48 bg-mg/15 border border-mg/25 animate-pulse"></div>
          </div>

          <template v-else-if="nextEvent">
            <component
              :is="nextEvent.link ? 'a' : 'div'"
              :href="nextEvent.link"
              target="_blank"
              rel="noopener noreferrer"
              class="block bg-gradient-to-br from-mg/20 to-mg-dark/30 border border-teal/20 overflow-hidden transition-all duration-200 hover:border-teal/50 hover:shadow-[0_0_15px_rgba(0,217,255,0.2)] no-underline"
            >
              <!-- Event with Cover Image -->
              <div v-if="nextEvent.coverUrl" class="flex flex-col">
                <div
                  class="relative h-40 bg-cover bg-center"
                  :style="{ backgroundImage: `url(${nextEvent.coverUrl})` }"
                >
                  <div class="absolute inset-0 bg-gradient-to-br from-black/20 to-black/50"></div>
                  <div class="absolute top-2 right-2 z-10">
                    <div
                      class="px-3 py-1 text-xs font-bold tracking-wider uppercase font-military border"
                      :class="
                        new Date(nextEvent.start).getTime() <= Date.now()
                          ? 'bg-youtube text-white border-youtube-bright shadow-[0_0_12px_rgba(229,57,53,0.6)] animate-pulse'
                          : 'bg-graphite-light/90 text-t border-teal/50'
                      "
                    >
                      {{ getCountdown(nextEvent.start) }}
                    </div>
                  </div>
                </div>
                <div class="p-4">
                  <h4
                    class="text-lg font-military font-bold text-t uppercase tracking-wide m-0 mb-2 line-clamp-2"
                  >
                    {{ nextEvent.name }}
                  </h4>
                  <p
                    class="text-sm text-t-secondary font-body m-0 mb-3 line-clamp-3 leading-relaxed"
                  >
                    {{ nextEvent.description }}
                  </p>
                  <div class="text-sm text-t3 font-body flex items-center gap-1.5">
                    <i class="fa-regular fa-calendar text-teal" aria-hidden="true"></i>
                    {{ formatDate(nextEvent.start) }}
                  </div>
                </div>
              </div>

              <!-- Event without Cover Image -->
              <div v-else class="p-4">
                <div class="mb-3">
                  <div
                    class="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase font-military border"
                    :class="
                      new Date(nextEvent.start).getTime() <= Date.now()
                        ? 'bg-youtube text-white border-youtube-bright shadow-[0_0_12px_rgba(229,57,53,0.6)] animate-pulse'
                        : 'bg-graphite-light/90 text-t border-teal/50'
                    "
                  >
                    {{ getCountdown(nextEvent.start) }}
                  </div>
                </div>
                <h4
                  class="text-lg font-military font-bold text-t uppercase tracking-wide m-0 mb-2 line-clamp-2"
                >
                  {{ nextEvent.name }}
                </h4>
                <p class="text-sm text-t-secondary font-body m-0 mb-3 line-clamp-3 leading-relaxed">
                  {{ nextEvent.description }}
                </p>
                <div class="text-sm text-t3 font-body flex items-center gap-1.5">
                  <i class="fa-regular fa-calendar text-teal" aria-hidden="true"></i>
                  {{ formatDate(nextEvent.start) }}
                </div>
              </div>
            </component>
          </template>
        </div>
      </div>

      <!-- Latest Videos View -->
      <div
        class="absolute inset-0 transition-opacity duration-500 flex flex-col"
        :class="!shouldShowEvent ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
        <div class="flex items-center justify-between p-5 border-b border-teal/20">
          <div class="flex items-center gap-3">
            <i class="fa-brands fa-youtube text-youtube text-xl" aria-hidden="true"></i>
            <h3 class="text-xl font-military font-bold text-t uppercase tracking-wide m-0">
              Latest Videos
            </h3>
          </div>
          <button
            class="text-sm text-teal hover:text-teal-bright font-body font-semibold transition-colors"
            @click="handleVideosClick"
          >
            Watch More →
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-5 custom-scrollbar">
          <div v-if="isSSR" class="space-y-4">
            <div class="h-20 bg-mg/15 border border-mg/25 animate-pulse"></div>
            <div class="h-20 bg-mg/15 border border-mg/25 animate-pulse"></div>
            <div class="h-20 bg-mg/15 border border-mg/25 animate-pulse"></div>
          </div>

          <template v-else>
            <div v-if="latestVideos.length > 0" class="space-y-4">
              <div
                v-for="video in latestVideos"
                :key="video.id"
                class="flex items-start gap-4 p-3 bg-mg/15 border border-mg/25 cursor-pointer transition-all duration-200 hover:bg-mg/25 hover:border-teal/40 hover:shadow-[0_0_15px_rgba(0,217,255,0.15)]"
                @click="openVideo(video.videoUrl)"
              >
                <img
                  :src="video.thumbnailUrl"
                  :alt="video.title"
                  class="w-24 h-16 object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div class="flex-1 overflow-hidden">
                  <p class="text-sm font-body font-semibold text-t m-0 line-clamp-2 leading-snug">
                    {{ video.title }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="h-full flex items-center justify-center text-t3 font-body text-sm">
              No videos yet
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
