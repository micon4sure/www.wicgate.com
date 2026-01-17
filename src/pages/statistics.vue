<script setup lang="ts">
import { computed } from 'vue';
import WidgetDashboard from '~/components/WidgetDashboard.vue';
import Downloads from '~/screens/Downloads.vue';
import Statistics from '~/screens/Statistics.vue';
import Community from '~/screens/Community.vue';
import FAQ from '~/screens/FAQ.vue';
import { useStatisticsData } from '~/composables/useStatisticsData';
import { useViewportMode } from '~/composables/useViewportMode';
import { usePageSeo } from '~/composables/usePageSeo';
import { PAGE_META } from '~/content/pageMeta';

// Page meta for route
definePageMeta({
  name: 'statistics',
  section: 'statistics',
});

// SEO
const meta = PAGE_META['/statistics'];
usePageSeo({
  title: meta?.title || 'World in Conflict Leaderboards and Statistics | WICGATE',
  description:
    meta?.description || 'View World in Conflict player rankings and competitive leaderboards.',
  ...(meta?.keywords && { keywords: meta.keywords }),
  section: 'statistics',
});

// Server-side data fetching with ISR caching
// Note: composable returns useAsyncData directly, no await needed
const { statisticsData, clansData, loading } = useStatisticsData();

// Viewport mode
const { isMobileMode } = useViewportMode();

// SSR detection
const isSSR = import.meta.server;

// On mobile, render all sections for scroll experience
// On desktop, render only statistics
const showAllSections = computed(() => !isSSR && isMobileMode.value);
</script>

<template>
  <div id="screens">
    <!-- Mobile: render all sections -->
    <template v-if="showAllSections">
      <WidgetDashboard :ladder="statisticsData?.ladder ?? []" :stats-loading="loading" />
      <Community />
      <Statistics :data="statisticsData" :loading="loading" :clans="clansData" />
      <Downloads />
      <FAQ />
    </template>

    <!-- Desktop: render only statistics -->
    <template v-else>
      <Statistics :data="statisticsData" :loading="loading" :clans="clansData" />
    </template>
  </div>
</template>
