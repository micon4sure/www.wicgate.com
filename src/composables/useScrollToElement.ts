/**
 * Consolidated scroll-to-element utility
 * Replaces duplicated scroll logic across FAQ, Statistics, default layout, and router
 *
 * IMPORTANT: When using the `highlight` option, the composable creates internal setTimeout
 * calls for the highlight animation. If the component might unmount before the highlight
 * animation completes, consumers should wrap the call with `trackTimeout` from `useTimeoutTracker`
 * to ensure proper cleanup. This prevents timeouts firing on stale DOM references.
 *
 * Example with trackTimeout:
 * ```typescript
 * const { trackTimeout, clearAllTimeouts } = useTimeoutTracker();
 *
 * // Wrap the scroll call to track internal timeouts
 * trackTimeout(() => {
 *   scrollToElement('my-element', { highlight: true });
 * }, 0);
 *
 * onBeforeUnmount(() => {
 *   clearAllTimeouts();
 * });
 * ```
 */
/* global ScrollBehavior */

import { DEFAULT_CONTENT_OFFSET, SCROLL_EXTRA_PADDING } from '../constants';

export interface ScrollToElementOptions {
  /** Add extra padding beyond the content offset (default: true, uses SCROLL_EXTRA_PADDING) */
  extraPadding?: boolean;
  /** Scroll behavior: 'smooth' for animations, 'auto' for instant (default: 'smooth') */
  behavior?: ScrollBehavior;
  /** Apply highlight animation after scrolling (default: false) */
  highlight?: boolean;
  /** Delay before starting scroll, in ms (default: 0) */
  delay?: number;
  /** Duration of highlight animation in ms (default: 2000) */
  highlightDuration?: number;
}

/**
 * Get the current content offset from CSS variable or fallback to constant
 * Call this within a function, not at module level, to ensure proper SSR handling
 */
export function getContentOffset(): number {
  if (typeof window === 'undefined') return DEFAULT_CONTENT_OFFSET;

  return (
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--content-offset').trim()
    ) || DEFAULT_CONTENT_OFFSET
  );
}

/**
 * Calculate the scroll position for an element
 * @param element - The target element
 * @param extraPadding - Whether to include extra padding (default: true)
 * @returns The calculated scroll position (top value)
 */
export function calculateScrollPosition(element: HTMLElement, extraPadding = true): number {
  if (typeof window === 'undefined') return 0;

  const contentOffset = getContentOffset();
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  const padding = extraPadding ? SCROLL_EXTRA_PADDING : 0;

  return elementPosition - contentOffset - padding;
}

/**
 * Scroll to an element by ID with consistent behavior across the app
 * @param elementId - The ID of the element to scroll to (without #)
 * @param options - Scroll options
 * @returns Promise that resolves when scrolling is complete
 */
export function scrollToElement(
  elementId: string,
  options: ScrollToElementOptions = {}
): Promise<void> {
  return new Promise((resolve) => {
    // SSR guard
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    const {
      extraPadding = true,
      behavior = 'smooth',
      highlight = false,
      delay = 0,
      highlightDuration = 2000,
    } = options;

    const scrollAction = () => {
      const element = document.getElementById(elementId);
      if (!element) {
        resolve();
        return;
      }

      const top = calculateScrollPosition(element, extraPadding);

      window.scrollTo({
        top,
        behavior,
      });

      // Apply highlight effect if requested
      if (highlight) {
        // Small delay to let scroll complete before highlighting
        setTimeout(() => {
          element.classList.add('anchor-highlight');
          setTimeout(() => {
            element.classList.remove('anchor-highlight');
          }, highlightDuration);
        }, 300);
      }

      resolve();
    };

    if (delay > 0) {
      setTimeout(scrollAction, delay);
    } else {
      scrollAction();
    }
  });
}

/**
 * Composable wrapper for Vue components
 * Provides the same functionality with a composable interface
 */
export function useScrollToElement() {
  return {
    scrollToElement,
    calculateScrollPosition,
    getContentOffset,
  };
}
