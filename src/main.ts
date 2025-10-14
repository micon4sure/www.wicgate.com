/// <reference types="vite-plugin-pwa/client" />

import { ViteSSG } from 'vite-ssg';
import { createHead } from '@vueuse/head';
import { createPinia } from 'pinia';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/styles/tailwind.css';
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
// CSS scroll-behavior handles smooth scrolling, JavaScript calculates offsets
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
    scrollBehavior(to, from, savedPosition) {
      // 1. Browser back/forward - restore saved position
      if (savedPosition) {
        return savedPosition;
      }

      // 2. Section or subsection route - scroll to element with manual offset
      const targetId = to.meta.subsection || to.meta.section;
      if (targetId && typeof targetId === 'string') {
        return new Promise((resolve) => {
          // Detect direct navigation (page reload/bookmark) vs SPA navigation
          const isDirectNavigation = !from.name;

          // Determine scroll behavior and delay based on navigation type
          // SPA navigation: Smooth animated scroll (nice UX for clicks)
          // Direct navigation: Instant jump (avoids smooth scroll distance limitations)
          const scrollBehavior = isDirectNavigation ? 'auto' : 'smooth';
          const delay = isDirectNavigation ? 600 : 100; // Longer delay for content stability on reload

          setTimeout(() => {
            const element = document.getElementById(targetId as string);
            if (!element) {
              resolve({ top: 0 });
              return;
            }

            const headerHeight =
              parseInt(
                getComputedStyle(document.documentElement)
                  .getPropertyValue('--header-height')
                  .trim()
              ) || 80;

            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerHeight;

            resolve({
              top: offsetPosition,
              behavior: scrollBehavior, // 'auto' for page reload, 'smooth' for clicks
            });
          }, delay);
        });
      }

      // 3. Default - scroll to top
      return { top: 0 };
    },
  },
  ({ app, isClient }) => {
    // Setup Pinia state management (must be before router for guards to work)
    const pinia = createPinia();
    app.use(pinia);

    // Initialize stores on client side only (after Pinia is registered)
    if (isClient) {
      // Import stores dynamically to avoid SSR issues
      import('./stores/appDataStore').then(({ useAppDataStore }) => {
        const appDataStore = useAppDataStore();
        appDataStore.init();
      });

      import('./stores/auth').then(({ useAuthStore }) => {
        const authStore = useAuthStore();
        // Check auth in background (non-blocking)
        authStore.checkAuth();
      });
    }

    // Setup head management
    const head = createHead();
    app.use(head);

    // Provide the app base so components can construct asset URLs
    const runtimeBase = getRuntimeBase();
    app.provide('appBase', runtimeBase.endsWith('/') ? runtimeBase : runtimeBase + '/');
  }
);
