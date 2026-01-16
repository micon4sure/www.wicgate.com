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
  name: 'faq',
  section: 'faq',
});

// SEO
const meta = PAGE_META['/faq'];
usePageSeo({
  title: meta?.title || 'World in Conflict FAQ and Help | WICGATE',
  description: meta?.description || 'Frequently asked questions about WICGATE.',
  ...(meta?.keywords && { keywords: meta.keywords }),
  section: 'faq',
});

// Store and viewport
const store = useAppDataStore();
const { isMobileMode } = useViewportMode();

// SSR detection
const isSSR = import.meta.server;

// On mobile, render all sections for scroll experience
// On desktop, render only FAQ
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

    <!-- Desktop: render only FAQ -->
    <template v-else>
      <FAQ />
    </template>
  </div>
</template>
