/**
 * Minimal scroll tracker composable
 * Single responsibility: Track active section for navigation highlighting
 * Uses IntersectionObserver for performance (no scroll events)
 */

import { ref } from 'vue';

export function useScrollTracker() {
  const currentSection = ref<string | undefined>();
  let observer: IntersectionObserver | null = null;

  // Only create observer in browser environment
  if (typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined') {
    // Simple IntersectionObserver for nav highlighting
    // Detects which section is currently in the "active zone" of the viewport
    observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting entry
        const intersecting = entries.find((e) => e.isIntersecting);
        if (intersecting) {
          currentSection.value = intersecting.target.id;
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
   * Stop observing and clean up
   */
  function disconnect() {
    if (observer) {
      observer.disconnect();
    }
  }

  return {
    currentSection,
    observe,
    disconnect,
  };
}
