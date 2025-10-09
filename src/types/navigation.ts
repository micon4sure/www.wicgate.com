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
    id: 'getting-started',
    label: 'Getting Started',
    subsections: [
      { id: 'getting-started-quick', label: 'Quick Installation' },
      { id: 'getting-started-advanced', label: 'Advanced Setup' },
    ],
  },
  {
    id: 'multiplayer',
    label: 'Multiplayer',
    subsections: [
      { id: 'multiplayer-servers', label: 'Servers Online' },
      { id: 'multiplayer-statistics', label: 'Statistics' },
    ],
  },
  {
    id: 'community',
    label: 'Community',
    subsections: [
      { id: 'community-events', label: 'Events' },
      { id: 'community-streams', label: 'Live Streams' },
      { id: 'community-videos', label: 'Latest Videos' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    subsections: [
      { id: 'about-mission', label: 'Our Mission' },
      { id: 'about-story', label: 'The Story' },
      { id: 'about-values', label: 'What Drives Us' },
      { id: 'about-team', label: 'The Team' },
    ],
  },
  {
    id: 'faq',
    label: 'FAQ',
    subsections: [
      { id: 'faq-getting-started', label: 'Getting Started' },
      { id: 'faq-technical', label: 'Technical Issues' },
      { id: 'faq-gameplay', label: 'Gameplay & Features' },
      { id: 'faq-server-community', label: 'Server & Community' },
    ],
  },
];

/**
 * Helper to get section ID from subsection ID
 * @param subsectionId - Full subsection ID (e.g., 'multiplayer-servers')
 * @returns Parent section ID (e.g., 'multiplayer')
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
 * Check if an ID is a subsection
 */
export function isSubsection(id: string): boolean {
  return NAVIGATION_STRUCTURE.some((section) => section.subsections?.some((sub) => sub.id === id));
}

/**
 * Get all valid section and subsection IDs
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
