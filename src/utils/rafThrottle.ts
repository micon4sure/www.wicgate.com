/**
 * requestAnimationFrame throttle utility - ensures function only runs once per frame
 * Perfect for scroll and resize handlers to maintain 60fps performance.
 *
 * @param fn - The function to throttle
 * @returns Throttled function that runs at most once per animation frame
 *
 * @example
 * const throttledScroll = rafThrottle(() => {
 *   const scrollTop = window.pageYOffset;
 *   updateUI(scrollTop);
 * });
 *
 * window.addEventListener('scroll', throttledScroll, { passive: true });
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => void {
  let rafId: number | undefined;

  return function (this: any, ...args: Parameters<T>) {
    // If we already have a pending frame, skip this call
    if (rafId !== undefined) return;

    rafId = requestAnimationFrame(() => {
      fn.apply(this, args);
      rafId = undefined;
    });
  };
}
