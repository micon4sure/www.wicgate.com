<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import type { YouTubeVideo, CommunityEvent } from '../../api-types';

const props = defineProps<{
  videos: YouTubeVideo[];
  events: CommunityEvent[];
  isSSR: boolean;
}>();

const emit = defineEmits<{
  navigate: [section: string];
}>();

// Carousel state
const currentSlide = ref(0);
const isPaused = ref(false);
const totalSlides = 4;
let autoRotateTimer: ReturnType<typeof setInterval> | null = null;

// Touch/swipe support
const touchStartX = ref(0);
const touchEndX = ref(0);

// Latest videos (top 3)
const latestVideos = computed(() => props.videos.slice(0, 3));

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

// Carousel navigation
function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % totalSlides;
  resetAutoRotate();
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides;
  resetAutoRotate();
}

function goToSlide(index: number) {
  currentSlide.value = index;
  resetAutoRotate();
}

// Auto-rotation logic
function startAutoRotate() {
  if (props.isSSR) return;
  stopAutoRotate();
  autoRotateTimer = setInterval(() => {
    if (!isPaused.value) {
      currentSlide.value = (currentSlide.value + 1) % totalSlides;
    }
  }, 5000);
}

function stopAutoRotate() {
  if (autoRotateTimer) {
    clearInterval(autoRotateTimer);
    autoRotateTimer = null;
  }
}

function resetAutoRotate() {
  startAutoRotate();
}

function handleMouseEnter() {
  isPaused.value = true;
}

function handleMouseLeave() {
  isPaused.value = false;
}

// Touch/Swipe handlers
function handleTouchStart(event: TouchEvent) {
  touchStartX.value = event.touches[0].clientX;
}

function handleTouchMove(event: TouchEvent) {
  touchEndX.value = event.touches[0].clientX;
}

function handleTouchEnd() {
  if (!touchStartX.value || !touchEndX.value) return;

  const swipeDistance = touchEndX.value - touchStartX.value;
  const swipeThreshold = 50; // Minimum distance for a swipe

  if (swipeDistance > swipeThreshold) {
    // Swiped right - go to previous slide
    prevSlide();
  } else if (swipeDistance < -swipeThreshold) {
    // Swiped left - go to next slide
    nextSlide();
  }

  // Reset touch positions
  touchStartX.value = 0;
  touchEndX.value = 0;
}

// Navigation handlers
function handleQuickStartClick() {
  emit('navigate', 'downloads');
}

function handleVideosClick() {
  emit('navigate', 'community-videos');
}

function handleHelpClick() {
  emit('navigate', 'faq');
}

function handleEventsClick() {
  emit('navigate', 'community');
}

function openVideo(url: string) {
  window.open(url, '_blank');
}

// Lifecycle
onMounted(() => {
  if (!props.isSSR) {
    startAutoRotate();
  }
});

onBeforeUnmount(() => {
  stopAutoRotate();
});
</script>

<template>
  <div
    class="relative bg-gradient-to-br from-panel/95 to-panel-dark/98 border-2 border-teal/30 overflow-hidden transition-all duration-300 hover:border-teal/50 hover:shadow-[0_0_30px_rgba(0,217,255,0.25)]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Carousel Container -->
    <div
      class="relative h-[400px] sm:h-[450px]"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <!-- Slide 1: Quick Start -->
      <div
        class="absolute inset-0 transition-opacity duration-500 flex flex-col"
        :class="currentSlide === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
        <div class="flex items-center justify-between p-5 border-b border-teal/20">
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-rocket text-massgate-red-bright text-xl" aria-hidden="true"></i>
            <h3 class="text-xl font-military font-bold text-t uppercase tracking-wide m-0">
              Quick Start
            </h3>
          </div>
        </div>
        <div class="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div
            class="text-5xl font-military font-bold text-massgate-red-bright mb-4 drop-shadow-[0_2px_8px_rgba(229,57,53,0.6)]"
          >
            Ready in 5 minutes
          </div>
          <p class="text-lg text-t-secondary font-body mb-8 max-w-md">
            Install WICGATE and join the battlefield. Free to play, easy to setup.
          </p>
          <button
            class="btn-red inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-black"
            @click="handleQuickStartClick"
          >
            <i class="fa-solid fa-download" aria-hidden="true"></i>
            <span>INSTALL WICGATE</span>
          </button>
        </div>
      </div>

      <!-- Slide 2: Latest Videos -->
      <div
        class="absolute inset-0 transition-opacity duration-500 flex flex-col"
        :class="currentSlide === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'"
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
          <div v-else-if="latestVideos.length > 0" class="space-y-4">
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
          <div v-else class="h-full flex items-center justify-center text-t3 font-body">
            No videos yet
          </div>
        </div>
      </div>

      <!-- Slide 3: Getting Help -->
      <div
        class="absolute inset-0 transition-opacity duration-500 flex flex-col"
        :class="currentSlide === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
        <div class="flex items-center justify-between p-5 border-b border-teal/20">
          <div class="flex items-center gap-3">
            <i
              class="fa-solid fa-circle-question text-massgate-gold text-xl"
              aria-hidden="true"
            ></i>
            <h3 class="text-xl font-military font-bold text-t uppercase tracking-wide m-0">
              Getting Help
            </h3>
          </div>
          <button
            class="text-sm text-teal hover:text-teal-bright font-body font-semibold transition-colors"
            @click="handleHelpClick"
          >
            View FAQ →
          </button>
        </div>
        <div class="flex-1 flex flex-col justify-center p-8 space-y-6">
          <div
            class="flex items-center gap-4 p-4 bg-mg/15 border border-mg/25 transition-all duration-200 hover:bg-mg/25 hover:border-teal/40"
          >
            <div
              class="w-12 h-12 flex items-center justify-center bg-massgate-gold/20 border border-massgate-gold/40 flex-shrink-0"
            >
              <i class="fa-solid fa-book text-massgate-gold text-xl" aria-hidden="true"></i>
            </div>
            <div>
              <h4 class="text-base font-military font-bold text-t uppercase m-0 mb-1">
                Installation Guide
              </h4>
              <p class="text-sm text-t-secondary font-body m-0">Step-by-step setup instructions</p>
            </div>
          </div>

          <div
            class="flex items-center gap-4 p-4 bg-mg/15 border border-mg/25 transition-all duration-200 hover:bg-mg/25 hover:border-teal/40"
          >
            <div
              class="w-12 h-12 flex items-center justify-center bg-massgate-orange/20 border border-massgate-orange/40 flex-shrink-0"
            >
              <i class="fa-solid fa-wrench text-massgate-orange text-xl" aria-hidden="true"></i>
            </div>
            <div>
              <h4 class="text-base font-military font-bold text-t uppercase m-0 mb-1">
                Troubleshooting
              </h4>
              <p class="text-sm text-t-secondary font-body m-0">Common issues and fixes</p>
            </div>
          </div>

          <div
            class="flex items-center gap-4 p-4 bg-mg/15 border border-mg/25 transition-all duration-200 hover:bg-mg/25 hover:border-teal/40"
          >
            <div
              class="w-12 h-12 flex items-center justify-center bg-discord/20 border border-discord/40 flex-shrink-0"
            >
              <i class="fa-brands fa-discord text-discord text-xl" aria-hidden="true"></i>
            </div>
            <div>
              <h4 class="text-base font-military font-bold text-t uppercase m-0 mb-1">
                Community Support
              </h4>
              <p class="text-sm text-t-secondary font-body m-0">Get help from other players</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 4: Upcoming Events -->
      <div
        class="absolute inset-0 transition-opacity duration-500 flex flex-col"
        :class="currentSlide === 3 ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
        <div class="flex items-center justify-between p-5 border-b border-teal/20">
          <div class="flex items-center gap-3">
            <i class="fa-regular fa-calendar text-teal text-xl" aria-hidden="true"></i>
            <h3 class="text-xl font-military font-bold text-t uppercase tracking-wide m-0">
              Upcoming Events
            </h3>
          </div>
          <button
            class="text-sm text-teal hover:text-teal-bright font-body font-semibold transition-colors"
            @click="handleEventsClick"
          >
            View All →
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <!-- Loading State -->
          <div v-if="isSSR" class="space-y-3">
            <div class="h-24 bg-mg/15 border border-mg/25 animate-pulse"></div>
            <div class="h-24 bg-mg/15 border border-mg/25 animate-pulse"></div>
            <div class="h-24 bg-mg/15 border border-mg/25 animate-pulse"></div>
          </div>

          <!-- Events List -->
          <div v-else-if="events.length > 0" class="space-y-3">
            <component
              :is="event.link ? 'a' : 'div'"
              v-for="event in events"
              :key="event.id"
              :href="event.link"
              target="_blank"
              rel="noopener noreferrer"
              class="block bg-gradient-to-br from-mg/20 to-mg-dark/30 border border-teal/20 overflow-hidden transition-all duration-200 hover:border-teal/50 hover:shadow-[0_0_15px_rgba(0,217,255,0.2)] no-underline"
            >
              <!-- Event with Cover Image -->
              <div v-if="event.coverUrl" class="flex flex-col">
                <div
                  class="relative h-28 bg-cover bg-center"
                  :style="{ backgroundImage: `url(${event.coverUrl})` }"
                >
                  <div class="absolute inset-0 bg-gradient-to-br from-black/20 to-black/50"></div>
                  <div class="absolute top-2 right-2 z-10">
                    <div
                      class="px-3 py-1 text-xs font-bold tracking-wider uppercase font-military border"
                      :class="
                        new Date(event.start).getTime() <= Date.now()
                          ? 'bg-youtube text-white border-youtube-bright shadow-[0_0_12px_rgba(229,57,53,0.6)] animate-pulse'
                          : 'bg-graphite-light/90 text-t border-teal/50'
                      "
                    >
                      {{ getCountdown(event.start) }}
                    </div>
                  </div>
                </div>
                <div class="p-3">
                  <h4
                    class="text-base font-military font-bold text-t uppercase tracking-wide m-0 mb-1 line-clamp-1"
                  >
                    {{ event.name }}
                  </h4>
                  <p
                    class="text-xs text-t-secondary font-body m-0 mb-2 line-clamp-2 leading-relaxed"
                  >
                    {{ event.description }}
                  </p>
                  <div class="text-xs text-t3 font-body flex items-center gap-1.5">
                    <i class="fa-regular fa-calendar text-teal" aria-hidden="true"></i>
                    {{ formatDate(event.start) }}
                  </div>
                </div>
              </div>

              <!-- Event without Cover Image -->
              <div v-else class="p-3">
                <div class="mb-2">
                  <div
                    class="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase font-military border"
                    :class="
                      new Date(event.start).getTime() <= Date.now()
                        ? 'bg-youtube text-white border-youtube-bright shadow-[0_0_12px_rgba(229,57,53,0.6)] animate-pulse'
                        : 'bg-graphite-light/90 text-t border-teal/50'
                    "
                  >
                    {{ getCountdown(event.start) }}
                  </div>
                </div>
                <h4
                  class="text-base font-military font-bold text-t uppercase tracking-wide m-0 mb-1 line-clamp-1"
                >
                  {{ event.name }}
                </h4>
                <p class="text-xs text-t-secondary font-body m-0 mb-2 line-clamp-2 leading-relaxed">
                  {{ event.description }}
                </p>
                <div class="text-xs text-t3 font-body flex items-center gap-1.5">
                  <i class="fa-regular fa-calendar text-teal" aria-hidden="true"></i>
                  {{ formatDate(event.start) }}
                </div>
              </div>
            </component>
          </div>

          <!-- Empty State -->
          <div v-else class="h-full flex flex-col items-center justify-center text-center py-8">
            <i
              class="fa-regular fa-calendar-xmark text-4xl mb-3 text-teal/50"
              aria-hidden="true"
            ></i>
            <p class="text-sm text-t3 font-body m-0">No events scheduled at the moment</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Controls -->
    <div
      class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent z-20"
    >
      <div class="flex items-center justify-between">
        <!-- Previous Button -->
        <button
          class="w-10 h-10 hidden md:flex items-center justify-center bg-mg/40 border border-teal/30 text-t hover:bg-mg/60 hover:border-teal/50 transition-all duration-200"
          aria-label="Previous slide"
          @click="prevSlide"
        >
          <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
        </button>

        <!-- Dot Indicators -->
        <div class="flex gap-2">
          <button
            v-for="i in totalSlides"
            :key="i"
            class="w-2.5 h-2.5 transition-all duration-300 border border-teal/50"
            :class="
              currentSlide === i - 1
                ? 'bg-teal shadow-[0_0_8px_rgba(0,217,255,0.6)] w-8'
                : 'bg-mg/40 hover:bg-teal/50'
            "
            :aria-label="`Go to slide ${i}`"
            @click="goToSlide(i - 1)"
          ></button>
        </div>

        <!-- Next Button -->
        <button
          class="w-10 h-10 hidden md:flex items-center justify-center bg-mg/40 border border-teal/30 text-t hover:bg-mg/60 hover:border-teal/50 transition-all duration-200"
          aria-label="Next slide"
          @click="nextSlide"
        >
          <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>
</template>
