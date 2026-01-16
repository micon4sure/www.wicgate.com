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
  name: 'community',
  section: 'community',
});

// SEO
const meta = PAGE_META['/community'];
usePageSeo({
  title: meta?.title || 'World in Conflict Community Hub | WICGATE',
  description: meta?.description || 'Stay connected with the World in Conflict community.',
  ...(meta?.keywords && { keywords: meta.keywords }),
  section: 'community',
});

// Store and viewport
const store = useAppDataStore();
const { isMobileMode } = useViewportMode();

// SSR detection
const isSSR = import.meta.server;

// On mobile, render all sections for scroll experience
// On desktop, render only community
const showAllSections = computed(() => !isSSR && isMobileMode.value);
</script>

<template>
  <div id="screens">
    <!-- Mobile: render all sections -->
    <template v-if="showAllSections">
      <WidgetDashboard />
      <Community />
      <Statistics :data="store.data" :loading="store.loading" :clans="store.clans" />
      <Downloads />
      <FAQ />
    </template>

    <!-- Desktop: render only community -->
    <template v-else>
      <Community />
    </template>
  </div>
</template>
