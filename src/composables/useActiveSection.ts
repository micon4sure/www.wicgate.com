/**
 * Active section tracking for navigation highlighting
 * Combines route-based (for clicks) and scroll-based (for manual scroll) tracking
 */

import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { getSectionFromSubsection } from '../types/navigation';

export function useActiveSection(sectionIds: string[] = []) {
  const route = useRoute();
  const scrollBasedSection = ref<string | undefined>();
  const isProgrammaticScroll = ref(false);
  const isHydrating = ref(true); // Track SSR → CSR hydration state
  let programmaticScrollTimeout: number | undefined;
  let scrollTimeout: number | undefined;
  let hydrationTimeout: number | undefined;

  /**
   * Get the currently visible section based on scroll position
   * Returns the topmost section that's past the header
   */
  function updateScrollBasedSection() {
    // Skip tracking during programmatic scroll OR initial hydration
    if (isProgrammaticScroll.value || isHydrating.value) return;
    if (typeof window === 'undefined') return;

    // Get header height from CSS variable
    const headerHeight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim()
      ) || 80;

    // Find which section is currently at the top of viewport (accounting for header)
    const scrollPosition = window.scrollY + headerHeight + 20; // +20px buffer

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

    // Map subsection IDs to their parent section (tabs should not affect navigation)
    if (foundSection) {
      const parentSection = getSectionFromSubsection(foundSection);
      if (parentSection) {
        foundSection = parentSection;
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

  // Set up scroll listener
  onMounted(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('scroll', handleScroll, { passive: true });

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
    if (scrollTimeout) clearTimeout(scrollTimeout);
    if (programmaticScrollTimeout) clearTimeout(programmaticScrollTimeout);
    if (hydrationTimeout) clearTimeout(hydrationTimeout);
  });

  // Current active section - prioritizes route (for clicks), falls back to scroll
  // IMPORTANT: Only track section-level, not subsection/tabs
  // Tabs are local UI state and shouldn't affect main navigation highlighting
  const currentSection = computed(() => {
    // Always use section, never subsection (tabs should not affect nav highlighting)
    const routeSection = route.meta.section as string | undefined;

    // During/after programmatic navigation, use route
    if (isProgrammaticScroll.value && routeSection) {
      return routeSection === 'hero' ? undefined : routeSection;
    }

    // For manual scrolling, use scroll-based tracking
    return scrollBasedSection.value;
  });

  return {
    currentSection,
    startProgrammaticScroll,
  };
}
