import type { Config } from 'vike/types';

// Admin login page - CSR only (authentication)
export default {
  prerender: false,
  ssr: false,
} satisfies Config;
