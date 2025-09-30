import { ViteSSG } from 'vite-ssg';
import { createHead } from '@vueuse/head';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/styles/base.css';
import App from './App.vue';
import { routes } from './router/routes';

// Router base derived from Vite's BASE_URL. When base is './' (our config),
// normalizing against the current URL yields the correct mount path in all environments:
// - Dev server: '/'
// - Custom domain: '/'
// - GitHub Pages under repo path: '/www.wicgate.com/'
const getRuntimeBase = () => {
  if (typeof window === 'undefined') return '/'; // SSR build
  return new URL(import.meta.env.BASE_URL, window.location.href).pathname;
};

// Export for SSG
export const createApp = ViteSSG(
  App,
  {
    routes,
    base: getRuntimeBase(),
    scrollBehavior(to, from, saved) {
      // Return saved position for browser back/forward
      if (saved) return saved;

      // For hash-based navigation (legacy support)
      if (to.hash) {
        const el = document.querySelector(to.hash);
        if (el) {
          return { el: to.hash, behavior: 'smooth' } as any;
        }
      }

      // Check if both routes use the same component (Home.vue)
      const toComponent = to.matched[0]?.components?.default;
      const fromComponent = from.matched[0]?.components?.default;

      // If navigating within Home component sections, don't auto-scroll
      // Let Home.vue's watcher handle the smooth scroll from current position
      if (toComponent === fromComponent && toComponent) {
        return false; // Disable automatic scroll
      }

      // For different pages (e.g., navigating to /game-mode), scroll to top
      return { top: 0 };
    },
  },
  ({ app, router, initialState }) => {
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
  }
);
