<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue';
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
import { getHeaderHeightWithBuffer, scrollToSection as scrollToSectionUtil } from '../utils/scroll';
import { generateOrganizationSchema, generateWebSiteSchema } from '../utils/structuredData';
import { initWebVitals } from '../utils/performance';
import { rafThrottle } from '../utils/rafThrottle';
import { SCROLL_SMOOTH_DURATION, SCROLL_FAST_SETTLE, SCROLL_TOP_DURATION } from '../constants';
import { getAllValidIds, getSectionFromSubsection, isSubsection } from '../types/navigation';

const store = useAppDataStore();
const { data, loading } = store;
const { showFirstVisitOverlay, initFirstVisitCheck, dismissOverlay } = useFirstVisit();
const route = useRoute();
const currentSection = ref<string | undefined>();
// Get all valid IDs including subsections for scroll tracking
const ALL_VALID_IDS = getAllValidIds();
let sectionElements: HTMLElement[] = [];
let scrollListenerAttached = false;

// Fast scroll detection for smooth navigation animations
const isFastScrolling = ref(false);
let lastSectionChangeTime = 0;
let fastScrollTimeout: number | undefined;

// Programmatic scroll detection to prevent listener interference
const isProgrammaticScrolling = ref(false);
let programmaticScrollTimeout: number | undefined;

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

function setCurrentSection(id?: string | null) {
  const normalized = id && id !== 'hero' ? id : undefined;
  if (currentSection.value !== normalized) {
    // Detect fast scrolling (section changes within 150ms)
    const now = Date.now();
    const timeSinceLastChange = now - lastSectionChangeTime;

    if (timeSinceLastChange < 150 && lastSectionChangeTime > 0) {
      // Fast scrolling detected - disable transitions
      isFastScrolling.value = true;

      // Clear any existing timeout
      if (fastScrollTimeout) {
        clearTimeout(fastScrollTimeout);
      }

      // Re-enable transitions after scrolling settles
      fastScrollTimeout = setTimeout(() => {
        isFastScrolling.value = false;
      }, SCROLL_FAST_SETTLE) as unknown as number;
    }

    lastSectionChangeTime = now;
    currentSection.value = normalized;
  }
}

// Dynamic header measurement imported from utils/scroll.ts
// (Removed duplicate code - now using shared utility)

function collectSectionElements() {
  // Collect both main sections and subsections for precise scroll tracking
  sectionElements = ALL_VALID_IDS.map((id) => document.getElementById(id)).filter(
    Boolean
  ) as HTMLElement[];
}

function updateActiveSection() {
  if (!sectionElements.length) return;

  // Skip during programmatic scrolling to prevent flash
  if (isProgrammaticScrolling.value) return;

  const scrollY = window.scrollY || window.pageYOffset;
  // Use buffer for detection tolerance (allows slight scroll past before switching)
  const offset = getHeaderHeightWithBuffer();

  for (const el of sectionElements) {
    const rect = el.getBoundingClientRect();
    const top = rect.top + scrollY;
    const bottom = top + rect.height;

    if (scrollY + offset >= top && scrollY + offset < bottom) {
      setCurrentSection(el.id);
      return;
    }
  }

  // Use responsive offset for hero section threshold too
  if (scrollY < offset - 40) {
    setCurrentSection('hero');
  }
}

// Throttle scroll/resize handlers with RAF for 60fps performance
const throttledUpdateSection = rafThrottle(updateActiveSection);

onMounted(() => {
  // Skip client-side initialization during SSG
  if (isSSR) return;

  // Initialize performance monitoring
  initWebVitals();

  // Initialize store data
  store.init();

  // Determine initial section from route
  const sectionFromRoute = targetSection.value;
  const hash = window.location.hash ? window.location.hash.substring(1) : undefined;

  // Set current section for first visit overlay
  setCurrentSection(sectionFromRoute || hash);

  // Check for first visit and show overlay if needed
  initFirstVisitCheck(!!(hash || sectionFromRoute));

  // Scroll handling moved to router's async scrollBehavior in main.ts
  // This ensures content loads before scrolling, preventing position jumps
  // (No manual scroll on mount - let router handle it after content ready)

  nextTick(() => {
    collectSectionElements();
    if (!scrollListenerAttached) {
      window.addEventListener('scroll', throttledUpdateSection, { passive: true });
      window.addEventListener('resize', throttledUpdateSection);
      scrollListenerAttached = true;
    }
    updateActiveSection();
  });
});

onBeforeUnmount(() => {
  // Remove scroll listeners and cancel pending RAF
  if (scrollListenerAttached) {
    throttledUpdateSection.cancel();
    window.removeEventListener('scroll', throttledUpdateSection);
    window.removeEventListener('resize', throttledUpdateSection);
    scrollListenerAttached = false;
  }

  // Clear all timeouts to prevent memory leaks
  if (fastScrollTimeout !== undefined) {
    clearTimeout(fastScrollTimeout);
    fastScrollTimeout = undefined;
  }
  if (programmaticScrollTimeout !== undefined) {
    clearTimeout(programmaticScrollTimeout);
    programmaticScrollTimeout = undefined;
  }
});

// First visit overlay handlers
function handleGoHome() {
  dismissOverlay();
  // Clear any hash and show home page
  history.replaceState(null, '', window.location.pathname);
  setCurrentSection(undefined);
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleContinue() {
  dismissOverlay();
  const hash = window.location.hash ? window.location.hash.substring(1) : undefined;

  if (hash) {
    setCurrentSection(hash);
    const element = document.getElementById(hash);
    if (element) {
      // Use the shared scroll utility to ensure consistency with active section detection
      scrollToSectionUtil(hash, 'smooth');
    }
  }
}

function handleNavNavigate(sectionOrSubsection?: string) {
  // If it's a subsection, normalize to parent section for navigation state
  // but the actual scrolling will target the subsection ID
  let parentSection = sectionOrSubsection;

  if (sectionOrSubsection && isSubsection(sectionOrSubsection)) {
    parentSection = getSectionFromSubsection(sectionOrSubsection);
  }

  setCurrentSection(parentSection);

  // Set flag for programmatic scroll on every nav click
  // This handles both route changes AND same-route clicks (e.g., click FAQ while already on /faq)
  isProgrammaticScrolling.value = true;

  if (programmaticScrollTimeout) {
    clearTimeout(programmaticScrollTimeout);
  }
  programmaticScrollTimeout = setTimeout(() => {
    isProgrammaticScrolling.value = false;
  }, SCROLL_SMOOTH_DURATION) as unknown as number;
}

// Scroll to section when route changes (wraps utility for nextTick)
function scrollToSection(sectionId: string) {
  // Wait for all sections to render on client-side
  nextTick(() => {
    scrollToSectionUtil(sectionId);
  });
}

// Watch for route changes and scroll to the target section
watch(
  () => route.meta.section,
  (newSection) => {
    if (isSSR) return;

    if (newSection) {
      setCurrentSection(newSection as string);

      // Disable scroll listener during programmatic scroll
      isProgrammaticScrolling.value = true;

      // Scroll to section immediately
      scrollToSection(newSection as string);

      // Re-enable scroll listener after smooth scroll completes
      if (programmaticScrollTimeout) {
        clearTimeout(programmaticScrollTimeout);
      }
      programmaticScrollTimeout = setTimeout(() => {
        isProgrammaticScrolling.value = false;
      }, SCROLL_SMOOTH_DURATION) as unknown as number;
    } else {
      // Homepage - scroll to top
      setCurrentSection(undefined);
      isProgrammaticScrolling.value = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (programmaticScrollTimeout) {
        clearTimeout(programmaticScrollTimeout);
      }
      programmaticScrollTimeout = setTimeout(() => {
        isProgrammaticScrolling.value = false;
      }, SCROLL_TOP_DURATION) as unknown as number;
    }
  }
);

// Watch for hash changes to handle subsection navigation
watch(
  () => route.hash,
  (newHash) => {
    if (isSSR || !newHash) return;

    // Extract ID from hash (remove #)
    const targetId = newHash.substring(1);

    // If it's a subsection, update current section to parent
    if (isSubsection(targetId)) {
      const parentSection = getSectionFromSubsection(targetId);
      setCurrentSection(parentSection);
    } else {
      setCurrentSection(targetId);
    }

    // Disable scroll listener during programmatic scroll
    isProgrammaticScrolling.value = true;

    // Scroll to the target (section or subsection)
    scrollToSection(targetId);

    // Re-enable scroll listener after smooth scroll completes
    if (programmaticScrollTimeout) {
      clearTimeout(programmaticScrollTimeout);
    }
    programmaticScrollTimeout = setTimeout(() => {
      isProgrammaticScrolling.value = false;
    }, SCROLL_SMOOTH_DURATION) as unknown as number;
  }
);
</script>
<template>
  <div id="siteWrapper" class="site-wrapper">
    <header>
      <Navigation
        :active-section="currentSection"
        :is-fast-scrolling="isFastScrolling"
        @navigate="handleNavNavigate"
      />
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
