<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAppDataStore } from '../stores/appDataStore';
import { useEvents } from '../composables/useEvents';
import { useYoutube } from '../composables/useYoutube';
import { useFirstVisit } from '../composables/useFirstVisit';
import MediaEventCard from './widgets/MediaEventCard.vue';
import DynamicInfoCard from './widgets/DynamicInfoCard.vue';
import { getRoutePath } from '../types/navigation';

const router = useRouter();
const store = useAppDataStore();
const { openPrimer } = useFirstVisit();

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
  <section id="hero" class="hero-section hero-section-with-image-bg">
    <!-- Atmospheric overlays -->
    <div class="hero-overlay-dark"></div>
    <div class="hero-overlay-gradient"></div>
    <div class="hero-overlay-atmospheric"></div>

    <div class="hero-container">
      <!-- Hero Header -->
      <div class="hero-main-card-wrapper">
        <!-- Card with title, description and CTA -->
        <div class="hero-main-card hero-main-card-with-video">
          <!-- Video Background -->
          <video class="hero-card-video-bg" autoplay muted loop playsinline poster="/wic.png">
            <source src="/seattle.mp4" type="video/mp4" />
          </video>

          <!-- Quick Start button - top right -->
          <button class="hero-primer-link hero-primer-link-top-right" @click="openPrimer">
            <i class="fa-solid fa-circle-question" aria-hidden="true"></i>
            Quick Start
          </button>

          <!-- WIC Logo -->
          <img src="/wic-logo.png" alt="World in Conflict" class="hero-wic-logo" />

          <h1 class="hero-title">
            <span class="hero-subtitle text-soviet block">Multiplayer Reloaded</span>
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
            <button class="hero-cta" @click="goToSection('downloads-quick')">
              <i class="fa-solid fa-download text-xl sm:text-lg" aria-hidden="true"></i>
              <span>DOWNLOAD NOW</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Streamlined Widget Cards -->
      <div class="hero-widget-grid">
        <DynamicInfoCard
          :data="store.data"
          :player-count="store.playerCount"
          :loading="store.loading"
          :is-s-s-r="isSSR"
          @navigate="goToSection"
        />

        <MediaEventCard
          :videos="videosSorted"
          :events="events"
          :is-s-s-r="isSSR"
          @navigate="goToSection"
        />
      </div>
    </div>
  </section>
</template>
