import type { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Community from '../views/Community.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'WICGATE - Start Playing World in Conflict Multiplayer',
      description:
        'Install World in Conflict, patch it with WIC LIVE, and join our Discord for live multiplayer support. Everything a returning commander needs to get back online.',
      keywords:
        'world in conflict download, wic live installer, wic discord, world in conflict multiplayer setup, massgate revival',
      ogImage: '/og-home.jpg',
    },
  },
  {
    path: '/community',
    name: 'community',
    component: Community,
    meta: {
      title: 'WICGATE Community Hub - Events, Videos & Live Players',
      description:
        'Track upcoming events, watch the latest World in Conflict videos, monitor who is online, and browse ranked leaderboards. Customize the modules you care about most.',
      keywords:
        'wic community, world in conflict events, wic videos, wic players online, wic leaderboards',
      ogImage: '/og-community.jpg',
    },
  },
  {
    path: '/getting-started',
    redirect: () => ({ path: '/', hash: '#hero' }),
  },
  {
    path: '/statistics',
    redirect: () => ({ path: '/community', hash: '#statistics' }),
  },
  {
    path: '/about',
    redirect: () => ({ path: '/', hash: '#about' }),
  },
  {
    path: '/faq',
    redirect: () => ({ path: '/', hash: '#faq' }),
  },
  {
    path: '/game-mode',
    name: 'game-mode',
    component: () => import('../views/GameMode.vue'),
    meta: {
      title: 'Game Modes - World in Conflict Multiplayer | WICGATE',
      description:
        'Explore World in Conflict multiplayer game modes: Domination, Assault, Tug of War, and more. Learn strategies and tactics for competitive play.',
      keywords: 'wic game modes, world in conflict domination, wic assault, wic tug of war',
      ogImage: '/og-game-mode.jpg',
    },
  },
];
