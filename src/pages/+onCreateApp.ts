import { createPinia } from 'pinia';
import { createHead } from '@unhead/vue';
import type { PageContext } from 'vike/types';

type PageContextWithApp = PageContext & {
  app: NonNullable<PageContext['app']>;
};

// Create Pinia instance and install it on the Vue app
function onCreateApp(pageContext: PageContextWithApp): void {
  const { app } = pageContext;

  // Create and install Pinia
  const pinia = createPinia();
  app.use(pinia);

  // Create and install @unhead/vue for meta tag management
  const head = createHead();
  app.use(head);

  // Provide app base for asset URL construction
  const runtimeBase =
    typeof window !== 'undefined'
      ? new URL(import.meta.env.BASE_URL, window.location.href).pathname
      : '/';
  app.provide('appBase', runtimeBase.endsWith('/') ? runtimeBase : runtimeBase + '/');
}

export { onCreateApp };
