/**
 * Dynamic header height synchronization utility
 *
 * Automatically measures the actual rendered header height and updates
 * the CSS variable --header-height to ensure pixel-perfect scroll positioning.
 *
 * Industry-standard approach (2024-2025) for handling dynamic/responsive headers.
 */

/**
 * Synchronizes CSS variable with actual header height
 * Updates automatically on window resize
 *
 * @returns Cleanup function to remove event listeners
 *
 * @example
 * ```typescript
 * onMounted(() => {
 *   const cleanup = syncHeaderHeight();
 *   onBeforeUnmount(cleanup);
 * });
 * ```
 */
export function syncHeaderHeight(): (() => void) | void {
  // SSR guard
  if (typeof window === 'undefined') return;

  const updateHeaderHeight = () => {
    const header = document.querySelector('header');
    if (!header) {
      console.warn('[Header Height] Header element not found');
      return;
    }

    // Measure actual rendered height (includes all borders, padding, etc.)
    const height = header.getBoundingClientRect().height;

    // Update CSS variable that scroll-padding-top uses
    document.documentElement.style.setProperty('--header-height', `${height}px`);

    // Debug logging (can be removed after testing)
    if (import.meta.env.DEV) {
      console.log('[Header Height] Measured:', `${height}px`);
      const computed = getComputedStyle(document.documentElement)
        .getPropertyValue('--header-height')
        .trim();
      console.log('[Header Height] CSS variable set to:', computed);
    }
  };

  // Update immediately on initialization
  updateHeaderHeight();

  // Update on resize with RAF for 60fps performance
  let rafId: number;
  const handleResize = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateHeaderHeight);
  };

  window.addEventListener('resize', handleResize);

  // Return cleanup function
  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', handleResize);
  };
}
