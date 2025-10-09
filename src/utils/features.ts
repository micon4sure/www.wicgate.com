/**
 * Feature Flag System
 *
 * Provides runtime feature toggles for gradual rollout, A/B testing, and environment-specific features.
 * Supports both static config and localStorage overrides for development/testing.
 *
 * @example
 * ```typescript
 * // Check if feature is enabled
 * if (isFeatureEnabled('new-dashboard')) {
 *   renderNewDashboard();
 * }
 *
 * // Enable feature for testing (localStorage override)
 * setFeatureOverride('experimental-charts', true);
 *
 * // Get all enabled features
 * const enabled = getEnabledFeatures();
 * ```
 */

// ============================================================================
// Feature Flag Configuration
// ============================================================================

/**
 * All available feature flags
 * Add new features here with descriptive names
 */
export type FeatureFlag =
  // Performance optimizations
  | 'intersection-observer' // Use IntersectionObserver for scroll detection
  | 'memoized-sorting' // Memoize expensive sorting operations
  | 'lazy-widgets' // Lazy load widget components
  // UI enhancements
  | 'enhanced-statistics' // Show advanced statistics charts
  | 'player-profiles' // Enhanced player profile pages
  | 'dark-mode' // Dark mode theme toggle
  // Experimental features
  | 'experimental-search' // Advanced search functionality
  | 'beta-notifications' // Push notification support
  | 'analytics' // Enable analytics tracking
  // Development/debug features
  | 'debug-mode' // Show debug information
  | 'verbose-logging'; // Enable verbose console logging

/**
 * Feature flag configuration with default states
 * Features can be enabled/disabled based on environment
 */
interface FeatureConfig {
  enabled: boolean;
  description: string;
  environments?: ('development' | 'production' | 'test')[];
}

/**
 * Default feature flag configuration
 * Update this to enable/disable features globally
 */
const FEATURE_CONFIG: Record<FeatureFlag, FeatureConfig> = {
  // Performance optimizations (enabled in production)
  'intersection-observer': {
    enabled: true,
    description: 'Use IntersectionObserver API for scroll detection',
  },
  'memoized-sorting': {
    enabled: true,
    description: 'Memoize expensive sorting and filtering operations',
  },
  'lazy-widgets': {
    enabled: false, // Not implemented yet
    description: 'Lazy load widget components for faster initial page load',
  },

  // UI enhancements
  'enhanced-statistics': {
    enabled: false, // Future feature
    description: 'Show advanced statistics with interactive charts',
  },
  'player-profiles': {
    enabled: false, // Future feature
    description: 'Enhanced player profile pages with stats history',
  },
  'dark-mode': {
    enabled: false, // Future feature
    description: 'Dark mode theme toggle',
  },

  // Experimental features (development only)
  'experimental-search': {
    enabled: false,
    description: 'Advanced search with filters and fuzzy matching',
    environments: ['development'],
  },
  'beta-notifications': {
    enabled: false,
    description: 'Push notification support for events',
    environments: ['development'],
  },
  analytics: {
    enabled: true,
    description: 'Enable analytics tracking',
    environments: ['production'],
  },

  // Debug features (development only)
  'debug-mode': {
    enabled: false,
    description: 'Show debug information overlays',
    environments: ['development'],
  },
  'verbose-logging': {
    enabled: false,
    description: 'Enable verbose console logging',
    environments: ['development'],
  },
};

// ============================================================================
// Feature Flag API
// ============================================================================

/**
 * LocalStorage key prefix for feature overrides
 */
const STORAGE_PREFIX = 'wicgate_feature_';

/**
 * Get current environment
 * @returns Current environment ('development', 'production', or 'test')
 */
function getCurrentEnvironment(): 'development' | 'production' | 'test' {
  if (import.meta.env.MODE === 'test') return 'test';
  if (import.meta.env.DEV) return 'development';
  return 'production';
}

/**
 * Check if a feature is enabled
 * Considers: environment restrictions, localStorage overrides, and default config
 *
 * @param feature - Feature flag to check
 * @returns True if feature is enabled
 *
 * @example
 * ```typescript
 * if (isFeatureEnabled('enhanced-statistics')) {
 *   renderAdvancedCharts();
 * }
 * ```
 */
export function isFeatureEnabled(feature: FeatureFlag): boolean {
  const config = FEATURE_CONFIG[feature];
  if (!config) {
    if (import.meta.env.DEV) {
      console.warn(`[Features] Unknown feature flag: ${feature}`);
    }
    return false;
  }

  // Check localStorage override (for development/testing)
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem(STORAGE_PREFIX + feature);
    if (override !== null) {
      return override === '1' || override === 'true';
    }
  }

  // Check environment restrictions
  if (config.environments) {
    const currentEnv = getCurrentEnvironment();
    if (!config.environments.includes(currentEnv)) {
      return false;
    }
  }

  // Return default config value
  return config.enabled;
}

/**
 * Set feature override in localStorage (for development/testing)
 * Overrides take precedence over default config
 *
 * @param feature - Feature flag to override
 * @param enabled - Whether to enable or disable the feature
 *
 * @example
 * ```typescript
 * // Enable experimental feature for testing
 * setFeatureOverride('experimental-search', true);
 *
 * // Disable feature temporarily
 * setFeatureOverride('analytics', false);
 * ```
 */
export function setFeatureOverride(feature: FeatureFlag, enabled: boolean): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_PREFIX + feature, enabled ? '1' : '0');
    if (import.meta.env.DEV) {
      console.log(`[Features] Override set: ${feature} = ${enabled}`);
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(`[Features] Failed to set override for ${feature}:`, error);
    }
  }
}

/**
 * Clear feature override from localStorage
 * Restores default config behavior
 *
 * @param feature - Feature flag to clear override for
 *
 * @example
 * ```typescript
 * clearFeatureOverride('experimental-search');
 * ```
 */
export function clearFeatureOverride(feature: FeatureFlag): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_PREFIX + feature);
    if (import.meta.env.DEV) {
      console.log(`[Features] Override cleared: ${feature}`);
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(`[Features] Failed to clear override for ${feature}:`, error);
    }
  }
}

/**
 * Clear all feature overrides from localStorage
 *
 * @example
 * ```typescript
 * clearAllFeatureOverrides();
 * ```
 */
export function clearAllFeatureOverrides(): void {
  if (typeof window === 'undefined') return;

  try {
    const keys = Object.keys(localStorage);
    let cleared = 0;

    for (const key of keys) {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
        cleared++;
      }
    }

    if (import.meta.env.DEV) {
      console.log(`[Features] Cleared ${cleared} override(s)`);
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Features] Failed to clear overrides:', error);
    }
  }
}

/**
 * Get all enabled features
 * Useful for debugging or analytics
 *
 * @returns Array of enabled feature flags
 *
 * @example
 * ```typescript
 * const enabled = getEnabledFeatures();
 * console.log('Active features:', enabled);
 * // ['intersection-observer', 'memoized-sorting', 'analytics']
 * ```
 */
export function getEnabledFeatures(): FeatureFlag[] {
  const enabled: FeatureFlag[] = [];

  for (const feature of Object.keys(FEATURE_CONFIG) as FeatureFlag[]) {
    if (isFeatureEnabled(feature)) {
      enabled.push(feature);
    }
  }

  return enabled;
}

/**
 * Get all feature flags with their current state and configuration
 * Useful for admin/debug UIs
 *
 * @returns Object with feature flags as keys and their state/config
 *
 * @example
 * ```typescript
 * const features = getAllFeatures();
 * // {
 * //   'intersection-observer': { enabled: true, description: '...', hasOverride: false },
 * //   'debug-mode': { enabled: false, description: '...', hasOverride: true }
 * // }
 * ```
 */
export function getAllFeatures(): Record<FeatureFlag, FeatureConfig & { hasOverride: boolean }> {
  const result = {} as Record<FeatureFlag, FeatureConfig & { hasOverride: boolean }>;

  for (const [feature, config] of Object.entries(FEATURE_CONFIG) as Array<
    [FeatureFlag, FeatureConfig]
  >) {
    const hasOverride =
      typeof window !== 'undefined' && localStorage.getItem(STORAGE_PREFIX + feature) !== null;

    result[feature] = {
      ...config,
      enabled: isFeatureEnabled(feature),
      hasOverride,
    };
  }

  return result;
}

/**
 * Get feature description
 * Useful for showing feature toggles in settings UI
 *
 * @param feature - Feature flag to get description for
 * @returns Feature description string
 *
 * @example
 * ```typescript
 * getFeatureDescription('dark-mode');
 * // 'Dark mode theme toggle'
 * ```
 */
export function getFeatureDescription(feature: FeatureFlag): string {
  return FEATURE_CONFIG[feature]?.description || 'Unknown feature';
}

// ============================================================================
// Development Utilities
// ============================================================================

/**
 * Log all feature flags (development only)
 * Useful for debugging feature state
 *
 * @example
 * ```typescript
 * logFeatureFlags(); // Logs table of all features to console
 * ```
 */
export function logFeatureFlags(): void {
  if (!import.meta.env.DEV) return;

  const features = getAllFeatures();
  const table: Record<string, any>[] = [];

  for (const [name, config] of Object.entries(features)) {
    table.push({
      Feature: name,
      Enabled: config.enabled ? '✅' : '❌',
      Override: config.hasOverride ? '🔧' : '',
      Environment: config.environments?.join(', ') || 'all',
      Description: config.description,
    });
  }

  console.group('🎛️  Feature Flags');
  console.table(table);
  console.groupEnd();
}

/**
 * Export feature flags to window for console access (development only)
 * Allows testing features via browser console
 *
 * @example
 * ```typescript
 * // In browser console:
 * window.features.enable('experimental-search');
 * window.features.disable('analytics');
 * window.features.list();
 * ```
 */
export function exposeToWindow(): void {
  if (!import.meta.env.DEV || typeof window === 'undefined') return;

  (window as any).features = {
    enable: (feature: FeatureFlag) => setFeatureOverride(feature, true),
    disable: (feature: FeatureFlag) => setFeatureOverride(feature, false),
    clear: (feature: FeatureFlag) => clearFeatureOverride(feature),
    clearAll: () => clearAllFeatureOverrides(),
    list: () => logFeatureFlags(),
    get: (feature: FeatureFlag) => isFeatureEnabled(feature),
    getAll: () => getAllFeatures(),
  };

  console.log(
    '[Features] Type `window.features.list()` to see all feature flags, or `window.features.enable("feature-name")` to enable a feature'
  );
}
