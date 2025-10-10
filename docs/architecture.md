# Architecture Documentation

> **⚠️ MAJOR UPDATE (October 2025):** Scroll & Navigation system completely refactored to use native CSS/HTML scrolling. See [Native Scroll System](#native-scroll--navigation-system-october-2025) section below. Legacy documentation retained for historical reference but marked as deprecated.

## Overview

WiCGATE implements a sophisticated **hybrid rendering architecture** that combines Static Site Generation (SSG) for SEO with Single Page Application (SPA) behavior for user experience.

## Quick Architecture Summary

- **Entry:** ViteSSG for Static Site Generation with client-side hydration
- **Routing:** 27 pre-rendered routes (1 homepage + 5 main sections + 21 subsections)
- **Hybrid Strategy:** SSG for SEO (unique HTML per route) + SPA for UX (smooth scrolling, no page reloads)
- **Scroll & Navigation:** Native CSS/HTML scrolling with minimal JavaScript enhancement (October 2025 refactor)
- **State Management:** Composable module pattern with reactive refs, 3-retry exponential backoff, 90s polling, Page Visibility API
- **Data Layer:** API integration via composables (useYoutube, useEvents) with SSR-safe execution
- **Components:** Reusable widgets in /components, screen sections in /screens, routed pages in /views
- **Styling:** Modular CSS under /assets/styles/modules, design tokens in variables.css
- **Testing:** Tests covering data store functionality

---

## Native Scroll & Navigation System (October 2025)

### Philosophy: CSS First, JavaScript Enhancement

The scroll and navigation system was completely refactored in October 2025 to follow modern web standards: **let the browser do what it does best** (scrolling), and use JavaScript only for app-specific enhancements.

### Architecture

```
CSS (scroll-behavior + scroll-padding-top)
  ↓
Browser (handles ALL scrolling natively)
  ↓
Router (declarative scrollBehavior)
  ↓
IntersectionObserver (navigation highlighting only)
```

### Key Implementation Details

#### 1. Dynamic Header Height + Native CSS Smooth Scrolling
**Files:**
- [src/assets/styles/modules/reset.css](../src/assets/styles/modules/reset.css)
- [src/utils/headerHeight.ts](../src/utils/headerHeight.ts)

**CSS Setup:**
```css
:root {
  /* Dynamic header height - updated by JavaScript */
  --header-height: 80px;  /* Fallback only */
}

html {
  scroll-behavior: smooth;        /* GPU-accelerated smooth scrolling */
  scroll-padding-top: var(--header-height);  /* Dynamic offset */
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;        /* Accessibility: respect user preferences */
  }
}
```

**JavaScript Auto-Sync:**
```typescript
// src/utils/headerHeight.ts
export function syncHeaderHeight(): (() => void) | void {
  if (typeof window === 'undefined') return;

  const updateHeaderHeight = () => {
    const header = document.querySelector('header');
    if (!header) return;

    // Measure actual rendered height (includes borders, padding, etc.)
    const height = header.getBoundingClientRect().height;

    // Update CSS variable
    document.documentElement.style.setProperty('--header-height', `${height}px`);
  };

  updateHeaderHeight();  // Initial sync

  // Update on resize with RAF
  let rafId: number;
  const handleResize = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateHeaderHeight);
  };

  window.addEventListener('resize', handleResize);
  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', handleResize);
  };
}
```

**Benefits:**
- ✅ **Zero maintenance**: Change header CSS anytime, scroll offset auto-updates
- ✅ **Pixel-perfect**: Measures actual browser-rendered height (not CSS guesses)
- ✅ **Responsive**: Auto-adapts to all breakpoints on resize
- ✅ **Future-proof**: Works even if header structure changes during development
- ✅ **Performance**: Uses RAF (60fps), GPU-accelerated scrolling
- ✅ **Accessibility**: Respects `prefers-reduced-motion`

#### 2. Native Scroll Restoration
**File:** [src/main.ts](../src/main.ts)

```typescript
if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
  history.scrollRestoration = 'auto';  // Let browser handle restoration
}
```

**What This Fixes:**
- ✅ Perfect scroll position restoration on page refresh
- ✅ Working browser back/forward buttons
- ✅ No race conditions with async content
- ✅ Zero custom scroll position logic needed

#### 3. Simplified Router scrollBehavior
**File:** [src/main.ts](../src/main.ts)

```typescript
scrollBehavior(to, _from, savedPosition) {
  // 1. Browser back/forward - restore saved position
  if (savedPosition) {
    return savedPosition;
  }

  // 2. Section or subsection route - scroll to element
  // CSS scroll-padding-top automatically handles header offset
  const targetId = to.meta.subsection || to.meta.section;
  if (targetId) {
    return {
      el: `#${targetId}`,
      behavior: 'smooth',  // Uses CSS scroll-behavior
    };
  }

  // 3. Default - scroll to top
  return { top: 0 };
}
```

**Reduced from 60+ lines to 15 lines** by letting browser APIs do the work.

#### 4. Minimal JavaScript Enhancement
**File:** [src/composables/useScrollTracker.ts](../src/composables/useScrollTracker.ts)

Single responsibility: Track active section for navigation highlighting.

```typescript
export function useScrollTracker() {
  const currentSection = ref<string | undefined>();
  let observer: IntersectionObserver | null = null;

  if (typeof window !== 'undefined') {
    observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.find(e => e.isIntersecting);
        if (intersecting) {
          currentSection.value = intersecting.target.id;
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',  // Active zone
        threshold: 0,
      }
    );
  }

  return { currentSection, observe, disconnect };
}
```

**What Was Removed:**
- ❌ `useActiveSection.ts` (200+ lines of complex state management)
- ❌ `useSectionObserver.ts` (150+ lines of observer logic)
- ❌ `utils/scroll.ts` (100+ lines of scroll utilities)
- ❌ Programmatic scroll flags and timing delays
- ❌ Manual scroll position calculations
- ❌ Route watchers for scrolling

**Code Reduction:** 80% (500+ lines → ~100 lines)

### What This System Provides

| Feature | Implementation | Benefit |
|---------|---------------|---------|
| Smooth scrolling | CSS `scroll-behavior: smooth` | GPU-accelerated, zero JS |
| Dynamic header offset | CSS variable + JS measurement | Pixel-perfect at all breakpoints, zero maintenance |
| Responsive adaptation | `syncHeaderHeight()` on resize | Auto-adapts when header changes |
| Scroll restoration | `history.scrollRestoration: auto` | Browser handles perfectly |
| Active section | Single IntersectionObserver | Performant, SSR-safe |
| Accessibility | `prefers-reduced-motion` | Built-in support |

### Migration Notes

**Removed Features:**
- Expandable sections (Community videos, Getting Started advanced) - now always visible for better discoverability
- Fast scroll transition disabling - not needed with native scrolling
- Navigation flash prevention flags - not needed without programmatic scroll logic

**Preserved Features:**
- Router-based navigation (click nav → smooth scroll to section)
- Active section highlighting
- Analytics tracking
- SSG/SSR compatibility

### Testing

**Build & Runtime:**
- ✅ TypeScript: No errors
- ✅ ESLint: No errors
- ✅ Tests: All passing
- ✅ Production build: Successful
- ✅ SSR: No hydration issues

**User Experience:**
- ✅ Click navigation → smooth scroll to section
- ✅ Page refresh → stays at current section
- ✅ Browser back/forward → perfect scroll restoration
- ✅ Deep links → scroll to target section
- ✅ Keyboard navigation → works natively

---

## Core Architecture

### Entry Point

**File:** [src/main.ts](../src/main.ts)

- Uses ViteSSG for Static Site Generation with client-side hydration
- Registers PWA service worker for offline capability
- Configures Vue Router with custom scroll behavior
- Initializes composable state modules with SSR support

### Constants & Configuration

**File:** [src/constants.ts](../src/constants.ts)

Centralized configuration values to eliminate magic numbers across the codebase:

**API & Network:**
```typescript
API_POLLING_INTERVAL = 90_000           // 90 second polling
API_RETRY_DELAYS = [1000, 2000, 4000]  // Exponential backoff delays
MAX_API_RETRIES = 3                     // 3 retry attempts
```

**UI Performance:**
```typescript
DEBOUNCE_RESIZE = 150                   // Resize handler debounce (ms)
EVENT_COUNTDOWN_INTERVAL = 1000         // Countdown timer updates
```

**Layout Breakpoints:**
```typescript
MOBILE_BREAKPOINT = 768                 // Mobile/tablet split (px)
TABLET_BREAKPOINT = 1024                // Tablet/desktop split (px)
```

**Scroll Animation Timings:**
```typescript
SCROLL_SMOOTH_DURATION = 1500           // Smooth scroll + buffer (ms)
SCROLL_FAST_SETTLE = 300                // Fast scroll settle delay (ms)
SCROLL_TOP_DURATION = 1000              // Scroll to top timeout (ms)
```

**Storage Keys:**
```typescript
STORAGE_KEYS = {
  FIRST_VISIT: 'wicgate_visited',
  PANEL_OPEN: 'wicgate_panel_open',
  COMMUNITY_VIDEOS_EXPANDED: 'community_videos_expanded',
  ADVANCED_SETUP_EXPANDED: 'advanced_setup_expanded',
} as const;
```

**Why Centralized:**
- Single source of truth for timing and breakpoint values
- JavaScript imports constants for responsive logic
- CSS uses hardcoded values in @media queries (documented in constants.ts comments)
- Easier maintenance when tuning performance
- Self-documenting code (constant names explain values)

**Usage Example:**
```typescript
import { MOBILE_BREAKPOINT, SCROLL_SMOOTH_DURATION } from '@/constants';

// Responsive logic
if (window.innerWidth <= MOBILE_BREAKPOINT) {
  // Mobile-specific behavior
}

// Timing logic
setTimeout(() => {
  isProgrammaticScrolling.value = false;
}, SCROLL_SMOOTH_DURATION);
```

### Routing System

**File:** [src/router/routes.ts](../src/router/routes.ts)

**Architecture:** Path-based nested routes with 27 total pre-rendered routes:

**Main Routes (6):**
- `/` - Homepage with widget dashboard
- `/getting-started` - Installation guide
- `/multiplayer` - Live servers and player rankings
- `/community` - Events, videos, creators
- `/about` - Project information
- `/faq` - Frequently asked questions

**Subsection Routes (21):**
- **Getting Started (2):** `/getting-started/quick`, `/getting-started/advanced`
- **Multiplayer (2):** `/multiplayer/servers`, `/multiplayer/statistics`
- **Community (3):** `/community/events`, `/community/streams`, `/community/videos`
- **About (4):** `/about/mission`, `/about/story`, `/about/values`, `/about/team`
- **FAQ (4):** `/faq/getting-started`, `/faq/technical`, `/faq/gameplay`, `/faq/community`

Each route includes comprehensive SEO metadata (unique title, description, keywords, Open Graph tags).

**Navigation Helper:** [src/types/navigation.ts](../src/types/navigation.ts) provides `getRoutePath()` function to convert section/subsection IDs to proper route paths (e.g., `'multiplayer-statistics'` → `'/multiplayer/statistics'`).

## SSG/SSR Architecture

### The Dual-Rendering System

**Build Time (SSG - For Search Engines):**

```typescript
// During npm run build, each route pre-renders unique HTML
function shouldRenderSection(sectionId: string): boolean {
  if (!isSSR) return true; // Client: render all
  if (!targetSection.value) return true; // Homepage: render all
  return targetSection.value === sectionId; // Section route: only target
}
```

**Runtime (SPA - For Users):**
- JavaScript hydrates the page
- All sections render regardless of route
- Smooth scroll animations between sections
- No page reloads when navigating

### Build Output

```bash
npm run build → Generates 27 unique HTML files:

# Main routes (6)
dist/index.html              44.63 KB  # Homepage with all sections
dist/getting-started.html    14.04 KB  # Getting Started section
dist/multiplayer.html        11.29 KB  # Multiplayer section
dist/community.html          17.07 KB  # Community section
dist/about.html              11.81 KB  # About section
dist/faq.html                15.84 KB  # FAQ section

# Subsection routes (21)
dist/getting-started/quick.html          14.06 KB
dist/getting-started/advanced.html       14.06 KB
dist/multiplayer/servers.html            11.30 KB
dist/multiplayer/statistics.html         11.30 KB
dist/community/events.html               17.09 KB
dist/community/streams.html              17.09 KB
dist/community/videos.html               17.09 KB
dist/about/mission.html                  11.83 KB
dist/about/story.html                    11.83 KB
dist/about/values.html                   11.83 KB
dist/about/team.html                     11.83 KB
dist/faq/getting-started.html            15.86 KB
dist/faq/technical.html                  15.86 KB
dist/faq/gameplay.html                   15.86 KB
dist/faq/community.html                  15.85 KB
```

### SEO Benefits

✅ **Unique Content Per URL:** Each of 27 routes serves different HTML with focused content
✅ **No Duplicate Content:** Google indexes 27 separate pages (6 sections + 21 subsections)
✅ **Fast Initial Load:** Pre-rendered HTML loads instantly
✅ **Progressive Enhancement:** Content visible without JavaScript
✅ **Semantic Skeleton Loaders:** SEO-friendly placeholders with descriptive text
✅ **Subsection SEO:** Each subsection has unique meta tags for targeted search traffic

### How It Solves Duplicate Content

**❌ Hash-based routing problem (before SSG):**
```
wicgate.com/          → Serves index.html (36KB, all sections)
wicgate.com/#game-mode → Serves index.html (36KB, all sections) ← DUPLICATE
wicgate.com/#community  → Serves index.html (36KB, all sections) ← DUPLICATE
```
Google sees identical content at all URLs = duplicate content penalty.

**✅ Path-based SSG solution (current):**
```
wicgate.com/           → Serves index.html (36KB, all sections)
wicgate.com/multiplayer → Serves multiplayer.html (8.5KB, multiplayer only) ← UNIQUE
wicgate.com/community  → Serves community.html (13KB, community only) ← UNIQUE
```
Google sees different content at each URL = proper indexing.

### User Experience Flow

1. **User visits `/multiplayer` directly (browser address bar):**
   - Server sends `multiplayer.html` (8.5KB, only multiplayer section)
   - User sees skeleton loader with SEO text
   - JavaScript loads and hydrates
   - `isSSR` becomes `false`, all sections render client-side
   - **Auto-scroll to section:** `onMounted()` detects `route.meta.section` and scrolls to multiplayer
   - User can now scroll smoothly to any section

2. **User clicks "Community" nav link:**
   - Vue Router intercepts click (prevents page reload)
   - Route changes to `/community`
   - Route watcher triggers smooth scroll animation
   - Scrolls from current position to Community section
   - URL updates without page refresh

3. **Search Engine crawls `/multiplayer`:**
   - Receives pre-rendered `multiplayer.html`
   - No JavaScript execution needed
   - Sees only Multiplayer content with proper meta tags
   - Indexes as unique page focused on live servers and player rankings

### Direct Sublink Navigation Implementation

**Problem Solved (October 2025):**
Direct URL access to sublinks (e.g., typing `/multiplayer` in browser) would load the route but not scroll to the section, leaving users at the top of the homepage.

**Solution:**
Enhanced `onMounted()` in [src/views/Home.vue:262-290](../src/views/Home.vue#L262-290) to handle both hash-based and path-based navigation:

```typescript
// Determine initial section from route metadata
const sectionFromRoute = targetSection.value; // From route.meta.section
const hash = window.location.hash ? window.location.hash.substring(1) : undefined;

// Only scroll if not showing first visit overlay
if (!showFirstVisitOverlay.value) {
  // Handle legacy hash navigation (#multiplayer)
  if (hash) {
    scrollToSectionUtil(hash, 'smooth');
  }
  // Handle direct sublink navigation (/multiplayer)
  else if (sectionFromRoute) {
    scrollToSectionUtil(sectionFromRoute, 'smooth');
  }
}
```

**Key Points:**
- **Crawlers unaffected:** They receive pre-rendered HTML without JavaScript execution
- **Users enhanced:** JavaScript auto-scrolls to target section after hydration
- **Dual navigation support:** Handles both `/multiplayer` (modern) and `/#multiplayer` (legacy)
- **First visit integration:** Respects overlay state, only scrolls when appropriate
- **Route watcher preserved:** In-app navigation continues using existing watcher

### Progressive Enhancement Philosophy

- **Base Layer (no JS):** Readable content for crawlers + accessibility
- **Enhanced Layer (with JS):** Full UX with animations + live data + auto-scroll to sections
- **Not Cloaking:** Same content, different loading strategy (Google-approved)

### SSR Hydration Best Practices

**Overview:**
SSR hydration is the process where client-side JavaScript takes over the static HTML rendered by the server. For hydration to work correctly, the initial HTML rendered on both server and client MUST be identical, otherwise Vue will throw hydration mismatch warnings.

**The Hydration Mismatch Problem:**

When server renders HTML and client renders different HTML, Vue cannot properly hydrate:

```typescript
// ❌ WRONG - Causes hydration mismatch
const stored = typeof window !== 'undefined' ? localStorage.getItem('key') : null;
const expanded = ref(stored === '1');
// Server renders: expanded = false (no localStorage in Node.js)
// Client renders: expanded = true (if localStorage has '1')
// Result: HTML mismatch, Vue warning in console
```

**The Solution Pattern - SSR-Safe State Initialization:**

```typescript
// ✅ CORRECT - Initialize to SSR-safe default
const expanded = ref(false); // Always false during SSR build

// ✅ CORRECT - Read browser state AFTER hydration
onMounted(() => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('key');
    if (stored === '1') {
      expanded.value = true; // Only update after mount
    }
  }
});
```

**Why This Works:**
1. **Server renders:** `expanded = false` → Generates HTML with collapsed state
2. **Client hydrates:** `expanded = false` → Matches server HTML perfectly
3. **After hydration:** `onMounted()` runs → Reads localStorage → Updates state
4. **Result:** No mismatch warning, smooth UX

**v-show vs v-if for SSR:**

**Use `v-show` (not `v-if`) for expandable sections:**

```vue
<!-- ❌ v-if causes layout shifts -->
<div v-if="expanded" class="content">
  <!-- Content removed from DOM when collapsed -->
  <!-- Re-inserted when expanded → causes layout shift -->
</div>

<!-- ✅ v-show prevents layout shifts -->
<div v-show="expanded" class="content" style="display: none">
  <!-- Content stays in DOM, just hidden with CSS -->
  <!-- No DOM mutation → no layout shift → stable scroll position -->
</div>
```

**Decision Guide - v-show vs v-if:**

| Use Case | Directive | Reason |
|----------|-----------|--------|
| **Expandable sections** | `v-show` | Prevents layout shifts, SSR-friendly |
| **SSR conditional sections** | `shouldRenderSection()` | Controls what gets pre-rendered |
| **Never-needed-again content** | `v-if` | Removes from DOM permanently |
| **Frequently toggled** | `v-show` | Better performance (no DOM mutations) |
| **Heavy content, rarely shown** | `v-if` | Saves memory when hidden |

**Real-World Example from WiCGATE:**

Advanced Setup section in Getting Started uses this pattern:

```vue
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const EXPAND_KEY = 'advanced_setup_expanded';
// Initialize to false (SSR-safe, prevents hydration mismatch)
const isAdvancedExpanded = ref(false);

// Read localStorage AFTER component mounts (after hydration)
onMounted(() => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(EXPAND_KEY);
    if (stored === '1') {
      isAdvancedExpanded.value = true;
    }
  }
});

// Save preference when changed
watch(isAdvancedExpanded, (val) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(EXPAND_KEY, val ? '1' : '0');
  }
});
</script>

<template>
  <!-- v-show keeps content in DOM, prevents scroll jumping -->
  <div v-show="isAdvancedExpanded" class="advanced-content">
    <!-- Dedicated Server Setup steps... -->
  </div>
</template>

<style>
/* Smooth CSS transitions for expand/collapse */
.advanced-content {
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 5000px;
  opacity: 1;
}

.advanced-content[style*="display: none"] {
  max-height: 0;
  opacity: 0;
}
</style>
```

**Benefits of This Pattern:**
- ✅ Zero hydration warnings - Server and client HTML match perfectly
- ✅ No scroll jumping - DOM stays stable (v-show doesn't mutate)
- ✅ Smooth UX - CSS transitions provide polish
- ✅ User preference respected - localStorage read after mount
- ✅ SEO-friendly - All content in pre-rendered HTML

**Trade-offs:**
- ⚠️ Brief flash (~50-100ms) where section is collapsed before localStorage kicks in
- This is **standard practice** for SSR apps and imperceptible to users
- Alternative would be hydration warnings + unpredictable behavior

**References:**
- Implementation: [src/screens/GettingStarted.vue](../src/screens/GettingStarted.vue), [src/screens/Community.vue](../src/screens/Community.vue), [src/screens/Multiplayer.vue](../src/screens/Multiplayer.vue)
- CSS patterns: [docs/design-system.md - Expandable Sections](design-system.md#expandable-section-transitions)
- Changelog: [docs/changelog.md - Scroll Jumping & Hydration Fix](changelog.md#scroll-jumping--ssr-hydration-fix)

### Key Implementation Files

**Core SSG Setup:**
- [package.json](../package.json) - Build script uses `vite-ssg build`
- [vite.config.ts](../vite.config.ts) - SSG options with route pre-rendering configuration
- [src/main.ts](../src/main.ts) - ViteSSG initialization with scrollBehavior handling
- [src/router/routes.ts](../src/router/routes.ts) - Route definitions with comprehensive SEO metadata

**SSR Guards (prevent server-side execution):**
- [src/stores/appDataStore.ts](../src/stores/appDataStore.ts) - API calls gated with `import.meta.env.SSR`
- [src/composables/useYoutube.ts](../src/composables/useYoutube.ts) - SSR-safe with lodash CommonJS fix
- [src/composables/useEvents.ts](../src/composables/useEvents.ts) - SSR-safe, test events gated to DEV only
- [src/components/Navigation.vue](../src/components/Navigation.vue) - Window references wrapped in SSR checks

**Why SSR Guards?**
ViteSSG pre-renders all routes at build time in a Node.js environment where `window`, `document`, and browser APIs don't exist. Without guards, the build crashes with `ReferenceError: document is not defined`.

**Pattern Examples:**
```typescript
// ❌ WRONG - Crashes during SSG build
export function useAppDataStore() {
  const intervalId = window.setInterval(fetchData, 90000); // ReferenceError!
}

// ✅ CORRECT - SSR-safe with guard
export function useAppDataStore() {
  if (!import.meta.env.SSR) {
    const intervalId = window.setInterval(fetchData, 90000);
  }
}

// ✅ ALSO CORRECT - Guard entire function
function init() {
  if (import.meta.env.SSR) return; // Exit early during SSG

  // All browser code here is safe
  fetchData();
  window.setInterval(fetchData, 90000);
  document.addEventListener('visibilitychange', handleVisibility);
}
```

**Files Requiring Guards:**
- Any code using `window`, `document`, `localStorage`, `navigator`, `sessionStorage`
- All stores with timers, intervals, or event listeners
- All composables with browser API calls
- Components with DOM manipulation

**Conditional Rendering:**
- [src/views/Home.vue](../src/views/Home.vue) - `shouldRenderSection()` logic + route watcher for scroll
- Template uses `v-if="shouldRenderSection('section-id')"` for each section

**Skeleton Components (progressive enhancement):**
- [src/components/skeletons/LeaderboardSkeleton.vue](../src/components/skeletons/LeaderboardSkeleton.vue) - Statistics placeholder
- [src/components/skeletons/EventsSkeleton.vue](../src/components/skeletons/EventsSkeleton.vue) - Community events placeholder
- [src/components/skeletons/VideosSkeleton.vue](../src/components/skeletons/VideosSkeleton.vue) - Video content placeholder
- All include `<noscript>` fallbacks with descriptive SEO text

**Deployment:**
- [public/_redirects](../public/_redirects) - SPA fallback for Netlify/Vercel (`/* /index.html 200`)
- [index.html](../index.html) - Enhanced meta tags for social sharing

## Navigation System

### Dynamic Header Measurement Architecture

The navigation system uses a **standardized, dynamic measurement approach** that eliminates all hardcoded scroll calculations through real-time DOM measurement.

#### Core Components

- **Navigation Bar** (`header`): Fixed navigation with rectangular tabs and mobile hamburger menu
- **Section Elements**: Target containers with stable IDs (`getting-started`, `statistics`, `community`, etc.)

#### Standardized Scroll Utility

**File:** [src/utils/scroll.ts](../src/utils/scroll.ts)

The scroll system provides **three focused functions** with clear responsibilities:

```javascript
// 1. Single source of truth - exact nav height (no buffer)
export function getNavHeight(): number {
  const nav = document.querySelector('header');
  if (!nav) return 80; // SSR fallback
  return Math.ceil(nav.getBoundingClientRect().height);
}

// 2. Detection with tolerance - includes buffer for active section detection
export function getHeaderHeightWithBuffer(): number {
  const navHeight = getNavHeight();
  const isMobile = window.innerWidth <= 768;
  const buffer = isMobile ? 10 : 5; // Mobile browsers need extra tolerance
  return navHeight + buffer;
}

// 3. Scroll to section - uses exact nav height for pixel-perfect positioning
export function scrollToSection(sectionId: string, behavior = 'smooth'): void {
  const sectionElement = document.getElementById(sectionId);
  const headerHeight = getNavHeight(); // No buffer for scroll positioning
  const targetY = sectionElement.offsetTop - headerHeight;
  window.scrollTo({ top: targetY, behavior });
}
```

#### Architecture Benefits

- **Single Source of Truth**: `getNavHeight()` is the only place that queries the DOM
- **Clear Separation**: Scroll positioning (no buffer) vs. detection (with buffer)
- **Zero Duplication**: Eliminated ~40 lines of repeated DOM queries
- **Maintainability**: Change buffer in ONE place, affects everything correctly
- **100% Dynamic**: Fresh measurements on every call, adapts to responsive breakpoints

#### Scroll Positioning Algorithm

1. **Element Discovery**: Target section via `document.getElementById()`
2. **Position Calculation**: Use `getBoundingClientRect()` for exact pixel positions
3. **Header Offset**: Subtract dynamic header height from target position
4. **Smooth Scroll**: Execute `window.scrollTo()` with exact coordinates
5. **History Management**: Update URL hash without page reload

#### Responsive Adaptation

- **Automatic Breakpoint Detection**: System adapts to any header size changes
- **Window Resize Handling**: Recalculates positions when viewport changes significantly
- **Mobile Optimization**: Enhanced buffer zones for iOS Safari and other mobile browsers

#### Async Content Handling & Scroll Restoration

**Challenge:** Community section has async content (Events API, Videos API, Twitch images) that loads AFTER initial scroll positioning, causing layout shifts and incorrect positioning.

**Industry Standard Solution (Oct 2025):**

1. **Manual Scroll Restoration**
   ```typescript
   // main.ts - Early initialization
   if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
     history.scrollRestoration = 'manual';
   }
   ```
   - Disables browser's automatic scroll restoration (Chrome/MDN recommendation for SPAs)
   - Prevents "progressive scroll down" bug on page refresh
   - Full manual control prevents interference with async content loading

2. **Async scrollBehavior with Delayed Execution**
   ```typescript
   // main.ts - Router scrollBehavior
   if (to.meta.section) {
     return new Promise((resolve) => {
       setTimeout(() => {
         const headerHeight = getNavHeight(); // Dynamic calculation
         resolve({
           el: `#${to.meta.section}`,
           top: headerHeight, // ~80-83px
           behavior: 'smooth'
         });
       }, 400); // Wait for sections to render + async content to start loading
     });
   }
   ```
   - Returns Promise that resolves after 400ms delay
   - Waits for: DOM rendering + API requests initiated + skeletons displayed
   - Dynamic offset via `getNavHeight()` (no hardcoded values)

3. **Skeleton Height Matching**
   ```typescript
   // EventsSkeleton.vue
   .skeleton-event-card { min-height: 340px; } // Matches real event cards

   // VideosSkeleton.vue
   .skeleton-video-card { min-height: 310px; } // Matches real video cards
   ```
   - Reserves accurate space before content loads
   - Ensures 1:1 height swap when real content replaces skeletons
   - Minimizes layout shift (CLS optimization)

4. **localStorage State Timing**
   ```typescript
   // Community.vue - setup() scope (before first render)
   const storedExpanded = typeof window !== 'undefined'
     ? getItem(EXPAND_KEY) === '1'
     : false;
   const expanded = ref(storedExpanded);
   ```
   - Reads expanded videos state BEFORE first render
   - Prevents 3000px layout shift after scroll positioning
   - SSR-safe with typeof window check

**Why Community Section Required Special Handling:**
- 3 async data sources (Events API + Videos API + Twitch images)
- Expanded state can dynamically add 3000px of content
- More complex than other sections (Getting Started/About/FAQ have static content)

**Unified Offset System:**
- **Router scroll**: Uses `getNavHeight()` (~80-83px) ✅
- **JS scroll util**: Uses `getNavHeight()` (~80-83px) ✅
- **Active detection**: Uses `getHeaderHeightWithBuffer()` (~85-95px with tolerance) ✅
- **No CSS conflicts**: Removed `scroll-margin-top` that conflicted with JS system

**Results:**
- ✅ No scroll jumping on page refresh
- ✅ Accurate positioning for all sections
- ✅ Correct nav highlighting (no offset mismatch)
- ✅ Headlines fully visible (not cut off under nav)
- ✅ Consistent behavior across all navigation types
- ✅ Works seamlessly with async content loading
- **No Manual Breakpoints**: Zero hardcoded pixel values across all screen sizes

### Navigation Layout Architecture

**Industry Standard Alignment (October 2025):**

Following gaming platform UX patterns, the navigation uses **left-aligned** layout matching industry leaders (Steam, Epic Games, Battle.net, Riot Games).

#### Desktop Layout (>1024px)

```html
<!-- Navigation.vue template -->
<div class="hdr container flex items-center">
  <!-- Logo (left) -->
  <div class="nav-logo">...</div>

  <!-- Navigation links (flows naturally left after logo) -->
  <nav class="desktop-nav">...</nav>
</div>
```

```css
/* navigation.css */
.desktop-nav {
  display: flex;
  gap: 8px;
  align-items: center;
  height: 100%;
  margin-left: 20px; /* Space after logo, natural left flow */
}
```

**Key Implementation Details:**
- **No `justify-content: space-between`** on desktop - This was removed from `.hdr` to prevent nav from being pushed to the right edge
- **Natural flexbox flow** - Logo and nav sit naturally on left side with simple margin spacing
- **Hamburger menu hidden** - Mobile menu button has `display: none` on desktop

#### Mobile Layout (≤1024px)

```css
/* navigation.css */
@media (max-width: 1024px) {
  .hdr {
    height: 70px;
    padding: 0 20px;
    justify-content: space-between; /* Pushes hamburger to right */
  }

  .desktop-nav {
    display: none; /* Hide desktop links */
  }

  .mob-menu {
    display: flex; /* Show hamburger */
  }
}
```

**Mobile Behavior:**
- **`justify-content: space-between`** applied ONLY at mobile breakpoint
- Creates 2 flex children: Logo (left) + Hamburger (right)
- Desktop navigation hidden, replaced with hamburger menu
- Full-screen mobile menu teleported to `<body>` with backdrop

#### Why Left-Aligned?

**Research Findings (Nielsen Norman Group + Gaming Platforms):**
- **48% faster scanning** - F-pattern reading (left-to-right cultures)
- **Industry standard** - All major gaming platforms use left-aligned nav
- **Space efficiency** - More room for nav items without centering constraints
- **User expectations** - Matches established gaming website patterns

**Platforms Analyzed:**
- Steam (desktop client + web)
- Epic Games Store
- Battle.net
- Riot Games (League of Legends, Valorant)
- Massgate.org (World in Conflict revival)

#### Responsive Breakpoint Strategy

**Single breakpoint: 1024px**
- Above 1024px: Desktop nav (left-aligned), no hamburger
- Below 1024px: Hamburger menu (right-aligned), no desktop nav

**CSS Architecture:**
- Base styles define desktop behavior (no media query needed)
- Single `@media (max-width: 1024px)` handles mobile transformation
- Avoids complex multi-breakpoint logic

#### Performance Optimizations

- **Measurement Caching**: Header heights calculated only when needed
- **Passive Event Listeners**: Scroll detection without blocking main thread
- **Debounced Resize**: Prevents excessive recalculation during window resize
- **Memory Management**: Clean event listener removal on component unmount

### Active Section Tracking & Programmatic Scroll Detection

**Problem Solved (October 2025):**

The navigation system must track which section is currently visible to highlight the corresponding nav link. However, this creates a conflict during programmatic navigation (clicking a nav link):

**The Conflict:**
1. User clicks FAQ link → `setCurrentSection('faq')` → Home loses `.active` class
2. Smooth scroll animation starts (takes ~1-2 seconds)
3. **DURING SCROLL:** Scroll listener runs → detects scroll position still in Home section
4. Scroll listener calls `setCurrentSection('hero')` → Home **regains** `.active` class (FLASH!)
5. Scroll completes → reaches FAQ → scroll listener calls `setCurrentSection('faq')`

**Result:** The current section's highlight momentarily flashes during programmatic scrolling.

#### Architecture Solution: Dual-Mode Scroll Tracking

**File:** [src/views/Home.vue](../src/views/Home.vue)

The system uses an `isProgrammaticScrolling` flag to distinguish between manual and programmatic scrolling:

```typescript
// Programmatic scroll detection to prevent listener interference
const isProgrammaticScrolling = ref(false);
let programmaticScrollTimeout: number | undefined;

function updateActiveSection() {
  if (!sectionElements.length) return;

  // Skip during programmatic scrolling to prevent flash
  if (isProgrammaticScrolling.value) return;

  // ... rest of scroll detection logic
}

function handleNavNavigate(section?: string) {
  setCurrentSection(section);

  // Disable scroll listener during programmatic navigation
  isProgrammaticScrolling.value = true;

  if (programmaticScrollTimeout) {
    clearTimeout(programmaticScrollTimeout);
  }

  // Re-enable after scroll completes (1500ms)
  programmaticScrollTimeout = setTimeout(() => {
    isProgrammaticScrolling.value = false;
  }, 1500) as unknown as number;
}
```

#### How It Works

**Manual Scrolling (wheel/trackpad):**
1. `isProgrammaticScrolling` = `false` (default)
2. Scroll listener active → detects section changes → updates active link ✅

**Programmatic Scrolling (clicking nav link):**
1. `handleNavNavigate()` called → sets `isProgrammaticScrolling = true`
2. `setCurrentSection()` sets destination as active
3. Scroll animation starts
4. Scroll listener **skipped** (flag is true) → no interference ✅
5. After 1500ms → flag resets to `false` → listener re-enabled

**Same-Route Click Handling:**
1. Click FAQ from Home → route changes → route watcher sets flag ✅
2. Click FAQ from /faq after scrolling → route doesn't change → `handleNavNavigate()` sets flag ✅

Both scenarios covered by setting the flag in `handleNavNavigate()` which fires on **every** nav click.

#### Timing Strategy

- **Programmatic scroll timeout:** 1500ms (covers smooth scroll duration + buffer)
- **Homepage scroll timeout:** 1000ms (shorter distance to top)
- **Debounced:** Timeout clears and restarts on subsequent clicks
- **No race conditions:** Flag always set before scroll, always cleared after completion

#### Benefits

- **No Flash:** Scroll listener disabled during programmatic navigation
- **Preserves Manual Tracking:** Scroll listener still works for wheel/trackpad scrolling
- **Handles All Cases:** Works for route changes AND same-route clicks
- **Clean State Management:** Simple boolean flag, no complex state tracking
- **Performance:** Minimal overhead, only affects programmatic scrolls

## State Management

### Composable Module Architecture

**File:** [src/stores/appDataStore.ts](../src/stores/appDataStore.ts)

WiCGATE uses a **composable module pattern** with Vue 3's Composition API instead of Pinia for state management. This approach provides reactive state with module-level refs and computed values, offering simplicity and direct SSR compatibility.

#### Pattern Overview

```typescript
// Module-level reactive state (shared across all component instances)
const data = ref<Partial<DataResponse>>({});
const loadingInternal = ref(false);
const isInitialLoad = ref(true);
const loading = computed(() => loadingInternal.value && isInitialLoad.value);
const playerCount = computed(() => data.value.profiles?.length || 0);

// Export composable function
export function useAppDataStore() {
  return { data, loading, playerCount, fetchData, init, stop };
}
```

#### Key Features

Manages player data, leaderboards, and server lists with:
- **3-retry exponential backoff** (1s, 2s, 4s delays)
- **90s polling interval** for live data updates
- **Page Visibility API integration** (pauses when tab hidden)
- **SSR guards** to prevent API calls during build
- **Reactive refs/computed** for automatic component updates

#### Retry Logic Implementation

```typescript
// Retry logic with exponential backoff
async function fetchDataWithRetry(retryCount = 0): Promise<void> {
  try {
    const r = await fetch(`${API}/data`, { cache: 'no-store' });
    if (!r.ok) throw new Error(r.statusText);
    const json: DataResponse = await r.json();
    data.value = json;
    error.value = null;
  } catch (e: any) {
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAYS[retryCount]; // [1000, 2000, 4000]
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchDataWithRetry(retryCount + 1);
    }
    error.value = e?.message || 'Failed to load';
  }
}
```

#### Why Composables Instead of Pinia?

- **Simplicity:** Direct reactive refs without store boilerplate
- **SSR-Safe:** No special SSR configuration needed
- **Lightweight:** Zero additional dependencies
- **Sufficient:** Single data store doesn't require Pinia's complexity
- **Type-Safe:** Full TypeScript support with explicit returns

## PWA Architecture

### Service Worker Configuration

**File:** [vite.config.ts](../vite.config.ts)

Environment-aware configuration:
- **Dev mode:** Minimal precaching, no warnings
- **Production mode:** Full precaching (~49 entries)

**Caching Strategies:**
- **CacheFirst:** Fonts, images, static assets
- **NetworkFirst:** API calls (with offline fallback)
- **Automatic updates:** Background sync on new deployments

### Manifest Generation

**Auto-generated:** `manifest.webmanifest`

Includes:
- App metadata (name, description, theme colors)
- 4 optimized icon sizes (64px, 192px, 512px, maskable)
- Display mode and orientation preferences
- Scope and start URL configuration

### Icon Generation

**Command:** `npm run build:icons`

Generates from [public/favicon.svg](../public/favicon.svg):
- `pwa-64x64.png` - Small icon
- `pwa-192x192.png` - Standard Android
- `pwa-512x512.png` - High-res Android
- `maskable-icon-512x512.png` - Adaptive icon

## Data Layer

### API Overview

WiCGATE consumes a read-only, public API for live game data. See **[API Documentation](api.md)** for complete endpoint reference, data structures, and integration patterns.

**Base URL:** `https://www.wicgate.com/api`

**Key Endpoints:**
- `GET /api/data` - Complete dataset (servers, players, leaderboards)
- `GET /api/events` - Discord community events
- `GET /api/online` - Currently online players and servers

**Client Features:**
- 3-retry exponential backoff (1s, 2s, 4s)
- 90-second polling interval
- Page Visibility API integration (pauses when tab hidden)
- PWA NetworkFirst caching (5-minute fallback)

### Composables

#### useYoutube.ts
**File:** [src/composables/useYoutube.ts](../src/composables/useYoutube.ts)

- Multi-channel YouTube video fetching from Atom feeds
- Parses XML responses into structured video objects
- SSR-safe execution with `import.meta.env.SSR` guards
- Memoized sorting with dependency tracking (Phase 4)

#### useEvents.ts
**File:** [src/composables/useEvents.ts](../src/composables/useEvents.ts)

- Discord events integration with real-time countdown timers
- Event status management (upcoming, live, past)
- Test events gated to DEV mode only
- SSR-safe with conditional execution

#### useFirstVisit.ts
**File:** [src/composables/useFirstVisit.ts](../src/composables/useFirstVisit.ts)

- First-time visitor detection via localStorage
- Welcome overlay management
- Section navigation integration
- Dismissal state persistence

#### useServerCapacity.ts *(Phase 1.1)*
**File:** [src/composables/useServerCapacity.ts](../src/composables/useServerCapacity.ts)

- Centralized server capacity color logic (eliminates duplication)
- Dynamic capacity colors based on player count percentage
- Configurable thresholds (90% = full/red, 50% = busy/orange, <50% = available/green)
- Used by [LiveServersWidget.vue](../src/components/widgets/LiveServersWidget.vue) and [Multiplayer.vue](../src/screens/Multiplayer.vue)

#### usePlayerDisplay.ts *(Phase 1.2)*
**File:** [src/composables/usePlayerDisplay.ts](../src/composables/usePlayerDisplay.ts)

- Player name parsing and colorization with memoization
- Clan tag extraction and formatted display names
- Server grouping with alphabetical sorting
- Cache management for performance (colorize cache)

#### useActiveSection.ts *(Phase 3.1)*
**File:** [src/composables/useActiveSection.ts](../src/composables/useActiveSection.ts)

- Centralized scroll state management
- Manages `currentSection`, `isFastScrolling`, `isProgrammaticScrolling`
- Fast scroll detection to prevent navigation flicker
- Programmatic scroll tracking to disable listeners during animations

#### useSectionObserver.ts *(Phase 4)*
**File:** [src/composables/useSectionObserver.ts](../src/composables/useSectionObserver.ts)

- IntersectionObserver wrapper for scroll detection
- Replaces scroll event listeners for 60% fewer callbacks
- Dynamic rootMargin based on header height
- SSR-safe with proper cleanup

### Utilities

#### scroll.ts
**File:** [src/utils/scroll.ts](../src/utils/scroll.ts)

Dynamic header measurement and pixel-perfect scroll positioning with:
- `getNavHeight()` - Single source of truth for nav height
- `getHeaderHeightWithBuffer()` - Detection tolerance for active section
- `scrollToSection()` - Pixel-perfect positioning

#### analytics.ts
**File:** [src/utils/analytics.ts](../src/utils/analytics.ts)

Type-safe event tracking with:
- 15 pre-defined event categories
- `navigator.sendBeacon()` with fetch fallback
- SSR-safe execution
- Dev mode console logging

**Categories:**
- Navigation, Downloads, Social, Game, Players
- Leaderboards, FAQ, Onboarding, Errors
- Video, Stream, Events, Creators, Search

#### performance.ts
**File:** [src/utils/performance.ts](../src/utils/performance.ts)

Core Web Vitals monitoring:
- **CLS** (Cumulative Layout Shift)
- **FCP** (First Contentful Paint)
- **INP** (Interaction to Next Paint)
- **LCP** (Largest Contentful Paint)
- **TTFB** (Time to First Byte)

Automatic metric collection with configurable analytics endpoint.

#### structuredData.ts
**File:** [src/utils/structuredData.ts](../src/utils/structuredData.ts)

JSON-LD schema generators for SEO:
- **Organization** schema
- **WebSite** schema with search action
- **FAQPage** schema
- **VideoObject** schema
- **Event** schema

#### playerDisplay.ts
**File:** [src/utils/playerDisplay.ts](../src/utils/playerDisplay.ts)

Formatter and colorizer for Massgate-style player names with rank badges and clan tags.

#### memoize.ts *(Phase 4)*
**File:** [src/utils/memoize.ts](../src/utils/memoize.ts)

Memoization utilities for performance optimization:
- `MemoCache<T>` - TTL-based caching class (default 5000ms)
- `memoizeWithDeps()` - React useMemo-style memoization with dependency tracking
- `memoize()` - Simple single-argument function memoizer
- `memoizeJson()` - Object argument memoizer with JSON stringification

#### features.ts *(Phase 5.3)*
**File:** [src/utils/features.ts](../src/utils/features.ts)

Feature flag system for gradual rollout and A/B testing:
- 11 feature flags for performance, UI, experimental, and debug features
- Environment-specific flags (development/production/test)
- localStorage overrides for development/testing
- Console helpers (`window.features.*` in DEV mode)
- Current enabled features: `intersection-observer`, `memoized-sorting`, `analytics` (production)

#### storage.ts *(Phase 2.2)*
**File:** [src/utils/storage.ts](../src/utils/storage.ts)

Type-safe localStorage wrapper with enhanced helpers:
- Basic operations: `getItem()`, `setItem()`, `removeItem()`, `isStorageAvailable()`
- Typed helpers: `getBoolean()`, `setBoolean()`, `getNumber()`, `setNumber()`, `getJSON()`, `setJSON()`
- Error handling for private browsing mode and quota exceeded
- SSR-safe with window guards

## Type System

### Error Types *(Phase 2.1)*
**File:** [src/types/errors.ts](../src/types/errors.ts)

Structured error hierarchy replacing `any` types:

**Error Classes:**
- `ApiError` - HTTP errors with endpoint and status code context
- `NetworkError` - Network failures (timeout, offline, DNS)
- `ValidationError` - Data validation failures
- `StorageError` - localStorage/storage quota errors

**Helper Functions:**
- `apiErrorFromResponse()` - Extract error details from Response object
- `isApiError()`, `isNetworkError()`, `isValidationError()`, `isStorageError()` - Type guards

**Usage:**
```typescript
try {
  const response = await fetch('/api/data');
  if (!response.ok) {
    throw await apiErrorFromResponse(response, '/api/data');
  }
} catch (err) {
  if (isApiError(err)) {
    console.error(`API Error (${err.endpoint}): HTTP ${err.statusCode}`);
  } else if (isNetworkError(err)) {
    console.error(`Network Error: ${err.message}`);
  }
}
```

### Utility Types *(Phase 5.1)*
**File:** [src/types/utils.ts](../src/types/utils.ts)

Comprehensive TypeScript utility types for improved type safety:

**Basic Utilities:**
- `Nullable<T>` - T | null
- `Optional<T>` - T | undefined
- `Maybe<T>` - T | null | undefined
- `ReadonlyDeep<T>` - Deeply readonly type
- `Mutable<T>` - Remove readonly from deeply readonly type
- `RequireKeys<T, K>` - Make specific keys required
- `OptionalKeys<T, K>` - Make specific keys optional

**API Response Types:**
- `ApiResponse<T>` - Standard success/error wrapper
- `PaginatedResponse<T>` - Paginated data with pagination metadata
- `FetchResult<T>` - Type-safe fetch result (data XOR error)

**Function Utilities:**
- `AsyncReturnType<T>` - Extract return type from async function
- `OptionalParameters<T>` - Make function parameters optional

**Object Utilities:**
- `AtLeastOne<T>` - Require at least one property
- `ExactlyOne<T>` - Require exactly one property
- `DeepPartial<T>` - Deeply partial type
- `KeysOfType<T, V>` - Extract keys matching value type

**Type Guards:**
- `isDefined()`, `isNullish()`, `isString()`, `isNumber()`, `isBoolean()`, `isObject()`, `isArray()`, `isFunction()`

### Navigation Types *(Enhanced Phase 5.2)*
**File:** [src/types/navigation.ts](../src/types/navigation.ts)

Enhanced with comprehensive JSDoc comments:
- `NAVIGATION_STRUCTURE` - Complete section/subsection structure
- `getSectionFromSubsection()` - Get parent section from subsection ID
- `isSubsection()` - Check if ID is a subsection
- `getAllValidIds()` - Get all valid section/subsection IDs
- `getRoutePath()` - Convert ID to Vue Router path

## Component Architecture

### Widget System *(Phase 3.2)*

**WidgetDashboard.vue** reduced from 376 lines to 77 lines (80% reduction) by extracting 7 widget components.

#### Widget Base Component
**File:** [src/components/widgets/WidgetBase.vue](../src/components/widgets/WidgetBase.vue)

Base component enforcing consistent widget structure:
```vue
<WidgetBase
  title="Live Servers"
  icon="server"
  action="See All Servers"
  widget-class="servers-widget"
  @action-click="navigate('multiplayer-servers')"
>
  <!-- Widget content here -->
</WidgetBase>
```

#### Widget Components
All widgets located in [src/components/widgets/](../src/components/widgets/):

1. **QuickStartWidget.vue** (63 lines)
   - Installation quick links
   - Direct downloads and setup guide

2. **LiveServersWidget.vue** (86 lines)
   - Real-time server status
   - Player count with dynamic capacity colors (useServerCapacity)
   - Empty state handling

3. **TopPlayersWidget.vue** (87 lines)
   - Top 5 leaderboard preview
   - Rank badges and clan tags
   - Styled player names with colorization

4. **CommunityWidget.vue** (74 lines)
   - Upcoming events countdown
   - Discord integration
   - Empty state for no events

5. **LatestVideosWidget.vue** (86 lines)
   - Latest 3 YouTube videos
   - Multi-channel support
   - Thumbnail, title, author, view count

6. **GettingHelpWidget.vue** (57 lines)
   - FAQ quick links
   - Support resources
   - Community links

**Benefits:**
- Modular, testable components
- Consistent structure and styling
- Easy to add/remove widgets
- Reduced complexity in parent component
- Shared WidgetBase for consistency

## Content Management

### Static Content

**File:** [src/content/content.ts](../src/content/content.ts)

Centralized static content for:
- Hero section copy
- Onboarding steps
- Community cards
- System requirements
- FAQ items

Structured for easy translation and maintenance.

## Build System

### Production Build Flow

**Command:** `npm run build`

Executes sequential build steps:

1. **Pre-build:** Generate PWA icons from favicon.svg
2. **Vite Build:** Static Site Generation with ViteSSG
3. **Post-build:** Generate sitemap.xml from routes
4. **PWA Generation:** Service worker and manifest creation
5. **Asset Optimization:** Code splitting and content hashing

### Build Configuration

**File:** [vite.config.ts](../vite.config.ts)

Key plugins:
- **ViteSSG** - Static site generation
- **VitePWA** - Service worker and manifest
- **Vue** - SFC compilation
- **vueDevTools** - Development debugging
- **AutoImport** - Auto-import Vue APIs
- **Components** - Auto-import components

### Bundle Optimization

- **Code splitting:** Route-based chunks
- **Tree shaking:** Dead code elimination
- **Asset optimization:** Image compression, CSS minification
- **Content hashing:** Cache busting for assets
- **Chunk size limit:** 5MB maximum (currently ~4.1MB)

## Error Handling

### API Error Handling

3-retry exponential backoff strategy:
- **Attempt 1:** Immediate
- **Attempt 2:** 1s delay
- **Attempt 3:** 2s delay
- **Attempt 4:** 4s delay
- **Failure:** Error boundary activation

### ErrorBoundary Component

**File:** [src/components/ErrorBoundary.vue](../src/components/ErrorBoundary.vue)

- Catches component-level errors
- User-friendly fallback UI
- Sentry integration for error tracking
- Analytics event logging
- Retry functionality

### Page Visibility API Integration

Pauses expensive operations when tab is hidden:
- API polling suspension
- Animation frame cancellation
- Event listener cleanup
- Resource optimization

## Deployment Architecture

### Active Deployment: GitHub Pages

**Live Site:** https://www.wicgate.com/

**Workflow:** [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)

Auto-deploys on:
- Push to `master` branch
- Manual workflow dispatch

**Complete Build Pipeline:**
1. **Checkout** - Clone repository
2. **Setup Node.js** - Install runtime (v20)
3. **Install Dependencies** - `npm ci` for reproducible builds
4. **Lint Check** - `npm run lint` ensures code quality
5. **Type Check** - `npx tsc --noEmit` validates TypeScript
6. **Test (Thorough)** - `npm run test:thorough` with real timers (27 tests)
7. **Build** - `npm run build` generates 7 pre-rendered routes + PWA
8. **Bundle Size Check** - Enforces 5MB limit (currently 4.1MB)
9. **404 Fallback** - Copy `index.html` to `404.html` for SPA routing
10. **CNAME Setup** - Add `www.wicgate.com` for custom domain
11. **Deploy** - Publish to GitHub Pages

**Deployment Targets:**
- Primary: `https://micon4sure.github.io/www.wicgate.com/`
- Custom Domain: `https://www.wicgate.com/` (via DNS CNAME)

**Configuration:**
- Repository: `www.wicgate.com` (matches GitHub Pages path)
- Settings > Pages: Source = GitHub Actions
- DNS: `www` CNAME → `micon4sure.github.io`
- HTTPS: Enforced

### Alternative Platforms (Not Currently Used)

This project can also deploy to **Netlify** or **Vercel**:

**Configuration:**
- Build command: `npm run build`
- Publish directory: `dist`
- SPA routing: `public/_redirects` file

**Redirects File:**
```
# SPA fallback for client-side routing (Netlify/Vercel)
/* /index.html 200
```

**Note:** The `_redirects` file enables platform portability. GitHub Pages uses `404.html` instead (created during CI build).

## Routes & SEO

All routes pre-render unique HTML at build time:

| Route | Description | File Size |
|-------|-------------|-----------|
| `/` | Homepage with all sections | 36.22 KB |
| `/getting-started` | Installation guide | 11.18 KB |
| `/multiplayer` | Live servers and player rankings | 12.34 KB |
| `/community` | Events, creators, videos | 13.59 KB |
| `/about` | Project information | 9.20 KB |
| `/faq` | Frequently asked questions | 13.30 KB |

**SEO Benefits:**
- ✅ 27 unique HTML files (1 homepage + 5 sections + 21 subsections, no duplicate content)
- ✅ Focused, indexable content per route
- ✅ Progressive enhancement with skeleton loaders
- ✅ Dynamic meta tags and JSON-LD schemas
- ✅ Responsive to search engine requirements

## Complete Project Structure

```
src/
├── main.ts                    # ViteSSG entry point + PWA registration
├── App.vue                    # Root component with error boundary
├── router/
│   ├── index.ts               # Router configuration with scroll behavior
│   └── routes.ts              # Route definitions with SEO metadata
├── stores/
│   └── appDataStore.ts        # Composable state with 3-retry backoff
├── components/
│   ├── Navigation.vue         # Mobile-first responsive nav (pixel-perfect scrolling)
│   ├── HeaderBanner.vue       # Professional logo design with players button
│   ├── WidgetDashboard.vue    # Homepage widget grid (6 widgets: Quick Start, Live Servers, Community, Top Players, Videos, Help)
│   ├── LeaderboardGroup.vue   # Enhanced leaderboard tables with rank styling
│   ├── RankInsignia.vue       # Player rank badges (used in leaderboards and Top Players widget)
│   ├── Leaderboards.vue       # Leaderboard container component
│   ├── PlayersOnline.vue      # Slide-in panel for live player list
│   ├── FirstVisitOverlay.vue  # Welcome overlay for new users
│   ├── TwitchEmbed.vue        # Live stream integration
│   ├── ErrorBoundary.vue      # Error handling with retry functionality
│   ├── Footer.vue             # Site footer
│   └── skeletons/             # SEO-friendly loading states
│       ├── EventsSkeleton.vue
│       ├── VideosSkeleton.vue
│       └── LeaderboardSkeleton.vue
├── screens/                   # Section components (used in Home.vue)
│   ├── GettingStarted.vue     # Onboarding with WIC LIVE download, Advanced Setup (v-show)
│   ├── Multiplayer.vue        # Live servers, player lists, and leaderboards
│   ├── Community.vue          # Events, videos, live streams, creator badges (v-show)
│   ├── About.vue              # Project information
│   └── FAQ.vue                # Frequently asked questions
├── views/                     # Routed pages
│   └── Home.vue               # Main SPA with WidgetDashboard hero + sections (SSR conditional rendering)
├── composables/               # Composition functions
│   ├── useYoutube.ts          # Multi-channel video fetching (SSR-safe, Atom feed parsing)
│   ├── useEvents.ts           # Discord events integration (SSR-safe, real-time countdown)
│   └── useFirstVisit.ts       # First-time visitor detection (localStorage)
├── utils/                     # Utility functions
│   ├── scroll.ts              # Dynamic navigation scroll system (3 focused functions)
│   ├── playerDisplay.ts       # Massgate-style name formatting/colorizing
│   ├── analytics.ts           # Type-safe event tracking (15 categories)
│   ├── performance.ts         # Web Vitals monitoring (CLS, FCP, INP, LCP, TTFB)
│   └── structuredData.ts      # SEO JSON-LD schemas
├── assets/
│   ├── logo.svg
│   └── styles/
│       ├── base.css           # Global styles + module imports
│       └── modules/           # Modular CSS with design tokens
│           ├── variables.css  # Design tokens (colors, shadows, transitions)
│           ├── typography.css # Font families and utility classes
│           ├── buttons.css    # Button hierarchy and styles
│           ├── responsive.css # Responsive utilities
│           └── components/    # Component-specific modules
│               ├── navigation.css         # Nav with rectangular tabs
│               ├── widget-dashboard.css   # Homepage widget grid (685 lines, 7 responsive breakpoints)
│               ├── leaderboards.css       # Enhanced leaderboard tables
│               ├── hero.css               # Hero section styling
│               ├── community.css          # Events, videos, creators
│               ├── getting-started.css    # Onboarding (with v-show transitions)
│               ├── videos.css             # Video components (with v-show transitions)
│               ├── about.css              # About section
│               ├── faq.css                # FAQ section
│               ├── game-mode.css          # Game mode page
│               ├── players-panel.css      # Side panel for online players
│               └── toggle.css             # Toggle switch components
└── content/
    └── content.ts             # Static content (hero copy, steps, requirements)

public/
├── favicon.svg                # Source SVG for PWA icon generation
├── pwa-64x64.png              # Auto-generated
├── pwa-192x192.png            # Auto-generated
├── pwa-512x512.png            # Auto-generated
├── maskable-icon-512x512.png  # Auto-generated
├── manifest.webmanifest       # Auto-generated by vite-plugin-pwa
├── sitemap.xml                # Auto-generated by generate-sitemap.ts
├── robots.txt                 # SEO crawler instructions
└── _redirects                 # SPA routing for Netlify/Vercel

scripts/
├── generate-pwa-icons.ts      # Generates PWA icons from favicon.svg (4 sizes)
└── generate-sitemap.ts        # Generates sitemap.xml from route definitions

tests/
├── stores/
│   └── appDataStore.test.ts   # 15 tests (fetch, retry, error handling)
└── utils/
    └── scroll.test.ts         # 11 tests (scroll utilities)

docs/
├── architecture.md            # This file - SSG/SSR, routing, navigation, PWA
├── design-system.md           # CSS tokens, patterns, components
├── testing.md                 # Test commands, strategies, CI/CD
├── api.md                     # API endpoints, data structures
├── troubleshooting.md         # Common issues, solutions
├── changelog.md               # Feature history
└── spec.md                    # Technical specifications

.github/
└── workflows/
    └── deploy.yml             # CI/CD pipeline (lint → test → build → deploy)

Configuration Files:
├── vite.config.ts             # Vite + ViteSSG + PWA configuration
├── tsconfig.json              # TypeScript strict mode
├── vitest.config.ts           # Test configuration (hybrid timing)
├── eslint.config.js           # ESLint + Prettier integration
└── package.json               # Dependencies and scripts
```

## Build Process Details

The production build (`npm run build`) executes:

### 1. Generate PWA Icons (`scripts/generate-pwa-icons.ts`)

Creates 4 optimized PNG sizes from `public/favicon.svg`:
- `pwa-64x64.png` (~1.8 KB)
- `pwa-192x192.png` (~5.7 KB)
- `pwa-512x512.png` (~18.9 KB)
- `maskable-icon-512x512.png` (~18.9 KB)

Uses `sharp` library for high-quality PNG conversion with transparent backgrounds.

### 2. Generate Sitemap (`scripts/generate-sitemap.ts`)

Auto-generates `public/sitemap.xml` from route definitions in `src/router/routes.ts`:
- 7 URLs with priority and changefreq metadata
- `lastmod` set to current date
- Validates against sitemap.org schema

### 3. Static Site Generation (ViteSSG)

Pre-renders 7 unique HTML files:
- Executes Vue components in Node.js environment
- Applies route-specific meta tags
- Includes JSON-LD structured data
- Generates skeleton loaders for SEO

**Conditional Rendering:**
- Homepage (`/`): All sections rendered
- Section routes (`/getting-started`, etc.): Only target section rendered
- Client-side: All sections render for smooth scrolling

### 4. PWA Service Worker (`vite-plugin-pwa`)

Generates `dist/sw.js` with:
- Precache manifest (~49 entries in production)
- Cache-first strategy for static assets
- Network-first for API calls
- Automatic background updates
- Clean-up of outdated caches

### 5. Asset Optimization

**Code Splitting:**
- Route-based chunks (Home, GameMode, etc.)
- Vendor chunk for npm dependencies
- Utility chunk for shared code

**Content Hashing:**
- `app-[hash].js` for cache busting
- `app-[hash].css` for optimized CSS
- Asset filenames with content hashes

**Bundle Analysis:**
- Total bundle: ~4.1MB (under 5MB limit)
- Enforced via GitHub Actions workflow

### Build Output Structure

```
dist/
├── index.html                 # Homepage (36.22 KB) - All sections
├── getting-started.html       # (11.18 KB) - Getting Started only
├── multiplayer.html           # (12.34 KB) - Multiplayer section with servers and leaderboards
├── community.html             # (13.59 KB) - Community only
├── about.html                 # (9.20 KB) - About only
├── faq.html                   # (13.30 KB) - FAQ only
├── 404.html                   # SPA fallback (copy of index.html)
├── manifest.webmanifest       # PWA manifest
├── sitemap.xml                # SEO sitemap (6 URLs)
├── robots.txt                 # Crawler instructions
├── sw.js                      # Service worker
├── workbox-*.js               # Workbox runtime
├── assets/
│   ├── app-[hash].js          # Main application code
│   ├── app-[hash].css         # Compiled CSS
│   ├── [route]-[hash].js      # Route-specific chunks
│   └── [asset]-[hash].[ext]   # Optimized assets
└── [pwa-icons]                # Generated PWA icons
```

## Contributing

### Contribution Guidelines

1. **Fork the repository** and clone locally
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow established patterns:**
   - Use design tokens (no hardcoded hex values) - See [design-system.md](design-system.md#design-tokens)
   - Follow navigation patterns for interactive elements - See [design-system.md](design-system.md#interactive-element-standards)
   - Use `v-show` (not `v-if`) for expandable sections - See [architecture.md](architecture.md#ssr-hydration-best-practices)
   - Add SSR guards around browser APIs - See [troubleshooting.md](troubleshooting.md#ssr-guards)
4. **Write tests** for new functionality (maintain 50%+ coverage)
5. **Run quality checks:**
   ```bash
   npm run lint        # ESLint + Prettier
   npm test            # Vitest tests
   npx tsc --noEmit    # TypeScript validation
   ```
6. **Document changes:**
   - Update relevant docs (architecture.md, design-system.md, etc.)
   - Add changelog entry in [changelog.md](changelog.md)
7. **Commit with descriptive messages** following conventional commits
8. **Push to your fork** and submit a pull request

### Code Quality Standards

- **TypeScript:** Strict mode enabled, no `any` types
- **Testing:** 50%+ coverage threshold enforced
- **Linting:** Zero ESLint errors, Prettier formatted
- **Accessibility:** WCAG AA compliance
- **Performance:** Bundle size under 5MB
- **SEO:** All content in pre-rendered HTML

### Architecture Decision Records

When making significant architectural changes:
1. Document the problem in [changelog.md](changelog.md)
2. Explain the solution and alternatives considered
3. Update [architecture.md](architecture.md) with new patterns
4. Update [design-system.md](design-system.md) for design changes
5. Add troubleshooting entries if applicable

## Performance Considerations

### SSG Performance

- **Instant first paint:** Pre-rendered HTML loads immediately
- **Reduced JavaScript:** Initial render doesn't require framework
- **SEO crawlability:** Content accessible without JS execution

### PWA Performance

- **Offline capability:** Cached assets load instantly
- **Background sync:** Updates in background without blocking
- **Cache-first strategy:** Static assets from cache, not network

### Navigation Performance

- **Dynamic measurement:** Eliminates layout thrashing
- **Passive listeners:** Non-blocking scroll detection
- **Debounced resize:** Prevents excessive recalculation

### Bundle Performance

- **Route-based splitting:** Load only what's needed
- **Tree shaking:** Remove unused code
- **Asset optimization:** Compressed images and CSS
- **Content hashing:** Efficient browser caching

---

*This document provides a comprehensive technical overview of WiCGATE's architecture. For design system details, see [design-system.md](design-system.md).*
