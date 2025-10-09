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
const { playerCount, loading: storeLoading, data } = store;

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
  <section id="hero" class="widget-hero">
    <div class="container">
      <!-- Hero Header -->
      <div class="widget-hero-header">
        <div class="hero-tag">THE WAR CONTINUES</div>
        <h1 class="military-title">
          World in Conflict<br /><span class="hero-subtitle">is Live Again</span>
        </h1>
        <p class="hero-description">
          Join our community in epic Cold War battles. Fully restored multiplayer servers with the
          real Massgate code.
        </p>
      </div>

      <!-- Widget Grid -->
      <div class="widget-grid">
        <QuickStartWidget @navigate="goToSection" />

        <LiveServersWidget
          :data="data"
          :player-count="playerCount"
          :loading="storeLoading"
          :is-s-s-r="isSSR"
          @navigate="goToSection"
        />

        <CommunityWidget :events="events" @navigate="goToSection" />

        <TopPlayersWidget
          :ladder="data.ladder || []"
          :loading="storeLoading"
          :is-s-s-r="isSSR"
          @navigate="goToSection"
        />

        <LatestVideosWidget :videos="videosSorted" :is-s-s-r="isSSR" @navigate="goToSection" />

        <GettingHelpWidget @navigate="goToSection" />
      </div>
    </div>
  </section>
</template>
