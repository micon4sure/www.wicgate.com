<script setup lang="ts">
import { computed } from 'vue';
import WidgetDashboard from '~/components/WidgetDashboard.vue';
import Downloads from '~/screens/Downloads.vue';
import Statistics from '~/screens/Statistics.vue';
import Community from '~/screens/Community.vue';
import FAQ from '~/screens/FAQ.vue';
import { useAppDataStore } from '~/stores/appDataStore';
import { useViewportMode } from '~/composables/useViewportMode';
import { usePageSeo } from '~/composables/usePageSeo';
import { PAGE_META } from '~/content/pageMeta';

// Page meta for route
definePageMeta({
  name: 'home',
});

// SEO
const meta = PAGE_META['/'];
usePageSeo({
  title: meta?.title || 'WICGATE | World in Conflict Online Multiplayer Reloaded',
  description:
    meta?.description || 'Play World in Conflict online with restored multiplayer servers.',
  ...(meta?.keywords && { keywords: meta.keywords }),
  includeWebsiteSchema: true,
  includeVideoGameSchema: true,
});

// Store and viewport
const store = useAppDataStore();
const { isMobileMode } = useViewportMode();

// SSR detection
const isSSR = import.meta.server;

// On mobile, render all sections for scroll experience
// On desktop SSR/CSR, render only hero
const showAllSections = computed(() => !isSSR && isMobileMode.value);
</script>

<template>
  <div id="screens">
    <!-- Hero section always renders -->
    <WidgetDashboard />

    <!-- Mobile: render all sections for scroll navigation -->
    <template v-if="showAllSections">
      <Community />
      <Statistics :data="store.data" :loading="store.loading" :clans="store.clans" />
      <Downloads />
      <FAQ />
    </template>
  </div>
</template>
