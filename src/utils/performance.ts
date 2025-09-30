/**
 * Web Vitals Performance Monitoring
 * Tracks Core Web Vitals for real user monitoring
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Sends metrics to analytics endpoint or logs to console in dev
 */
function sendToAnalytics(metric: Metric) {
  // In development, log to console
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });
    return;
  }

  // In production, send to analytics endpoint
  // TODO: Replace with your analytics endpoint
  const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;

  if (analyticsEndpoint) {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    });

    // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
    if (navigator.sendBeacon) {
      navigator.sendBeacon(analyticsEndpoint, body);
    } else {
      fetch(analyticsEndpoint, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch((err) => {
        if (import.meta.env.DEV) {
          console.error('[Web Vitals] Failed to send metric:', err);
        }
      });
    }
  }
}

/**
 * Initializes web vitals tracking
 * Should be called once on app mount
 */
export function initWebVitals() {
  // Skip in SSR
  if (import.meta.env.SSR || typeof window === 'undefined') return;

  try {
    // Cumulative Layout Shift - measures visual stability
    // Good: < 0.1, Needs improvement: 0.1-0.25, Poor: > 0.25
    onCLS(sendToAnalytics);

    // First Contentful Paint - measures loading performance
    // Good: < 1.8s, Needs improvement: 1.8-3s, Poor: > 3s
    onFCP(sendToAnalytics);

    // Interaction to Next Paint - measures responsiveness (replaces deprecated FID)
    // Good: < 200ms, Needs improvement: 200-500ms, Poor: > 500ms
    onINP(sendToAnalytics);

    // Largest Contentful Paint - measures loading performance
    // Good: < 2.5s, Needs improvement: 2.5-4s, Poor: > 4s
    onLCP(sendToAnalytics);

    // Time to First Byte - measures connection and server response
    // Good: < 800ms, Needs improvement: 800-1800ms, Poor: > 1800ms
    onTTFB(sendToAnalytics);

    if (import.meta.env.DEV) {
      console.log('[Web Vitals] Tracking initialized');
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[Web Vitals] Failed to initialize:', error);
    }
  }
}

/**
 * Thresholds for Core Web Vitals
 * Use these to display warnings in UI or determine pass/fail
 */
export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  INP: { good: 200, needsImprovement: 500 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
} as const;
