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
import type { HowToStep } from '~/utils/structuredData';

// Page meta for route
definePageMeta({
  name: 'downloads',
  section: 'downloads',
});

// HowTo steps for structured data
const downloadHowToSteps: HowToStep[] = [
  {
    name: 'Download WIC LIVE Installer',
    text: 'Download the WIC LIVE installer from the official GitHub releases page. This installer handles all setup automatically.',
    url: 'https://github.com/wic-live/launcher/releases/latest',
  },
  {
    name: 'Run the Installer',
    text: 'Run the downloaded installer. WIC LIVE will update your game for WICGATE servers, install community maps, and add quality of life fixes for modern systems.',
  },
  {
    name: 'Launch the Game',
    text: 'After installation, launch World in Conflict and navigate to Multiplayer. You will see WICGATE servers in the server browser.',
  },
  {
    name: 'Join a Server',
    text: 'Select a server from the list and click Join. Create your account when prompted and start playing!',
  },
];

// SEO
const meta = PAGE_META['/downloads'];
usePageSeo({
  title: meta?.title || 'World in Conflict Downloads and Installation | WICGATE',
  description: meta?.description || 'Download and install World in Conflict multiplayer.',
  ...(meta?.keywords && { keywords: meta.keywords }),
  section: 'downloads',
  includeSoftwareSchema: true,
  includeHowToSchema: true,
  howToSteps: downloadHowToSteps,
  howToTitle: 'How to Install World in Conflict Multiplayer',
  howToDescription:
    'Step-by-step guide to install World in Conflict multiplayer and connect to WICGATE servers using WIC LIVE.',
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
// On desktop, render only downloads
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

    <!-- Desktop: render only downloads -->
    <template v-else>
      <Downloads />
    </template>
  </div>
</template>
