/**
 * Active Section Management Composable
 *
 * Centralizes scroll state management including active section tracking,
 * fast scroll detection, and programmatic scroll coordination.
 * Used across Home.vue and Navigation.vue for consistent state.
 *
 * @example
 * ```typescript
 * const {
 *   currentSection,
 *   isFastScrolling,
 *   isProgrammaticScrolling,
 *   setCurrentSection,
 *   startProgrammaticScroll,
 *   cleanup
 * } = useActiveSection();
 *
 * // Update current section
 * setCurrentSection('multiplayer');
 *
 * // Start programmatic scroll (disables listener temporarily)
 * startProgrammaticScroll();
 * scrollToSection('community');
 * ```
 */

import { ref } from 'vue';
import { SCROLL_SMOOTH_DURATION, SCROLL_FAST_SETTLE } from '../constants';

/**
 * Composable for managing active section state and scroll behavior
 */
export function useActiveSection() {
  // Current active section (undefined = hero/top of page)
  const currentSection = ref<string | undefined>();

  // Fast scroll detection for smooth navigation animations
  const isFastScrolling = ref(false);
  let lastSectionChangeTime = 0;
  let fastScrollTimeout: number | undefined;

  // Programmatic scroll detection to prevent listener interference
  const isProgrammaticScrolling = ref(false);
  let programmaticScrollTimeout: number | undefined;

  /**
   * Update the current active section
   * Includes fast scroll detection logic
   *
   * @param id - Section ID or null/undefined for hero
   */
  function setCurrentSection(id?: string | null): void {
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

  /**
   * Start programmatic scroll mode
   * Temporarily disables scroll listener to prevent interference
   *
   * @param duration - How long to disable listener (default: SCROLL_SMOOTH_DURATION)
   */
  function startProgrammaticScroll(duration: number = SCROLL_SMOOTH_DURATION): void {
    isProgrammaticScrolling.value = true;

    if (programmaticScrollTimeout) {
      clearTimeout(programmaticScrollTimeout);
    }

    programmaticScrollTimeout = setTimeout(() => {
      isProgrammaticScrolling.value = false;
    }, duration) as unknown as number;
  }

  /**
   * Get current section value (read-only access)
   * @returns Current section ID or undefined
   */
  function getCurrentSection(): string | undefined {
    return currentSection.value;
  }

  /**
   * Check if currently fast scrolling
   * @returns True if fast scroll in progress
   */
  function getIsFastScrolling(): boolean {
    return isFastScrolling.value;
  }

  /**
   * Check if programmatic scroll is active
   * @returns True if programmatic scroll in progress
   */
  function getIsProgrammaticScrolling(): boolean {
    return isProgrammaticScrolling.value;
  }

  /**
   * Clean up all timeouts
   * Call this in onBeforeUnmount to prevent memory leaks
   */
  function cleanup(): void {
    if (fastScrollTimeout !== undefined) {
      clearTimeout(fastScrollTimeout);
      fastScrollTimeout = undefined;
    }

    if (programmaticScrollTimeout !== undefined) {
      clearTimeout(programmaticScrollTimeout);
      programmaticScrollTimeout = undefined;
    }

    // Reset state
    isFastScrolling.value = false;
    isProgrammaticScrolling.value = false;
  }

  /**
   * Reset all state (useful for testing or route changes)
   */
  function reset(): void {
    cleanup();
    currentSection.value = undefined;
    lastSectionChangeTime = 0;
  }

  return {
    // Reactive refs
    currentSection,
    isFastScrolling,
    isProgrammaticScrolling,

    // Methods
    setCurrentSection,
    startProgrammaticScroll,
    getCurrentSection,
    getIsFastScrolling,
    getIsProgrammaticScrolling,
    cleanup,
    reset,
  };
}
