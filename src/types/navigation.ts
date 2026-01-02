/**
 * Navigation types for sections
 * Note: Tab navigation within sections (Downloads, FAQ) uses URL hash fragments
 * handled by TabContainer component (e.g., /downloads#manual-install, /faq#technical-issues)
 */

export interface NavigationSection {
  id: string;
  label: string;
}

/**
 * Complete navigation structure with all main sections.
 */
export const NAVIGATION_STRUCTURE: NavigationSection[] = [
  {
    id: 'hero',
    label: 'Home',
  },
  {
    id: 'community',
    label: 'Community',
  },
  {
    id: 'statistics',
    label: 'Statistics',
  },
  {
    id: 'downloads',
    label: 'Downloads',
  },
  {
    id: 'faq',
    label: 'FAQ',
  },
];

/**
 * Get all valid section IDs
 * Useful for validation, testing, or generating sitemap/navigation menus.
 *
 * @returns Array of all valid section IDs
 *
 * @example
 * ```typescript
 * const allIds = getAllValidIds();
 * // ['hero', 'community', 'statistics', 'downloads', 'faq']
 *
 * // Validate user input
 * const isValid = getAllValidIds().includes(userInput);
 * ```
 */
export function getAllValidIds(): string[] {
  return NAVIGATION_STRUCTURE.map((section) => section.id);
}

/**
 * Get route path for a section
 * Converts navigation IDs to Vue Router paths.
 *
 * @param id - Section ID
 * @returns Route path (e.g., '/downloads')
 *
 * @example
 * ```typescript
 * getRoutePath('hero');       // '/'
 * getRoutePath('downloads');  // '/downloads'
 * getRoutePath('faq');        // '/faq'
 * ```
 */
export function getRoutePath(id: string): string {
  // Handle hero/home
  if (id === 'hero') return '/';

  // Main section
  return `/${id}`;
}
