// Centralized utility functions for the WiCGate application
// This module consolidates common utilities to improve maintainability

// Re-export player display utilities
export {
  displayName,
  colorize,
  groupPlayersByServer,
  type PlayerProfile,
  type PlayerGroup,
} from './playerDisplay';

// FontAwesome configuration is imported in main.ts
// No need to re-export it from here

/**
 * Format date string to localized string
 * Uses browser's locale settings for automatic localization.
 *
 * @param dateString - ISO date string (e.g., '2025-10-10T12:00:00Z')
 * @returns Localized date/time string
 *
 * @example
 * ```typescript
 * formatDate('2025-10-10T12:00:00Z');
 * // '10/10/2025, 12:00:00 PM' (en-US locale)
 * ```
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

/**
 * Calculate countdown from now to target date
 * Returns human-readable time remaining with days, hours, minutes, seconds.
 *
 * @param targetDateString - ISO date string for target time
 * @param currentDate - Current date (defaults to now, injectable for testing)
 * @returns Formatted countdown string (e.g., '2d 05h 30m 15s')
 *
 * @example
 * ```typescript
 * getCountdown('2025-12-25T00:00:00Z');
 * // '75d 12h 45m 30s'
 *
 * getCountdown('2025-01-01T00:00:00Z', new Date('2025-01-01T00:00:01Z'));
 * // 'Event ongoing' (target already passed)
 * ```
 */
export const getCountdown = (targetDateString: string, currentDate: Date = new Date()): string => {
  const target = new Date(targetDateString).getTime();
  const diff = target - currentDate.getTime();

  if (diff <= 0) {
    return 'Event ongoing';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const parts: string[] = [];
  if (days) {
    parts.push(`${days}d`);
  }
  parts.push(`${String(hours).padStart(2, '0')}h`);
  parts.push(`${String(minutes).padStart(2, '0')}m`);
  parts.push(`${String(seconds).padStart(2, '0')}s`);

  return parts.join(' ');
};

/**
 * Sort array by key in ascending or descending order
 * Returns a new array (non-mutating). Lodash-free alternative to _.sortBy.
 *
 * @param array - Array to sort
 * @param key - Object key to sort by
 * @param order - Sort direction ('asc' or 'desc', defaults to 'asc')
 * @returns New sorted array
 *
 * @example
 * ```typescript
 * const users = [
 *   { name: 'Charlie', age: 30 },
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 35 }
 * ];
 *
 * sortBy(users, 'name');        // Alice, Bob, Charlie
 * sortBy(users, 'age', 'desc'); // Bob (35), Charlie (30), Alice (25)
 * ```
 */
export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return array.slice().sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Map object values to new values using transform function
 * Returns a new object with same keys but transformed values.
 * Lodash-free alternative to _.mapValues.
 *
 * @param obj - Object to transform
 * @param fn - Transform function applied to each value
 * @returns New object with transformed values
 *
 * @example
 * ```typescript
 * const scores = { alice: 85, bob: 92, charlie: 78 };
 *
 * // Convert to percentages
 * mapValues(scores, (score) => `${score}%`);
 * // { alice: '85%', bob: '92%', charlie: '78%' }
 *
 * // Double all values
 * mapValues(scores, (score) => score * 2);
 * // { alice: 170, bob: 184, charlie: 156 }
 * ```
 */
export const mapValues = <T, U>(obj: Record<string, T>, fn: (value: T) => U): Record<string, U> => {
  const result: Record<string, U> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = fn(value);
  }
  return result;
};
