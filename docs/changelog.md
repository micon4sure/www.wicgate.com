# Changelog

## Recent Changes - Quick Summary
- 🎨 **UI: Leaderboard Divider Cleanup** - Removed unintended white divider borders from leaderboard headers and body cells so statistics cards keep a solid dark panel appearance; hover treatments still rely on orange gradient utilities for focus. (Oct 17)
- 🎨 **MAJOR: CSS Variable to Tailwind Migration Complete** - Eliminated 89% of CSS variables (56 → 6 usages), migrated all legacy variables to Tailwind utilities achieving full CLAUDE.md compliance: removed all spacing variables (--spacing-xs/sm/md/lg/xl), color shortcuts (--t, --t2, --sw, --ink), RGB triplets (--massgate-orange-rgb, --graphite-rgb, etc.), transition helpers (--tr), skeleton colors (--s2, --mg-muted), and gradient variables (--grad-card), fixed 8 critical bugs from undefined variables (player-neutral, spacing classes, error gradients), only retained --header-height (JS-synced via headerHeight.ts for dynamic layout), all quality gates passing (44/44 tests, clean lint, TypeScript strict mode, successful build), divider colors migrated to tailwind.config.ts with proper rgba definitions, build output confirms zero project CSS variables except header-height - cleaner codebase, better type safety, improved maintainability, maximum Tailwind utility usage (Oct 17)
- 🎨 **MAJOR: Teal/Orange Color System Refinement** - Completed color hierarchy clarification with teal for structural elements and orange for interactive states: icon badges now use teal gradients (teal-bright → teal-glow with darker teal borders) across all sections (widgets, Downloads timeline, FAQ categories, Network Ports), all card/widget hover effects changed from teal to orange (widgets, server items, player lists, ladder items, generic cards, FAQ target highlights), creator badges in Community section now match navigation tabs with orange hover (orange gradient background + ink text on hover), download links use orange with underline on hover, FAQ copy link icons changed to orange, removed excessive glow from Downloads Quick Install timeline steps, section headers in Downloads changed to white for cleaner hierarchy - creates clear visual language: teal = structure/badges/accents, orange = interactive/hover states (Oct 17)
- 🔗 **FAQ Copy Link Feature** - Added industry-standard copy link buttons to all 21 FAQ questions following GitHub/MDN/Stack Overflow pattern: hover over any question reveals link icon (🔗), clicking copies category-specific URL to clipboard (e.g., `/faq/server#technical-advantages`), icon changes to checkmark (✓) with toast notification "Link copied to clipboard!" (auto-dismiss after 2s), questions now shareable via proper URLs encoding both category and question ID, :target CSS animation provides visual feedback on deep-link arrival (2s orange border pulse), SSR-safe with `navigator.clipboard` guard, full keyboard accessibility with ARIA labels - enables precise question sharing in Discord/support contexts, better SEO discoverability, follows modern documentation site UX patterns (Oct 17)
- 🔒 **SSR/SSG Safety Hardening** - Fixed critical SSR bugs in router scrollBehavior and improved FAQ schema injection: added SSR guards (`typeof window === 'undefined'`) to main.ts scrollBehavior (lines 73-76, 119-122) preventing DOM API crashes during ViteSSG build, migrated FAQ structured data from manual DOM injection to SSR-compatible `useHead()` for proper pre-rendering, all 14 routes now pre-render successfully with zero SSR errors, FAQ schema (`"@type":"FAQPage"`) confirmed in static HTML, build validation passes with 0 errors - production-ready SSR implementation with 100% safety score (Oct 17)
- 🔄 **MAJOR: Path-Based Routing for Subsections** - Converted subsections from hash anchors to full nested routes for maximum SEO potential: expanded from 5 routes to 15 routes (3 Downloads, 5 FAQ, 1 Community, 1 Statistics, 2 system routes), created unique PageMeta for each subsection with targeted keywords/descriptions to prevent cannibalization, added FAQ question-level deep-linking with hash anchors (/faq/technical#black-screen), hybrid TabContainer supporting both route navigation (Downloads, FAQ) and local tabs (Community videos), sitemap now includes 15 URLs (all main sections + subsections), robots.txt with /admin disallow, noindex meta tags for login/admin pages - granular SEO targeting per subsection, better entry points from search, FAQ questions are shareable, maintains instant tab switching UX - route navigation ready for testing (Oct 17)
- 🧹 **REFACTOR: Remove /about Redirect** - Removed standalone /about redirect route and metadata since website is in development with no user bookmarks to preserve: deleted /about route from routes.ts, deleted /about metadata from pageMeta.ts - /faq/about remains as canonical About location with full metadata and navigation support, cleaner routing table, eliminates unnecessary redirect overhead - all 44 tests passing, linting clean, 18 routes pre-rendered (Oct 17)
- 🎨 **MAJOR: About Section Integration into FAQ** - Converted About section content to FAQ Q&A format and integrated as first tab in FAQ section: created "About WICGATE" category with 5 questions (What is WICGATE?, How did WICGATE start?, What makes WICGATE different?, core values, team), deleted About.vue component and all related About exports (aboutProject, teamMembers, projectValues), added redirect /about → /faq (later removed in Oct 17 refactor), removed About from NAVIGATION_STRUCTURE (5 top-level sections instead of 6), merged About SEO keywords into FAQ metadata, updated all internal references - all content now uses consistent accordion Q&A design, cleaner navigation hierarchy, one-stop destination for project info and help - all 44 tests passing, linting clean (Oct 16)
- 🎨 **Multitab Organization: About & Community Sections** - Refactored About section with 4 tabs (Mission, Our Story, Values, The Team) and Community Latest Videos with dynamic content creator tabs: About uses TabContainer with dedicated tabs for each subsection, Community videos has "Latest Videos" default tab showing top 6 videos across all channels plus individual tabs per content creator with channel links, both sections now match Downloads/FAQ navigation patterns - consistent UX across all major sections, improved mobile experience, deep linking support, analytics tracking - all 44 tests passing, linting clean (Oct 16)
- 🐛 **CRITICAL: Navigation Highlighting Bug Fix** - Fixed FAQ navigation button permanently highlighted by adding visibility check to skip hidden tab panels during scroll tracking: root cause was hidden tab panels (with `display:none`) still returning `getBoundingClientRect()` values and interfering with scroll position detection - added `element.offsetParent === null` check in useActiveSection.ts (line 45), added subsection-to-section mapping via getSectionFromSubsection() helper (line 60), preserved Vue Router state in TabContainer window.history.replaceState() (line 70), fixed FAQ route consistency from `/faq/community` to `/faq/server-community` - navigation now correctly highlights only the current section, tabs remain pure local state, all 44 tests passing, linting clean (Oct 16)
- ✨ **URL Sync for Tab Clicks** - Tab clicks now update URL for sharing/bookmarking (e.g., /downloads/quick, /faq/technical), maintains instant tab switching behavior, deep-linking preserved - all 44 tests passing, linting clean (Oct 16)
- 🐛 **CRITICAL: Navigation Dropdown Links Fix** - Fixed navigation dropdown links (Downloads → Quick Install, FAQ → Technical Issues, etc.) redirecting to home page by removing "panel-" prefix from TabContainer panel IDs: router scrollBehavior now correctly finds elements with IDs matching subsection routes (e.g., #downloads-quick instead of #panel-downloads-quick), navigation dropdown links now scroll to correct sections and activate correct tabs - all 44 tests passing, linting clean (Oct 16)
- 🐛 **Tab Navigation Fix** - Fixed FAQ tabs showing blank pages and Downloads tabs navigating to home by removing router.push from TabContainer: tabs now work as pure SPA with local state (no route navigation on tab clicks), deep-linking still works when arriving directly at subsection URLs (e.g., /downloads/server), eliminates navigation issues while maintaining accessibility and analytics - all 44 tests passing, linting clean (Oct 16)
- 🎨 **MAJOR: Multi-Tab Site Reorganization** - Complete IA restructuring to reduce scrolling with industry-standard tab pattern: created reusable TabContainer component with ARIA support, router sync, and analytics; extended Hero section to 100vh+ with reduced overlays; moved Events and Live Servers to main page (above scrollable sections); renamed Getting Started → Downloads with 3 tabs (Quick Install, Dedicated Server, Manual Install); renamed Multiplayer → Statistics (leaderboards only, servers moved to main page); FAQ reorganized into 4-category tabs (Getting Started, Technical Issues, Gameplay & Features, Server & Community); Community simplified to 2 subsections (streams, videos - events moved to main); updated 18 routes, navigation structure, and all widget navigation references - follows GitHub/Stripe/Apple patterns for parallel content organization (Oct 16)
- 🔒 **Code Quality & Security Improvements** - Fixed missing @vitest/coverage-v8 test dependency, added prominent mock authentication warnings to Admin/Login views with production safety checks in auth store, created comprehensive docs/security.md covering XSS prevention, authentication security, API security, and deployment checklist, extracted magic numbers to constants.ts (SERVER_MAX_CAPACITY, thresholds), migrated 3 legacy CSS variables (--g, --t3, --bd) to Tailwind across 8 files for better maintainability - all 44 tests passing, TypeScript strict mode clean, ESLint zero errors (Oct 16)
- 🎨 **MAJOR: 100% Scoped Styles to Tailwind Conversion** - Complete elimination of all `<style scoped>` blocks (19 files → 0) achieving full CLAUDE.md compliance: converted final 3 components (ErrorBoundary, FirstVisitOverlay, Navigation) from scoped CSS to centralized Tailwind classes in `@layer components`, added 252 lines of component CSS to tailwind.css while removing 324 lines from Vue files (66 line net reduction), fixed critical regressions (Vue transition animations for Navigation mobile menu, RGB CSS variables for ErrorBoundary gradient), 621+ total lines of scoped CSS eliminated across all phases, all 44 tests passing, 22 SSG pages render successfully, zero styling breaks - achieved perfect CLAUDE.md constraint adherence with maintainable, DRY, utility-first architecture (Oct 16)
- 🔒 **SECURITY: ESLint 9 Migration** - Upgraded from ESLint 8 (end-of-life October 2024) to ESLint 9 with flat config format for continued security patches: migrated `.eslintrc.json` to `eslint.config.js`, upgraded all plugins (eslint-plugin-vue 9→10, @typescript-eslint 8.44→8.46, vue-eslint-parser→10.2), added comprehensive browser/Node.js globals, all 44 tests passing, linting verified, TypeScript compilation clean, Prettier integration working, zero breaking changes to development workflow (Oct 15)
- 📚 **Architecture Documentation Update** - Updated architecture.md to reflect @unhead/vue migration: added @unhead/vue to stack listing, added comprehensive "Head Management & Meta Tags" section documenting belt-and-suspenders approach (runtime `useHead()` + build-time post-build script), clarified API differences from @vueuse/head (`textContent` vs `children`), corrected route counts (27 routes total, 23 pre-rendered for SSG with /admin excluded), updated build pipeline documentation (Oct 14)
- 🎨 **Homepage Widget Icon Badges** - Updated all 6 widget icons to use consistent orange circular badges matching site-wide design: solid orange gradient backgrounds (`from-massgate-orange-light to-massgate-orange`) with dark icons (`text-ink`), rounded full circles with orange borders - removed brand color overrides (Discord, YouTube) for unified visual language - matches FAQ category icons, About section icons, Getting Started badges while preserving unique glassmorphism widget containers (Oct 14)
- 🐛 **FAQ Routing Fix: Server & Community Subsection** - Fixed navigation link redirecting to home instead of scrolling to FAQ section by correcting ID mismatch: navigation/router used `faq-server-community` but FAQ component element used `faq-community`, causing `document.getElementById()` to return null - aligned FAQ component to use `faq-server-community` matching router configuration, all 44 tests passing (Oct 14)
- 🐛 **Navigation Dropdown Active States Fix** - Fixed subsection links turning black when active/clicked by replacing undefined CSS variables (`var(--massgate-orange-light)` and `var(--massgate-orange)`) with Tailwind `theme()` function accessing design tokens - text was changing to dark color while background gradient failed, creating invisible text on dark background (Oct 14)
- 🔄 **MAJOR: @unhead/vue Migration** - Migrated from deprecated @vueuse/head to modern @unhead/vue (official successor, maintained, integrated with vite-ssg v28+), changed `children` → `textContent` property for proper JSON-LD rendering during SSG, removed manual head setup (vite-ssg handles it automatically), all 44 tests passing, belt-and-suspenders approach with post-build script as safety net ensures structured data always works (Oct 14)
- 🔍 **SEO Critical: Structured Data Injection** - Fixed missing JSON-LD structured data (Organization + WebSite schemas) by extending post-build script to inject schema.org markup into all 22 pre-rendered pages - enables Google Knowledge Panel, rich search results, and proper search engine understanding (Oct 14)
- 🧹 **Code Cleanup: Store Refactoring Artifacts** - Removed unused imports and variables left behind from store initialization centralization: removed `onMounted` import from Admin.vue, removed unused `authStore` variable from Home.vue, auto-fixed Prettier formatting issues (Oct 14)
- 🌐 **SSG Metadata + Asset Base Fix** - Assets now use the correct root-relative base via `DEPLOY_BASE`, SSG pages exclude `/admin`, and a new post-build step stamps per-route titles/descriptions/canonicals into every pre-rendered HTML file (Oct 14)
- 🛡️ **Auth Guards + Data Polling Resilience** - Login/admin route guards now hydrate persisted sessions before enforcing access, admin dashboard triggers live polling on mount, app data store auto-recovers after outages, and sitemap generator covers all 23 SSG routes for better SEO (Oct 14)
- 🎨 **Tailwind Config Further Consolidated** - Reduced `tailwind.config.ts` from 250 to 193 lines (23% reduction): removed duplicate colors (night/battlefield-teal), consolidated gradients (kept 4 most-used, documented inline alternatives), reduced shadows (1-2 per color family instead of 3), moved rarely-used animations to component CSS - clearer hierarchy, easier to learn, still fully flexible with Tailwind utilities (Oct 14)
- 🎨 **Design System Consolidation: Single Source of Truth** - Removed ~80% of duplicate CSS variables from `tailwind.css` (95 lines → 20 lines), established `tailwind.config.ts` as single source of truth for all design tokens, refactored navigation styles to use Tailwind's `theme()` function instead of CSS variables, eliminated fragmentation between two parallel design systems - all colors now customizable in one place (Oct 14)
- 🛠️ **Shared Data Types + Leaderboard Stability** - Unified community event and YouTube video typings in `api-types`, rewired events/videos composables + widgets to use them, and hardened leaderboard data handling/tests so SSR + TypeScript builds run warning-free (Oct 14)
- 🎨 **Navigation & Leaderboards: Unified Massgate Orange Hover States** - Shifted primary navigation tabs (desktop + mobile), login CTA, dropdown items, and all leaderboard tab/row hover treatments to the same `massgate-orange` design tokens for consistent interactions. Added helper CSS vars in Tailwind base for RGB math so borders, glows, and gradients share the palette (Oct 13)

### October 14, 2025 - Auth Guard + Data Polling Resilience

**Highlights**
- Login (`/login`) and admin (`/admin`) route guards now await `authStore.checkAuth()` on first load so persisted sessions survive hard refreshes before role checks run.
- Admin dashboard bootstraps `useAppDataStore().init()` on mount, guaranteeing live polling even when the admin view is the entry point.
- App data store automatically schedules recovery fetches and listens for the browser `online` event after exhausting retries, restoring polling without a full reload.
- Sitemap generator derives URLs from `NAVIGATION_STRUCTURE`, producing a 23-route `public/sitemap.xml` that mirrors every pre-rendered section and subsection.
- Ran `npm run test:thorough` and `npm run lint` to confirm the resilience changes didn't introduce regressions.

### October 14, 2025 - SSR/SSG Metadata & Asset Hardening

**Highlights**
- Migrated all route head definitions into `src/content/pageMeta.ts`, providing a single source of truth for titles, descriptions, keywords, OG assets, and canonicals.
- Added `scripts/apply-head-meta.ts` plus a `postbuild:head` step so every ViteSSG HTML artifact is rewritten with the page-specific head metadata (24 routes total).
- Updated `vite.config.ts` to respect a `DEPLOY_BASE` env variable (default `/`); this fixes broken `/assets/*` URLs when serving nested SSG pages and excludes gated `/admin` from the SSG pass entirely.
- Regenerated sitemap via `scripts/generate-sitemap.ts` (now 22 routes) and refreshed PWA icons in `public/` during the build pipeline.
- Verified via `npm run build`, `npm run lint`, and `npm run test:thorough` to ensure the SSR output and asset references are stable.

- 🎨 **Leaderboard Headers: Red Gradient + White Text** - Updated leaderboard headers to use red gradient background with white text for strong military command center aesthetic: red gradient (`from-massgate-red to-massgate-red-dark` = #c62828 → #8b0000), dark red border (`border-massgate-red-dark`), white text with subtle shadow - affects all leaderboards (High Scores, Total Scores, Player Leaderboard, Clan Leaderboard) - creates bold, commanding presence matching military tactical UI (Oct 13)
- 🎨 **Text Brightness Enhancement** - Brightened text colors for better visibility on steel blue card backgrounds: primary text (#f3f6f8 → #ffffff pure white), secondary text (#a7b7c3 → #c5d5e0 brighter gray-blue), tertiary text (#6c7a85 → #8a9aa8) - improves readability across all content cards in About, FAQ, Getting Started, Multiplayer, Community sections (Oct 13)
- 🎨 **Design System: Darker Teal Variant** - Added `teal-darker` (#008b9e) to design system for subdued teal applications in headers and badges, completing teal color palette: bright (#4de8ff), default (#00d9ff), dark (#00b8d4), darker (#008b9e), glow (#26c6da) (Oct 13)
- 🎨 **Leaderboard Cleanup: Removed Unnecessary Red Borders** - Removed all unnecessary red borders/separators from leaderboards for cleaner visual flow: removed 3px aggressive red border below header, removed dark border below tab container, removed subtle red borders below table headers (RANK/PLAYER/SCORE) - affects all leaderboards (High Scores, Total Scores, Player Leaderboard, Clan Leaderboard) - creates unified seamless design with header flowing directly into tabs and table without visual breaks (Oct 13)
- 🎨 **Leaderboard Styling: Aggressive Red Headers + Consistent Borders** - Updated all leaderboard headers to use bright aggressive massgate-red (`#c62828`) instead of muted deep Soviet red (`#8b1d14`) for stronger visual hierarchy - fixed Clan Leaderboard outer border to match other leaderboards (`border-[var(--divider-strong)]`) - affects High Scores, Total Scores, Player Leaderboard, and Clan Leaderboard - creates more impactful, eye-catching headers with consistent card borders (Oct 13)
- 🎨 **MAJOR: Authentic Master Branch Steel Blue Theme** - Converted all content cards AND leaderboard tables from pure graphite/black to authentic military steel blue/navy backgrounds from original master branch - added new `panel` colors to design system: panel (DEFAULT: #121e27, dark: #090f14, alt: #1f313d), panel-striped (DEFAULT: #182630, dark: #0e181f) - affects 14 content cards across About, FAQ, Getting Started, Multiplayer, Community + leaderboard table rows (6 cells per table, 2 tables) - leaderboard odd rows: `from-panel/75 to-panel-dark/85`, even rows: `from-panel-striped/78 to-panel-striped-dark/88` - restores authentic darker, more subdued military tactical steel blue from original master branch design, replacing flat graphite/black with dimensional navy blue characteristic of military UI - matches authentic Massgate aesthetics from screenshot (Oct 13)
- 🎨 **Discord Button: Authentic Social Media CTA** - Redesigned desktop Discord button from icon-only to full button with "Join Discord" text, using official Discord brand colors (solid Discord blue #5865F2, white text, rounded corners), matching social media button pattern with hover lift and glow effects - exception to teal/orange theme for third-party brand recognition (Oct 13)
- 🎨 **Icon Badges: Nav Button Style (Solid Orange + Dark Text)** - Updated all icon badges to match navigation button visual style: solid orange gradient backgrounds (`from-massgate-orange-light to-massgate-orange`) with dark text/icons (`text-ink`), replacing semi-transparent gradients - affects Getting Started (timeline badges, advanced section icons, step numbers), About (mission, story, approach, values icons), FAQ (category icons), Discord CTA icons - matches nav tabs design (solid teal background + dark text) but with orange branding (Oct 13)
- 🎨 **MAJOR: Authentic Massgate Orange Structural Color (#f37c2b)** - Replaced teal with authentic Massgate orange (#f37c2b - warm red-tinted orange from original Massgate master branch) for all structural elements: timelines, badges, icon borders, card left accents, decorative lines, clan tags (Multiplayer + Leaderboards), network port numbers, FAQ category headers - added new `massgate-orange` color to design system (DEFAULT: #f37c2b, light: #f8a85e, dark: #e06820) with glows/shadows - teal now reserved ONLY for interactive hover/active states (navigation, buttons, accordions), soviet orange (#ff6600) kept for CTAs/download buttons - honors original Massgate's navigation/header style with authentic color palette, eliminates "teal washing" with proper color hierarchy (Oct 13)
- 🎨 **UI Cleanup: Reduced Teal Overload** - Removed icon badges from subsection headers (Community: Events/Live Streams/Latest Videos/By Content Creator, Multiplayer: Players & Servers/Statistics), changed subsection header text from teal to white for cleaner visual hierarchy, fixed YouTube play button to be always visible (not hidden until hover), teal now reserved for borders/accents/interactive elements (Oct 13)
- 🎨 **Multiplayer Section: Modern Card-Based Redesign** - Complete visual overhaul matching other sections: circular icon badges (server, trophy), server cards with teal accents, player hover changed from orange to teal, removed 372 lines of scoped CSS, reduced from 505 to 221 lines (56% reduction), kept beloved leaderboard tab teal gradient + dark text hover effect (Oct 13)
- 🎨 **About & FAQ Sections: Modern Card-Based Redesign** - Complete visual overhaul matching Getting Started's design language: circular icon badges with teal accents, card-based layouts, Vue transitions for collapsibles, Tailwind-first approach (no CSS variables/inline styles), hover effects reserved for interactive elements only (buttons/links), category icons (graduation-cap, wrench, gamepad, users) (Oct 13)
- 📚 **Documentation Consolidation** - Merged SCROLL_SYSTEM.md and DEEPLINKS.md into architecture.md, reduced from 2,270 lines to 559 lines (75% reduction), deleted design-system.md (duplicate of tailwind.config.ts), updated all references across GUIDE.md and AGENTS.md (Oct 13)
- 🎨 **Community Section: Teal Hover Theme** - Converted all video/event/stream card hover effects from orange to teal accent color matching navigation tabs for consistent visual language, reduced excessive glow effects in design system by ~50% (Oct 13)
- 🎨 **Getting Started: Modern Timeline UI** - Complete redesign with vertical timeline pattern, z-index layered badges/cards/lines, collapsible advanced sections with subtle hover effects, prominent RED download CTA button, orange underlined links in advanced sections (Oct 13)
- 🔄 **MAJOR: Pinia State Management Migration** - Complete migration from composable-based state to Pinia stores, added authentication system with mock JWT (admin/user roles), protected routes with guards, session persistence via localStorage, 19 new auth tests (44 total tests), comprehensive docs update (Oct 13)
- 🐛 **Server 0 Display Fix** - Players with serverId 0 (logged in but not on any server) now display as "Online" instead of "Server 0", added comprehensive tests and API documentation (Oct 13)
- 🎨 **Widget Icon Brand Colors** - Fixed Discord and YouTube widget icons to display their official brand colors (#5865F2 and #e53935) by making iconClass conditional in WidgetBase.vue, removed excessive teal glow from Getting Started step badges (Oct 12)
- 🎨 **MAJOR: Tailwind CSS Migration** - Complete rewrite from modular CSS to utility-first Tailwind approach, ~80% code reduction (8,154 deletions vs 1,569 additions), deleted 29 CSS module files, all design tokens moved to `tailwind.config.ts` (Oct 12)
- ✨ **Homepage Enhancement: Glassmorphism & Video Background** - Added frosted glass widget effect (desktop only), 22MB video background with SSR guards, enhanced text readability with drop shadows, 3-slide onboarding wizard for first-time visitors (Oct 12)
- 🔧 **CRITICAL: Page Reload Scroll Fix** - Fixed page refresh failing to reach FAQ/About sections by removing global CSS `scroll-behavior: smooth` that overrode JavaScript control, now uses smart behavior: instant jump (`auto`) on page reload to avoid smooth scroll distance limitations (~700ms browser animation timeout), smooth animation on SPA clicks for UX (Oct 11)
- 🎨 **Layout Stability: SSR→CSR Hydration** - Added min-height constraints to Community section containers (events: 380px, videos: 340px, streams: 200px) matching skeleton loaders, prevents layout shifts during API data loading, added 500ms hydration protection to useActiveSection to prevent premature scroll tracking during SSR→CSR transition, implemented smart scroll delays (400ms direct nav, 100ms SPA) (Oct 11)
- 🎯 **Navigation Highlighting: Hybrid Scroll Tracking** - Replaced complex IntersectionObserver with simple hybrid approach: click navigation uses route (instant), manual scrolling uses position-based tracking (scroll position + header height), added programmatic scroll protection to prevent racing highlights, ~110 lines vs 100+ complex observer code (Oct 10)
- 🧹 **Code Cleanup: Scroll System Documentation** - Removed duplicate `.section` CSS definition, updated outdated comments to reflect manual offset calculation instead of `scroll-padding-top`, consolidated `.section` definition with `position: relative` in layout.css (Oct 10)
- 🔧 **CRITICAL: Scroll Positioning & Navigation Height Fix** - Fixed hardcoded `.hdr` heights breaking dynamic measurement system and browser `scroll-padding-top` inconsistencies by using both `height` + `min-height` properties and manual offset calculation in router scrollBehavior for pixel-perfect positioning across all browsers and breakpoints (Oct 10)
- 🔧 **CRITICAL: Missing CSS Imports Fixed** - Discovered and fixed missing `hero.css` and `visual-hierarchy.css` imports in `base.css` that prevented dynamic header height from working, added comprehensive scroll system documentation in [architecture.md](architecture.md#scroll--navigation-system) (Oct 10)
- 🎯 **Dynamic Header Height Sync** - Implemented industry-standard auto-syncing system: JavaScript measures actual header height, updates CSS variable `--header-height`, `scroll-padding-top` uses variable for pixel-perfect positioning at all breakpoints, zero maintenance required (Oct 10)
- 🔄 **Native Scroll & Navigation System Refactor** - Complete rewrite using CSS/HTML-first approach: `scroll-behavior: smooth`, CSS variables for scroll offset, native `scrollRestoration: auto`, removed 500+ lines of custom JS logic (80% reduction), removed expandable sections for better discoverability (Oct 10)
- 🏗️ **Major Refactoring (Phases 1-5)** - Comprehensive codebase optimization: extracted composables, improved type safety, decomposed components, performance optimizations, developer experience enhancements (Oct 10)
- 🎨 **Live Servers Widget Color Enhancement** - Added dynamic player count colors (green < 50%, orange 50-89%, red ≥ 90%) matching Multiplayer section (Oct 9)
- 🎨 **Quick Start Widget Enhancement** - Added download icon and "Install WICGATE" CTA (reused from removed homepage button) for clearer action (Oct 9)
- 🌈 **Server Name Color Rendering** - Fixed Live Servers widget to properly render WiC in-game color codes, matching Multiplayer section display (Oct 9)
- 🔗 **Discord Navigation Integration** - Moved Discord from homepage CTA to navigation bar (icon-only on desktop, full link in mobile menu), removed redundant homepage buttons (Oct 9)
- 🔄 **Navigation System: Path-Based Nested Routes** - Refactored from hash-based to nested routes (27 pre-rendered routes), unique SEO meta tags per subsection, 80% code reduction (Oct 9)
- 🎨 **Widget Dashboard Styling Improvements** - Top Players widget now matches leaderboard styling: rank insignias, clan tags (orange), player names (white), podium colors for scores (Oct 9)
- 🎨 **Homepage Redesign: Widget Dashboard** - Replaced hero carousel with function-geared widget grid, integrated player count into Live Servers widget (Oct 9)
- 🐛 **90-Second Refresh Bug Fix** - Fixed LivePlayersBadge and Multiplayer section flashing/crashing every 90 seconds during polling (Oct 8)
- 🔧 **Hash Navigation Fix** - Replaced hash-based URLs with path-based routes in hero section for SSG compatibility (Oct 8)
- 📖 **GUIDE.md Update** - Added path-based navigation pattern to prevent future hash navigation bugs (Oct 8)
- 🎯 **Navigation UX Improvement** - Aligned navigation to left (gaming industry standard) for faster F-pattern scanning, matching Steam/Epic/Battle.net (Oct 8)
- 🔄 **Section Rename: Multiplayer** - Renamed "Game Mode" to "Multiplayer" for clarity, updated routes from `/game-mode` to `/multiplayer` (Oct 8)
- 🎮 **Hero Widget: Live Players Badge** - Added interactive player count widget to hero section with click-to-navigate to Multiplayer (Oct 8)
- 🧹 **UI Cleanup** - Removed Players Online panel/button, cleaned up related CSS/analytics/utilities (Oct 8)
- 🐛 **Critical Scroll Jump Fix** - Fixed fundamental scroll positioning bugs with async content loading using industry-standard patterns (Oct 6)
- ⚡ **Scroll Performance Improvement** - Removed artificial setTimeout delays (50-200ms) from navigation scrolling for instant, more predictable UX (Oct 6)
- ⚡ **Twitch Embed Performance Optimization** - Implemented click-to-load facade pattern with static previews, reducing initial page load by ~1.2MB (Oct 6)
- 🐛 **Memory Leak & Cleanup Fixes** - Fixed RAF/timeout cleanup in throttle/debounce utilities, added cancel methods, fixed visibilitychange listener leak (Oct 5)
- 🧹 **Code Review Cleanup** - Removed deprecated getDynamicHeaderHeight() function and lodash vite config reference, 26 tests passing (Oct 4)
- 🔧 **Constants Refactor & Cleanup** - Restored breakpoint/timing constants, removed unused dependencies/timers, centralized magic numbers (Oct 4)
- ⚡ **Performance & Bundle Optimization** - Removed axios/lodash (-83KB), debounced resize handlers (-95% events), RAF throttled scrolling (60fps locked), consolidated utilities, fixed memory leaks (Oct 3)
- 🔧 **Scroll Jumping & Hydration Fix** - Eliminated scroll jumping and SSR hydration mismatches with v-show + CSS transitions (Oct 3)
- 🎯 **Advanced Setup Collapsible** - Made Advanced Setup Options collapsible by default for cleaner onboarding (Oct 3)
- 🎯 **Getting Started Simplification** - Compressed 4 steps to 3, removed Requirements box, streamlined onboarding (Oct 3)
- 🎨 **Navigation Flash Fix** - Disabled scroll listener during programmatic navigation to prevent highlight flash (Oct 2)
- 🎨 **WICGATE Logo UX** - Made logos non-interactive in navigation and game mode (Oct 2)
- 🎨 **Navigation Animation Polish** - Smart transition system prevents cascade flicker during fast scrolling (Oct 2)
- 🎯 **Primary CTA Enhancement** - Dramatically improved download/Discord button interactivity (Oct 2)
- 🏆 **Leaderboard Top 3 Styling** - Removed glow effects from podium colors (Oct 2)
- 🎮 **Game Mode Header Buttons** - Revamped to match navigation's interactive design system (Oct 2)
- ▶️ **YouTube Play Button** - Updated to match YouTube's rounded rectangle shape (Oct 2)
- 🎨 **Visual Design Cleanup** - Removed green status indicators, fixed Twitch embed styling (Oct 2)
- 🔧 **Quick Fixes** - Added svgo dependency, improved .gitignore, fixed type safety in Home.vue (Oct 2)
- 🔄 **Navigation Scroll Fix** - Simplified resize handler to use centralized `scrollToSection()` utility (Oct 2)
- 📖 **GUIDE.md Optimization** - Streamlined from 500 → 182 lines, essential patterns only (Oct 2)
- 📋 **Documentation Restructure** - CLAUDE.md → pure preferences, GUIDE.md → detailed patterns (Oct 2)
- 📘 **API Documentation** - Complete endpoint reference, data structures, integration patterns (Oct 2)
- 📚 **Documentation Enhancement** - Fixed state management docs, added quick summaries, enhanced onboarding (Oct 2)
- 📱 **PWA Implementation** - Full offline capability, installable app with service worker
- 📊 **Analytics Integration** - 15 event categories, Web Vitals tracking
- 🧪 **Testing Infrastructure** - 26 tests, hybrid timing (0.7s fast / 14s thorough)
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

### October 16, 2025 - Code Quality & Security Improvements

**Highlights**
- Fixed missing @vitest/coverage-v8 dependency causing test coverage to fail (critical blocker for CI/CD pipelines)
- Added prominent mock authentication warnings to production builds: visual banner in Admin dashboard, demo mode notice in Login page, console error in auth store
- Created comprehensive security documentation (docs/security.md) covering XSS prevention strategies, authentication security concerns, API security best practices, storage security, and deployment checklist
- Extracted magic numbers to constants.ts: SERVER_MAX_CAPACITY (16 players), SERVER_CAPACITY_THRESHOLDS (90% full, 50% medium, 0% low)
- Migrated 3 most-used legacy CSS variables to Tailwind utilities across 8 files: --g → bg-online, --t3 → text-t-tertiary, --bd → border-mg
- Added security comments to usePlayerDisplay.ts documenting hex validation preventing CSS injection
- All 44 tests passing, TypeScript strict mode clean, ESLint zero errors

**Technical Details**

**Phase 1 - Critical Fixes:**
- `package.json`: Installed @vitest/coverage-v8@3.0.0 as dev dependency (required by vitest.config.ts)
- `src/views/Admin.vue`: Added prominent mock auth warning banner with red border/background, icon, and bold text after line 82
- `src/views/Login.vue`: Added demo mode warning notice with red styling and Flask icon after line 65
- `src/stores/auth.ts`: Added production environment check logging critical error when mock auth detected in production build (after line 11)
- `docs/security.md`: Created 250+ line comprehensive security guide covering XSS prevention (v-html usage analysis, sanitization strategies), authentication security (mock auth risks, production recommendations), API security (CORS, rate limiting), storage security (localStorage risks), vulnerability reporting, and deployment security checklist
- `src/composables/usePlayerDisplay.ts`: Added inline security comment at hex validation documenting CSS injection prevention (line 75-77)

**Phase 2 - High Priority:**
- `src/constants.ts`: Added SERVER_MAX_CAPACITY constant (16) and SERVER_CAPACITY_THRESHOLDS object (FULL: 0.9, MEDIUM: 0.5, LOW: 0) after line 9
- `src/screens/Multiplayer.vue`: Updated player count display to use SERVER_MAX_CAPACITY constant instead of hard-coded 16 (line 139)
- `tailwind.config.ts`: Added t-tertiary color (#6c7a85) to text hierarchy for muted text (line 88)
- `src/components/Footer.vue`: Migrated 4 CSS variable usages to Tailwind classes (bg-graphite-dark, border-mg, text-t-tertiary, bg-online)
- `src/components/LeaderboardGroup.vue`: Replaced var(--t3) with text-t-tertiary in 2 locations (lines 173, 265)
- `src/components/TwitchFacade.vue` & `src/components/TwitchEmbed.vue`: Migrated var(--s2) → bg-graphite-light, var(--bd) → border-mg
- `src/composables/useServerCapacity.ts`: Changed getCapacityColor() to return hex colors directly (#e53935 red, #ff6600 orange, #7cb342 green) instead of CSS variables (lines 53-55)

**Why This Matters**
- Test coverage now works in CI/CD pipelines (previously failed with "Cannot find dependency" error)
- Mock authentication now has visible warnings preventing accidental production deployment
- Security documentation provides clear guidance for production hardening (real auth backend, XSS prevention, deployment checklist)
- Magic number extraction improves maintainability (single source of truth for server capacity)
- CSS variable migration reduces technical debt and improves type safety (Tailwind IntelliSense works better with utility classes)

### October 17, 2025 - Leaderboard Divider Cleanup

- Removed table header and body border utilities from the statistics leaderboard so the cards no longer show unintended white seams between cells.
- Kept hover highlights using existing orange gradient utilities; no changes to data fetching or row rendering.

**Files**
- `src/components/LeaderboardGroup.vue`

### October 15, 2025 - ESLint 9 Migration (Security Update)

**Highlights**
- Upgraded from ESLint 8.57.1 (end-of-life October 5, 2024) to ESLint 9.37.0 for continued security patch support.
- Migrated from deprecated `.eslintrc.json` format to modern flat config (`eslint.config.js`) as required by ESLint 9.
- Upgraded all ESLint-related packages: `eslint-plugin-vue` (9.33.0 → 10.5.0), `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` (8.44.0 → 8.46.1), `vue-eslint-parser` (→ 10.2.0).
- Added comprehensive browser globals (DOM, Fetch API, Service Workers) and Node.js globals to flat config to eliminate `no-undef` errors.
- Verified zero breaking changes: all 44 tests passing (`npm run test:thorough`), TypeScript compilation clean (`npx tsc --noEmit`), linting passes with 0 errors, Prettier integration working, build scripts functional.
- Configuration files (`*.config.ts/js`) and `scripts/**` properly ignored by ESLint as intended.

**Technical Details**
- `package.json`: Updated ESLint and related plugins to latest compatible versions with `--legacy-peer-deps` flag for peer dependency resolution
- `eslint.config.js`: Created new flat config with ESM imports, explicit plugin registration, comprehensive globals definition, preserved all custom rules (unused var patterns, Prettier integration, Vue-specific overrides)
- `.eslintrc.json`: Deleted deprecated config file after successful migration
- All source files (`.ts`, `.vue`) lint cleanly with new configuration
- Pre-commit hooks continue to work without modification
- `npm run lint` and `npm run lint:fix` commands unchanged

**Why This Matters**
- ESLint 8 reached end-of-life on October 5, 2024 and no longer receives security patches for newly discovered vulnerabilities
- Flat config is the future of ESLint configuration and will be the only format supported in ESLint 10 (expected early 2025)
- Proactive migration ensures continued security support and compatibility with future ESLint ecosystem updates
- Zero disruption to development workflow - all existing scripts, hooks, and IDE integrations continue to work

### October 14, 2025 - @unhead/vue Migration (Head Management Library)

**Highlights**
- Migrated from deprecated `@vueuse/head@2.0.0` to modern `@unhead/vue@1.11.18` (official successor maintained by the Unhead team).
- Fixed critical API difference: changed `children` property to `textContent` in all `useHead()` script blocks for proper JSON-LD rendering during ViteSSG build.
- Removed manual head setup from `src/main.ts` since vite-ssg v28+ automatically integrates @unhead/vue (no `createHead()` needed).
- Verified structured data renders correctly during SSG: both @unhead/vue AND post-build script now inject JSON-LD (belt-and-suspenders approach).
- All 44 tests passing, build successful, structured data properly formatted in all 22 pre-rendered pages.

**Technical Details**
- `package.json`: Replaced `@vueuse/head@2.0.0` with `@unhead/vue@1.11.18` in devDependencies
- `src/main.ts`: Removed `import { createHead } from '@vueuse/head'` and manual head setup (lines 132-134), added comment explaining vite-ssg v28+ auto-integration
- `src/views/Home.vue`: Changed import to `@unhead/vue`, replaced `children:` with `textContent:` in both Organization and WebSite schema script blocks
- Result: Structured data now renders during SSG via @unhead/vue, with post-build script as backup safety net

**Why This Matters**
- @vueuse/head is officially sunset/deprecated, @unhead/vue is the maintained successor integrated with modern build tools
- Using `children` property with @unhead/vue produces malformed HTML attributes instead of proper JSON-LD content
- Future-proof foundation: when tailwind branch merges to master, it brings modern, maintained library with correct API usage
- Belt-and-suspenders approach ensures structured data works even if library behavior changes

### October 14, 2025 - Structured Data SEO Fix + Code Cleanup

**Highlights**
- Extended `scripts/apply-head-meta.ts` to inject JSON-LD structured data during post-build processing, fixing a critical SEO gap where @vueuse/head v2 doesn't render `<script>` tags during SSG.
- Added Organization schema to all 22 pre-rendered pages and WebSite schema to homepage for rich search results and Google Knowledge Panel eligibility.
- Cleaned up unused imports/variables from store initialization refactoring: removed `onMounted` from Admin.vue, removed unused `authStore` from Home.vue.
- Build validation now passes with 0 errors, 0 warnings (previously had 22 warnings for missing structured data).
- Verified with `npm run lint`, `npm test`, and new `npm run validate:build` command.

**Technical Details**
- `apply-head-meta.ts`: Added `injectStructuredData()` function that imports schemas from `src/utils/structuredData.ts` and injects minified JSON-LD before `</head>` tag
- All 22 routes now include proper schema.org Organization markup with name, logo, description, social links, and founding date
- Homepage additionally includes WebSite schema with search action for enhanced search engine integration
- Created `scripts/validate-build.ts` for automated post-build quality checks (favicon paths, canonical URLs, meta tags, structured data)

### October 13, 2025 - Pinia State Management Migration + Authentication

- Complete migration from composable-based state to Pinia stores
- Added authentication system with mock JWT (admin/admin123, user/user123)
- Protected routes with guards (`/login`, `/admin`)
- Session persistence via localStorage
- 19 new auth tests (44 total tests passing)
- Fixed critical reactivity bug (destructuring breaks reactivity)
- Updated CLAUDE.md from "NEVER use Pinia" to "ALWAYS use Pinia"

### October 13, 2025 - Server 0 Display Fix

- Players with `serverId: 0` now display as "Online" instead of "Server 0"
- Added 10 comprehensive tests covering all edge cases
- Updated API documentation with serverId behavior

### October 12, 2025 - Tailwind CSS Migration

- Complete rewrite from modular CSS to utility-first Tailwind
- ~80% code reduction (8,154 deletions vs 1,569 additions)
- Deleted 29 CSS module files
- All design tokens moved to `tailwind.config.ts`
- Added glassmorphism widgets (desktop only)
- 22MB video background with SSR guards
- Enhanced 3-slide onboarding wizard

### October 11, 2025 - SSR Hydration & Scroll Fixes

- Fixed page refresh failing to reach FAQ/About sections
- Removed global CSS `scroll-behavior: smooth` that overrode JS control
- Added min-height constraints matching skeleton loaders
- 500ms hydration protection to prevent premature scroll tracking
- Smart scroll delays (400ms direct nav, 100ms SPA)

### October 10, 2025 - Navigation & Scroll System Refactor

- Replaced IntersectionObserver with hybrid scroll tracking (~110 lines vs 100+)
- Fixed hardcoded header heights breaking dynamic measurement
- Added missing CSS imports (hero.css, visual-hierarchy.css)
- Implemented industry-standard auto-syncing system for header height
- Complete rewrite using CSS/HTML-first approach (removed 500+ lines JS)

### October 9, 2025 - Path-Based Nested Routes

- Refactored from hash-based to nested routes (27 pre-rendered routes)
- Unique SEO meta tags per subsection
- 80% code reduction in navigation logic
- Clean URLs: `/multiplayer/statistics` instead of `/multiplayer#statistics`
- Widget dashboard redesign: replaced carousel with 6 functional widgets

### October 8, 2025 - Navigation UX & Bug Fixes

- Fixed 90-second refresh bug (LivePlayersBadge and Multiplayer flashing)
- Replaced hash-based URLs with path-based routes for SSG compatibility
- Left-aligned navigation (gaming industry standard)
- Renamed "Game Mode" to "Multiplayer"
- Added LivePlayersBadge hero widget
- Removed Players Online panel/button

### October 6, 2025 - Performance Optimizations

- Removed setTimeout delays (50-200ms) from navigation scrolling
- Fixed critical scroll jump bugs with async content loading
- Twitch embed facade pattern (reducing page load by ~1.2MB)
- Industry-standard async scroll handling

### October 5, 2025 - Memory Leak Fixes

- Fixed RAF/timeout cleanup in throttle/debounce utilities
- Added cancel methods to prevent callbacks after unmount
- Fixed visibilitychange listener leak in appDataStore

### October 4, 2025 - Code Review Cleanup

- Removed deprecated getDynamicHeaderHeight() function
- Removed lodash from vite config
- Restored breakpoint/timing constants to constants.ts
- Centralized magic numbers across codebase

### October 3, 2025 - Bundle Optimization

- Removed axios/lodash (-83KB bundle size)
- Debounced resize handlers (-95% events)
- RAF throttled scrolling (60fps locked)
- Fixed memory leaks and race conditions
- Consolidated duplicate utilities

### October 2, 2025 - Documentation & UX Polish

- GUIDE.md optimization (500 → 182 lines)
- Documentation restructure (CLAUDE.md → preferences, GUIDE.md → patterns)
- Complete API documentation
- Navigation animation polish
- Primary CTA enhancement
- Visual design cleanup

---

## September 2025

- Major architecture changes: Single-page app with section-based navigation
- Mobile navigation overhaul: Full-screen with smooth animations
- Events system integration: Discord-connected with real-time sync
- Content creator redesign: Ultra-compact badges (37% size reduction)
- First visit experience: Welcome overlay with localStorage detection
- Live streaming integration: Embedded Twitch streams in Community
- Enhanced responsive design: Improved breakpoints and touch targets
- Color consistency improvements: Standardized text colors across components
- Advanced setup UX optimization: Contextual hyperlinks for file downloads
- Web Vitals monitoring: Core Web Vitals tracking (CLS, FCP, INP, LCP, TTFB)
- Build automation: Icon generation, sitemap creation, PWA manifest

---

## Future Enhancements

### Planned Features

- [ ] Implement lazy loading for video thumbnails
- [ ] Add E2E tests with Playwright
- [ ] Performance benchmarking
- [ ] Accessibility testing (axe-core)

### Under Consideration

- Service worker update notifications
- Offline-first data caching strategy
- Enhanced analytics dashboards
- Advanced search functionality

---

*For current features and architecture, see [README.md](../README.md) and [architecture.md](architecture.md).*
