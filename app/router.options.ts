import type { RouterConfig } from '@nuxt/schema';
import { DEFAULT_CONTENT_OFFSET } from '../src/constants';

// Custom scroll behavior for Nuxt router
// Mirrors the scroll behavior from the original ViteSSG setup
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // 1. Browser back/forward - restore saved position
    if (savedPosition) {
      return savedPosition;
    }

    // 2. Hash anchor navigation - scroll to element with manual offset
    if (to.hash) {
      return new Promise((resolve) => {
        // SSR guard - scrollBehavior runs during SSG build
        if (typeof window === 'undefined') {
          resolve({ top: 0 });
          return;
        }

        // Detect direct navigation (page reload/bookmark) vs SPA navigation
        const isDirectNavigation = !from.name;

        // Determine scroll behavior and delay based on navigation type
        const scrollBehavior = isDirectNavigation ? 'auto' : 'smooth';
        const delay = isDirectNavigation ? 600 : 100;

        setTimeout(() => {
          // Remove the # from hash to get element ID
          let targetId = to.hash.slice(1);
          let element = document.getElementById(targetId);

          // If element not found, try parsing as compound hash
          if (!element) {
            const categories = ['total', 'infantry', 'armor', 'air', 'support'];
            const parts = targetId.split('-');
            const lastPart = parts[parts.length - 1] ?? '';
            if (categories.includes(lastPart) && parts.length > 2) {
              targetId = parts.slice(0, -1).join('-');
              element = document.getElementById(targetId);
            }
          }

          if (!element) {
            resolve({ top: 0 });
            return;
          }

          const contentOffset =
            parseInt(
              getComputedStyle(document.documentElement)
                .getPropertyValue('--content-offset')
                .trim()
            ) || DEFAULT_CONTENT_OFFSET;

          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - contentOffset - 16;

          resolve({
            top: offsetPosition,
            behavior: scrollBehavior as ScrollBehavior,
          });
        }, delay);
      });
    }

    // 3. Section route - scroll to section element
    const targetSection = to.meta.section;
    if (targetSection && typeof targetSection === 'string') {
      const sourceSection = from.meta.section;
      const targetSubsection = to.meta.subsection;
      const isDirectNavigation = !from.name;

      // Only preserve scroll when navigating TO a subsection within same section
      const isSubsectionNavigation =
        sourceSection === targetSection && targetSubsection !== undefined && !isDirectNavigation;

      if (isSubsectionNavigation) {
        if (typeof window !== 'undefined') {
          return { top: window.scrollY };
        }
        return { top: 0 };
      }

      return new Promise((resolve) => {
        if (typeof window === 'undefined') {
          resolve({ top: 0 });
          return;
        }

        const scrollBehavior = isDirectNavigation ? 'auto' : 'smooth';
        const delay = isDirectNavigation ? 600 : 100;

        setTimeout(() => {
          const element = document.getElementById(targetSection);
          if (!element) {
            resolve({ top: 0 });
            return;
          }

          const contentOffset =
            parseInt(
              getComputedStyle(document.documentElement)
                .getPropertyValue('--content-offset')
                .trim()
            ) || DEFAULT_CONTENT_OFFSET;

          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - contentOffset;

          resolve({
            top: offsetPosition,
            behavior: scrollBehavior as ScrollBehavior,
          });
        }, delay);
      });
    }

    // 4. Default - scroll to top
    return { top: 0 };
  },
};
