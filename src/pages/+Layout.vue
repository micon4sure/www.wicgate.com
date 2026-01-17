<script setup lang="ts">
// Global styles
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../assets/styles/tailwind.css';

import { computed, onMounted, onBeforeUnmount, watch, ref } from 'vue';
import { usePageContext } from 'vike-vue/usePageContext';
import { useHead } from '@unhead/vue';

// Load Google Fonts via head management (Vike doesn't use index.html the same way)
useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Oswald:wght@200;300;400;500;600;700&family=Roboto+Mono:wght@400;500;600;700&display=swap',
    },
  ],
});
import Navigation from '../components/Navigation.vue';
import SiteFooter from '../components/Footer.vue';
import FirstVisitOverlay from '../components/FirstVisitOverlay.vue';
import { useFirstVisit } from '../composables/useFirstVisit';
import { useActiveSection } from '../composables/useActiveSection';
import { useViewportMode } from '../composables/useViewportMode';
import { getAllValidIds } from '../types/navigation';
import { syncHeaderHeight } from '../utils/headerHeight';
import { DEFAULT_CONTENT_OFFSET } from '../constants';

const pageContext = usePageContext();
const { showFirstVisitOverlay, initFirstVisitCheck, dismissOverlay } = useFirstVisit();
const { isMobileMode } = useViewportMode();

// Get all valid section IDs for scroll tracking
const ALL_VALID_IDS = getAllValidIds();

// Hybrid navigation highlighting: click-based (route) + scroll-based (manual)
const { currentSection, startProgrammaticScroll } = useActiveSection(ALL_VALID_IDS);

// SSG conditional rendering
const isSSR = import.meta.env.SSR;

// Get the current section from URL path
const targetSection = computed(() => {
  const path = pageContext.urlPathname;
  if (path === '/') return undefined;
  // Remove leading slash
  return path.slice(1).split('/')[0];
});

// Track programmatic scrolls
const lastTargetSection = ref<string | undefined>(undefined);

watch(
  targetSection,
  (newSection, oldSection) => {
    // Only trigger on actual navigation (not initial load)
    if (oldSection !== undefined && newSection !== oldSection) {
      startProgrammaticScroll();
    }
    lastTargetSection.value = newSection;
  },
  { immediate: true }
);

// Helper to scroll to a section element
function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const contentOffset =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--content-offset').trim()
    ) || DEFAULT_CONTENT_OFFSET;

  const top = element.getBoundingClientRect().top + window.scrollY - contentOffset;
  window.scrollTo({ top, behavior: 'smooth' });
}

// When switching to mobile mode while on a section route, scroll to that section
watch(isMobileMode, (nowMobile) => {
  if (nowMobile && targetSection.value) {
    scrollToSection(targetSection.value);
  }
});

let cleanupHeaderSync: (() => void) | null | undefined;

onMounted(() => {
  if (isSSR) return;

  // Sync header height with CSS variable for pixel-perfect scroll positioning
  const cleanup = syncHeaderHeight();
  cleanupHeaderSync = cleanup || null;

  // Check for first visit and show overlay if needed
  initFirstVisitCheck();
});

onBeforeUnmount(() => {
  if (cleanupHeaderSync) cleanupHeaderSync();
});

// First visit overlay handlers
function handleGoHome() {
  dismissOverlay();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleContinue() {
  dismissOverlay();
}
</script>
<template>
  <div id="siteWrapper" class="site-wrapper">
    <header>
      <Navigation :active-section="currentSection" />
    </header>

    <div class="main-content">
      <div id="screens">
        <slot />
      </div>
      <div class="h-[80px]"></div>
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
