import type { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'WICGATE - World in Conflict Multiplayer Revival',
      description:
        'Play World in Conflict online with restored multiplayer servers. Join our active community in epic Cold War battles using the real Massgate code.',
      keywords:
        'world in conflict, wic multiplayer, massgate, wic online, world in conflict servers, wic revival',
      ogImage: '/og-home.jpg',
    },
  },
  {
    path: '/getting-started',
    name: 'getting-started',
    component: Home,
    meta: {
      section: 'getting-started',
      title: 'Getting Started - Download & Install WiC Multiplayer | WICGATE',
      description:
        'Download and install World in Conflict multiplayer in minutes. Step-by-step guide to join WICGATE community servers with WIC LIVE installer.',
      keywords:
        'world in conflict download, wic install, wic multiplayer setup, wic live, how to play world in conflict online',
      ogImage: '/og-getting-started.jpg',
    },
  },
  {
    path: '/multiplayer',
    name: 'multiplayer',
    component: Home,
    meta: {
      section: 'multiplayer',
      title: 'Multiplayer - Live Servers & Rankings | WICGATE',
      description:
        'View live World in Conflict multiplayer servers with online players and competitive leaderboards. Track top players and see real-time server activity.',
      keywords:
        'wic multiplayer, wic servers, wic online players, wic leaderboards, world in conflict rankings, wic stats, world in conflict live servers',
      ogImage: '/og-statistics.jpg',
    },
  },
  {
    path: '/community',
    name: 'community',
    component: Home,
    meta: {
      section: 'community',
      title: 'Community & Events - Discord, Tournaments & Videos | WICGATE',
      description:
        'Join the World in Conflict community on Discord, watch tournaments on YouTube and Twitch, and participate in weekly events. Active community with 287+ members.',
      keywords:
        'wic discord, world in conflict community, wic tournaments, wic youtube, wic twitch, world in conflict events',
      ogImage: '/og-community.jpg',
    },
  },
  {
    path: '/about',
    name: 'about',
    component: Home,
    meta: {
      section: 'about',
      title: 'About WICGATE - Official Massgate Server Revival | WICGATE',
      description:
        'Learn about the community-driven initiative to preserve World in Conflict multiplayer using the official Massgate source code released by Ubisoft.',
      keywords:
        'massgate, wic revival, world in conflict servers, massgate source code, wic community project',
      ogImage: '/og-about.jpg',
    },
  },
  {
    path: '/faq',
    name: 'faq',
    component: Home,
    meta: {
      section: 'faq',
      title: 'FAQ - Help & Troubleshooting | WICGATE',
      description:
        'Frequently asked questions about installing, troubleshooting, and playing World in Conflict on WICGATE servers. Get help with crashes, server connectivity, and gameplay.',
      keywords:
        'wic help, world in conflict troubleshooting, wic faq, wic crashes, wic server issues, world in conflict support',
      ogImage: '/og-faq.jpg',
    },
  },
];
