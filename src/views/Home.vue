<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';
import Navigation from '../components/Navigation.vue';
import SiteFooter from '../components/Footer.vue';
import WidgetDashboard from '../components/WidgetDashboard.vue';
import GettingStarted from '../screens/GettingStarted.vue';
import Multiplayer from '../screens/Multiplayer.vue';
import Community from '../screens/Community.vue';
import About from '../screens/About.vue';
import FAQ from '../screens/FAQ.vue';
import FirstVisitOverlay from '../components/FirstVisitOverlay.vue';
import { useAppDataStore } from '../stores/appDataStore';
import { useFirstVisit } from '../composables/useFirstVisit';
import { useScrollTracker } from '../composables/useScrollTracker';
import { generateOrganizationSchema, generateWebSiteSchema } from '../utils/structuredData';
import { initWebVitals } from '../utils/performance';
import { getAllValidIds } from '../types/navigation';
import { syncHeaderHeight } from '../utils/headerHeight';

const store = useAppDataStore();
const { data, loading } = store;
const { showFirstVisitOverlay, initFirstVisitCheck, dismissOverlay } = useFirstVisit();

// Simple scroll tracker for navigation highlighting
const { currentSection, observe, disconnect } = useScrollTracker();

const route = useRoute();
// Get all valid IDs including subsections for scroll tracking
const ALL_VALID_IDS = getAllValidIds();

// SSG conditional rendering
const isSSR = import.meta.env.SSR;
const targetSection = computed(() => route.meta.section as string | undefined);

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
  title: () => (route.meta.title as string) || 'WICGATE - World in Conflict Multiplayer Revival',
  meta: [
    {
      name: 'description',
      content: () =>
        (route.meta.description as string) ||
        'Play World in Conflict online with restored multiplayer servers.',
    },
    {
      name: 'keywords',
      content: () =>
        (route.meta.keywords as string) || 'world in conflict, wic multiplayer, massgate',
    },
    // Open Graph
    {
      property: 'og:title',
      content: () => (route.meta.title as string) || 'WICGATE',
    },
    {
      property: 'og:description',
      content: () =>
        (route.meta.description as string) ||
        'Play World in Conflict online with restored multiplayer servers.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: () => `https://wicgate.com${route.path}`,
    },
    {
      property: 'og:image',
      content: () => (route.meta.ogImage as string) || 'https://wicgate.com/og-default.jpg',
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: () => (route.meta.title as string) || 'WICGATE',
    },
    {
      name: 'twitter:description',
      content: () =>
        (route.meta.description as string) ||
        'Play World in Conflict online with restored multiplayer servers.',
    },
    {
      name: 'twitter:image',
      content: () => (route.meta.ogImage as string) || 'https://wicgate.com/og-default.jpg',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: () => `https://wicgate.com${route.path}`,
    },
  ],
  script: [
    // Organization schema for all pages
    {
      type: 'application/ld+json',
      children: JSON.stringify(generateOrganizationSchema()),
    },
    // WebSite schema for homepage only
    ...(!targetSection.value
      ? [
          {
            type: 'application/ld+json',
            children: JSON.stringify(generateWebSiteSchema()),
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

  // Initialize store data
  store.init();

  // Sync header height with CSS variable for pixel-perfect scroll positioning
  // This measures actual rendered header height and updates --header-height
  const cleanupHeaderSync = syncHeaderHeight();

  // Check for first visit and show overlay if needed
  const hasSection = !!(route.meta.subsection || route.meta.section);
  initFirstVisitCheck(hasSection);

  // Start observing sections for navigation highlighting
  // Browser handles scrolling via router scrollBehavior + CSS
  observe(ALL_VALID_IDS);

  // Cleanup on unmount
  onBeforeUnmount(() => {
    // Disconnect IntersectionObserver
    disconnect();

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
        <GettingStarted v-if="shouldRenderSection('getting-started')" />
        <Multiplayer v-if="shouldRenderSection('multiplayer')" :data="data" :loading="loading" />
        <Community v-if="shouldRenderSection('community')" />
        <About v-if="shouldRenderSection('about')" />
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
<style lang="scss">
// Section stacking with military-themed subtle variations
#screens {
  > * {
    padding: 48px 0;
    border-top: 2px solid rgba(var(--mg-rgb), 0.1);

    // Even-indexed screens: subtle orange military tint
    &:nth-child(even) {
      background: linear-gradient(
        180deg,
        rgba(var(--mg-rgb), 0.02) 0%,
        rgba(15, 15, 15, 0.95) 100%
      );
    }

    // Odd-indexed screens: subtle accent tint
    &:nth-child(odd) {
      background: linear-gradient(
        180deg,
        rgba(var(--sw-rgb), 0.06) 0%,
        rgba(10, 16, 21, 0.96) 100%
      );
    }
  }
}

// Military typography for hero content
.military-title {
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--t);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
