import type { Config } from 'vike/types';

// Admin panel - CSR only (authenticated, admin only)
export default {
  prerender: false,
  ssr: false,
} satisfies Config;
