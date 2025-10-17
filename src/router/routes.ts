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
    path: '/downloads',
    component: Home,
    children: [
      {
        path: '',
        name: 'downloads',
        component: Home,
        meta: {
          ...PAGE_META['/downloads'],
          section: 'downloads',
        },
      },
      {
        path: 'quick',
        name: 'downloads-quick',
        component: Home,
        meta: {
          ...PAGE_META['/downloads/quick'],
          section: 'downloads',
          subsection: 'downloads-quick',
        },
      },
      {
        path: 'server',
        name: 'downloads-server',
        component: Home,
        meta: {
          ...PAGE_META['/downloads/server'],
          section: 'downloads',
          subsection: 'downloads-server',
        },
      },
      {
        path: 'manual',
        name: 'downloads-manual',
        component: Home,
        meta: {
          ...PAGE_META['/downloads/manual'],
          section: 'downloads',
          subsection: 'downloads-manual',
        },
      },
    ],
  },
  {
    path: '/statistics',
    component: Home,
    children: [
      {
        path: '',
        name: 'statistics',
        component: Home,
        meta: {
          ...PAGE_META['/statistics'],
          section: 'statistics',
        },
      },
      {
        path: 'leaderboards',
        name: 'statistics-leaderboards',
        component: Home,
        meta: {
          ...PAGE_META['/statistics/leaderboards'],
          section: 'statistics',
          subsection: 'statistics-leaderboards',
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
    redirect: '/faq',
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
        path: 'about',
        name: 'faq-about',
        component: Home,
        meta: {
          ...PAGE_META['/faq/about'],
          section: 'faq',
          subsection: 'faq-about',
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
        path: 'server-community',
        name: 'faq-server-community',
        component: Home,
        meta: {
          ...PAGE_META['/faq/server-community'],
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
