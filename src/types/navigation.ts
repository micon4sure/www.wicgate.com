/**
 * Navigation types for section and subsection deeplinks
 */

export interface Subsection {
  id: string;
  label: string;
}

export interface NavigationSection {
  id: string;
  label: string;
  subsections?: Subsection[];
}

/**
 * Complete navigation structure with all sections.
 * Note: Subsections (e.g., Downloads tabs, FAQ categories) are handled via:
 * - Internal TabContainer components within sections
 * - Direct URL routing (e.g., /downloads/quick, /faq/about)
 * - Helper functions below for routing and active section tracking
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
 * Helper to get section ID from subsection ID
 * Useful for navigation logic when you need to determine the parent section
 * of a given subsection (e.g., for breadcrumbs or active section highlighting).
 *
 * Note: Subsections are defined in routes and section components, not in NAVIGATION_STRUCTURE.
 * This mapping is maintained manually to support routing and active section tracking.
 *
 * @param subsectionId - Full subsection ID (e.g., 'downloads-quick', 'faq-about')
 * @returns Parent section ID (e.g., 'downloads', 'faq') or undefined if not found
 *
 * @example
 * ```typescript
 * getSectionFromSubsection('downloads-quick');     // 'downloads'
 * getSectionFromSubsection('faq-about');           // 'faq'
 * getSectionFromSubsection('invalid-id');          // undefined
 * ```
 */
export function getSectionFromSubsection(subsectionId: string): string | undefined {
  // Subsection to section mapping (synchronized with routes.ts)
  const subsectionMap: Record<string, string> = {
    // Downloads subsections
    'downloads-quick': 'downloads',
    'downloads-server': 'downloads',
    'downloads-manual': 'downloads',
    // FAQ subsections
    'faq-about': 'faq',
    'faq-getting-started': 'faq',
    'faq-technical': 'faq',
    'faq-gameplay': 'faq',
    'faq-server': 'faq',
  };

  return subsectionMap[subsectionId];
}

/**
 * Check if an ID is a subsection (vs a main section)
 * Useful for routing logic to determine if nested path structure is needed.
 *
 * @param id - Section or subsection ID to check
 * @returns True if the ID is a subsection, false if it's a main section or invalid
 *
 * @example
 * ```typescript
 * isSubsection('downloads-quick'); // true
 * isSubsection('downloads');       // false
 * isSubsection('hero');            // false
 * ```
 */
export function isSubsection(id: string): boolean {
  return getSectionFromSubsection(id) !== undefined;
}

/**
 * Get all valid section and subsection IDs
 * Useful for validation, testing, or generating sitemap/navigation menus.
 *
 * @returns Array of all valid IDs (both main sections and subsections)
 *
 * @example
 * ```typescript
 * const allIds = getAllValidIds();
 * // ['hero', 'downloads', 'downloads-quick', 'downloads-server', ...]
 *
 * // Validate user input
 * const isValid = getAllValidIds().includes(userInput);
 * ```
 */
export function getAllValidIds(): string[] {
  // Main sections
  const sectionIds = NAVIGATION_STRUCTURE.map((section) => section.id);

  // All known subsections (synchronized with routes.ts)
  const subsectionIds = [
    'downloads-quick',
    'downloads-server',
    'downloads-manual',
    'faq-about',
    'faq-getting-started',
    'faq-technical',
    'faq-gameplay',
    'faq-server',
  ];

  return [...sectionIds, ...subsectionIds];
}

/**
 * Get route path for a section or subsection
 * Converts navigation IDs to Vue Router paths.
 * Main sections and subsections use full paths.
 *
 * @param id - Section or subsection ID
 * @returns Route path (e.g., '/downloads' or '/downloads/quick')
 *
 * @example
 * ```typescript
 * getRoutePath('hero');                  // '/'
 * getRoutePath('downloads');             // '/downloads'
 * getRoutePath('downloads-quick');       // '/downloads/quick'
 * getRoutePath('faq-technical');         // '/faq/technical'
 * ```
 */
export function getRoutePath(id: string): string {
  // Handle hero/home
  if (id === 'hero') return '/';

  // Check if it's a subsection
  const parentSection = getSectionFromSubsection(id);
  if (parentSection) {
    // Extract path from ID (e.g., 'downloads-quick' → 'quick')
    const subpath = id.replace(`${parentSection}-`, '');
    return `/${parentSection}/${subpath}`;
  }

  // It's a main section
  return `/${id}`;
}
