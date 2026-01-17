import type { Config } from 'vike/types';

// Login page - CSR only (authentication)
export default {
  prerender: false,
  ssr: false,
} satisfies Config;
