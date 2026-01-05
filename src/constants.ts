/**
 * Application-wide constants
 * Centralizes magic numbers for better maintainability
 */

// API & Network
export const API_POLLING_INTERVAL = 90_000; // 90 seconds
export const API_RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff
export const MAX_API_RETRIES = 3;

// Server Configuration
export const SERVER_MAX_CAPACITY = 16; // Maximum players per server
export const SERVER_CAPACITY_THRESHOLDS = {
  FULL: 0.9, // 90% = red (nearly full)
  MEDIUM: 0.5, // 50% = orange (moderate)
  LOW: 0, // <50% = green (plenty of space)
} as const;

// UI Performance
export const DEBOUNCE_RESIZE = 150; // Resize handler debounce (ms)

// Timers
export const EVENT_COUNTDOWN_INTERVAL = 1000; // Update countdown every second

// Layout Breakpoints (Tailwind defaults + xs custom)
// xs: 375px (custom), sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
export const BREAKPOINTS = {
  XS: 375, // Custom (small phone)
  SM: 640, // Tailwind default
  MD: 768, // Tailwind default (tablet)
  LG: 1024, // Tailwind default - NAV/TABS SWITCH POINT
  XL: 1280, // Tailwind default
  XXL: 1536, // Tailwind default
} as const;

// Nav/tabs switch at this breakpoint (matches Tailwind lg)
export const NAV_BREAKPOINT = BREAKPOINTS.LG;

// Storage Keys
export const STORAGE_KEYS = {
  FIRST_VISIT: 'wicgate_visited',
  PANEL_OPEN: 'wicgate_panel_open',
} as const;

// External URLs
export const WICLIVE_URL =
  'https://github.com/micon4sure/WICLIVE/releases/latest/download/wiclive_x64-setup.exe';
export const GOG_URL = 'https://www.gog.com/game/world_in_conflict_complete_edition';
export const DISCORD_URL = 'https://discord.gg/Udbv9UDBBb';
