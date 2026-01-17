<script setup lang="ts">
import { computed, onMounted } from 'vue';
import WidgetDashboard from '~/components/WidgetDashboard.vue';
import Downloads from '~/screens/Downloads.vue';
import Statistics from '~/screens/Statistics.vue';
import Community from '~/screens/Community.vue';
import FAQ from '~/screens/FAQ.vue';
import { useStatisticsData } from '~/composables/useStatisticsData';
import { useEventsData } from '~/composables/useEventsData';
import { useVideosData } from '~/composables/useVideosData';
import { useCalendarStore } from '~/stores/calendarStore';
import { useYoutubeStore } from '~/stores/youtubeStore';
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

// Server-side data fetching with ISR caching
// Note: composables return useFetch/useAsyncData directly, no await needed
const { statisticsData, clansData, loading: statsLoading } = useStatisticsData();
const { events } = useEventsData();
const { videos } = useVideosData();

// Hydrate stores with server data (client-side only)
const calendarStore = useCalendarStore();
const youtubeStore = useYoutubeStore();

onMounted(() => {
  // Hydrate calendar store with server-provided events
  if (events.value && events.value.length > 0) {
    calendarStore.initWithData(events.value);
  } else {
    // Fallback: fetch if no server data
    calendarStore.fetchEvents();
  }

  // Hydrate youtube store with server-provided videos
  if (videos.value && Object.keys(videos.value).length > 0) {
    youtubeStore.initWithData(videos.value);
  } else {
    // Fallback: fetch if no server data
    youtubeStore.fetchVideos();
  }
});

// Viewport mode
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
    <WidgetDashboard :ladder="statisticsData?.ladder ?? []" :stats-loading="statsLoading" />

    <!-- Mobile: render all sections for scroll navigation -->
    <template v-if="showAllSections">
      <Community />
      <Statistics :data="statisticsData" :loading="statsLoading" :clans="clansData" />
      <Downloads />
      <FAQ />
    </template>
  </div>
</template>
