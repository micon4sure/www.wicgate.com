/**
 * Minimal scroll tracker composable
 * Single responsibility: Track active section for navigation highlighting
 * Uses IntersectionObserver for performance (no scroll events)
 */

import { ref } from 'vue';

export function useScrollTracker() {
  const currentSection = ref<string | undefined>();
  const isProgrammaticScroll = ref(false);
  let observer: IntersectionObserver | null = null;
  let programmaticScrollTimeout: number | undefined;

  // Only create observer in browser environment
  if (typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined') {
    // Simple IntersectionObserver for nav highlighting
    // Detects which section is currently in the "active zone" of the viewport
    observer = new IntersectionObserver(
      (entries) => {
        // Skip updates during programmatic scroll to prevent "racing" highlights
        if (isProgrammaticScroll.value) return;

        // Get all intersecting entries and sort by vertical position (top to bottom)
        // This ensures we always pick the topmost visible section, regardless of scroll direction
        const sortedEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        // Select the topmost visible section
        if (sortedEntries.length > 0) {
          const topSection = sortedEntries[0];
          // Special case: hero section should set currentSection to undefined (for Home highlighting)
          currentSection.value = topSection.target.id === 'hero' ? undefined : topSection.target.id;
        }
      },
      {
        // Active zone: middle portion of viewport (20% from top, 60% from bottom)
        // This creates a stable "sweet spot" where sections become active
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0, // Trigger as soon as element enters the zone
      }
    );
  }

  /**
   * Start observing sections for active state tracking
   * @param sectionIds - Array of section/subsection IDs to observe
   */
  function observe(sectionIds: string[]) {
    if (!observer) return; // Skip during SSR

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer!.observe(el);
      }
    });
  }

  /**
   * Start programmatic scroll mode
   * Temporarily disables scroll tracker to prevent "racing" highlights during navigation
   * @param duration - How long to disable tracking (default: 800ms for smooth scroll + settle)
   */
  function startProgrammaticScroll(duration = 800) {
    isProgrammaticScroll.value = true;

    if (programmaticScrollTimeout) {
      clearTimeout(programmaticScrollTimeout);
    }

    programmaticScrollTimeout = setTimeout(() => {
      isProgrammaticScroll.value = false;
    }, duration) as unknown as number;
  }

  /**
   * Stop observing and clean up
   */
  function disconnect() {
    if (observer) {
      observer.disconnect();
    }
    if (programmaticScrollTimeout) {
      clearTimeout(programmaticScrollTimeout);
    }
  }

  return {
    currentSection,
    observe,
    disconnect,
    startProgrammaticScroll,
  };
}
