/**
 * Memoization Utilities
 *
 * Provides caching mechanisms for expensive computations to improve performance.
 * Use for operations like sorting, filtering, or parsing that don't need to run
 * on every reactive change.
 */

/**
 * Simple memoization cache with TTL (time-to-live) support
 */
export class MemoCache<T> {
  private cache = new Map<string, { value: T; timestamp: number }>();
  private ttl: number;

  /**
   * @param ttl - Time to live in milliseconds (default: 5000ms)
   */
  constructor(ttl: number = 5000) {
    this.ttl = ttl;
  }

  /**
   * Get value from cache if not expired
   * @param key - Cache key
   * @returns Cached value or undefined if expired/missing
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    const now = Date.now();
    if (now - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /**
   * Set value in cache
   * @param key - Cache key
   * @param value - Value to cache
   */
  set(key: string, value: T): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  /**
   * Check if key exists and is not expired
   * @param key - Cache key
   * @returns True if valid cached value exists
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Clear all cached values
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get current cache size
   */
  get size(): number {
    return this.cache.size;
  }
}

/**
 * Create a memoized version of a function with dependency tracking
 *
 * @param fn - Function to memoize
 * @param getDeps - Function that returns dependency array (like React useMemo)
 * @returns Memoized function
 *
 * @example
 * ```typescript
 * const expensiveSort = memoizeWithDeps(
 *   (items: Item[]) => items.sort((a, b) => a.value - b.value),
 *   (items) => [items.length, items[0]?.id] // Only recompute if length or first item changes
 * );
 * ```
 */
export function memoizeWithDeps<T, Args extends any[]>(
  fn: (...args: Args) => T,
  getDeps: (...args: Args) => any[]
): (...args: Args) => T {
  let lastDeps: any[] | undefined;
  let lastResult: T | undefined;

  return (...args: Args): T => {
    const currentDeps = getDeps(...args);

    if (lastDeps === undefined || !depsAreEqual(lastDeps, currentDeps)) {
      lastResult = fn(...args);
      lastDeps = currentDeps;
    }

    return lastResult!;
  };
}

/**
 * Compare two dependency arrays for equality (shallow comparison)
 */
function depsAreEqual(prevDeps: any[], nextDeps: any[]): boolean {
  if (prevDeps.length !== nextDeps.length) return false;

  for (let i = 0; i < prevDeps.length; i++) {
    if (!Object.is(prevDeps[i], nextDeps[i])) {
      return false;
    }
  }

  return true;
}

/**
 * Simple function memoizer with single argument
 *
 * @param fn - Function to memoize (must take single argument)
 * @returns Memoized function
 *
 * @example
 * ```typescript
 * const parseXML = memoize((xmlString: string) => {
 *   return new DOMParser().parseFromString(xmlString, 'text/xml');
 * });
 * ```
 */
export function memoize<T, R>(fn: (arg: T) => R): (arg: T) => R {
  const cache = new Map<T, R>();

  return (arg: T): R => {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }

    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

/**
 * Memoize with JSON stringified key (for object arguments)
 *
 * @param fn - Function to memoize
 * @returns Memoized function
 *
 * @example
 * ```typescript
 * const processData = memoizeJson((config: Config) => {
 *   return expensiveOperation(config);
 * });
 * ```
 */
export function memoizeJson<T extends object, R>(fn: (arg: T) => R): (arg: T) => R {
  const cache = new Map<string, R>();

  return (arg: T): R => {
    const key = JSON.stringify(arg);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(arg);
    cache.set(key, result);
    return result;
  };
}
