# CLAUDE.md – WiCGATE Frontend Reference

## Overview
- **Project:** WiCGATE community portal for the World in Conflict revival initiative (WiCGATE/Massgate).
- **Stack:** Vue 3 + TypeScript, Vite build system, Pinia state management, Vue Router, modular CSS.
- **Purpose:** Deliver Massgate-inspired experience featuring live player data, onboarding help, community tools, and historically faithful styling.

## Development Quickstart
```bash
npm install          # install dependencies
npm run dev          # start dev server (http://localhost:5173)
npm run lint         # lint with ESLint + Prettier rules
npm run lint:fix     # auto-fix lint violations
npm run build        # production build (icons + sitemap + SSG + PWA)
npm run build:icons  # generate PWA icons from favicon.svg
npm run preview      # preview production build
npm test             # run all tests (27 tests across scroll utils and store)
npm run test:watch   # run tests in watch mode
npm run test:ui      # run tests with Vitest UI
npm run test:coverage # run tests with coverage report
```
- **Editor:** VS Code with Volar/Vetur recommended for Vue 3.
- **Formatting:** Prettier via ESLint – ensure no CRLF when committing.
- **Testing:** Vitest with Vue Test Utils for component and utility testing.

## Architectural Notes
- **Entry point:** `src/main.ts` uses ViteSSG for Static Site Generation with client-side hydration. PWA service worker registered for offline capability.
- **Routing:** Path-based routing with 7 pre-rendered routes: `/`, `/getting-started`, `/statistics`, `/community`, `/about`, `/faq`, `/game-mode`. Each section gets its own SEO-friendly URL.
- **Hybrid architecture:** SSG for SEO (conditional rendering per route) + SPA for UX (all sections render client-side for smooth scrolling).
- **State:** `src/stores/appDataStore.ts` manages player data, leaderboards, servers with 3-retry exponential backoff, 90s polling, and Page Visibility API integration.
- **Data layer:** API integration via composables (`useYoutube`, `useEvents`) with SSR-safe execution; static content in `src/content`.
- **Components:** `src/components` hosts reusable widgets (navigation, leaderboards, overlays, skeletons). Screen components in `src/screens`.
- **Styling system:** Modular CSS under `src/assets/styles/modules`, composed via `base.css`; each screen/component has dedicated module.
- **Testing:** Comprehensive test suite with 27 tests covering scroll utilities (11 tests) and data store (15 tests) with 50%+ coverage.

## Technical Architecture - Navigation System

### Dynamic Header Measurement Architecture
The navigation system uses a **standardized, dynamic measurement approach** that eliminates all hardcoded scroll calculations through real-time DOM measurement.

#### Core Components
- **Navigation Bar** (`header`): Fixed navigation with rectangular tabs and mobile hamburger menu
- **Section Elements**: Target containers with stable IDs (`getting-started`, `statistics`, `community`, etc.)

#### Standardized Scroll Utility (`src/utils/scroll.ts`)
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
- **No Manual Breakpoints**: Zero hardcoded pixel values across all screen sizes

#### Performance Optimizations
- **Measurement Caching**: Header heights calculated only when needed
- **Passive Event Listeners**: Scroll detection without blocking main thread
- **Debounced Resize**: Prevents excessive recalculation during window resize
- **Memory Management**: Clean event listener removal on component unmount

## SEO Architecture - Static Site Generation (SSG)

### Overview
The website implements a sophisticated **hybrid rendering strategy** that provides unique, SEO-optimized content to search engines while delivering a seamless single-page experience to users.

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
npm run build → Generates 7 unique HTML files:

dist/index.html              35.59 KB  # All 6 sections for homepage
dist/getting-started.html    10.74 KB  # Only Getting Started section
dist/statistics.html          6.99 KB  # Only Statistics section
dist/community.html          12.60 KB  # Only Community section
dist/about.html               8.27 KB  # Only About section
dist/faq.html                12.39 KB  # Only FAQ section
dist/game-mode.html          11.37 KB  # Game mode standalone page
```

### SEO Benefits
✅ **Unique Content Per URL:** Each route serves different HTML with unique file sizes
✅ **No Duplicate Content:** Google indexes 7 separate pages with focused content
✅ **Fast Initial Load:** Pre-rendered HTML loads instantly
✅ **Progressive Enhancement:** Content visible without JavaScript
✅ **Semantic Skeleton Loaders:** SEO-friendly placeholders with descriptive text

### Key Implementation Files

**Core SSG Setup:**
- `package.json` - Build script uses `vite-ssg build`
- `vite.config.ts` - SSG options with route pre-rendering configuration
- `src/main.ts` - ViteSSG initialization with scrollBehavior handling
- `src/router/routes.ts` - Route definitions with comprehensive SEO metadata

**SSR Guards (prevent server-side execution):**
- `src/stores/appDataStore.ts` - API calls gated with `import.meta.env.SSR`
- `src/composables/useYoutube.ts` - SSR-safe with lodash CommonJS fix
- `src/composables/useEvents.ts` - SSR-safe, test events gated to DEV only
- `src/components/Navigation.vue` - Window references wrapped in SSR checks

**Conditional Rendering:**
- `src/views/Home.vue` - `shouldRenderSection()` logic + route watcher for scroll
- Template uses `v-if="shouldRenderSection('section-id')"` for each section

**Skeleton Components (progressive enhancement):**
- `src/components/skeletons/LeaderboardSkeleton.vue` - Statistics placeholder
- `src/components/skeletons/EventsSkeleton.vue` - Community events placeholder
- `src/components/skeletons/VideosSkeleton.vue` - Video content placeholder
- All include `<noscript>` fallbacks with descriptive SEO text

**Deployment:**
- `public/_redirects` - SPA fallback for Netlify/Vercel (`/* /index.html 200`)
- `index.html` - Enhanced meta tags for social sharing

### How It Solves Duplicate Content

**❌ Hash-based routing problem (before SSG):**
```
wicgate.com/          → Serves index.html (36KB, all sections)
wicgate.com/#statistics → Serves index.html (36KB, all sections) ← DUPLICATE
wicgate.com/#community  → Serves index.html (36KB, all sections) ← DUPLICATE
```
Google sees identical content at all URLs = duplicate content penalty.

**✅ Path-based SSG solution (current):**
```
wicgate.com/          → Serves index.html (36KB, all sections)
wicgate.com/statistics → Serves statistics.html (7KB, stats only) ← UNIQUE
wicgate.com/community  → Serves community.html (13KB, community only) ← UNIQUE
```
Google sees different content at each URL = proper indexing.

### User Experience Flow

1. **User visits `/statistics`:**
   - Server sends `statistics.html` (7KB, only statistics section)
   - User sees skeleton loader with SEO text
   - JavaScript loads and hydrates
   - `isSSR` becomes `false`, all sections render
   - User can now scroll smoothly to any section

2. **User clicks "Community" nav link:**
   - Vue Router intercepts click (prevents page reload)
   - Route changes to `/community`
   - Route watcher triggers smooth scroll animation
   - Scrolls from current position to Community section
   - URL updates without page refresh

3. **Search Engine crawls `/statistics`:**
   - Receives pre-rendered `statistics.html`
   - No JavaScript execution needed
   - Sees only Statistics content with proper meta tags
   - Indexes as unique page focused on player rankings

### Progressive Enhancement Philosophy
- **Base Layer (no JS):** Readable content for crawlers + accessibility
- **Enhanced Layer (with JS):** Full UX with animations + live data
- **Not Cloaking:** Same content, different loading strategy (Google-approved)

## Styling & Design System
- **Tokens:** All colors, gradients, shadows, and transitions defined in `src/assets/styles/modules/variables.css`. New work should *only* reference tokens (no hard-coded hex values).
- **Palette highlights:**
  - Steel structure – `--mg`, `--mg-dark`, `--mg-muted`.
  - Graphite navigation surfaces – `--graphite`, `--graphite-dark`, `--graphite-light`.
  - Accents – Massgate orange `--sw`, alert red `--dl`, Discord blue `--d`.
  - Platform/brand tokens – YouTube/Twitch variants, medal colors, panel RGB helpers.
- **Typography:** `typography.css` registers Oswald (headers), Rajdhani (body), Courier New (data), plus scoped utility classes.
- **Component modules:**
  - `navigation.css` (18KB+) – modernized rectangular nav tabs, pill-shaped players button, enhanced hover effects with multi-layer shadows.
  - `leaderboards.css` (12KB+) – enhanced tables with responsive typography, medal/rank styling, podium classes.
  - `community.css` (18KB+) – Events integration, creator badge system with consistent hover states, video grids, Twitch embeds.
  - `hero.css`, `getting-started.css`, `videos.css`, `about.css`, `faq.css`, `buttons.css`, `game-mode.css`, `players-panel.css`, `toggle.css` – each screen/component has its own file.

## Recent Changes (October 2025)
- **📱 Progressive Web App (PWA) Implementation (Latest):** Full PWA support with offline capability and installability. Includes service worker with intelligent caching (CacheFirst for fonts/images, NetworkFirst for API), auto-generated manifest.webmanifest, 4 optimized icon sizes (64px, 192px, 512px, maskable), and automatic updates. Environment-aware configuration: dev mode skips file precaching (no warnings), production mode enables full precaching (~49 entries). Users can install WICGATE as a desktop/mobile app with full offline access to cached content.
- **📊 Analytics Integration:** Type-safe analytics event tracking system with 15 pre-defined event categories (Navigation, Downloads, Social, Game, Players, Leaderboards, FAQ, Onboarding, Errors). Integrated across Navigation, LeaderboardGroup, ErrorBoundary, and appDataStore. Uses `navigator.sendBeacon()` with fetch fallback for reliable event delivery.
- **🧪 Testing Infrastructure:** Comprehensive test suite with Vitest + Vue Test Utils covering scroll utilities (12 tests) and data store (15 tests). Includes SSR-safe mocks, coverage thresholds (50%), and CI/CD integration via GitHub Actions.
- **♻️ Scroll System Refactor:** Standardized scroll utility architecture with three focused functions: `getNavHeight()` (single source of truth), `getHeaderHeightWithBuffer()` (detection tolerance), and `scrollToSection()` (pixel-perfect positioning). Eliminated 40+ lines of duplicate code while maintaining 100% dynamic measurement.
- **🔧 Enhanced Error Handling:** 3-retry exponential backoff (1s, 2s, 4s) for API calls, 90s polling interval, Page Visibility API integration (pauses when tab hidden), and ErrorBoundary component with Sentry integration.
- **🔍 SEO Revolution with SSG Implementation:** Complete migration to Static Site Generation (SSG) using vite-ssg for industry-standard SEO optimization. Path-based routing (`/statistics`, `/community`) replaces hash-based navigation, generating 7 unique pre-rendered HTML files. Hybrid rendering strategy: conditional sections for crawlers (unique content per URL), full sections for users (seamless scrolling). Implements progressive enhancement with skeleton loaders, SSR guards across stores/composables, and Vue Router integration with scroll preservation. Eliminates duplicate content issues while maintaining beautiful single-page UX.
- **🚀 Pixel-Perfect Navigation Revolution:** Complete elimination of hardcoded scroll calculations in favor of dynamic header measurement system. Navigation links now scroll to exact pixel positions with zero manual guesswork, automatically adapting across all screen sizes. Implemented real-time `offsetHeight` measurement replacing ~40 lines of hardcoded CSS `scroll-margin-top` rules.
- **Navigation Modernization:** Complete redesign with rectangular tabs, enhanced hover effects, and professional shadow systems.
- **Interactive Elements Unification:** Consistent orange hover backgrounds with dark text across nav, players button, and creator badges.
- **Players Button Redesign:** Chunky 52px pill-shaped design optimized for clickability, removing green status indicator clutter.
- **Enhanced Hover Effects:** Scale transforms (1.02x-1.03x) with smooth cubic-bezier transitions and refined glow effects.
- **Major Architecture:** Single-page app structure with section-based navigation instead of multi-page routing.
- **Mobile Navigation Overhaul:** Full-screen mobile nav with smooth animations and enhanced UX.
- **Events System Integration:** Discord-connected events with countdown timers and military-themed status indicators.
- **Content Creator Redesign:** Ultra-compact creator badges (50px desktop, 45px tablet, 40px mobile) with optimized padding, standardized inactive text colors, and matching navigation hover behavior.
- **First Visit Experience:** Welcome overlay system for new users with guided onboarding.
- **Live Streaming Integration:** Embedded Twitch streams in Community section with `TwitchEmbed.vue`.
- **Enhanced Responsive Design:** Improved mobile breakpoints, typography scaling, and touch interactions.
- **Color Consistency Improvements:** Standardized text colors (var(--t2) inactive, var(--ink) hover) across all interactive elements.
- **Advanced Setup UX Optimization:** Replaced inappropriate download buttons with contextual hyperlinks for file downloads, implementing professional massgate orange styling with hover effects and modern underlines.
- **Content Creator Badge Refinement:** Further optimized badge dimensions (50px→45px→40px across breakpoints) with reduced padding and standardized inactive text colors for ultra-clean presentation.
- **Enhanced Discord Integration:** Direct Discord server hyperlinks in setup flows for seamless CD key support access.

## Content & Data
- **Static content:** `src/content/content.ts` holds hero copy, onboarding steps, community cards, requirements.
- **Live data:** `useAppDataStore` orchestrates API fetches for players online, leaderboards, server lists with 90s refresh cycle, 3-retry exponential backoff, and Page Visibility API integration.
- **Composables:**
  - `useYoutube.ts` – Multi-channel YouTube video fetching and parsing from Atom feeds (SSR-safe).
  - `useEvents.ts` – Discord events integration with real-time countdown and status management (SSR-safe).
  - `useFirstVisit.ts` – First-time visitor detection and overlay management.
- **Utilities:**
  - `src/utils/scroll.ts` – Dynamic header measurement and pixel-perfect scroll positioning with `getNavHeight()`, `getHeaderHeightWithBuffer()`, and `scrollToSection()`.
  - `src/utils/analytics.ts` – Type-safe event tracking with 15 pre-defined event categories and SSR-safe execution.
  - `src/utils/performance.ts` – Web Vitals tracking (CLS, FCP, INP, LCP, TTFB) with automatic metric collection.
  - `src/utils/structuredData.ts` – JSON-LD schema generators for SEO (Organization, WebSite, FAQPage, VideoObject, Event).
  - `src/utils/playerDisplay.ts` – Formatter/colorizer for massgate-style names.

## UX/Design Guidelines
- Always consume design tokens and component variables for colors, borders, shadows.
- **Interactive Element Standards:** Orange backgrounds (var(--sw-rgb)) with dark text (var(--ink)) on hover for all clickable elements.
- **Hover Effects:** Use scale transforms (1.02x nav, 1.03x players) + translateY(-2px) with cubic-bezier(0.25, 0.8, 0.25, 1) transitions.
- **Shadow System:** Multi-layer shadows with proper depth: outer shadows for elevation, inner highlights for premium feel.
- **Text Color Rules:** var(--t2) for inactive states, var(--ink) for hover/active states across all components.
- **Navigation Scroll Precision:** ALWAYS use dynamic header measurement for scroll positioning. NEVER use hardcoded CSS `scroll-margin-top` values or manual pixel calculations. Use `offsetHeight` measurements at scroll time for pixel-perfect positioning.
- **Download Button Hierarchy:** Reserve `btn-download` (red) exclusively for executable program downloads (WIC LIVE); use contextual hyperlinks for file/ZIP downloads. Use `btn-p` (orange) for standard primary actions.
- **Hyperlink Standards:** Advanced Setup sections use massgate orange (`var(--sw)`) with `var(--sw-light)` hover states, modern underline styling (3px offset, 1px thickness), and `target="_blank"` for external links.
- Maintain adequate contrast (WCAG AA) – headings `var(--t)` on dark surfaces, supporting copy `var(--t2)`/`var(--t3)`.
- **Glow Effects:** Refined brightness levels - keep glow opacity around 0.3-0.4 for subtle professional appearance.
- **Responsive Navigation:** Dynamic measurement system automatically adapts across all breakpoints (1200, 1100, 1000, 900, 850, 800px etc.) without manual calculations.

## Project Structure Snapshot
```
src/
├─ main.ts
├─ router/
├─ stores/
├─ components/
│  ├─ Navigation.vue          # Mobile-first responsive nav
│  ├─ LeaderboardGroup.vue    # Enhanced leaderboard tables
│  ├─ PlayersOnline.vue       # Side panel for live players
│  ├─ FirstVisitOverlay.vue   # Welcome overlay for new users
│  ├─ TwitchEmbed.vue         # Live stream integration
│  ├─ RankInsignia.vue        # Player rank badges
│  ├─ Footer.vue
│  └─ …
├─ screens/                     # Section components (not separate pages)
│  ├─ GettingStarted.vue       # Onboarding section with download flow
│  ├─ Community.vue            # Events, videos, live streams, creator badges
│  ├─ Statistics.vue           # Leaderboards and player data
│  ├─ About.vue                # Project information
│  └─ FAQ.vue                  # Frequently asked questions
├─ views/                       # Actual routed pages
│  ├─ Home.vue                 # Main page containing all sections
│  └─ GameMode.vue             # Standalone game mode page
├─ composables/
│  ├─ useYoutube.ts            # Multi-channel video fetching
│  ├─ useEvents.ts             # Discord events integration
│  └─ useFirstVisit.ts          # First-time visitor management
├─ assets/
│  └─ styles/
│     ├─ base.css
│     └─ modules/
│        ├─ variables.css
│        ├─ typography.css
│        ├─ buttons.css
│        ├─ responsive.css
│        └─ components/
│           ├─ navigation.css
│           ├─ leaderboards.css
│           ├─ hero.css
│           ├─ community.css
│           ├─ getting-started.css      # Onboarding section styling
│           ├─ videos.css               # Video component styles
│           ├─ about.css                # About section styling
│           ├─ faq.css                  # FAQ section styling
│           ├─ game-mode.css            # Game mode page styling
│           ├─ players-panel.css        # Side panel for online players
│           └─ toggle.css               # Toggle switch components
└─ content/
   └─ content.ts
```

## Testing & Quality
- Primary checks via `npm run lint` (ESLint + Prettier integration).
- Build validation through `npm run build` (Vite, outputs hashed bundles to `dist/`).
- No dedicated unit/e2e suites today; manual QA focused on responsive behavior and API integration.

## Navigation Component Details

### Pixel-Perfect Navigation System
- **Desktop Navigation:** Rectangular tabs with 3px top border-radius, enhanced shadow systems, and scale hover effects
- **Players Button:** Independent 52px pill-shaped design (border-radius: 26px) optimized for mobile and desktop interaction
- **Hover Standards:** Orange gradient backgrounds with dark text (var(--ink)) and consistent scale transforms
- **Animation System:** Cubic-bezier(0.25, 0.8, 0.25, 1) transitions with multi-layer shadow effects
- **Scroll Precision:** Dynamic header measurement system eliminates all manual calculations and hardcoded offsets

### Technical Implementation - Dynamic Measurement System
```javascript
// Real-time header height measurement - zero guesswork
function getDynamicHeaderHeight() {
  const banner = document.querySelector('.header-banner');
  const nav = document.querySelector('header');

  if (!banner || !nav) return 200; // Fallback

  const bannerHeight = banner.getBoundingClientRect().height;
  const navHeight = nav.getBoundingClientRect().height;
  const isMobile = window.innerWidth <= 768;
  const buffer = isMobile ? 20 : 5;

  return Math.ceil(bannerHeight + navHeight + buffer);
}

// Pixel-perfect scroll positioning
function scrollTo(id: string) {
  const sectionElement = document.getElementById(id);
  if (sectionElement) {
    const headerBanner = document.querySelector('.header-banner');
    const nav = document.querySelector('header');
    const actualHeaderHeight = (headerBanner?.offsetHeight || 0) + (nav?.offsetHeight || 0);

    const sectionRect = sectionElement.getBoundingClientRect();
    const sectionTop = sectionRect.top + window.scrollY;
    const targetY = sectionTop - actualHeaderHeight;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth'
    });
  }
}
```

### Visual Design Patterns
```css
/* Navigation Tab Pattern */
transform: scale(1.02) translateY(-2px);
box-shadow:
  0 4px 16px rgba(0, 0, 0, 0.3),
  0 0 24px rgba(var(--sw-rgb), 0.4),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);

/* Players Button Pattern */
height: 52px;
border-radius: 26px;
transform: scale(1.03) translateY(-2px);
```

### Color Consistency Rules
- **Inactive State:** All text uses `var(--t2)` (neutral text color)
- **Hover State:** All text and dividers use `var(--ink)` (dark contrast color)
- **Background Hover:** Orange gradient `rgba(var(--sw-rgb), 0.85-0.68)` range
- **Glow Effects:** Limited to 0.3-0.4 opacity for professional appearance

## Contribution Reminders
- Work from feature branches; keep commits scoped.
- **Follow Navigation Patterns:** Use established hover effects and color rules for new interactive elements.
- When adding styles, create or extend the appropriate module under `assets/styles/modules/components/` and import via `base.css`.
- Document major visual or content changes in `AGENTS.md` + `CLAUDE.md` for future maintainers.

---
*This document is the quick-reference guide for future agents/maintainers so they can ramp fast and stay aligned with the Massgate design system.*

## New Features & Components
- **📱 Progressive Web App (PWA):** Full offline capability with service worker, installable as desktop/mobile app, intelligent caching strategies (CacheFirst for assets, NetworkFirst for API), auto-generated manifest with 4 icon sizes, automatic background updates, and environment-aware configuration (dev mode: minimal precaching with clean output; production: full ~49 entry precaching for offline support).
- **📊 Analytics System:** Type-safe event tracking with 15 pre-defined categories, integrated across all interactive components, uses `navigator.sendBeacon()` for reliability, SSR-safe execution with dev mode logging.
- **🧪 Testing Infrastructure:** 27 comprehensive tests (12 scroll utility tests, 15 data store tests) with Vitest + Vue Test Utils, SSR-safe mocks, 50%+ coverage thresholds, CI/CD integration via GitHub Actions with quality gates.
- **♻️ Standardized Scroll System:** Three focused utility functions (`getNavHeight()`, `getHeaderHeightWithBuffer()`, `scrollToSection()`), single source of truth, eliminated 40+ lines of duplicate code, 100% dynamic measurement, clear separation of concerns.
- **🔧 Robust Error Handling:** 3-retry exponential backoff for API calls, 90s polling with Page Visibility API integration, ErrorBoundary component with Sentry integration, comprehensive error tracking and analytics.
- **🔍 SEO-Optimized Static Site Generation:** Hybrid SSG/SPA architecture using vite-ssg. Pre-renders 7 unique HTML files at build time for search engines, hydrates to full single-page experience for users. Eliminates duplicate content issues with path-based routing while preserving seamless long-scroll UX.
- **🎯 Pixel-Perfect Navigation System:** Revolutionary dynamic header measurement eliminates all hardcoded scroll calculations, providing exact section positioning across all breakpoints with zero manual offsets.
- **Modern Navigation Design:** Rectangular tabs with enhanced hover effects, professional shadow systems, and consistent interaction patterns.
- **Optimized Players Button:** Independent 52px pill-shaped design with superior clickability and clean visual presentation.
- **Unified Interactive Design:** Consistent orange hover backgrounds with dark text across all clickable elements (nav, players, creators).
- **Enhanced Visual Feedback:** Scale transforms, refined glow effects, and smooth cubic-bezier transitions throughout the interface.
- **Progressive Enhancement with Skeletons:** SEO-friendly skeleton loaders with semantic HTML and noscript fallbacks for accessibility.
- **Events System:** Real-time Discord event integration with countdown timers and status tracking.
- **First Visit Experience:** Guided overlay for new users with smart section navigation.
- **Live Streaming:** Embedded Twitch streams with automatic status detection.
- **Enhanced Mobile Navigation:** Full-screen mobile nav with smooth slide animations.
- **Ultra-Compact Creator Badge System:** Significantly refined creator badges with 37% height reduction across breakpoints, optimized padding, and standardized var(--t2) inactive text colors for professional presentation.
- **Color Consistency Standards:** Standardized text colors and divider elements following unified design patterns.
- **Advanced Setup Hyperlink System:** Professional massgate orange hyperlinks replacing download buttons for file downloads, with integrated Discord server access and modern underline styling.
- **Web Vitals Monitoring:** Automatic Core Web Vitals tracking (CLS, FCP, INP, LCP, TTFB) with configurable analytics endpoint.
- **Build Automation:** Automated icon generation, sitemap creation, and PWA manifest generation as part of build process.

---
*This document reflects the current state of WiCGATE as of October 2025. Major enhancements include PWA implementation with offline support and environment-aware configuration, comprehensive analytics and testing infrastructure, standardized scroll system architecture, robust error handling with retry logic, SEO-optimized SSG, production-ready monitoring with Web Vitals tracking, and complete rectangular design system implementation.*
