import type { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Admin from '../views/Admin.vue';
import UserAdmin from '../views/UserAdmin.vue';
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
    name: 'downloads',
    component: Home,
    meta: {
      ...PAGE_META['/downloads'],
      section: 'downloads',
    },
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: Home,
    meta: {
      ...PAGE_META['/statistics'],
      section: 'statistics',
    },
  },
  {
    path: '/community',
    name: 'community',
    component: Home,
    meta: {
      ...PAGE_META['/community'],
      section: 'community',
    },
  },
  {
    path: '/faq',
    name: 'faq',
    component: Home,
    meta: {
      ...PAGE_META['/faq'],
      section: 'faq',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    props: { mode: 'user' },
    meta: {
      ...PAGE_META['/login'],
    },
    beforeEnter: async (_to, _from, next) => {
      // Redirect to user panel if already logged in as user
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated && !import.meta.env.SSR) {
        await authStore.checkAuth();
      }

      if (authStore.isAuthenticated && authStore.isUser) {
        next({ name: 'user' });
      } else {
        next();
      }
    },
  },
  {
    path: '/admin-login',
    name: 'admin-login',
    component: Login,
    props: { mode: 'admin' },
    meta: {
      title: 'WICGATE | Admin Login',
      description: 'Admin login for WICGATE',
    },
    beforeEnter: async (_to, _from, next) => {
      // Redirect to admin panel if already logged in as admin
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated && !import.meta.env.SSR) {
        await authStore.checkAuth();
      }

      if (authStore.isAuthenticated && authStore.isAdmin) {
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
        // Not logged in, redirect to admin login
        next({ name: 'admin-login' });
      } else if (!authStore.isAdmin) {
        // Logged in but not admin, redirect to user panel
        next({ name: 'user' });
      } else {
        // Admin authenticated, proceed
        next();
      }
    },
  },
  {
    path: '/user',
    name: 'user',
    component: UserAdmin,
    meta: {
      title: 'WICGATE | Account Panel',
      description: 'Manage your WICGATE account',
      requiresAuth: true,
    },
    beforeEnter: async (_to, _from, next) => {
      const authStore = useAuthStore();

      if (!authStore.isAuthenticated && !import.meta.env.SSR) {
        await authStore.checkAuth();
      }

      if (!authStore.isAuthenticated) {
        // Not logged in, redirect to login
        next({ name: 'login' });
      } else if (authStore.isAdmin) {
        // Admin logged in, redirect to admin panel
        next({ name: 'admin' });
      } else {
        // User authenticated, proceed
        next();
      }
    },
  },
];
