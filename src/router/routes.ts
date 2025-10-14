import type { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Admin from '../views/Admin.vue';
import { useAuthStore } from '../stores/auth';
import { PAGE_META } from '../content/pageMeta';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      ...PAGE_META['/'],
    },
  },
  {
    path: '/getting-started',
    component: Home,
    children: [
      {
        path: '',
        name: 'getting-started',
        component: Home,
        meta: {
          ...PAGE_META['/getting-started'],
          section: 'getting-started',
        },
      },
      {
        path: 'quick',
        name: 'getting-started-quick',
        component: Home,
        meta: {
          ...PAGE_META['/getting-started/quick'],
          section: 'getting-started',
          subsection: 'getting-started-quick',
        },
      },
      {
        path: 'advanced',
        name: 'getting-started-advanced',
        component: Home,
        meta: {
          ...PAGE_META['/getting-started/advanced'],
          section: 'getting-started',
          subsection: 'getting-started-advanced',
        },
      },
    ],
  },
  {
    path: '/multiplayer',
    component: Home,
    children: [
      {
        path: '',
        name: 'multiplayer',
        component: Home,
        meta: {
          ...PAGE_META['/multiplayer'],
          section: 'multiplayer',
        },
      },
      {
        path: 'servers',
        name: 'multiplayer-servers',
        component: Home,
        meta: {
          ...PAGE_META['/multiplayer/servers'],
          section: 'multiplayer',
          subsection: 'multiplayer-servers',
        },
      },
      {
        path: 'statistics',
        name: 'multiplayer-statistics',
        component: Home,
        meta: {
          ...PAGE_META['/multiplayer/statistics'],
          section: 'multiplayer',
          subsection: 'multiplayer-statistics',
        },
      },
    ],
  },
  {
    path: '/community',
    component: Home,
    children: [
      {
        path: '',
        name: 'community',
        component: Home,
        meta: {
          ...PAGE_META['/community'],
          section: 'community',
        },
      },
      {
        path: 'events',
        name: 'community-events',
        component: Home,
        meta: {
          ...PAGE_META['/community/events'],
          section: 'community',
          subsection: 'community-events',
        },
      },
      {
        path: 'streams',
        name: 'community-streams',
        component: Home,
        meta: {
          ...PAGE_META['/community/streams'],
          section: 'community',
          subsection: 'community-streams',
        },
      },
      {
        path: 'videos',
        name: 'community-videos',
        component: Home,
        meta: {
          ...PAGE_META['/community/videos'],
          section: 'community',
          subsection: 'community-videos',
        },
      },
    ],
  },
  {
    path: '/about',
    component: Home,
    children: [
      {
        path: '',
        name: 'about',
        component: Home,
        meta: {
          ...PAGE_META['/about'],
          section: 'about',
        },
      },
      {
        path: 'mission',
        name: 'about-mission',
        component: Home,
        meta: {
          ...PAGE_META['/about/mission'],
          section: 'about',
          subsection: 'about-mission',
        },
      },
      {
        path: 'story',
        name: 'about-story',
        component: Home,
        meta: {
          ...PAGE_META['/about/story'],
          section: 'about',
          subsection: 'about-story',
        },
      },
      {
        path: 'values',
        name: 'about-values',
        component: Home,
        meta: {
          ...PAGE_META['/about/values'],
          section: 'about',
          subsection: 'about-values',
        },
      },
      {
        path: 'team',
        name: 'about-team',
        component: Home,
        meta: {
          ...PAGE_META['/about/team'],
          section: 'about',
          subsection: 'about-team',
        },
      },
    ],
  },
  {
    path: '/faq',
    component: Home,
    children: [
      {
        path: '',
        name: 'faq',
        component: Home,
        meta: {
          ...PAGE_META['/faq'],
          section: 'faq',
        },
      },
      {
        path: 'getting-started',
        name: 'faq-getting-started',
        component: Home,
        meta: {
          ...PAGE_META['/faq/getting-started'],
          section: 'faq',
          subsection: 'faq-getting-started',
        },
      },
      {
        path: 'technical',
        name: 'faq-technical',
        component: Home,
        meta: {
          ...PAGE_META['/faq/technical'],
          section: 'faq',
          subsection: 'faq-technical',
        },
      },
      {
        path: 'gameplay',
        name: 'faq-gameplay',
        component: Home,
        meta: {
          ...PAGE_META['/faq/gameplay'],
          section: 'faq',
          subsection: 'faq-gameplay',
        },
      },
      {
        path: 'community',
        name: 'faq-server-community',
        component: Home,
        meta: {
          ...PAGE_META['/faq/community'],
          section: 'faq',
          subsection: 'faq-server-community',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      ...PAGE_META['/login'],
    },
    beforeEnter: async (_to, _from, next) => {
      // Redirect to admin if already logged in
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated && !import.meta.env.SSR) {
        await authStore.checkAuth();
      }

      if (authStore.isAuthenticated) {
        next({ name: 'admin' });
      } else {
        next();
      }
    },
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: {
      ...PAGE_META['/admin'],
      requiresAuth: true,
      requiresAdmin: true,
    },
    beforeEnter: async (_to, _from, next) => {
      const authStore = useAuthStore();

      if (!authStore.isAuthenticated && !import.meta.env.SSR) {
        await authStore.checkAuth();
      }

      if (!authStore.isAuthenticated) {
        // Not logged in, redirect to login with return URL
        next({
          name: 'login',
          query: { redirect: '/admin' },
        });
      } else if (!authStore.isAdmin) {
        // Logged in but not admin, redirect to home
        next({ name: 'home' });
      } else {
        // Admin authenticated, proceed
        next();
      }
    },
  },
];
