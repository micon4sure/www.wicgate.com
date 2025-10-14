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
  '/getting-started': {
    title: 'Getting Started - Download & Install WiC Multiplayer | WICGATE',
    description:
      'Download and install World in Conflict multiplayer in minutes. Step-by-step guide to join WICGATE community servers with WIC LIVE installer.',
    keywords:
      'world in conflict download, wic install, wic multiplayer setup, wic live, how to play world in conflict online',
    ogImage: '/og-getting-started.jpg',
  },
  '/getting-started/quick': {
    title: 'Quick Installation - Getting Started | WICGATE',
    description:
      'Quick 3-step installation guide for World in Conflict multiplayer. Get playing in under 5 minutes with WIC LIVE installer.',
    keywords: 'wic quick install, wic live installer, world in conflict setup',
    ogImage: '/og-getting-started.jpg',
  },
  '/getting-started/advanced': {
    title: 'Advanced Setup - Dedicated Servers & Manual Install | WICGATE',
    description:
      'Advanced setup options for World in Conflict: dedicated server hosting, manual installation, and network configuration.',
    keywords: 'wic dedicated server, wic manual install, world in conflict server hosting',
    ogImage: '/og-getting-started.jpg',
  },
  '/multiplayer': {
    title: 'Multiplayer - Live Servers & Rankings | WICGATE',
    description:
      'View live World in Conflict multiplayer servers with online players and competitive leaderboards. Track top players and see real-time server activity.',
    keywords:
      'wic multiplayer, wic servers, wic online players, wic leaderboards, world in conflict rankings, wic stats, world in conflict live servers',
    ogImage: '/og-statistics.jpg',
  },
  '/multiplayer/servers': {
    title: 'Live Servers - Players Online Now | WICGATE',
    description:
      'See live World in Conflict servers with current player counts. Join active games and find opponents in real-time.',
    keywords: 'wic live servers, wic players online, world in conflict active games',
    ogImage: '/og-statistics.jpg',
  },
  '/multiplayer/statistics': {
    title: 'Player Statistics & Leaderboards | WICGATE',
    description:
      'View World in Conflict player rankings, competitive leaderboards, and match statistics. See top players across all game modes.',
    keywords: 'wic leaderboards, world in conflict rankings, wic player stats, wic top players',
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
    title: 'About WICGATE - Official Massgate Server Revival | WICGATE',
    description:
      'Learn about the community-driven initiative to preserve World in Conflict multiplayer using the official Massgate source code released by Ubisoft.',
    keywords:
      'massgate, wic revival, world in conflict servers, massgate source code, wic community project',
    ogImage: '/og-about.jpg',
  },
  '/about/mission': {
    title: 'Our Mission - Preserving WiC Multiplayer | WICGATE',
    description:
      'Our mission to preserve and revitalize World in Conflict multiplayer using the official Massgate source code for current and future generations.',
    keywords: 'wic preservation, massgate revival, world in conflict mission',
    ogImage: '/og-about.jpg',
  },
  '/about/story': {
    title: 'The Story - How WICGATE Began | WICGATE',
    description:
      'The story of how WICGATE started when Ubisoft open-sourced Massgate server code, enabling authentic WiC multiplayer restoration.',
    keywords: 'wic history, massgate open source, world in conflict story',
    ogImage: '/og-about.jpg',
  },
  '/about/values': {
    title: 'Our Values - What Drives WICGATE | WICGATE',
    description:
      'WICGATE core values: authentic experience, community-driven development, fair competition, and open source spirit.',
    keywords: 'wic values, community project, open source gaming',
    ogImage: '/og-about.jpg',
  },
  '/about/team': {
    title: 'The Team - Meet WICGATE Contributors | WICGATE',
    description:
      'Meet the WICGATE team: developers, moderators, and community contributors keeping World in Conflict multiplayer alive.',
    keywords: 'wic team, wic developers, wic community',
    ogImage: '/og-about.jpg',
  },
  '/faq': {
    title: 'FAQ - Help & Troubleshooting | WICGATE',
    description:
      'Frequently asked questions about installing, troubleshooting, and playing World in Conflict on WICGATE servers. Get help with crashes, server connectivity, and gameplay.',
    keywords:
      'wic help, world in conflict troubleshooting, wic faq, wic crashes, wic server issues, world in conflict support',
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
  '/faq/community': {
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
