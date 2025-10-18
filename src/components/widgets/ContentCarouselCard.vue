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

// Latest videos (top 3)
const latestVideos = computed(() => props.videos.slice(0, 3));

// Next event
const nextEvent = computed(() => {
  if (!props.events || props.events.length === 0) return null;
  const upcoming = props.events.find((e) => new Date(e.start).getTime() > Date.now());
  return upcoming || props.events[0];
});

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

function handleCommunityClick() {
  emit('navigate', 'community-events');
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
    <div class="relative h-[400px] sm:h-[450px]">
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

      <!-- Slide 4: Community Events -->
      <div
        class="absolute inset-0 transition-opacity duration-500 flex flex-col"
        :class="currentSlide === 3 ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
        <div class="flex items-center justify-between p-5 border-b border-teal/20">
          <div class="flex items-center gap-3">
            <i class="fa-brands fa-discord text-discord text-xl" aria-hidden="true"></i>
            <h3 class="text-xl font-military font-bold text-t uppercase tracking-wide m-0">
              Community
            </h3>
          </div>
          <button
            class="text-sm text-teal hover:text-teal-bright font-body font-semibold transition-colors"
            @click="handleCommunityClick"
          >
            Explore →
          </button>
        </div>
        <div class="flex-1 flex flex-col justify-center items-center p-8 text-center space-y-6">
          <div
            class="inline-flex items-center gap-4 px-8 py-4 bg-discord/20 border-2 border-discord/40"
          >
            <i class="fa-brands fa-discord text-discord text-3xl" aria-hidden="true"></i>
            <div class="text-left">
              <div class="text-3xl font-military font-bold text-t">287</div>
              <div class="text-sm text-t-secondary font-body uppercase tracking-wide">
                Discord Members
              </div>
            </div>
          </div>

          <div v-if="nextEvent" class="w-full max-w-md">
            <div class="mb-2 flex items-center justify-center gap-2 text-t3 text-sm font-body">
              <i class="fa-regular fa-calendar" aria-hidden="true"></i>
              <span>Next Event</span>
            </div>
            <div
              class="p-4 bg-gradient-to-br from-mg/25 to-mg-dark/30 border-2 border-teal/30 shadow-[0_0_20px_rgba(0,217,255,0.15)]"
            >
              <h4 class="text-lg font-military font-bold text-t uppercase tracking-wide m-0 mb-2">
                {{ nextEvent.name }}
              </h4>
              <p class="text-sm text-t-secondary font-body m-0">{{ nextEvent.description }}</p>
            </div>
          </div>
          <div v-else class="text-base text-t3 font-body">Join our active community on Discord</div>
        </div>
      </div>
    </div>

    <!-- Navigation Controls -->
    <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
      <div class="flex items-center justify-between">
        <!-- Previous Button -->
        <button
          class="w-10 h-10 flex items-center justify-center bg-mg/40 border border-teal/30 text-t hover:bg-mg/60 hover:border-teal/50 transition-all duration-200"
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
          class="w-10 h-10 flex items-center justify-center bg-mg/40 border border-teal/30 text-t hover:bg-mg/60 hover:border-teal/50 transition-all duration-200"
          aria-label="Next slide"
          @click="nextSlide"
        >
          <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>
</template>
