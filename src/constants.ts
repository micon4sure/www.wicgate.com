/**
 * Application-wide constants
 * Centralizes magic numbers for better maintainability
 */

// API & Network
export const API_POLLING_INTERVAL = 90_000; // 90 seconds
export const API_RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff
export const MAX_API_RETRIES = 3;

// UI Performance
export const DEBOUNCE_RESIZE = 150; // Resize handler debounce (ms)
export const DEBOUNCE_INPUT = 300; // Input handler debounce (ms)
export const SCROLL_SMOOTH_DELAY = 1500; // Smooth scroll animation duration (ms)

// Timers
export const EVENT_COUNTDOWN_INTERVAL = 1000; // Update countdown every second
export const VIDEO_REFRESH_INTERVAL = 1000; // Update video timestamps every second

// Layout
export const MOBILE_BREAKPOINT = 768; // Mobile/desktop breakpoint (px)
export const TABLET_BREAKPOINT = 1024; // Tablet/desktop breakpoint (px)

// Storage Keys
export const STORAGE_KEYS = {
  FIRST_VISIT: 'wicgate_visited',
  PANEL_OPEN: 'wicgate_panel_open',
  COMMUNITY_VIDEOS_EXPANDED: 'community_videos_expanded',
  ADVANCED_SETUP_EXPANDED: 'advanced_setup_expanded',
} as const;
