/// <reference types="vite/client" />

/* Vue 3 + TypeScript module declarations */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // DefineComponent generic parameters are complex; using object types for basic declaration
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

/*
 * Express types for API endpoint type definitions.
 * These are placeholder types used only for documenting the API contract.
 * The frontend doesn't use Express directly.
 */
declare module 'express' {
  /** Minimal request placeholder for API endpoint type definitions */
  export interface Request {
    params?: Record<string, string>;
    query?: Record<string, string>;
    body?: unknown;
  }
  /** Minimal response placeholder for API endpoint type definitions */
  export interface Response<ResBody = unknown> {
    json(_body: ResBody): void;
  }
}

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_SITE_URL?: string;
}

// Global augmentation for Vite environment variables
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
