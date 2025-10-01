import { ViteSSG } from 'vite-ssg';
import { createHead } from '@vueuse/head';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/styles/base.css';
import App from './App.vue';
import { routes } from './router/routes';
import { registerSW } from 'virtual:pwa-register';
import { initSentry } from './plugins/sentry';
import type { RouterScrollBehavior, Router } from 'vue-router';
import type { App as VueApp } from 'vue';

type AppSetupContext = {
  app: VueApp;
  router: Router;
  initialState: Record<string, unknown>;
};

// Router base derived from Vite's BASE_URL. When base is './' (our config),
// normalizing against the current URL yields the correct mount path in all environments:
// - Dev server: '/'
// - Custom domain: '/'
// - GitHub Pages under repo path: '/www.wicgate.com/'
const getRuntimeBase = () => {
  if (typeof window === 'undefined') return '/'; // SSR build
  return new URL(import.meta.env.BASE_URL, window.location.href).pathname;
};

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
    onRegistered(registration: ServiceWorkerRegistration | undefined) {
      if (import.meta.env.DEV) {
        console.log('[PWA] Service worker registered:', registration);
      }
    },
    onRegisterError(error: unknown) {
      if (import.meta.env.DEV) {
        console.error('[PWA] Service worker registration error:', error);
      }
    },
  });
}

const scrollBehavior: RouterScrollBehavior = (to, from, saved) => {
  if (saved) return saved;

  if (typeof document !== 'undefined' && to.hash) {
    const el = document.querySelector(to.hash);
    if (el) {
      return { el: to.hash, behavior: 'smooth' };
    }
  }

  const toComponent = to.matched[0]?.components?.default;
  const fromComponent = from.matched[0]?.components?.default;

  if (toComponent === fromComponent && toComponent) {
    return false;
  }

  return { top: 0 };
};

// Export for SSG
export const createApp = ViteSSG(
  App,
  {
    routes,
    base: getRuntimeBase(),
    scrollBehavior,
  },
  ({ app, router, initialState }: AppSetupContext) => {
    // Setup head management
    const head = createHead();
    app.use(head);

    // Provide the app base so components can construct asset URLs
    const runtimeBase = getRuntimeBase();
    app.provide('appBase', runtimeBase.endsWith('/') ? runtimeBase : runtimeBase + '/');

    // Restore state on client-side
    if (import.meta.env.SSR) {
      initialState.pinia = {};
    }

    if (typeof window !== 'undefined') {
      initSentry(app, router);
    }
  }
);
