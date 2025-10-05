/**
 * requestAnimationFrame throttle utility - ensures function only runs once per frame
 * Perfect for scroll and resize handlers to maintain 60fps performance.
 *
 * @param fn - The function to throttle
 * @returns Throttled function with cancel method for cleanup
 *
 * @example
 * const throttledScroll = rafThrottle(() => {
 *   const scrollTop = window.pageYOffset;
 *   updateUI(scrollTop);
 * });
 *
 * window.addEventListener('scroll', throttledScroll, { passive: true });
 *
 * // Cleanup on unmount
 * onUnmounted(() => {
 *   throttledScroll.cancel();
 *   window.removeEventListener('scroll', throttledScroll);
 * });
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  fn: T
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let rafId: number | undefined;

  const throttled = function (this: any, ...args: Parameters<T>) {
    // If we already have a pending frame, skip this call
    if (rafId !== undefined) return;

    rafId = requestAnimationFrame(() => {
      fn.apply(this, args);
      rafId = undefined;
    });
  };

  throttled.cancel = () => {
    if (rafId !== undefined) {
      cancelAnimationFrame(rafId);
      rafId = undefined;
    }
  };

  return throttled;
}
