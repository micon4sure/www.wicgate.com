/**
 * Viewport mode detection for responsive hybrid navigation
 * Mobile (<850px): Single-page scroll experience
 * Desktop (>=850px): Multi-page route-based experience
 */

import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { DESKTOP_BREAKPOINT } from '../constants';

/**
 * Reactive viewport mode detection with SSR safety
 * Uses matchMedia for efficient breakpoint detection (only fires on crossing)
 */
export function useViewportMode() {
  // SSR-safe: default to desktop mode during SSG
  const isDesktop = ref(true);

  // Store mediaQuery reference for cleanup (typed as unknown for ESLint compatibility)
  let mediaQuery: {
    matches: boolean;
    addEventListener: Function;
    removeEventListener: Function;
  } | null = null;

  function handleMediaChange(event: { matches: boolean }) {
    isDesktop.value = event.matches;
  }

  onMounted(() => {
    if (typeof window === 'undefined') return;

    // Use matchMedia for efficient breakpoint detection
    mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);

    // Set initial value
    isDesktop.value = mediaQuery.matches;

    // Listen for changes (only fires when crossing breakpoint)
    mediaQuery.addEventListener('change', handleMediaChange);
  });

  onBeforeUnmount(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', handleMediaChange);
    }
  });

  const isDesktopMode = computed(() => isDesktop.value);
  const isMobileMode = computed(() => !isDesktop.value);

  return {
    isDesktopMode,
    isMobileMode,
  };
}
