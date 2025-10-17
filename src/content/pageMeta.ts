export interface PageMetaDefinition {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  canonical?: string;
  robots?: string;
}

export const DEFAULT_SITE_URL = 'https://wicgate.com';
export const DEFAULT_OG_IMAGE = '/og-default.jpg';

export const PAGE_META: Record<string, PageMetaDefinition> = {
  '/': {
    title: 'WICGATE - World in Conflict Multiplayer Revival',
    description:
      'Play World in Conflict online with restored multiplayer servers. Join our active community in epic Cold War battles using the real Massgate code.',
    keywords:
      'world in conflict, wic multiplayer, massgate, wic online, world in conflict servers, wic revival',
    ogImage: '/og-home.jpg',
  },
  '/downloads': {
    title: 'Downloads - Get WiC Multiplayer | WICGATE',
    description:
      'Download and install World in Conflict multiplayer. Quick install with WIC LIVE, host your own dedicated server, or manual installation for advanced users.',
    keywords:
      'world in conflict download, wic install, wic multiplayer setup, wic live, wic dedicated server, world in conflict server hosting, wic manual install, how to play world in conflict online',
    ogImage: '/og-getting-started.jpg',
  },
  '/statistics': {
    title: 'Statistics - Player Rankings & Leaderboards | WICGATE',
    description:
      'View World in Conflict player rankings, competitive leaderboards, and match statistics. See top players across all game modes and roles including infantry, armor, air, and support.',
    keywords:
      'wic leaderboards, world in conflict rankings, wic player stats, wic top players, world in conflict statistics, wic competitive stats',
    ogImage: '/og-statistics.jpg',
  },
  '/community': {
    title: 'Community & Events - Discord, Tournaments & Videos | WICGATE',
    description:
      'Join the World in Conflict community on Discord, watch live streams on Twitch, view latest YouTube videos, and participate in weekly tournaments and events. Active community with 287+ members.',
    keywords:
      'wic discord, world in conflict community, wic tournaments, wic youtube, wic twitch, world in conflict events, wic streams, wic videos, wic live gameplay',
    ogImage: '/og-community.jpg',
  },
  '/faq': {
    title: 'FAQ - Help, About & Troubleshooting | WICGATE',
    description:
      'Frequently asked questions about WICGATE. Learn about the project, Massgate revival, installation help, technical troubleshooting, gameplay features, server hosting, and community information.',
    keywords:
      'wic help, world in conflict troubleshooting, wic faq, about wicgate, massgate, wic crashes, wic server issues, world in conflict support, wic install help, wic gameplay, wic features, wic server hosting',
    ogImage: '/og-faq.jpg',
  },
  // Downloads subsections
  '/downloads/quick': {
    title: 'Quick Install - Download WiC LIVE | WICGATE',
    description:
      'Fast and easy World in Conflict multiplayer installation with WIC LIVE. One-click installer that sets up game patches, community maps, and modern system compatibility automatically.',
    keywords:
      'how to install world in conflict, wic live installer, quick install wic, wic easy setup, world in conflict one click install, wic live download',
    ogImage: '/og-getting-started.jpg',
  },
  '/downloads/server': {
    title: 'Dedicated Server Setup - Host Your Own WiC Server | WICGATE',
    description:
      'Host your own 24/7 World in Conflict dedicated server. Complete setup guide including server files, network configuration, port forwarding, and hosting requirements.',
    keywords:
      'world in conflict dedicated server, wic server hosting, wic ds setup, how to host wic server, world in conflict server files, wic server configuration',
    ogImage: '/og-getting-started.jpg',
  },
  '/downloads/manual': {
    title: 'Manual Installation - Advanced WiC Setup | WICGATE',
    description:
      'Advanced manual installation for World in Conflict multiplayer. Install standalone updates, configure hosts file, and add community maps manually for experienced users.',
    keywords:
      'world in conflict manual installation, wic advanced install, manual wic setup, wic standalone update, world in conflict hosts file',
    ogImage: '/og-getting-started.jpg',
  },
  // Community subsections
  '/community/streams': {
    title: 'Live Streams - Watch WiC Gameplay on Twitch | WICGATE',
    description:
      'Watch World in Conflict live gameplay streams on Twitch. Follow active streamers, see tournament broadcasts, and join the community during live matches.',
    keywords:
      'world in conflict twitch streams, wic live gameplay, watch wic streams, world in conflict streamers, wic twitch channels, wic live broadcasts',
    ogImage: '/og-community.jpg',
  },
  '/community/videos': {
    title: 'Video Content - WiC Tutorials & Gameplay | WICGATE',
    description:
      'World in Conflict YouTube videos from community content creators. Watch gameplay highlights, strategy guides, tournament VODs, and tutorials from top players.',
    keywords:
      'world in conflict youtube videos, wic content creators, wic gameplay videos, wic tutorials, world in conflict strategy guides, wic tournament vods',
    ogImage: '/og-community.jpg',
  },
  // FAQ subsections
  '/faq/about': {
    title: 'About WICGATE - Project Info & Massgate Revival | WICGATE',
    description:
      'Learn about the WICGATE project, Massgate revival using official Ubisoft source code, our core values, team, and what makes WICGATE different from other revival projects.',
    keywords:
      'about wicgate, what is massgate, wicgate project, massgate revival, world in conflict revival project, wic server restoration',
    ogImage: '/og-faq.jpg',
  },
  '/faq/getting-started': {
    title: 'Getting Started FAQ - How to Play WiC Online | WICGATE',
    description:
      'Beginner guide to playing World in Conflict online. Learn how to get the game, connect to WICGATE servers, recover lost CD keys, and start playing multiplayer.',
    keywords:
      'how to play world in conflict, wic beginner guide, wic setup guide, world in conflict cd key, wic multiplayer how to, getting started wic',
    ogImage: '/og-faq.jpg',
  },
  '/faq/technical': {
    title: 'Technical Support - WiC Troubleshooting & Fixes | WICGATE',
    description:
      'Fix World in Conflict technical issues: startup crashes, black screen errors, server browser problems, performance issues, and DirectX compatibility on modern systems.',
    keywords:
      'world in conflict troubleshooting, wic crashes, wic technical issues, world in conflict black screen, wic server browser not working, wic performance fix',
    ogImage: '/og-faq.jpg',
  },
  '/faq/gameplay': {
    title: 'Gameplay FAQ - WiC Features & Game Modes | WICGATE',
    description:
      'World in Conflict gameplay information: all game modes (Domination, Assault, Tug of War), ranking system, version compatibility, and feature details.',
    keywords:
      'world in conflict gameplay, wic features, wic game modes, world in conflict ranking, wic multiplayer features, wic domination assault',
    ogImage: '/og-faq.jpg',
  },
  '/faq/server': {
    title: 'Server & Community FAQ - Population, Tournaments & Hosting | WICGATE',
    description:
      'WICGATE community information: current player population, tournament schedules, server hosting guides, technical advantages, and how to get involved.',
    keywords:
      'world in conflict server info, wic community, wic tournaments, wic player count, world in conflict hosting, wic server population',
    ogImage: '/og-faq.jpg',
  },
  '/login': {
    title: 'Login - WICGATE',
    description: 'Login to WICGATE',
    keywords: '',
    robots: 'noindex, nofollow',
  },
  '/admin': {
    title: 'Admin Dashboard - WICGATE',
    description: 'WICGATE admin dashboard',
    keywords: '',
    robots: 'noindex, nofollow',
  },
};

export function getPageMeta(path: string): PageMetaDefinition | undefined {
  return PAGE_META[path];
}
