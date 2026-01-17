<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, watch, nextTick } from 'vue';
import Navigation from '~/components/Navigation.vue';
import SiteFooter from '~/components/Footer.vue';
import FirstVisitOverlay from '~/components/FirstVisitOverlay.vue';
import { useFirstVisit } from '~/composables/useFirstVisit';
import { useActiveSection } from '~/composables/useActiveSection';
import { useViewportMode } from '~/composables/useViewportMode';
import { useScrollToElement } from '~/composables/useScrollToElement';
import { getAllValidIds } from '~/types/navigation';
import { syncHeaderHeight } from '~/utils/headerHeight';

const route = useRoute();
const { showFirstVisitOverlay, initFirstVisitCheck, dismissOverlay } = useFirstVisit();
const { isMobileMode } = useViewportMode();

// Get all valid section IDs for scroll tracking
const ALL_VALID_IDS = getAllValidIds();

// Hybrid navigation highlighting: click-based (route) + scroll-based (manual)
const { currentSection, startProgrammaticScroll } = useActiveSection(ALL_VALID_IDS);
const { scrollToElement } = useScrollToElement();

// SSG conditional rendering
const isSSR = import.meta.server;
const targetSection = computed(() => route.meta.section as string | undefined);

// Disable scroll tracking during programmatic navigation (clicks)
watch(
  () => route.meta.section,
  (newSection, oldSection) => {
    // Only trigger on actual navigation (not initial load)
    if (oldSection !== undefined && newSection !== oldSection) {
      startProgrammaticScroll();
    }
  }
);

// Helper to scroll to a section element
function scrollToSection(sectionId: string) {
  scrollToElement(sectionId, {
    extraPadding: false, // Sections don't need extra padding, just content offset
    behavior: 'smooth',
  });
}

// When switching to mobile mode while on a section route, scroll to that section
watch(isMobileMode, (nowMobile) => {
  if (nowMobile && targetSection.value) {
    // Wait for all sections to render, then scroll to current section
    nextTick(() => {
      scrollToSection(targetSection.value as string);
    });
  }
});

let cleanupHeaderSync: (() => void) | null = null;

onMounted(() => {
  // Skip client-side initialization during SSG
  if (isSSR) return;

  // Sync header height with CSS variable for pixel-perfect scroll positioning
  const cleanup = syncHeaderHeight();
  if (cleanup) {
    cleanupHeaderSync = cleanup;
  }

  // Check for first visit and show overlay if needed
  initFirstVisitCheck();
});

onBeforeUnmount(() => {
  // Clean up header height sync
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
      <slot />
      <div class="footer-spacer"></div>
      <SiteFooter />
    </div>
  </div>

  <!-- First Visit Overlay -->
  <ClientOnly>
    <FirstVisitOverlay
      v-if="showFirstVisitOverlay"
      :current-section="currentSection"
      @go-home="handleGoHome"
      @continue="handleContinue"
      @close="dismissOverlay"
    />
  </ClientOnly>
</template>
