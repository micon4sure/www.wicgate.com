<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAppDataStore } from '../stores/appDataStore';
import { useEvents } from '../composables/useEvents';
import { useYoutube } from '../composables/useYoutube';
import MediaEventCard from './widgets/MediaEventCard.vue';
import DynamicInfoCard from './widgets/DynamicInfoCard.vue';
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
  <section id="hero" class="hero-section">
    <!-- Atmospheric overlays -->
    <div class="hero-overlay-dark"></div>
    <div class="hero-overlay-gradient"></div>
    <div class="hero-overlay-atmospheric"></div>

    <div class="container relative z-10">
      <!-- Hero Header -->
      <div class="text-center mb-16 2xl:mb-16 xl:mb-14 md:mb-12 sm:mb-10">
        <div class="hero-badge">THE WAR CONTINUES</div>

        <h1 class="hero-title">
          World in Conflict<br />
          <span class="hero-subtitle">Multiplayer Reborn</span>
        </h1>

        <div class="max-w-3xl mx-auto space-y-3 mb-6">
          <p class="hero-desc">
            Experience the critically acclaimed 2007 Cold War RTS masterpiece online again.
          </p>
          <p class="hero-desc-secondary">
            Using the <strong class="text-soviet">official Massgate server code</strong>, WiCGate
            delivers authentic WiC multiplayer with all original features intact. Command Soviet or
            Western forces in intense tactical battles across dedicated WiCGate servers.
          </p>
        </div>

        <!-- Primary CTA -->
        <div class="flex justify-center mb-8 sm:mb-6">
          <button class="hero-cta" @click="goToSection('downloads-quick')">
            <i class="fa-solid fa-download text-xl sm:text-lg" aria-hidden="true"></i>
            <span>DOWNLOAD NOW</span>
          </button>
        </div>
      </div>

      <!-- Streamlined Widget Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 md:mb-12 xl:mb-16">
        <MediaEventCard
          :videos="videosSorted"
          :events="events"
          :is-s-s-r="isSSR"
          @navigate="goToSection"
        />

        <DynamicInfoCard
          :data="store.data"
          :player-count="store.playerCount"
          :loading="store.loading"
          :is-s-s-r="isSSR"
          @navigate="goToSection"
        />
      </div>
    </div>
  </section>
</template>
