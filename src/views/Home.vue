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
import { useAppDataStore } from '../stores/appDataStore';
import { useFirstVisit } from '../composables/useFirstVisit';
import { useActiveSection } from '../composables/useActiveSection';
import { generateOrganizationSchema, generateWebSiteSchema } from '../utils/structuredData';
import { initWebVitals } from '../utils/performance';
import { getAllValidIds } from '../types/navigation';
import { syncHeaderHeight } from '../utils/headerHeight';

const store = useAppDataStore();
const { showFirstVisitOverlay, initFirstVisitCheck, dismissOverlay } = useFirstVisit();

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
