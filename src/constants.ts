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

// Timers
export const EVENT_COUNTDOWN_INTERVAL = 1000; // Update countdown every second

// Layout Breakpoints
// Used in JavaScript responsive logic and CSS @media queries (often hardcoded in CSS)
export const MOBILE_BREAKPOINT = 768; // Mobile/tablet breakpoint (px)
export const TABLET_BREAKPOINT = 1024; // Tablet/desktop breakpoint (px)

// Storage Keys
export const STORAGE_KEYS = {
  FIRST_VISIT: 'wicgate_visited',
  PANEL_OPEN: 'wicgate_panel_open',
} as const;
