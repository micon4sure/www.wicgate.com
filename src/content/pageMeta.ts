export interface PageMetaDefinition {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  canonical?: string;
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
      'Download and install World in Conflict multiplayer in minutes. Step-by-step guide to join WICGATE community servers with WIC LIVE installer.',
    keywords:
      'world in conflict download, wic install, wic multiplayer setup, wic live, how to play world in conflict online',
    ogImage: '/og-getting-started.jpg',
  },
  '/downloads/quick': {
    title: 'Quick Install - Downloads | WICGATE',
    description:
      'Quick 3-step installation guide for World in Conflict multiplayer. Get playing in under 5 minutes with WIC LIVE installer.',
    keywords: 'wic quick install, wic live installer, world in conflict setup',
    ogImage: '/og-getting-started.jpg',
  },
  '/downloads/server': {
    title: 'Dedicated Server Setup - Downloads | WICGATE',
    description:
      'Host your own 24/7 World in Conflict dedicated server. Complete setup guide with network configuration and port forwarding.',
    keywords: 'wic dedicated server, world in conflict server hosting, wic server setup',
    ogImage: '/og-getting-started.jpg',
  },
  '/downloads/manual': {
    title: 'Manual Install - Downloads | WICGATE',
    description:
      'Advanced manual installation for World in Conflict multiplayer. Install WICGATE components individually for custom configurations.',
    keywords: 'wic manual install, world in conflict advanced setup, wic custom install',
    ogImage: '/og-getting-started.jpg',
  },
  '/statistics': {
    title: 'Statistics - Player Rankings & Leaderboards | WICGATE',
    description:
      'View World in Conflict player rankings, competitive leaderboards, and match statistics. See top players across all game modes and roles.',
    keywords:
      'wic leaderboards, world in conflict rankings, wic player stats, wic top players, world in conflict statistics',
    ogImage: '/og-statistics.jpg',
  },
  '/statistics/leaderboards': {
    title: 'Leaderboards - Top Players & Rankings | WICGATE',
    description:
      'Competitive leaderboards for World in Conflict. View top players by total score, infantry, armor, air, and support roles.',
    keywords:
      'wic leaderboards, world in conflict rankings, wic top players, wic competitive stats',
    ogImage: '/og-statistics.jpg',
  },
  '/community': {
    title: 'Community & Events - Discord, Tournaments & Videos | WICGATE',
    description:
      'Join the World in Conflict community on Discord, watch tournaments on YouTube and Twitch, and participate in weekly events. Active community with 287+ members.',
    keywords:
      'wic discord, world in conflict community, wic tournaments, wic youtube, wic twitch, world in conflict events',
    ogImage: '/og-community.jpg',
  },
  '/community/events': {
    title: 'Community Events & Tournaments | WICGATE',
    description:
      'Join World in Conflict community events, weekly tournaments, and special operations. Compete for prizes and custom roles.',
    keywords: 'wic tournaments, world in conflict events, wic competitions',
    ogImage: '/og-community.jpg',
  },
  '/community/streams': {
    title: 'Live Twitch Streams | WICGATE',
    description:
      'Watch live World in Conflict gameplay on Twitch. Follow community streamers and catch tournament broadcasts.',
    keywords: 'wic twitch, world in conflict streams, wic live gameplay',
    ogImage: '/og-community.jpg',
  },
  '/community/videos': {
    title: 'Latest YouTube Videos | WICGATE',
    description:
      'Watch World in Conflict tutorials, tournament VODs, gameplay highlights, and strategy guides on YouTube.',
    keywords: 'wic youtube, world in conflict videos, wic tutorials, wic gameplay',
    ogImage: '/og-community.jpg',
  },
  '/about': {
    title: 'About - Redirecting to FAQ | WICGATE',
    description:
      'Information about WICGATE has moved to the FAQ section. You will be redirected automatically.',
    keywords: 'about wicgate, massgate',
    canonical: '/faq/about',
  },
  '/faq': {
    title: 'FAQ - Help, About & Troubleshooting | WICGATE',
    description:
      'Frequently asked questions about WICGATE, installing, troubleshooting, and playing World in Conflict. Learn about the project, get help with crashes and server connectivity.',
    keywords:
      'wic help, world in conflict troubleshooting, wic faq, about wicgate, massgate, wic crashes, wic server issues, world in conflict support',
    ogImage: '/og-faq.jpg',
  },
  '/faq/about': {
    title: 'About WICGATE - Official Massgate Server Revival | WICGATE',
    description:
      'Learn about the community-driven initiative to preserve World in Conflict multiplayer using the official Massgate source code released by Ubisoft.',
    keywords:
      'massgate, wic revival, world in conflict servers, massgate source code, wic community project, about wicgate',
    ogImage: '/og-faq.jpg',
  },
  '/faq/getting-started': {
    title: 'FAQ - Getting Started Questions | WICGATE',
    description:
      'Common questions about installing World in Conflict, connecting to WICGATE servers, and getting started with multiplayer.',
    keywords: 'wic install help, wic setup faq, world in conflict getting started',
    ogImage: '/og-faq.jpg',
  },
  '/faq/technical': {
    title: 'FAQ - Technical Issues & Troubleshooting | WICGATE',
    description:
      'Troubleshooting technical problems with World in Conflict: crashes, black screens, server connectivity, and performance issues.',
    keywords: 'wic crashes, wic troubleshooting, world in conflict fixes, wic technical support',
    ogImage: '/og-faq.jpg',
  },
  '/faq/gameplay': {
    title: 'FAQ - Gameplay & Features | WICGATE',
    description:
      'Questions about World in Conflict gameplay, game modes, ranking system, and multiplayer features on WICGATE.',
    keywords: 'wic gameplay, wic features, world in conflict game modes, wic ranking',
    ogImage: '/og-faq.jpg',
  },
  '/faq/server-community': {
    title: 'FAQ - Server Hosting & Community | WICGATE',
    description:
      'Questions about hosting dedicated World in Conflict servers, player population, tournaments, and community information.',
    keywords: 'wic server hosting, wic community, world in conflict tournaments, wic player count',
    ogImage: '/og-faq.jpg',
  },
  '/login': {
    title: 'Login - WICGATE Admin',
    description: 'Admin login for WICGATE multiplayer server management',
    keywords: 'wicgate admin, wicgate login, world in conflict admin',
  },
  '/admin': {
    title: 'Admin Dashboard - WICGATE',
    description: 'WICGATE admin dashboard for server management and analytics',
    keywords: 'wicgate admin dashboard, server management',
  },
};

export function getPageMeta(path: string): PageMetaDefinition | undefined {
  return PAGE_META[path];
}
