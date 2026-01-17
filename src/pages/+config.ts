import vikeVue from 'vike-vue/config';
import type { Config } from 'vike/types';

export default {
  // Use vike-vue for rendering
  extends: vikeVue,

  // Default to SSR mode (can be overridden per page)
  prerender: false,

  // Pass data to client for hydration
  passToClient: ['pageProps', 'urlPathname'],

  // Default title template
  title: 'WICGATE - World in Conflict Multiplayer Revival',

  // Favicon
  favicon: '/favicon.svg',
} satisfies Config;
