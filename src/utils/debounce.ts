/**
 * Debounce utility - delays function execution until after wait time has elapsed
 * since the last time it was invoked. Useful for resize, input, and scroll handlers.
 *
 * @param fn - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns Debounced function with cancel method for cleanup
 *
 * @example
 * const debouncedResize = debounce(() => {
 *   console.log('Window resized!');
 * }, 150);
 *
 * window.addEventListener('resize', debouncedResize);
 *
 * // Cleanup on unmount
 * onUnmounted(() => {
 *   debouncedResize.cancel();
 *   window.removeEventListener('resize', debouncedResize);
 * });
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeoutId: number | undefined;

  const debounced = function (this: any, ...args: Parameters<T>) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      fn.apply(this, args);
      timeoutId = undefined;
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debounced;
}
