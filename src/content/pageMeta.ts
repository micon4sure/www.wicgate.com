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
      'Play World in Conflict online with restored multiplayer servers. Join our active community in epic Cold War battles using the real Massgate code.',
    keywords:
      'world in conflict online, world in conflict multiplayer, world in conflict servers, world in conflict revival, massgate, wic online, wic multiplayer, wic servers, play world in conflict online',
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
      'View World in Conflict player rankings, competitive leaderboards, and match statistics. See top players across all game modes and roles including infantry, armor, air, and support.',
    keywords:
      'world in conflict leaderboards, world in conflict rankings, world in conflict player stats, world in conflict statistics, world in conflict top players, wic leaderboards, wic rankings, wic player stats, wic top players',
  },
  '/community': {
    title: 'World in Conflict Community Hub | WICGATE',
    description:
      'Join the World in Conflict community on Discord, watch live streams on Twitch, view latest YouTube videos, and participate in weekly tournaments and events. Active community with 287+ members.',
    keywords:
      'world in conflict community, world in conflict discord, world in conflict tournaments, world in conflict events, world in conflict twitch, world in conflict youtube, wic community, wic discord, wic tournaments, wic streams',
  },
  '/faq': {
    title: 'World in Conflict FAQ and Help | WICGATE',
    description:
      'Frequently asked questions about WICGATE. Learn about the project, Massgate revival, installation help, technical troubleshooting, gameplay features, server hosting, and community information.',
    keywords:
      'world in conflict help, world in conflict faq, world in conflict troubleshooting, world in conflict support, massgate help, wic help, wic faq, wic troubleshooting, wicgate help',
  },
  // Downloads subsections
  '/downloads/quick': {
    title: 'World in Conflict Quick Install with WIC LIVE | WICGATE',
    description:
      'Fast and easy World in Conflict multiplayer installation with WIC LIVE. One-click installer that sets up game patches, community maps, and modern system compatibility automatically.',
    keywords:
      'world in conflict quick install, world in conflict easy install, world in conflict one click installer, world in conflict wic live, how to install world in conflict, wic live installer, wic quick install, wic easy setup',
  },
  '/downloads/server': {
    title: 'World in Conflict Dedicated Server Setup | WICGATE',
    description:
      'Host your own 24/7 World in Conflict dedicated server. Complete setup guide including server files, network configuration, port forwarding, and hosting requirements.',
    keywords:
      'world in conflict dedicated server, world in conflict server hosting, world in conflict server setup, host world in conflict server, wic dedicated server, wic server hosting, wic ds setup, wic server files',
  },
  '/downloads/manual': {
    title: 'World in Conflict Manual Installation Guide | WICGATE',
    description:
      'Advanced manual installation for World in Conflict multiplayer. Install standalone updates, configure hosts file, and add community maps manually for experienced users.',
    keywords:
      'world in conflict manual install, world in conflict advanced setup, world in conflict hosts file, world in conflict standalone update, wic manual install, wic advanced setup',
  },
  // Community subsections
  '/community/streams': {
    title: 'World in Conflict Live Streams on Twitch | WICGATE',
    description:
      'Watch World in Conflict live gameplay streams on Twitch. Follow active streamers, see tournament broadcasts, and join the community during live matches.',
    keywords:
      'world in conflict streams, world in conflict twitch, world in conflict live gameplay, world in conflict streamers, watch world in conflict, wic streams, wic twitch, wic live gameplay',
  },
  '/community/videos': {
    title: 'World in Conflict Videos and Gameplay | WICGATE',
    description:
      'World in Conflict YouTube videos from community content creators. Watch gameplay highlights, strategy guides, tournament VODs, and tutorials from top players.',
    keywords:
      'world in conflict videos, world in conflict youtube, world in conflict gameplay, world in conflict tutorials, world in conflict strategy, wic videos, wic youtube, wic gameplay, wic tutorials',
  },
  // FAQ subsections
  '/faq/about': {
    title: 'About WICGATE | World in Conflict Multiplayer Revival',
    description:
      'Learn about the WICGATE project, Massgate revival using official Ubisoft source code, our core values, team, and what makes WICGATE different from other revival projects.',
    keywords:
      'about wicgate, world in conflict revival, massgate revival, world in conflict multiplayer restoration, what is wicgate, wic revival project',
  },
  '/faq/getting-started': {
    title: 'World in Conflict Getting Started Guide | WICGATE',
    description:
      'Beginner guide to playing World in Conflict online. Learn how to get the game, connect to WICGATE servers, recover lost CD keys, and start playing multiplayer.',
    keywords:
      'world in conflict beginner guide, how to play world in conflict, world in conflict setup guide, world in conflict multiplayer guide, world in conflict cd key, wic beginner guide, wic setup guide, getting started world in conflict',
  },
  '/faq/technical': {
    title: 'World in Conflict Technical Support and Fixes | WICGATE',
    description:
      'Fix World in Conflict technical issues: startup crashes, black screen errors, server browser problems, performance issues, and DirectX compatibility on modern systems.',
    keywords:
      'world in conflict crashes, world in conflict black screen, world in conflict technical issues, world in conflict not working, world in conflict performance, wic crashes, wic technical issues, wic troubleshooting, wic fix',
  },
  '/faq/gameplay': {
    title: 'World in Conflict Gameplay and Game Modes | WICGATE',
    description:
      'World in Conflict gameplay information: all game modes (Domination, Assault, Tug of War), ranking system, version compatibility, and feature details.',
    keywords:
      'world in conflict gameplay, world in conflict game modes, world in conflict ranking system, world in conflict features, world in conflict domination, world in conflict assault, wic gameplay, wic game modes, wic features',
  },
  '/faq/server': {
    title: 'World in Conflict Server and Community Info | WICGATE',
    description:
      'WICGATE community information: current player population, tournament schedules, server hosting guides, technical advantages, and how to get involved.',
    keywords:
      'world in conflict servers, world in conflict player count, world in conflict server hosting, world in conflict tournaments, world in conflict community info, wic servers, wic player count, wic tournaments',
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
