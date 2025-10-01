/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

/* Vue 3 + TypeScript module declarations */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

/* Express types for API definitions (frontend doesn't actually use Express) */
declare module 'express' {
  export interface Request {
    [key: string]: any;
  }
  export interface Response<ResBody = any> {
    json(_body: ResBody): void;
    [key: string]: any;
  }
}

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly VITE_API_BASE?: string;
  readonly VITE_SENTRY_DSN?: string;
}

// Global augmentation for Vite environment variables
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
