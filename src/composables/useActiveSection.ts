/**
 * Active section tracking for navigation highlighting
 * Combines route-based (for clicks) and scroll-based (for manual scroll) tracking
 */

import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useViewportMode } from './useViewportMode';

export function useActiveSection(sectionIds: string[] = []) {
  const route = useRoute();
  const { isDesktopMode } = useViewportMode();
  const scrollBasedSection = ref<string | undefined>();
  const isProgrammaticScroll = ref(false);
  const isHydrating = ref(true); // Track SSR → CSR hydration state
  let programmaticScrollTimeout: number | undefined;
  let scrollTimeout: number | undefined;
  let hydrationTimeout: number | undefined;

  // Cached content offset - updated on mount and resize only (not on scroll)
  // Avoids getComputedStyle() reflow during scroll for better performance
  let cachedContentOffset = 48;

  /**
   * Update cached content offset from CSS variable
   * Called on mount and resize, NOT on scroll (performance optimization)
   */
  function updateContentOffset() {
    if (typeof window === 'undefined') return;
    cachedContentOffset =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--content-offset').trim()
      ) || 48;
  }

  /**
   * Get the currently visible section based on scroll position
   * Returns the topmost section that's past the header
   */
  function updateScrollBasedSection() {
    // Skip tracking during programmatic scroll OR initial hydration
    if (isProgrammaticScroll.value || isHydrating.value) return;
    if (typeof window === 'undefined') return;

    // Find which section is currently at the top of viewport (accounting for content offset)
    const scrollPosition = window.scrollY + cachedContentOffset + 20; // +20px buffer

    // Check sections from bottom to top (so we get the topmost visible one)
    let foundSection: string | undefined;

    for (const id of sectionIds) {
      const element = document.getElementById(id);
      if (element) {
        // Skip hidden elements (tab panels that aren't currently active)
        // offsetParent is null for elements with display:none
        if (element.hidden || element.offsetParent === null) {
          continue;
        }

        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;

        if (scrollPosition >= elementTop) {
          foundSection = id;
        }
      }
    }

    // Special case: hero section should return undefined (for Home highlighting)
    scrollBasedSection.value = foundSection === 'hero' ? undefined : foundSection;
  }

  /**
   * Handle scroll events with debouncing for performance
   */
  function handleScroll() {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateScrollBasedSection, 50) as unknown as number;
  }

  /**
   * Disable scroll tracking during programmatic navigation
   */
  function startProgrammaticScroll() {
    isProgrammaticScroll.value = true;

    if (programmaticScrollTimeout) {
      clearTimeout(programmaticScrollTimeout);
    }

    programmaticScrollTimeout = setTimeout(() => {
      isProgrammaticScroll.value = false;
      // Update immediately after programmatic scroll finishes
      updateScrollBasedSection();
    }, 800) as unknown as number;
  }

  // Set up scroll and resize listeners
  onMounted(() => {
    if (typeof window === 'undefined') return;

    // Initialize cached content offset
    updateContentOffset();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateContentOffset, { passive: true });

    // Initial update
    updateScrollBasedSection();

    // End hydration protection after content stabilizes
    // Wait for API data to load (YouTube/Events ~200-500ms)
    hydrationTimeout = setTimeout(() => {
      isHydrating.value = false;
      // Update once after hydration completes
      updateScrollBasedSection();
    }, 500) as unknown as number;
  });

  onBeforeUnmount(() => {
    if (typeof window === 'undefined') return;

    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', updateContentOffset);
    if (scrollTimeout) clearTimeout(scrollTimeout);
    if (programmaticScrollTimeout) clearTimeout(programmaticScrollTimeout);
    if (hydrationTimeout) clearTimeout(hydrationTimeout);
  });

  // Current active section - viewport-aware highlighting
  // Desktop: always use route-based section
  // Mobile: use scroll-based tracking for manual scrolling
  const currentSection = computed(() => {
    const routeSection = route.meta.section as string | undefined;

    // Desktop: always use route-based section
    if (isDesktopMode.value) {
      return routeSection === 'hero' ? undefined : routeSection;
    }

    // Mobile: prioritize route during programmatic navigation, otherwise scroll-based
    if (isProgrammaticScroll.value && routeSection) {
      return routeSection === 'hero' ? undefined : routeSection;
    }

    // For manual scrolling on mobile, use scroll-based tracking
    return scrollBasedSection.value;
  });

  return {
    currentSection,
    startProgrammaticScroll,
  };
}
