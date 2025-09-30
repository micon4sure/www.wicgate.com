/**
 * Scroll utility functions for pixel-perfect navigation
 * Part of the WiCGATE dynamic header measurement system
 */

/**
 * Mobile breakpoint constant for buffer calculation
 */
export const MOBILE_BREAKPOINT = 768;

/**
 * Buffer sizes for active section detection tolerance
 * NOT used for scroll positioning - only for detecting which section is currently visible
 */
const DETECTION_BUFFER = {
  MOBILE: 10,
  DESKTOP: 5,
} as const;

/**
 * Gets the exact navigation header height without any buffers.
 * This is the single source of truth for header measurements.
 *
 * @returns Navigation header height in pixels (no buffer)
 *
 * @example
 * ```typescript
 * const navHeight = getNavHeight();
 * // Use for scroll positioning: targetY = sectionTop - navHeight
 * ```
 */
export function getNavHeight(): number {
  const nav = document.querySelector('header');
  if (!nav) return 80; // Fallback for SSR or early mount
  return Math.ceil(nav.getBoundingClientRect().height);
}

/**
 * Gets header height WITH buffer for active section detection.
 * The buffer provides tolerance when detecting which section is currently visible.
 *
 * Mobile browsers (iOS Safari) have dynamic UI elements that can affect positioning,
 * so we use a larger buffer on mobile.
 *
 * @returns Header height + detection buffer in pixels
 *
 * @example
 * ```typescript
 * const offset = getHeaderHeightWithBuffer();
 * // Use for detection: if (scrollY + offset >= sectionTop) { ... }
 * ```
 */
export function getHeaderHeightWithBuffer(): number {
  const navHeight = getNavHeight();
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const buffer = isMobile ? DETECTION_BUFFER.MOBILE : DETECTION_BUFFER.DESKTOP;
  return navHeight + buffer;
}

/**
 * @deprecated Use getHeaderHeightWithBuffer() instead
 * Kept for backward compatibility during migration
 */
export function getDynamicHeaderHeight(): number {
  return getHeaderHeightWithBuffer();
}

/**
 * Scrolls to a section by ID with pixel-perfect positioning
 *
 * Uses getNavHeight() to ensure sections align exactly below the header.
 * The buffer is NOT included in scroll positioning - it's only for detection tolerance.
 *
 * @param sectionId - The HTML element ID to scroll to
 * @param behavior - Scroll behavior ('smooth' or 'auto')
 *
 * @example
 * ```typescript
 * scrollToSection('getting-started'); // Smooth scroll
 * scrollToSection('statistics', 'auto'); // Instant scroll
 * ```
 */
export function scrollToSection(sectionId: string, behavior: 'smooth' | 'auto' = 'smooth'): void {
  if (sectionId === 'hero') {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const sectionElement = document.getElementById(sectionId);

  if (!sectionElement) {
    console.warn(`[scroll] Section not found: ${sectionId}`);
    return;
  }

  // Use exact nav height (no buffer) for scroll positioning
  const headerHeight = getNavHeight();

  // Calculate exact position
  const sectionRect = sectionElement.getBoundingClientRect();
  const sectionTop = sectionRect.top + window.scrollY;
  const targetY = sectionTop - headerHeight;

  // Scroll with calculated offset
  window.scrollTo({
    top: Math.max(0, targetY), // Never scroll to negative position
    behavior,
  });
}
