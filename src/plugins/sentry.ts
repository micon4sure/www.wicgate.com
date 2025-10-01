/**
 * Sentry Error Tracking Configuration
 * Only enabled in production with proper DSN configuration
 */

import type { App } from 'vue';
import * as Sentry from '@sentry/vue';

export function initSentry(app: App) {
  // Only initialize in production with valid DSN
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!import.meta.env.PROD || !dsn) {
    console.log('[Sentry] Skipped (not production or DSN not configured)');
    return;
  }

  try {
    Sentry.init({
      app,
      dsn,
      environment: import.meta.env.MODE,

      // Performance monitoring
      tracesSampleRate: 0.1, // 10% of transactions

      // Session replay for debugging (sample 10% of sessions)
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

      // Integration configuration
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],

      // Filter out known issues
      beforeSend(event, hint) {
        // Ignore errors from browser extensions
        if (
          event.exception?.values?.[0]?.stacktrace?.frames?.some(
            (frame) =>
              frame.filename?.includes('extension://') ||
              frame.filename?.includes('chrome-extension://')
          )
        ) {
          return null;
        }

        // Ignore network errors (already handled by retry logic)
        if (
          hint.originalException instanceof TypeError &&
          hint.originalException.message.includes('fetch')
        ) {
          return null;
        }

        return event;
      },
    });

    console.log('[Sentry] Initialized successfully');
  } catch (error) {
    console.error('[Sentry] Failed to initialize:', error);
  }
}
