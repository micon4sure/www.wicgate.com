# Changelog

## Recent Changes - Quick Summary

- 📖 **GUIDE.md Optimization** - Streamlined from 500 → 182 lines, essential patterns only (Oct 2)
- 📋 **Documentation Restructure** - CLAUDE.md → pure preferences, GUIDE.md → detailed patterns (Oct 2)
- 📘 **API Documentation** - Complete endpoint reference, data structures, integration patterns (Oct 2)
- 📚 **Documentation Enhancement** - Fixed state management docs, added quick summaries, enhanced onboarding (Oct 2)
- 📱 **PWA Implementation** - Full offline capability, installable app with service worker
- 📊 **Analytics Integration** - 15 event categories, Web Vitals tracking
- 🧪 **Testing Infrastructure** - 27 tests, hybrid timing (0.7s fast / 14s thorough)
- ♻️ **Scroll System Refactor** - 3 focused functions, eliminated 40+ lines duplication
- 🔧 **Enhanced Error Handling** - 3-retry exponential backoff, Page Visibility API
- 🔍 **SEO Revolution** - 7 unique pre-rendered HTML files, path-based routing
- 🚀 **Pixel-Perfect Navigation** - Dynamic measurement, zero hardcoded values
- 🎨 **Navigation Modernization** - Rectangular tabs, multi-layer shadows
- 🔵 **Interactive Elements Unification** - Consistent orange hover backgrounds
- 🎯 **Players Button Redesign** - 52px pill-shaped, mobile-optimized
- 🔗 **Advanced Setup UX** - Professional hyperlinks for file downloads
- 👤 **Content Creator Redesign** - Ultra-compact badges (37% size reduction)

---

## October 2025

### 📖 GUIDE.md Optimization & Deep Dive Docs

**Status:** Complete (October 2, 2025)

**Problem:** GUIDE.md at 500 lines was too dense for quick onboarding, even as a "read once" guide.

**Solution:** Streamlined GUIDE.md to essentials only, moved deep content to relevant docs.

**Changes:**
- **GUIDE.md** - Reduced from 500 → 182 lines (64% reduction)
- **docs/troubleshooting.md** - NEW file with all troubleshooting scenarios
- **docs/design-system.md** - Enhanced with "WHY" explanations and examples
- **docs/architecture.md** - Enhanced with detailed SSR guard patterns

**GUIDE.md (182 lines - Essentials Only):**
- Documentation index
- 8 essential patterns (minimal, with links to deep dives)
- 2 critical gotchas (Composables, bun run test)
- Common mistakes table
- Key files reference
- "When You're Stuck" quick links

**docs/troubleshooting.md (NEW - ~300 lines):**
- Build issues (SSR guards, module resolution)
- Test failures (package manager, timing, coverage)
- Styling issues (CSS modules, scroll positioning)
- Type errors
- Environment variables
- Runtime errors
- Performance issues
- Git issues
- Quick diagnostic commands

**docs/design-system.md (Enhanced):**
- Added "Why Design Tokens?" explanation
- Added visual examples (wrong vs correct)

**docs/architecture.md (Enhanced):**
- Added "Why SSR Guards?" explanation
- Added detailed code examples (wrong vs correct)
- Added "Files Requiring Guards" list

**Impact:**
- **Lighter onboarding:** 182 lines vs 500 lines for first read
- **Faster reference:** Jump to relevant deep dive doc instead of scrolling through 500 lines
- **Better organization:** Troubleshooting separate from patterns
- **Comprehensive help:** All error scenarios documented in one place

**Files:**
- GUIDE.md - Streamlined to essentials
- docs/troubleshooting.md - Created (~300 lines)
- docs/design-system.md - Enhanced (+20 lines)
- docs/architecture.md - Enhanced (+40 lines)

### 📋 Documentation Structure Optimization

**Status:** Complete (October 2, 2025)

**Problem:** CLAUDE.md was 133 lines mixing user preferences with detailed documentation, making it unclear what was "must do" vs "nice to know."

**Solution:** Separated concerns into focused files with clear purposes.

**Changes:**
- **CLAUDE.md** - Reduced from 133 → 58 lines (pure user preferences/constraints)
- **GUIDE.md** - NEW file with all detailed patterns, examples, and explanations
- **AGENTS.md** - Updated to reference GUIDE.md as primary onboarding doc

**CLAUDE.md (Pure Preferences - 58 lines):**
- Commands agents need to know
- 6 mandatory constraints (NEVER/ALWAYS rules)
- Workflow preferences (when to update which docs)
- Quality gates

**GUIDE.md (Complete Agent Guide - ~500 lines):**
- Detailed rules with WHY explanations
- Code examples (wrong vs correct)
- Troubleshooting guide
- Common mistakes reference
- Key files reference
- State management pattern explanation
- Package manager gotchas

**Impact:**
- **True purpose:** CLAUDE.md is now actual user preferences (like .eslintrc for AI)
- **Better separation:** Preferences vs documentation clearly distinct
- **Easier maintenance:** Change preferences without touching documentation
- **Clearer onboarding:** GUIDE.md provides complete context for new agents
- **Scalability:** Can expand documentation without bloating preferences

**Files:**
- CLAUDE.md - Rewritten as pure preferences
- GUIDE.md - Created with all explanatory content
- AGENTS.md - Updated Quick Links to prioritize GUIDE.md

### 📘 WiCGATE API Documentation

**Status:** Complete (October 2, 2025)

**Features:**
- Complete API reference documentation for all 5 endpoints
- Comprehensive data structure documentation (7 types)
- Request/response examples with real data
- Integration patterns and best practices
- Error handling and retry logic documentation
- Caching strategy (client-side + PWA)
- TypeScript type reference
- Testing and mocking guidelines

**API Endpoints Documented:**
- `GET /api/data` - Complete dataset (servers, players, all leaderboards)
- `GET /api/online` - Currently online servers and players
- `GET /api/leaderboard/all` - All 10 leaderboard variants
- `GET /api/leaderboard/ladder` - Player ladder rankings
- `GET /api/events` - Discord community events

**Data Structures Documented:**
- ServerEntry - Active game servers
- OnlineProfile - Currently online players with server info
- LeaderboardEntry - Player leaderboard entries with clan tags
- LadderEntry - Player ladder rankings
- DiscordEvent - Community events with countdown timers

**Impact:**
- **Complete API reference** - Developers can integrate with WiCGATE API
- **Clear integration patterns** - Examples show proper usage with retry logic
- **Fixed environment variable** - Corrected VITE_API_BASE_URL → VITE_API_BASE
- **Better discoverability** - API docs linked from architecture, CLAUDE.md, AGENTS.md
- **Type safety documented** - TypeScript interfaces explained with context

**Files:**
- docs/api.md - Complete API documentation (~600 lines)
- README.md - Fixed environment variable name
- docs/architecture.md - Added API overview in Data Layer section
- CLAUDE.md - Added API docs to Quick Links
- AGENTS.md - Added API docs to Quick Links

### 📚 Documentation Enhancement & Architecture Clarification

**Status:** Complete (October 2, 2025)

**Features:**
- Added Quick Architecture Summary to docs/architecture.md for rapid onboarding
- Fixed state management documentation (composable modules, NOT Pinia)
- Enhanced Contributing guidelines in README.md
- Added Quick Summary section to changelog for easy scanning
- Added inline comments to README.md Project Structure
- Comprehensive gap analysis comparing OLD_ARCHIVE vs current docs

**Impact:**
- **Accurate documentation** - State management pattern correctly documented
- **Faster onboarding** - Quick summary helps new developers understand architecture in seconds
- **Clear contribution workflow** - Explicit guidance on CLAUDE.md and AGENTS.md updates
- **Better discoverability** - Enhanced project structure with descriptive comments
- **Scannable changelog** - Quick summary with emoji markers for rapid navigation

**Changes:**
- docs/architecture.md - Added Quick Architecture Summary, updated State Management section
- README.md - Fixed Pinia references, enhanced Contributing section, added component descriptions
- CLAUDE.md - Updated stack reference (Composable Modules instead of Pinia)
- AGENTS.md - Updated stack and file organization references
- docs/changelog.md - Added Quick Summary section at top

### 📱 Progressive Web App (PWA) Implementation

**Status:** Complete

**Features:**
- Full offline capability with service worker
- Installable as desktop/mobile app
- Intelligent caching strategies:
  - **CacheFirst:** Fonts, images, static assets
  - **NetworkFirst:** API calls with offline fallback
- Auto-generated `manifest.webmanifest` with metadata
- 4 optimized icon sizes (64px, 192px, 512px, maskable)
- Automatic background updates
- Environment-aware configuration:
  - **Dev mode:** Minimal precaching, clean console output
  - **Production mode:** Full ~49 entry precaching for offline support

**Impact:**
- Users can install WICGATE as a native-like app
- Complete offline access to cached content
- Faster subsequent page loads via caching
- Enhanced mobile experience

**Files:**
- [vite.config.ts](../vite.config.ts) - PWA plugin configuration
- [src/main.ts](../src/main.ts) - Service worker registration
- [public/manifest.webmanifest](../public/manifest.webmanifest) - Auto-generated manifest
- [scripts/generate-pwa-assets.ts](../scripts/generate-pwa-assets.ts) - Icon generation

### 📊 Analytics Integration

**Status:** Complete

**Features:**
- Type-safe event tracking system
- 15 pre-defined event categories:
  - Navigation, Downloads, Social, Game, Players
  - Leaderboards, FAQ, Onboarding, Errors
  - Video, Stream, Events, Creators, Search
- Integrated across all interactive components:
  - [Navigation.vue](../src/components/Navigation.vue)
  - [LeaderboardGroup.vue](../src/components/LeaderboardGroup.vue)
  - [ErrorBoundary.vue](../src/components/ErrorBoundary.vue)
  - [appDataStore.ts](../src/stores/appDataStore.ts)
- `navigator.sendBeacon()` with fetch fallback for reliable delivery
- SSR-safe execution with dev mode console logging

**Impact:**
- Comprehensive user behavior insights
- Error tracking and debugging
- Performance monitoring
- Data-driven feature development

**Files:**
- [src/utils/analytics.ts](../src/utils/analytics.ts) - Core analytics system
- [src/utils/performance.ts](../src/utils/performance.ts) - Web Vitals tracking

### 🧪 Testing Infrastructure

**Status:** Complete

**Features:**
- Comprehensive test suite with Vitest + Vue Test Utils
- 27 tests covering:
  - Scroll utilities (12 tests)
  - Data store (15 tests)
- SSR-safe mocks and test utilities
- 50%+ coverage thresholds enforced
- Hybrid timing strategy:
  - **Fast mode:** ~0.7s with fake timers (default)
  - **Thorough mode:** ~14s with real timers (CI)
- CI/CD integration via GitHub Actions:
  - [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)
  - [.github/workflows/pr-checks.yml](../.github/workflows/pr-checks.yml)

**Impact:**
- 21x faster local development with fast mode
- Comprehensive validation in CI with thorough mode
- Confidence in code changes
- Regression prevention

**Files:**
- [src/utils/scroll.test.ts](../src/utils/scroll.test.ts)
- [src/stores/appDataStore.test.ts](../src/stores/appDataStore.test.ts)
- [vitest.config.ts](../vitest.config.ts)

### ♻️ Scroll System Refactor

**Status:** Complete

**Features:**
- Standardized scroll utility architecture
- Three focused functions with clear responsibilities:
  - `getNavHeight()` - Single source of truth for nav height
  - `getHeaderHeightWithBuffer()` - Detection tolerance
  - `scrollToSection()` - Pixel-perfect positioning
- Eliminated 40+ lines of duplicate code
- 100% dynamic measurement
- Clear separation of concerns (positioning vs. detection)

**Impact:**
- Zero hardcoded scroll calculations
- Automatic responsive adaptation
- Single point of maintenance
- Pixel-perfect navigation across all breakpoints

**Files:**
- [src/utils/scroll.ts](../src/utils/scroll.ts)
- [src/components/Navigation.vue](../src/components/Navigation.vue)
- [src/views/Home.vue](../src/views/Home.vue)

### 🔧 Enhanced Error Handling

**Status:** Complete

**Features:**
- 3-retry exponential backoff for API calls:
  - Attempt 1: Immediate
  - Attempt 2: 1s delay
  - Attempt 3: 2s delay
  - Attempt 4: 4s delay
- 90s polling interval for live data
- Page Visibility API integration (pauses when tab hidden)
- ErrorBoundary component with:
  - User-friendly fallback UI
  - Sentry integration
  - Analytics event logging
  - Retry functionality

**Impact:**
- Resilient API communication
- Better handling of network issues
- Resource optimization when tab hidden
- Graceful degradation for users

**Files:**
- [src/stores/appDataStore.ts](../src/stores/appDataStore.ts)
- [src/components/ErrorBoundary.vue](../src/components/ErrorBoundary.vue)

### 🔍 SEO Revolution with SSG Implementation

**Status:** Complete

**Features:**
- Complete migration to Static Site Generation (SSG) using vite-ssg
- Path-based routing (`/statistics`, `/community`) replaces hash-based navigation
- Generates 7 unique pre-rendered HTML files:
  - `index.html` (35.59 KB) - All 6 sections
  - `getting-started.html` (10.74 KB)
  - `statistics.html` (6.99 KB)
  - `community.html` (12.60 KB)
  - `about.html` (8.27 KB)
  - `faq.html` (12.39 KB)
  - `game-mode.html` (11.37 KB)
- Hybrid rendering strategy:
  - **For crawlers:** Conditional sections (unique content per URL)
  - **For users:** Full sections (seamless scrolling)
- Progressive enhancement with skeleton loaders:
  - [LeaderboardSkeleton.vue](../src/components/skeletons/LeaderboardSkeleton.vue)
  - [EventsSkeleton.vue](../src/components/skeletons/EventsSkeleton.vue)
  - [VideosSkeleton.vue](../src/components/skeletons/VideosSkeleton.vue)
- SSR guards across stores/composables
- Vue Router integration with scroll preservation

**Impact:**
- Eliminates duplicate content issues
- Each URL has unique, focused content for search engines
- Fast initial page loads (pre-rendered HTML)
- Beautiful single-page UX maintained for users
- Progressive enhancement for accessibility

**Files:**
- [src/main.ts](../src/main.ts) - ViteSSG initialization
- [src/views/Home.vue](../src/views/Home.vue) - Conditional rendering logic
- [src/router/routes.ts](../src/router/routes.ts) - SEO metadata
- [vite.config.ts](../vite.config.ts) - SSG configuration

### 🚀 Pixel-Perfect Navigation Revolution

**Status:** Complete

**Features:**
- Complete elimination of hardcoded scroll calculations
- Dynamic header measurement system
- Navigation links scroll to exact pixel positions
- Zero manual guesswork
- Automatic adaptation across all screen sizes
- Real-time `offsetHeight` measurement
- Replaced ~40 lines of hardcoded CSS `scroll-margin-top` rules

**Impact:**
- Perfect scroll positioning at all breakpoints
- Eliminated maintenance burden of manual calculations
- Future-proof responsive design
- Single source of truth for measurements

**Files:**
- [src/utils/scroll.ts](../src/utils/scroll.ts)
- [src/components/Navigation.vue](../src/components/Navigation.vue)

### 🎨 Navigation Modernization

**Status:** Complete

**Features:**
- Complete redesign with rectangular tabs
- 3px top border-radius for modern aesthetic
- Enhanced hover effects with multi-layer shadows:
  - Elevation shadows for depth
  - Orange glow effects (0.3-0.4 opacity)
  - Inner highlights for premium feel
- Professional shadow systems
- Scale transforms (1.02x) + translateY(-2px) for lift effect
- Cubic-bezier transitions for smooth animations

**Impact:**
- Modern, professional appearance
- Consistent interaction patterns
- Enhanced visual feedback
- Military-themed aesthetic maintained

**Files:**
- [src/assets/styles/modules/components/navigation.css](../src/assets/styles/modules/components/navigation.css)

### 🔵 Interactive Elements Unification

**Status:** Complete

**Features:**
- Consistent orange hover backgrounds across all interactive elements:
  - Navigation links
  - Players button
  - Creator badges
- Dark text (`var(--ink)`) on hover for readability
- Standardized inactive text color (`var(--t2)`)
- Matching scale transforms and transitions

**Impact:**
- Unified user experience
- Predictable interaction patterns
- Professional consistency
- Clear visual hierarchy

**Files:**
- [src/assets/styles/modules/components/navigation.css](../src/assets/styles/modules/components/navigation.css)
- [src/assets/styles/modules/components/community.css](../src/assets/styles/modules/components/community.css)

### 🎯 Players Button Redesign

**Status:** Complete

**Features:**
- Chunky 52px pill-shaped design (border-radius: 26px)
- Optimized for clickability on mobile and desktop
- Removed green status indicator clutter
- Independent design from navigation tabs
- Slightly stronger scale transform (1.03x) for emphasis

**Impact:**
- Superior mobile interaction
- Cleaner visual presentation
- Better thumb/finger targeting
- Consistent with modern UI patterns

**Files:**
- [src/assets/styles/modules/components/navigation.css](../src/assets/styles/modules/components/navigation.css)
- [src/components/PlayersOnline.vue](../src/components/PlayersOnline.vue)

## September 2025

### 🏗️ Major Architecture Changes

**Status:** Complete

**Features:**
- Single-page app structure with section-based navigation
- Replaced multi-page routing with smooth scroll sections
- Path-based routing preparation for SSG

**Files:**
- [src/views/Home.vue](../src/views/Home.vue)
- [src/router/routes.ts](../src/router/routes.ts)

### 📱 Mobile Navigation Overhaul

**Status:** Complete

**Features:**
- Full-screen mobile nav with smooth animations
- Hamburger menu with slide-in behavior
- Touch-optimized spacing and targets
- Enhanced mobile UX

**Files:**
- [src/components/Navigation.vue](../src/components/Navigation.vue)
- [src/assets/styles/modules/components/navigation.css](../src/assets/styles/modules/components/navigation.css)

### 🎮 Events System Integration

**Status:** Complete

**Features:**
- Discord-connected events with real-time sync
- Countdown timers with military-themed status indicators
- Event status management (upcoming, live, past)
- Integration with Discord API

**Files:**
- [src/composables/useEvents.ts](../src/composables/useEvents.ts)
- [src/screens/Community.vue](../src/screens/Community.vue)

### 👤 Content Creator Redesign

**Status:** Complete (Multiple Iterations)

**Features:**
- Ultra-compact creator badges with 37% height reduction:
  - Desktop: 50px (from original 80px)
  - Tablet: 45px
  - Mobile: 40px
- Optimized padding for clean presentation
- Standardized inactive text colors (`var(--t2)`)
- Matching navigation hover behavior (orange backgrounds, dark text)

**Impact:**
- Professional, compact presentation
- Consistent with overall design system
- Better use of screen space
- Enhanced mobile experience

**Files:**
- [src/assets/styles/modules/components/community.css](../src/assets/styles/modules/components/community.css)

### 🎭 First Visit Experience

**Status:** Complete

**Features:**
- Welcome overlay system for new users
- Guided onboarding flow
- localStorage-based detection
- Dismissible with preference memory

**Files:**
- [src/composables/useFirstVisit.ts](../src/composables/useFirstVisit.ts)
- [src/components/FirstVisitOverlay.vue](../src/components/FirstVisitOverlay.vue)

### 📺 Live Streaming Integration

**Status:** Complete

**Features:**
- Embedded Twitch streams in Community section
- Automatic status detection
- Responsive embed sizing
- Platform integration with Twitch API

**Files:**
- [src/components/TwitchEmbed.vue](../src/components/TwitchEmbed.vue)
- [src/screens/Community.vue](../src/screens/Community.vue)

### 📐 Enhanced Responsive Design

**Status:** Complete

**Features:**
- Improved mobile breakpoints (1200, 1100, 1000, 900, 850, 800, 768, 480px)
- Typography scaling across breakpoints
- Touch-optimized interactions (44px minimum targets)
- Fluid layouts and spacing

**Files:**
- [src/assets/styles/modules/responsive.css](../src/assets/styles/modules/responsive.css)

### 🎨 Color Consistency Improvements

**Status:** Complete

**Features:**
- Standardized text colors:
  - Inactive state: `var(--t2)` across all components
  - Hover state: `var(--ink)` for readability on orange
- Unified divider and border colors
- Consistent glow opacity (0.3-0.4) for professional appearance

**Files:**
- [src/assets/styles/modules/variables.css](../src/assets/styles/modules/variables.css)

### 🔗 Advanced Setup UX Optimization

**Status:** Complete

**Features:**
- Replaced inappropriate download buttons with contextual hyperlinks
- Professional massgate orange styling (`var(--sw)`)
- Hover effects with `var(--sw-light)`
- Modern underline styling (3px offset, 1px thickness)
- `target="_blank"` for external links
- Integrated Discord server access links

**Impact:**
- Appropriate UI patterns for file downloads
- Clear distinction from executable downloads
- Seamless access to community support
- Professional link presentation

**Files:**
- [src/screens/GettingStarted.vue](../src/screens/GettingStarted.vue)
- [src/assets/styles/modules/components/getting-started.css](../src/assets/styles/modules/components/getting-started.css)

### 📊 Web Vitals Monitoring

**Status:** Complete

**Features:**
- Automatic Core Web Vitals tracking:
  - CLS (Cumulative Layout Shift)
  - FCP (First Contentful Paint)
  - INP (Interaction to Next Paint)
  - LCP (Largest Contentful Paint)
  - TTFB (Time to First Byte)
- Configurable analytics endpoint
- Real-time performance metrics collection

**Files:**
- [src/utils/performance.ts](../src/utils/performance.ts)

### 🛠️ Build Automation

**Status:** Complete

**Features:**
- Automated icon generation from `favicon.svg`
- Sitemap creation from route definitions
- PWA manifest generation
- Sequential build process integration

**Files:**
- [scripts/generate-pwa-assets.ts](../scripts/generate-pwa-assets.ts)
- [scripts/generate-sitemap.ts](../scripts/generate-sitemap.ts)
- [package.json](../package.json)

## Future Enhancements

### Planned Features

- [ ] Implement lazy loading for video thumbnails
- [ ] Add E2E tests with Playwright
- [ ] Implement image CDN integration
- [ ] Visual regression testing
- [ ] Component snapshot testing
- [ ] Performance benchmarking
- [ ] Accessibility testing (axe-core)
- [ ] Internationalization (i18n) support
- [ ] Dark mode toggle (optional enhancement)

### Under Consideration

- Implement service worker update notifications
- Add offline-first data caching strategy
- Enhanced analytics dashboards
- User preference persistence across devices
- Advanced search functionality
- RSS feed for community updates

---

*For current features and architecture, see [README.md](../README.md) and [architecture.md](architecture.md).*
