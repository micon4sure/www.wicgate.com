<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAppDataStore } from '../stores/appDataStore';
import { useEvents } from '../composables/useEvents';
import { useYoutube } from '../composables/useYoutube';
import QuickStartWidget from './widgets/QuickStartWidget.vue';
import LiveServersWidget from './widgets/LiveServersWidget.vue';
import CommunityWidget from './widgets/CommunityWidget.vue';
import TopPlayersWidget from './widgets/TopPlayersWidget.vue';
import LatestVideosWidget from './widgets/LatestVideosWidget.vue';
import GettingHelpWidget from './widgets/GettingHelpWidget.vue';
import { getRoutePath } from '../types/navigation';

const router = useRouter();
const store = useAppDataStore();

const { events } = useEvents();
const { videosSorted } = useYoutube();

// SSR detection
const isSSR = import.meta.env.SSR;

// Navigation function - uses proper nested routes
function goToSection(sectionOrSubsectionId: string) {
  router.push(getRoutePath(sectionOrSubsectionId));
}
</script>

<template>
  <section
    id="hero"
    class="relative min-h-[100vh] pt-[var(--header-height)] pb-24 overflow-hidden md:pb-20 sm:pb-12 sm:min-h-[85vh]"
  >
    <!-- Video Background (Client-side only, hidden on mobile for performance) -->
    <video
      v-if="!isSSR"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      class="absolute inset-0 w-full h-full object-cover hidden md:block"
    >
      <source src="/hero-background.mp4" type="video/mp4" />
    </video>

    <!-- Light overlay for text readability (even lighter to show video) -->
    <div class="absolute inset-0 bg-black/10 md:bg-black/8"></div>

    <!-- Subtle Atmospheric Gradients (further reduced opacity) -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-texture-dark/20 via-transparent to-graphite/50"
    ></div>
    <div
      class="absolute inset-0 bg-gradient-to-br from-massgate-red-dark/5 via-transparent to-soviet/3"
    ></div>

    <!-- Subtle animated glow effects -->
    <div
      class="absolute top-0 left-1/4 w-96 h-96 bg-massgate-red/5 rounded-full blur-[120px] animate-pulse-slow"
    ></div>
    <div
      class="absolute bottom-0 right-1/4 w-96 h-96 bg-soviet/5 rounded-full blur-[120px] animate-pulse-slow"
      style="animation-delay: 1s"
    ></div>

    <div class="container relative z-10">
      <!-- Hero Header -->
      <div class="text-center mb-16 2xl:mb-16 xl:mb-14 md:mb-12 sm:mb-10">
        <div
          class="inline-block py-1.5 px-4 bg-gradient-to-b from-mg/40 to-mg-dark/60 border border-soviet/40 text-soviet font-military text-xs font-bold tracking-widest uppercase mb-5 shadow-soviet-glow/30 sm:py-[5px] sm:px-3 sm:text-[11px] sm:mb-4"
        >
          THE WAR CONTINUES
        </div>

        <h1
          class="text-6xl leading-tight mb-4 font-military font-bold text-t uppercase tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] 2xl:text-6xl xl:text-5xl md:text-[2.5rem] sm:text-3xl"
        >
          World in Conflict<br />
          <span
            class="inline text-2xl text-massgate-red-bright font-bold bg-clip-text bg-gradient-to-r from-massgate-red-bright to-soviet drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] 2xl:text-2xl xl:text-xl md:text-xl sm:text-lg"
          >
            Multiplayer Reborn
          </span>
        </h1>

        <div class="max-w-3xl mx-auto space-y-3 mb-6">
          <p
            class="text-lg text-t leading-relaxed font-body font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] 2xl:text-lg xl:text-base md:text-base sm:text-sm"
          >
            Experience the critically acclaimed 2007 Cold War RTS masterpiece online again.
          </p>
          <p
            class="text-base text-t-secondary leading-relaxed font-body drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] 2xl:text-base xl:text-[0.9375rem] md:text-[0.875rem] sm:text-[0.8125rem]"
          >
            Using the <strong class="text-soviet">official Massgate server code</strong>, WiCGate
            delivers authentic WiC multiplayer with all original features intact. Command Soviet or
            Western forces in intense tactical battles across dedicated WiCGate servers.
          </p>
        </div>

        <!-- Key features badges -->
        <div class="flex flex-wrap items-center justify-center gap-3 mb-6 sm:gap-2 sm:mb-5">
          <div
            class="inline-flex items-center gap-2 py-2 px-4 bg-black/50 border border-t-dim/30 text-t text-sm font-body font-semibold backdrop-blur-md shadow-lg sm:py-1.5 sm:px-3 sm:text-xs"
          >
            <i class="fa-solid fa-server text-online" aria-hidden="true"></i>
            <span>Official Servers</span>
          </div>
          <div
            class="inline-flex items-center gap-2 py-2 px-4 bg-black/50 border border-t-dim/30 text-t text-sm font-body font-semibold backdrop-blur-md shadow-lg sm:py-1.5 sm:px-3 sm:text-xs"
          >
            <i class="fa-solid fa-users text-soviet" aria-hidden="true"></i>
            <span>Active Community</span>
          </div>
          <div
            class="inline-flex items-center gap-2 py-2 px-4 bg-black/50 border border-t-dim/30 text-t text-sm font-body font-semibold backdrop-blur-md shadow-lg sm:py-1.5 sm:px-3 sm:text-xs"
          >
            <i class="fa-solid fa-download text-massgate-gold" aria-hidden="true"></i>
            <span>Free to Play</span>
          </div>
        </div>

        <!-- Primary CTA -->
        <div class="flex justify-center mb-8 sm:mb-6">
          <button
            class="btn-red inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-black no-underline animate-red-pulse shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-300 sm:px-6 sm:py-3 sm:text-base"
            @click="goToSection('downloads-quick')"
          >
            <i class="fa-solid fa-download text-xl sm:text-lg" aria-hidden="true"></i>
            <span>DOWNLOAD NOW</span>
          </button>
        </div>
      </div>

      <!-- Widget Grid -->
      <div
        class="grid grid-cols-1 gap-4 mb-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 sm:gap-4 md:gap-5 xl:gap-6 md:mb-12 xl:mb-16"
      >
        <QuickStartWidget @navigate="goToSection" />

        <LiveServersWidget
          :data="store.data"
          :player-count="store.playerCount"
          :loading="store.loading"
          :is-s-s-r="isSSR"
          @navigate="goToSection"
        />

        <CommunityWidget :events="events" @navigate="goToSection" />

        <TopPlayersWidget
          :ladder="store.data.ladder || []"
          :loading="store.loading"
          :is-s-s-r="isSSR"
          @navigate="goToSection"
        />

        <LatestVideosWidget :videos="videosSorted" :is-s-s-r="isSSR" @navigate="goToSection" />

        <GettingHelpWidget @navigate="goToSection" />
      </div>
    </div>
  </section>
</template>
