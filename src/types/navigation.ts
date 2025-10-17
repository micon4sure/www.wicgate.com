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
 * Complete navigation structure with all sections and subsections
 */
export const NAVIGATION_STRUCTURE: NavigationSection[] = [
  {
    id: 'hero',
    label: 'Home',
  },
  {
    id: 'downloads',
    label: 'Downloads',
    subsections: [
      { id: 'downloads-quick', label: 'Quick Install' },
      { id: 'downloads-server', label: 'Dedicated Server' },
      { id: 'downloads-manual', label: 'Manual Install' },
    ],
  },
  {
    id: 'statistics',
    label: 'Statistics',
  },
  {
    id: 'community',
    label: 'Community',
  },
  {
    id: 'faq',
    label: 'FAQ',
    subsections: [
      { id: 'faq-about', label: 'About WICGATE' },
      { id: 'faq-getting-started', label: 'Getting Started' },
      { id: 'faq-technical', label: 'Technical Issues' },
      { id: 'faq-gameplay', label: 'Gameplay & Features' },
      { id: 'faq-server', label: 'Server & Community' },
    ],
  },
];

/**
 * Helper to get section ID from subsection ID
 * Useful for navigation logic when you need to determine the parent section
 * of a given subsection (e.g., for breadcrumbs or active section highlighting).
 *
 * @param subsectionId - Full subsection ID (e.g., 'multiplayer-servers')
 * @returns Parent section ID (e.g., 'multiplayer') or undefined if not found
 *
 * @example
 * ```typescript
 * getSectionFromSubsection('multiplayer-servers'); // 'multiplayer'
 * getSectionFromSubsection('community-events');    // 'community'
 * getSectionFromSubsection('invalid-id');          // undefined
 * ```
 */
export function getSectionFromSubsection(subsectionId: string): string | undefined {
  for (const section of NAVIGATION_STRUCTURE) {
    if (section.subsections) {
      if (section.subsections.some((sub) => sub.id === subsectionId)) {
        return section.id;
      }
    }
  }
  return undefined;
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
 * isSubsection('multiplayer-servers'); // true
 * isSubsection('multiplayer');         // false
 * isSubsection('hero');                // false
 * ```
 */
export function isSubsection(id: string): boolean {
  return NAVIGATION_STRUCTURE.some((section) => section.subsections?.some((sub) => sub.id === id));
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
 * // ['hero', 'getting-started', 'getting-started-quick', 'getting-started-advanced', ...]
 *
 * // Validate user input
 * const isValid = getAllValidIds().includes(userInput);
 * ```
 */
export function getAllValidIds(): string[] {
  const ids: string[] = [];
  for (const section of NAVIGATION_STRUCTURE) {
    ids.push(section.id);
    if (section.subsections) {
      ids.push(...section.subsections.map((sub) => sub.id));
    }
  }
  return ids;
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
  for (const section of NAVIGATION_STRUCTURE) {
    if (section.subsections) {
      const subsection = section.subsections.find((sub) => sub.id === id);
      if (subsection) {
        // Extract path from ID (e.g., 'downloads-quick' → 'quick')
        const subpath = id.replace(`${section.id}-`, '');
        return `/${section.id}/${subpath}`;
      }
    }
  }

  // It's a main section
  return `/${id}`;
}
