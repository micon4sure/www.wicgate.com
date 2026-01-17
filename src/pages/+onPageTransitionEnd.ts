/// <reference types="vite-plugin-pwa/client" />
import type { PageContextClient } from 'vike/types';
import { registerSW } from 'virtual:pwa-register';

// Track if PWA has been registered (only once per session)
let pwaRegistered = false;

// Initialize client-side features after page transitions
async function onPageTransitionEnd(_pageContext: PageContextClient): Promise<void> {
  // Only run on client
  if (typeof window === 'undefined') return;

  // Initialize PWA service worker (only once)
  if (!pwaRegistered) {
    pwaRegistered = true;
    registerSW({
      immediate: true,
      onNeedRefresh() {
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

  // Initialize stores on first load (stores have internal guards against double-init)
  // Import stores dynamically to avoid SSR issues
  const { useAppDataStore } = await import('../stores/appDataStore');
  const appDataStore = useAppDataStore();
  appDataStore.init();

  const { useAuthStore } = await import('../stores/auth');
  const authStore = useAuthStore();
  // Check auth in background (non-blocking)
  authStore.checkAuth();

  // Enable browser's native scroll restoration
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'auto';
  }
}

export { onPageTransitionEnd };
