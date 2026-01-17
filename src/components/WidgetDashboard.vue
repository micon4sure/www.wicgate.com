<script setup lang="ts">
import { ref, computed, watch, onActivated, onDeactivated, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAppDataStore } from '../stores/appDataStore';
import { useCalendarStore } from '../stores/calendarStore';
import { useYoutubeStore } from '../stores/youtubeStore';
import { useFirstVisit } from '../composables/useFirstVisit';
import { useViewportMode } from '../composables/useViewportMode';
import { useOverlayState } from '../composables/useOverlayState';
import MediaEventCard from './widgets/MediaEventCard.vue';
import DynamicInfoCard from './widgets/DynamicInfoCard.vue';
import { getRoutePath } from '../types/navigation';
import type { DataResponse, LadderEntry } from '../api-types';

// Props: ladder data passed from page (server-side cached)
const props = defineProps<{
  ladder?: LadderEntry[];
  statsLoading?: boolean;
}>();

const router = useRouter();

// Real-time data store (online players - polled every 90s)
const store = useAppDataStore();

// Stores for events and videos
const calendarStore = useCalendarStore();
const youtubeStore = useYoutubeStore();

const { openPrimer } = useFirstVisit();
const { isMobileMode } = useViewportMode();
const { overlayActive } = useOverlayState();

const { isLoading: eventsLoading } = storeToRefs(calendarStore);
const { videosSorted } = storeToRefs(youtubeStore);

// SSR detection - explicitly typed as boolean
const isSSR: boolean = import.meta.server ?? false;

// Combine real-time and server-cached data for DynamicInfoCard
// DynamicInfoCard needs: servers, profiles (real-time), ladder (cached from props)
const combinedData = computed<Partial<DataResponse>>(() => ({
  servers: store.servers,
  profiles: store.profiles,
  ladder: props.ladder ?? [],
}));

// Combined loading state: real-time data OR stats loading (for initial render)
const combinedLoading = computed(() => store.loading || (props.statsLoading ?? false));

// Template refs
const heroVideo = ref<HTMLVideoElement | null>(null);
const heroSection = ref<HTMLElement | null>(null);
let videoObserver: IntersectionObserver | null = null;

// Track if hero is visible (from IntersectionObserver on mobile, KeepAlive on desktop)
const isHeroVisible = ref(true);

// Track video playing state for pause/play button
const isVideoPlaying = ref(true);

// Track if user manually paused (don't auto-resume if true)
const userPausedVideo = ref(false);

// Toggle video playback
function toggleVideo() {
  if (heroVideo.value?.paused) {
    heroVideo.value.play();
    isVideoPlaying.value = true;
    userPausedVideo.value = false; // User resumed, allow auto-resume
  } else {
    heroVideo.value?.pause();
    isVideoPlaying.value = false;
    userPausedVideo.value = true; // User paused, block auto-resume
  }
}

// Resume video playback when component reactivates from KeepAlive cache
onActivated(() => {
  // On mobile with IntersectionObserver, let the observer handle video state
  // The observer will fire after activation and set correct visibility based on scroll position
  if (isMobileMode.value && videoObserver) {
    // Don't auto-play - IntersectionObserver will resume if hero is visible
    return;
  }

  // Desktop: KeepAlive handles navigation, resume video immediately
  isHeroVisible.value = true;
  if (!userPausedVideo.value) {
    heroVideo.value?.play();
    isVideoPlaying.value = true;
  }
});

onDeactivated(() => {
  isHeroVisible.value = false;
  // Pause video when component is cached to save resources
  heroVideo.value?.pause();
  isVideoPlaying.value = false;
});

// Pause video when overlay is active, resume only if hero is visible and user hasn't paused
watch(overlayActive, (active) => {
  if (active) {
    heroVideo.value?.pause();
    isVideoPlaying.value = false;
  } else if (isHeroVisible.value && !userPausedVideo.value) {
    heroVideo.value?.play();
    isVideoPlaying.value = true;
  }
});

// Viewport-based video pause/resume (mobile scroll only)
// Desktop uses KeepAlive's onActivated instead
onMounted(() => {
  if (typeof window === 'undefined' || !heroSection.value) return;
  if (!isMobileMode.value) return; // Skip on desktop - KeepAlive handles it

  videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isHeroVisible.value = entry.isIntersecting;
        if (entry.isIntersecting && !userPausedVideo.value) {
          heroVideo.value?.play();
          isVideoPlaying.value = true;
        } else if (!entry.isIntersecting) {
          heroVideo.value?.pause();
          isVideoPlaying.value = false;
        }
      });
    },
    { threshold: 0.1 } // Trigger when 10% visible
  );

  videoObserver.observe(heroSection.value);
});

onBeforeUnmount(() => {
  videoObserver?.disconnect();
});

// Navigation function - uses proper nested routes
function goToSection(sectionOrSubsectionId: string) {
  router.push(getRoutePath(sectionOrSubsectionId));
}
</script>

<template>
  <section id="hero" ref="heroSection" class="hero-section hero-section-with-image-bg">
    <div class="hero-container">
      <!-- Hero Header -->
      <div class="hero-main-card-wrapper">
        <!-- Card with title, description and CTA -->
        <div class="hero-main-card hero-main-card-with-video">
          <!-- Video Background -->
          <video
            ref="heroVideo"
            class="hero-card-video-bg"
            autoplay
            muted
            loop
            playsinline
            :poster="'/wic.png'"
          >
            <source :src="'/seattle.mp4'" type="video/mp4" />
          </video>

          <!-- Video pause/play toggle - bottom right -->
          <button
            class="hero-video-toggle"
            :aria-label="isVideoPlaying ? 'Pause video' : 'Play video'"
            @click="toggleVideo"
          >
            <i
              :class="isVideoPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
              aria-hidden="true"
            ></i>
          </button>

          <!-- Quick Start button - top right -->
          <button class="hero-primer-link hero-primer-link-top-right" @click="openPrimer">
            <i class="fa-solid fa-circle-question" aria-hidden="true"></i>
            Quick Start
          </button>

          <!-- WIC Logo -->
          <img :src="'/wic-logo.png'" alt="World in Conflict" class="hero-wic-logo" />

          <h1 class="hero-title">
            <span class="hero-subtitle text-white block">Multiplayer Reloaded</span>
          </h1>

          <div class="space-y-3 mb-6">
            <p class="hero-desc">
              Experience the critically acclaimed 2007 Cold War RTS masterpiece online again.
            </p>
            <p class="hero-desc-secondary">
              Using the official Massgate server code, WiCGate delivers authentic WiC multiplayer
              with all original features intact on stable dedicated servers!
            </p>
          </div>

          <!-- Primary CTA -->
          <div class="flex justify-center items-center">
            <button class="hero-cta" @click="goToSection('downloads')">
              <i
                class="fa-solid fa-download text-sm xs:text-base md:text-lg lg:text-xl"
                aria-hidden="true"
              ></i>
              <span>DOWNLOAD NOW</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Streamlined Widget Cards -->
      <div class="hero-widget-grid">
        <DynamicInfoCard
          :data="combinedData"
          :player-count="store.playerCount"
          :loading="combinedLoading"
          :is-s-s-r="isSSR"
          @navigate="goToSection"
        />

        <MediaEventCard
          :videos="videosSorted"
          :is-s-s-r="isSSR"
          :loading="combinedLoading || eventsLoading"
          @navigate="goToSection"
        />
      </div>
    </div>
  </section>
</template>
