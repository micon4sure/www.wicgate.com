/**
 * Viewport mode detection for responsive hybrid navigation
 * Mobile (<850px): Single-page scroll experience
 * Desktop (>=850px): Multi-page route-based experience
 *
 * Automatically respects browser "Request Desktop Site" feature
 * because the browser changes the viewport width when enabled.
 */

import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { DESKTOP_BREAKPOINT } from '../constants';

export function useViewportMode() {
  // SSR-safe: default to desktop mode during SSG
  const isDesktop = ref(true);

  // Store mediaQuery reference for cleanup (typed for ESLint compatibility)
  let mediaQuery: {
    matches: boolean;
    addEventListener: (type: string, handler: (e: { matches: boolean }) => void) => void;
    removeEventListener: (type: string, handler: (e: { matches: boolean }) => void) => void;
  } | null = null;

  function handleMediaChange(event: { matches: boolean }) {
    isDesktop.value = event.matches;
  }

  onMounted(() => {
    if (typeof window === 'undefined') return;

    mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    isDesktop.value = mediaQuery.matches;
    mediaQuery.addEventListener('change', handleMediaChange);
  });

  onBeforeUnmount(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', handleMediaChange);
    }
  });

  return {
    isDesktopMode: computed(() => isDesktop.value),
    isMobileMode: computed(() => !isDesktop.value),
  };
}
