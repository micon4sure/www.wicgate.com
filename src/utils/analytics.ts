/**
 * Analytics Event Tracking Utilities
 * Provides type-safe wrapper for common analytics events
 */

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

/**
 * Sends an event to the analytics endpoint
 * Falls back to console logging in development
 */
export function trackEvent(event: AnalyticsEvent): void {
  // Skip in SSR
  if (import.meta.env.SSR || typeof window === 'undefined') return;

  // In development, log to console
  if (import.meta.env.DEV) {
    console.log('[Analytics Event]', event);
    return;
  }

  // In production, send to analytics endpoint
  const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;

  if (analyticsEndpoint) {
    const body = JSON.stringify({
      ...event,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    });

    // Use sendBeacon if available, falling back to fetch
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
          console.error('[Analytics] Failed to send event:', err);
        }
      });
    }
  }
}

/**
 * Common analytics events used throughout the application
 */
export const AnalyticsEvents = {
  // Navigation
  sectionView: (sectionName: string) =>
    trackEvent({
      category: 'Navigation',
      action: 'Section View',
      label: sectionName,
    }),

  externalLink: (linkUrl: string) =>
    trackEvent({
      category: 'Navigation',
      action: 'External Link Click',
      label: linkUrl,
    }),

  // Downloads
  downloadClick: (fileName: string) =>
    trackEvent({
      category: 'Download',
      action: 'Download Click',
      label: fileName,
    }),

  // Social
  discordJoin: () =>
    trackEvent({
      category: 'Social',
      action: 'Discord Join Click',
    }),

  youtubeVideo: (videoTitle: string) =>
    trackEvent({
      category: 'Social',
      action: 'YouTube Video Click',
      label: videoTitle,
    }),

  twitchStream: (channelName: string) =>
    trackEvent({
      category: 'Social',
      action: 'Twitch Stream View',
      label: channelName,
    }),

  // Game Mode
  gameModeEnter: () =>
    trackEvent({
      category: 'Game',
      action: 'Game Mode Enter',
    }),

  gameModeExit: () =>
    trackEvent({
      category: 'Game',
      action: 'Game Mode Exit',
    }),

  // Players
  playersButtonClick: (playerCount: number) =>
    trackEvent({
      category: 'Players',
      action: 'Players Button Click',
      value: playerCount,
    }),

  serverBrowserOpen: () =>
    trackEvent({
      category: 'Players',
      action: 'Server Browser Open',
    }),

  // Leaderboards
  leaderboardTabSwitch: (tabName: string) =>
    trackEvent({
      category: 'Leaderboards',
      action: 'Tab Switch',
      label: tabName,
    }),

  // FAQ
  faqItemToggle: (question: string) =>
    trackEvent({
      category: 'FAQ',
      action: 'Question Toggle',
      label: question,
    }),

  // First Visit
  firstVisitWelcome: (landingSection: string) =>
    trackEvent({
      category: 'Onboarding',
      action: 'First Visit Welcome',
      label: landingSection,
    }),

  firstVisitAction: (action: 'go-home' | 'continue' | 'dismiss') =>
    trackEvent({
      category: 'Onboarding',
      action: 'First Visit Action',
      label: action,
    }),

  // Errors
  errorBoundary: (errorMessage: string) =>
    trackEvent({
      category: 'Error',
      action: 'Component Error',
      label: errorMessage,
    }),

  apiError: (endpoint: string) =>
    trackEvent({
      category: 'Error',
      action: 'API Error',
      label: endpoint,
    }),
} as const;
