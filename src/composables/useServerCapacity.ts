/**
 * Server Capacity Utility Composable
 *
 * Provides color coding and status indicators for server player counts.
 * Used across WidgetDashboard and Multiplayer sections for consistent capacity visualization.
 *
 * @example
 * ```typescript
 * const { getCapacityColor, getCapacityStatus } = useServerCapacity();
 *
 * const color = getCapacityColor(14, 16); // returns 'var(--sw)' (orange)
 * const status = getCapacityStatus(14, 16); // returns 'busy'
 * ```
 */

export type CapacityStatus = 'full' | 'busy' | 'available';

export interface ServerCapacityOptions {
  /**
   * Threshold for "full" status (default: 90%)
   */
  fullThreshold?: number;

  /**
   * Threshold for "busy" status (default: 50%)
   */
  busyThreshold?: number;
}

/**
 * Composable for server capacity calculations and color coding
 */
export function useServerCapacity(options: ServerCapacityOptions = {}) {
  const { fullThreshold = 90, busyThreshold = 50 } = options;

  /**
   * Get color token based on server capacity percentage
   *
   * @param count - Current player count
   * @param max - Maximum server capacity (default: 16)
   * @returns CSS variable token for color
   *
   * @example
   * ```typescript
   * getCapacityColor(15, 16); // 'var(--dl-light)' - red (≥90%)
   * getCapacityColor(10, 16); // 'var(--sw)' - orange (≥50%)
   * getCapacityColor(5, 16);  // 'var(--g)' - green (<50%)
   * ```
   */
  function getCapacityColor(count: number, max: number = 16): string {
    const percentage = (count / max) * 100;

    if (percentage >= fullThreshold) return 'var(--dl-light)'; // Red - nearly full
    if (percentage >= busyThreshold) return 'var(--sw)'; // Orange - half full
    return 'var(--g)'; // Green - plenty of space
  }

  /**
   * Get semantic status label based on server capacity percentage
   *
   * @param count - Current player count
   * @param max - Maximum server capacity (default: 16)
   * @returns Status string: 'full', 'busy', or 'available'
   *
   * @example
   * ```typescript
   * getCapacityStatus(15, 16); // 'full'
   * getCapacityStatus(10, 16); // 'busy'
   * getCapacityStatus(5, 16);  // 'available'
   * ```
   */
  function getCapacityStatus(count: number, max: number = 16): CapacityStatus {
    const percentage = (count / max) * 100;

    if (percentage >= fullThreshold) return 'full';
    if (percentage >= busyThreshold) return 'busy';
    return 'available';
  }

  /**
   * Get capacity percentage as a number
   *
   * @param count - Current player count
   * @param max - Maximum server capacity (default: 16)
   * @returns Percentage value (0-100)
   */
  function getCapacityPercentage(count: number, max: number = 16): number {
    return Math.round((count / max) * 100);
  }

  /**
   * Check if server is accepting new players
   *
   * @param count - Current player count
   * @param max - Maximum server capacity (default: 16)
   * @returns True if server has space
   */
  function hasSpace(count: number, max: number = 16): boolean {
    return count < max;
  }

  return {
    getCapacityColor,
    getCapacityStatus,
    getCapacityPercentage,
    hasSpace,
  };
}
