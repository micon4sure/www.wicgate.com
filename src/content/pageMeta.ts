export interface PageMetaDefinition {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  canonical?: string;
  robots?: string;
}

export const DEFAULT_SITE_URL = import.meta.env?.VITE_SITE_URL || 'https://wicgate.com';
export const DEFAULT_OG_IMAGE = '/og-default.jpg';

/**
 * Validates and optimizes meta description length for SEO
 * Optimal: 150-160 characters
 * Warning: < 120 characters (underutilized)
 * Auto-truncate: > 160 characters
 */
function validateDescriptionLength(description: string, path: string): string {
  const len = description.length;

  // Perfect range: 150-160 chars
  if (len >= 150 && len <= 160) {
    return description;
  }

  // Too long: truncate with ellipsis
  if (len > 160) {
    console.warn(
      `[SEO] Description too long (${len} chars) for ${path}, truncating to 157 chars + "..."`
    );
    return description.substring(0, 157) + '...';
  }

  // Too short: warn but don't modify
  if (len < 120) {
    console.warn(
      `[SEO] Description short (${len} chars) for ${path}, consider expanding for better SERP usage`
    );
  }

  return description;
}

export const PAGE_META: Record<string, PageMetaDefinition> = {
  '/': {
    title: 'WICGATE | World in Conflict Online Multiplayer Reloaded',
    description:
      'Play World in Conflict online with restored multiplayer servers. Join our active community in epic Cold War battles built on the original Massgate code.',
    keywords:
      'world in conflict online, world in conflict multiplayer, world in conflict servers, world in conflict online multiplayer revival, massgate, wicgate, wic online, wic multiplayer, wic servers, play world in conflict online, play wic online, world in conflict discord, wic discord, wicgate discord',
  },
  '/downloads': {
    title: 'World in Conflict Downloads and Installation | WICGATE',
    description:
      'Download and install World in Conflict multiplayer. Quick install with WIC LIVE, host your own dedicated server, or manual installation for advanced users.',
    keywords:
      'world in conflict download, world in conflict install, world in conflict multiplayer setup, world in conflict online install, how to play world in conflict online, wic download, wic install, wic live, wic multiplayer setup',
  },
  '/statistics': {
    title: 'World in Conflict Leaderboards and Statistics | WICGATE',
    description:
      'View World in Conflict player rankings and competitive leaderboards. See top WiC players and statistics across all 4 roles: infantry, armor, air, and support.',
    keywords:
      'world in conflict leaderboards, world in conflict rankings, world in conflict player stats, world in conflict statistics, world in conflict top players, wic leaderboards, wic rankings, wic player stats, wic top players',
  },
  '/community': {
    title: 'World in Conflict Community Hub | WICGATE',
    description:
      'Stay connected with the World in Conflict community. Browse upcoming events, catch live Twitch streams, and watch the latest YouTube videos from our creators.',
    keywords:
      'world in conflict community, world in conflict events, world in conflict event calendar, world in conflict twitch, world in conflict youtube, world in conflict videos, wic community, wic events, wic calendar, wic streams, wic videos, wic discord events',
  },
  '/faq': {
    title: 'World in Conflict FAQ and Help | WICGATE',
    description:
      'Frequently asked questions about WICGATE. Learn about the project, Massgate revival, installation help, technical troubleshooting, gameplay, and server hosting.',
    keywords:
      'world in conflict installation help, world in conflict faq, world in conflict troubleshooting, world in conflict support, massgate help, wic help, wic faq, wic troubleshooting, wicgate help',
  },
  '/login': {
    title: 'WICGATE | Login',
    description: 'Login to WICGATE',
    keywords: '',
    robots: 'noindex, nofollow',
  },
  '/admin': {
    title: 'WICGATE | Admin Dashboard',
    description: 'WICGATE admin dashboard',
    keywords: '',
    robots: 'noindex, nofollow',
  },
};

// Validate all descriptions for SEO optimal length (150-160 chars)
// Runs at module load time to catch issues early
Object.entries(PAGE_META).forEach(([path, meta]) => {
  if (meta?.description && PAGE_META[path]) {
    PAGE_META[path]!.description = validateDescriptionLength(meta.description, path);
  }
});

export function getPageMeta(path: string): PageMetaDefinition | undefined {
  return PAGE_META[path];
}
