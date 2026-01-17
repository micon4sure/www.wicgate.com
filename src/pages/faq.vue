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
    calendarStore.fetchEvents();
  }

  // Hydrate youtube store with server-provided videos
  if (videos.value && Object.keys(videos.value).length > 0) {
    youtubeStore.initWithData(videos.value);
  } else {
    youtubeStore.fetchVideos();
  }
});

// Viewport mode
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
      <WidgetDashboard :ladder="statisticsData?.ladder ?? []" :stats-loading="statsLoading" />
      <Community />
      <Statistics :data="statisticsData" :loading="statsLoading" :clans="clansData" />
      <Downloads />
      <FAQ />
    </template>

    <!-- Desktop: render only FAQ -->
    <template v-else>
      <FAQ />
    </template>
  </div>
</template>
