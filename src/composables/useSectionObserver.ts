/**
 * Section Intersection Observer Composable
 *
 * Provides high-performance section detection using IntersectionObserver API
 * instead of scroll event listeners. Better for battery life and performance.
 *
 * @example
 * ```typescript
 * const { observe, disconnect } = useSectionObserver((sectionId) => {
 *   setCurrentSection(sectionId);
 * });
 *
 * onMounted(() => {
 *   observe(ALL_VALID_IDS);
 * });
 *
 * onBeforeUnmount(() => {
 *   disconnect();
 * });
 * ```
 */

import { getHeaderHeightWithBuffer } from '../utils/scroll';

export interface SectionObserverOptions {
  /**
   * Callback fired when a section enters the viewport
   */
  onSectionChange: (sectionId: string) => void;

  /**
   * Skip observation during programmatic scrolling
   */
  isProgrammaticScrolling?: () => boolean;

  /**
   * Threshold for intersection (0-1)
   * Default: 0 (trigger as soon as any pixel is visible)
   */
  threshold?: number;
}

/**
 * Composable for observing section visibility with IntersectionObserver
 */
export function useSectionObserver(options: SectionObserverOptions) {
  const { onSectionChange, isProgrammaticScrolling, threshold = 0 } = options;

  let observer: IntersectionObserver | null = null;
  let currentlyIntersecting: Set<string> = new Set();

  /**
   * Create and configure the IntersectionObserver
   */
  function createObserver(): IntersectionObserver {
    // Calculate root margin to account for header
    const headerHeight = getHeaderHeightWithBuffer();
    const rootMargin = `-${headerHeight}px 0px -50% 0px`;

    return new IntersectionObserver(
      (entries) => {
        // Skip during programmatic scrolling
        if (isProgrammaticScrolling && isProgrammaticScrolling()) {
          return;
        }

        entries.forEach((entry) => {
          const sectionId = entry.target.id;

          if (entry.isIntersecting) {
            currentlyIntersecting.add(sectionId);
          } else {
            currentlyIntersecting.delete(sectionId);
          }
        });

        // Find the most visible section (first one in the set)
        if (currentlyIntersecting.size > 0) {
          const firstIntersecting = Array.from(currentlyIntersecting)[0];
          if (firstIntersecting) {
            onSectionChange(firstIntersecting);
          }
        } else {
          // No sections intersecting, check if at top
          if (window.scrollY < headerHeight - 40) {
            onSectionChange('hero');
          }
        }
      },
      {
        rootMargin,
        threshold,
      }
    );
  }

  /**
   * Start observing sections by their IDs
   *
   * @param sectionIds - Array of section element IDs to observe
   */
  function observe(sectionIds: string[]): void {
    // Disconnect any existing observer
    if (observer) {
      disconnect();
    }

    // Create new observer
    observer = createObserver();

    // Observe each section
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer!.observe(element);
      }
    });
  }

  /**
   * Stop observing all sections and clean up
   */
  function disconnect(): void {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    currentlyIntersecting.clear();
  }

  /**
   * Temporarily pause observation (for programmatic scrolling)
   */
  function pause(): void {
    if (observer) {
      observer.disconnect();
    }
  }

  /**
   * Resume observation after being paused
   *
   * @param sectionIds - Section IDs to re-observe
   */
  function resume(sectionIds: string[]): void {
    if (!observer) {
      observer = createObserver();
    }

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer!.observe(element);
      }
    });
  }

  return {
    observe,
    disconnect,
    pause,
    resume,
  };
}
