import type { Config } from 'vike/types';

// User panel - CSR only (authenticated)
export default {
  prerender: false,
  ssr: false,
} satisfies Config;
