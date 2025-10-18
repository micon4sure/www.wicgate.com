<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import Navigation from '../components/Navigation.vue';
import SiteFooter from '../components/Footer.vue';
import WidgetDashboard from '../components/WidgetDashboard.vue';
import Downloads from '../screens/Downloads.vue';
import Statistics from '../screens/Statistics.vue';
import Community from '../screens/Community.vue';
import FAQ from '../screens/FAQ.vue';
import FirstVisitOverlay from '../components/FirstVisitOverlay.vue';
import EventsSkeleton from '../components/skeletons/EventsSkeleton.vue';
import { useAppDataStore } from '../stores/appDataStore';
import { useFirstVisit } from '../composables/useFirstVisit';
import { useActiveSection } from '../composables/useActiveSection';
import { useEvents } from '../composables/useEvents';
import { generateOrganizationSchema, generateWebSiteSchema } from '../utils/structuredData';
import { initWebVitals } from '../utils/performance';
import { getAllValidIds } from '../types/navigation';
import { syncHeaderHeight } from '../utils/headerHeight';

const store = useAppDataStore();
const { showFirstVisitOverlay, initFirstVisitCheck, dismissOverlay } = useFirstVisit();

// Events integration
const { events, isLoading: eventsLoading, formatDate, getCountdown } = useEvents();

// Get all valid section IDs for scroll tracking
const ALL_VALID_IDS = getAllValidIds();

// Hybrid navigation highlighting: click-based (route) + scroll-based (manual)
const { currentSection, startProgrammaticScroll } = useActiveSection(ALL_VALID_IDS);

const route = useRoute();

// Disable scroll tracking during programmatic navigation (clicks)
watch(
  () => route.meta.section || route.meta.subsection,
  (newSection, oldSection) => {
    // Only trigger on actual navigation (not initial load)
    if (oldSection !== undefined && newSection !== oldSection) {
      startProgrammaticScroll();
    }
  }
);

// SSG conditional rendering
const isSSR = import.meta.env.SSR;
const targetSection = computed(() => route.meta.section as string | undefined);

const matchedMeta = computed(() => {
  const matched = [...route.matched].reverse();
  for (const record of matched) {
    if (record.meta && Object.keys(record.meta).length > 0) {
      return record.meta;
    }
  }
  return route.meta;
});

const defaultTitle = 'WICGATE - World in Conflict Multiplayer Revival';
const defaultDescription = 'Play World in Conflict online with restored multiplayer servers.';
const defaultKeywords = 'world in conflict, wic multiplayer, massgate';
const defaultOgImage = 'https://wicgate.com/og-default.jpg';

const pageTitle = computed(() => (matchedMeta.value.title as string | undefined) || defaultTitle);
const pageDescription = computed(
  () => (matchedMeta.value.description as string | undefined) || defaultDescription
);
const pageKeywords = computed(
  () => (matchedMeta.value.keywords as string | undefined) || defaultKeywords
);
const pageOgImage = computed(
  () => (matchedMeta.value.ogImage as string | undefined) || defaultOgImage
);
const pageRobots = computed(() => matchedMeta.value.robots as string | undefined);

const canonicalUrl = computed(() => {
  const canonicalPath = (matchedMeta.value.canonical as string | undefined) || route.path || '/';
  return `https://wicgate.com${
    canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`
  }`;
});

// Determine which sections to render based on SSR vs CSR
function shouldRenderSection(sectionId: string): boolean {
  // Client-side: always render all sections for smooth long-scroll
  if (!isSSR) return true;

  // Server-side/build-time rendering
  if (!targetSection.value) {
    // Homepage: render all sections
    return true;
  }

  // Specific section page: render only that section for SEO
  return targetSection.value === sectionId;
}

// Dynamic meta tags based on route
useHead({
  title: pageTitle,
  meta: [
    {
      key: 'description',
      name: 'description',
      content: pageDescription,
    },
    {
      key: 'keywords',
      name: 'keywords',
      content: pageKeywords,
    },
    // Robots meta tag (only if specified)
    ...(pageRobots.value
      ? [
          {
            key: 'robots',
            name: 'robots',
            content: pageRobots.value,
          },
        ]
      : []),
    // Open Graph
    {
      key: 'og:title',
      property: 'og:title',
      content: pageTitle,
    },
    {
      key: 'og:description',
      property: 'og:description',
      content: pageDescription,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      key: 'og:url',
      property: 'og:url',
      content: canonicalUrl,
    },
    {
      key: 'og:image',
      property: 'og:image',
      content: pageOgImage,
    },
    // Twitter Card
    {
      key: 'twitter:card',
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      key: 'twitter:title',
      name: 'twitter:title',
      content: pageTitle,
    },
    {
      key: 'twitter:description',
      name: 'twitter:description',
      content: pageDescription,
    },
    {
      key: 'twitter:image',
      name: 'twitter:image',
      content: pageOgImage,
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl,
      key: 'canonical',
    },
  ],
  script: [
    // Organization schema for all pages
    {
      type: 'application/ld+json',
      textContent: JSON.stringify(generateOrganizationSchema()),
    },
    // WebSite schema for homepage only
    ...(!targetSection.value
      ? [
          {
            type: 'application/ld+json',
            textContent: JSON.stringify(generateWebSiteSchema()),
          },
        ]
      : []),
  ],
});

onMounted(() => {
  // Skip client-side initialization during SSG
  if (isSSR) return;

  // Initialize performance monitoring
  initWebVitals();

  // Sync header height with CSS variable for pixel-perfect scroll positioning
  // This measures actual rendered header height and updates --header-height
  const cleanupHeaderSync = syncHeaderHeight();

  // Check for first visit and show overlay if needed
  initFirstVisitCheck();

  // Cleanup on unmount
  onBeforeUnmount(() => {
    // Clean up header height sync
    if (cleanupHeaderSync) cleanupHeaderSync();
  });
});

// First visit overlay handlers
function handleGoHome() {
  dismissOverlay();
  // Browser handles smooth scroll to top via native behavior
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleContinue() {
  dismissOverlay();
  // Browser already scrolled to target section via router scrollBehavior
}
</script>
<template>
  <div id="siteWrapper" class="site-wrapper">
    <header>
      <Navigation :active-section="currentSection" />
    </header>

    <div class="main-content">
      <!-- Widget Dashboard - only rendered on homepage -->
      <WidgetDashboard v-if="shouldRenderSection('hero')" />

      <!-- Events & Live Activity (Main page content) -->
      <div v-if="!targetSection || targetSection === 'hero'" class="container py-12 md:py-16">
        <!-- Events Section -->
        <div id="events" class="mb-16 md:mb-20">
          <div class="text-center mb-10">
            <h2
              class="text-4xl md:text-5xl font-military font-bold text-t uppercase tracking-wider mb-4"
            >
              Upcoming Events
            </h2>
            <p class="text-base md:text-lg text-t-secondary font-body max-w-2xl mx-auto">
              Tournaments, community nights, and special operations
            </p>
          </div>

          <EventsSkeleton v-if="isSSR || eventsLoading" />
          <div
            v-else-if="events.length"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <component
              :is="e.link ? 'a' : 'div'"
              v-for="e in events"
              :key="e.id"
              :href="e.link"
              target="_blank"
              class="bg-gradient-to-br from-panel/95 to-panel-dark/98 border-2 border-teal/30 rounded-none overflow-hidden transition-all duration-300 hover:border-teal/75 hover:shadow-[0_0_30px_rgba(0,217,255,0.32)] hover:-translate-y-0.5 active:scale-[0.98] no-underline text-inherit flex flex-col"
            >
              <div
                v-if="e.coverUrl"
                class="relative h-56 bg-cover bg-center bg-graphite-dark flex items-start justify-end p-3 border-b border-teal/20"
                :style="{ backgroundImage: 'url(' + e.coverUrl + ')' }"
              >
                <div class="absolute inset-0 bg-gradient-to-br from-black/10 to-black/40"></div>
                <div
                  class="relative z-10 px-4 py-1.5 rounded-none text-xs font-bold tracking-wider uppercase font-military border"
                  :class="
                    new Date(e.start).getTime() <= Date.now()
                      ? 'bg-youtube text-white border-youtube-bright shadow-[0_0_20px_rgba(229,57,53,0.6)] animate-pulse'
                      : 'bg-graphite-light/90 text-t border-teal/50'
                  "
                >
                  {{
                    new Date(e.start).getTime() <= Date.now() ? 'LIVE NOW' : getCountdown(e.start)
                  }}
                </div>
              </div>
              <div class="flex-1 flex flex-col gap-2 p-4">
                <div
                  v-if="!e.coverUrl"
                  class="self-start px-4 py-1.5 rounded-none text-xs font-bold tracking-wider uppercase font-military border mb-2"
                  :class="
                    new Date(e.start).getTime() <= Date.now()
                      ? 'bg-youtube text-white border-youtube-bright shadow-[0_0_20px_rgba(229,57,53,0.6)] animate-pulse'
                      : 'bg-graphite-light/90 text-t border-teal/50'
                  "
                >
                  {{
                    new Date(e.start).getTime() <= Date.now() ? 'LIVE NOW' : getCountdown(e.start)
                  }}
                </div>
                <h4
                  class="m-0 text-lg md:text-xl font-military font-medium text-t uppercase tracking-wide leading-snug"
                >
                  {{ e.name }}
                </h4>
                <p
                  class="m-0 text-sm md:text-base text-t-secondary font-body leading-relaxed flex-1"
                >
                  {{ e.description }}
                </p>
                <div class="flex justify-between items-center mt-3 pt-3 border-t border-teal/10">
                  <span class="text-xs text-t3 flex items-center gap-2 font-body">
                    <i class="fa-regular fa-calendar" aria-hidden="true"></i>
                    {{ formatDate(e.start) }}
                  </span>
                  <span v-if="e.link" class="text-massgate-orange text-xs">
                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
            </component>
          </div>
          <div
            v-else-if="!eventsLoading"
            class="text-center py-10 text-t3 border border-teal/10 bg-gradient-to-b from-graphite-light/85 to-graphite-dark/90 rounded-none"
          >
            <i
              class="fa-regular fa-calendar-xmark text-4xl mb-4 text-teal/70 opacity-85"
              aria-hidden="true"
            ></i>
            <p class="m-0 text-base font-body">No events scheduled at the moment</p>
          </div>
        </div>
      </div>

      <div id="screens">
        <Downloads v-if="shouldRenderSection('downloads')" />
        <Statistics
          v-if="shouldRenderSection('statistics')"
          :data="store.data"
          :loading="store.loading"
        />
        <Community v-if="shouldRenderSection('community')" />
        <FAQ v-if="shouldRenderSection('faq')" />
      </div>
      <SiteFooter />
    </div>
  </div>

  <!-- First Visit Overlay -->
  <FirstVisitOverlay
    v-if="showFirstVisitOverlay"
    :current-section="currentSection"
    @go-home="handleGoHome"
    @continue="handleContinue"
    @close="dismissOverlay"
  />
</template>
