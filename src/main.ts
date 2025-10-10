/// <reference types="vite-plugin-pwa/client" />

import { ViteSSG } from 'vite-ssg';
import { createHead } from '@vueuse/head';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/styles/base.css';
import App from './App.vue';
import { routes } from './router/routes';
import { registerSW } from 'virtual:pwa-register';

// Router base derived from Vite's BASE_URL. When base is './' (our config),
// normalizing against the current URL yields the correct mount path in all environments:
// - Dev server: '/'
// - Custom domain: '/'
// - GitHub Pages under repo path: '/www.wicgate.com/'
const getRuntimeBase = () => {
  if (typeof window === 'undefined') return '/'; // SSR build
  return new URL(import.meta.env.BASE_URL, window.location.href).pathname;
};

// Enable browser's native scroll restoration
// Modern best practice: Let browser handle scroll position restoration
// CSS scroll-behavior + scroll-padding-top handle smooth scrolling and offsets
if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
  history.scrollRestoration = 'auto';
}

// Register PWA service worker (client-side only)
if (typeof window !== 'undefined') {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      // When new content is available, refresh automatically
      // Alternatively, you could show a toast notification asking user to refresh
      if (import.meta.env.DEV) {
        console.log('[PWA] New content available, refreshing...');
      }
    },
    onOfflineReady() {
      if (import.meta.env.DEV) {
        console.log('[PWA] App ready to work offline');
      }
    },
    onRegistered(_registration: ServiceWorkerRegistration | undefined) {
      if (import.meta.env.DEV) {
        console.log('[PWA] Service worker registered');
      }
    },
    onRegisterError(_error: Error) {
      if (import.meta.env.DEV) {
        console.error('[PWA] Service worker registration error');
      }
    },
  });
}

// Export for SSG
export const createApp = ViteSSG(
  App,
  {
    routes,
    base: getRuntimeBase(),
    scrollBehavior(to, _from, savedPosition) {
      // Native browser scroll behavior - minimal JavaScript, CSS does the work

      // 1. Browser back/forward - restore saved position
      if (savedPosition) {
        return savedPosition;
      }

      // 2. Section or subsection route - scroll to element
      // CSS scroll-padding-top automatically handles header offset
      const targetId = to.meta.subsection || to.meta.section;
      if (targetId) {
        return {
          el: `#${targetId}`,
          behavior: 'smooth', // Uses CSS scroll-behavior
        };
      }

      // 3. Default - scroll to top
      return { top: 0 };
    },
  },
  ({ app }) => {
    // Setup head management
    const head = createHead();
    app.use(head);

    // Provide the app base so components can construct asset URLs
    const runtimeBase = getRuntimeBase();
    app.provide('appBase', runtimeBase.endsWith('/') ? runtimeBase : runtimeBase + '/');
  }
);
