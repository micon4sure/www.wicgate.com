# AGENTS.md – AI Agent Operational Guide

> **Purpose:** Quick-reference guide for AI agents working on WiCGATE. For detailed documentation, see [GUIDE.md](GUIDE.md) and [docs/](docs/).

---

## Quick Links

- **[GUIDE.md](GUIDE.md)** - Complete agent guide with detailed patterns and examples
- **[CLAUDE.md](CLAUDE.md)** - User preferences and mandatory constraints
- **[README.md](README.md)** - Project overview and setup
- **[docs/architecture.md](docs/architecture.md)** - Technical architecture
- **[docs/deployment_guide.md](docs/deployment_guide.md)** - Deployment configs (env vars, asset paths)
- **[tailwind.config.ts](tailwind.config.ts)** - Design tokens (colors, shadows, animations)
- **[docs/testing.md](docs/testing.md)** - Testing guide
- **[docs/api.md](docs/api.md)** - API endpoints and data structures
- **[docs/security.md](docs/security.md)** - Security guidelines (XSS, auth, deployment)
- **[docs/changelog.md](docs/changelog.md)** - Recent changes

---

## Project Overview

**WiCGATE** - Community portal for World in Conflict multiplayer revival

- **Stack:** Vue 3 + TypeScript, Vite + ViteSSG, @unhead/vue, Pinia, Vue Router, Tailwind CSS
- **Architecture:** Hybrid SSG/SPA with PWA support
- **Purpose:** Massgate-inspired UI with live player data and community tools
- **Authentication:** Mock JWT system (admin/user roles)

---

## Commands

```bash
npm run dev          # Dev server (localhost:5173)
npm test             # Fast tests (~0.7s, fake timers)
npm run test:thorough # Thorough tests (~14s, real timers, for CI)
npm run lint:fix     # Fix linting issues
npm run build        # Production build (SSG + PWA)
```

**Bun alternative:** Use `bun run test` (NOT `bun test`)

---

## Critical Rules (See CLAUDE.md for details)

### 1. Tailwind Utility-First (MANDATORY) *(Updated Oct 14, 2025)*
❌ `color: #ff6600;` or custom CSS classes
✅ `class="text-soviet"` (Tailwind utilities)

**Design System Separation:**
- **[tailwind.config.ts](tailwind.config.ts)** = Universal tokens (used project-wide)
- **[tailwind.css](src/assets/styles/tailwind.css)** = Component-specific patterns (1-2 uses)
- Rule: Add to config if used in 5+ components, otherwise use CSS @layer

### 2. Pinia Reactivity (CRITICAL) *(Updated Oct 13, 2025)*
❌ `const { data } = useAppDataStore();` (breaks reactivity!)
✅ `const store = useAppDataStore();` (use `store.data`)
✅ `const { data } = storeToRefs(store);` (alternative)

**Destructuring creates static snapshots - must use store refs directly**

### 3. Native Scroll System (MANDATORY)
❌ `padding-top: 80px;` or `scroll-margin-top: 120px;`
✅ `padding-top: var(--header-height);` or `pt-[var(--header-height)]`

Browser handles scrolling natively. See [docs/architecture.md#scroll--navigation-system](docs/architecture.md#scroll--navigation-system)

### 4. SSR Guards (MANDATORY)
❌ `document.querySelector()`
✅ `if (!import.meta.env.SSR) { /* browser code */ }`

### 5. Interactive Element Hover Pattern
- Inactive: Muted colors
- Hover: Orange gradient + dark text + scale transform

### 6. Button & Link Hierarchy
- **Red (`.btn-download`):** ONLY for executables
- **Orange (primary):** Standard actions
- **Inline links (gold):** `.internal-link`, `.download-link` (with icon), `.external-link` (with icon)
- **Anchor copy links (gold):** `.faq-copy-link-btn`, `.lb-copy-link-btn`, `.toast-notification`

---

## Visual Identity *(Updated Oct 12, 2025)*

### Color Palette
All in [tailwind.config.ts](tailwind.config.ts):

- **Steel:** `mg`, `mg-dark`, `mg-muted` → Use: `bg-mg`, `text-mg-dark`
- **Dark navy:** `dark-navy`, `dark-navy-dark`, `dark-navy-light` → Use: `bg-dark-navy`
- **Soviet orange:** `soviet` (#ff6600) → Use: `text-soviet`, `bg-soviet`
- **Massgate red:** `massgate-red` → Use: `bg-massgate-red`
- **Text:** `slate-200` (primary), `slate-400` (muted), `slate-800` (on light)

### Typography
- **Headers:** Oswald → Use: `font-oswald`
- **Body:** Rajdhani → Use: `font-rajdhani`
- **Data:** Courier New → Use: `font-mono`

---

## Key Features (October 2025)

- **PWA:** Offline capability, installable, service worker
- **SSG:** 6 pre-rendered HTML files for SEO (hash-based tabs within sections)
- **Authentication:** Mock JWT with admin/user roles, protected routes
- **State Management:** Pinia stores with SSR support
- **Styling:** Tailwind CSS utility-first approach (80% code reduction)
- **Navigation:** Dynamic header measurement (pixel-perfect)
- **Analytics:** Type-safe event tracking (15 categories)
- **Testing:** 44 tests, hybrid timing strategy (fast/thorough)
- **Error Handling:** Typed error hierarchy, 3-retry exponential backoff, 90s polling
- **Widget System:** Modular widget components (7 widgets + base component)

---

## Architecture Highlights

### Entry Point
[src/main.ts](src/main.ts) - ViteSSG initialization + PWA registration

### Routing
7 routes total (6 pre-rendered for SSG, /admin excluded): `/`, `/downloads`, `/statistics`, `/community`, `/faq`, `/login`, `/admin`. Tabs use hash fragments (e.g., `/downloads#dedicated-server`)

### State Management (Pinia)
- [src/stores/appDataStore.ts](src/stores/appDataStore.ts) - API data with retry logic
- [src/stores/auth.ts](src/stores/auth.ts) - Authentication with mock JWT

### Composables (SSR-safe)
- [useFirstVisit.ts](src/composables/useFirstVisit.ts) - Welcome overlay
- [useServerCapacity.ts](src/composables/useServerCapacity.ts) - Server capacity colors
- [usePlayerDisplay.ts](src/composables/usePlayerDisplay.ts) - Player name parsing
- [useActiveSection.ts](src/composables/useActiveSection.ts) - Nav highlighting (hybrid: route + scroll position)
- [useInternalLinks.ts](src/composables/useInternalLinks.ts) - Client-side navigation for `.internal-link` clicks in v-html content

### Utilities
- [constants.ts](src/constants.ts) - Application constants (SERVER_MAX_CAPACITY, thresholds, API config)
- [headerHeight.ts](src/utils/headerHeight.ts) - Dynamic header height sync
- [memoize.ts](src/utils/memoize.ts) - Memoization toolkit
- [features.ts](src/utils/features.ts) - Feature flag system (11 flags)
- [analytics.ts](src/utils/analytics.ts) - Event tracking
- [performance.ts](src/utils/performance.ts) - Web Vitals

### Types
- [types/errors.ts](src/types/errors.ts) - Typed error hierarchy (ApiError, NetworkError, etc.)
- [types/utils.ts](src/types/utils.ts) - 25+ utility types and type guards

---

## File Organization

```
src/
├── main.ts              # ViteSSG entry (Pinia + Router)
├── router/              # Vue Router with nested routes + auth guards
├── stores/              # Pinia stores (appData, auth)
├── components/          # Reusable UI components
│   └── widgets/         # Widget components (7 total)
├── screens/             # Section components
├── views/               # Routed pages (Home, Login, Admin, etc.)
├── composables/         # Composition functions (7 total)
├── utils/               # Utility functions
├── types/               # TypeScript types (auth, errors, utils)
├── assets/styles/       # Tailwind CSS (base + components)
└── content/             # Static content
```

---

## Quality Gates

- ESLint + Prettier (zero errors)
- TypeScript strict mode
- 50%+ test coverage
- LF line endings (no CRLF)

---

## Recent Major Updates

### January 8, 2026 - Leaderboard Card Tokens & Unified Anchor Highlights
- **Unified Anchor Highlight System:** Consolidated FAQ and Statistics deep link highlights
  - Single `.anchor-highlight` class + `anchor-highlight-pulse` keyframe (was duplicate code)
  - `ANCHOR_HIGHLIGHT_DELAY` constant (300ms) in `constants.ts`
  - Both FAQ.vue and Statistics.vue use identical pattern
- **Leaderboard Background Tokens:** Tokenized Statistics leaderboard card backgrounds
  - `bg-lb-row` / `bg-lb-row-even` - leaderboard data rows (steel blue 50% opacity)
  - `bg-lb-header` - leaderboard table headers (steel blue 50% opacity)
  - `medal-text` boxShadow - top 3 rank text shadows
  - `card-surface` updated to 50% opacity for consistency
- **CSS Cleanup:** Removed legacy `.leaderboard-cell` / `.leaderboard-rank-cell` styles (~40 lines)
- **Theme References:** All leaderboard CSS now uses `theme()` instead of hardcoded rgba values

### January 7, 2026 - Card & Navigation Background Tokens
- **Card Background Tokens:** Tokenized all card/container backgrounds for consistent styling
  - `bg-card-surface` (steel blue gradient) - main containers (dashboard, FAQ, leaderboard, step cards)
  - `bg-video-card` (dark-navy gradient) - standalone cards (video, community)
  - `bg-list-item` / `bg-list-item-hover` / `bg-list-item-alt` - nested items inside containers
- **Navigation Background Tokens:** Tokenized nav bar backgrounds
  - `bg-nav-main` - main navigation bar
  - `bg-nav-sub` - sub navigation bar + mobile dropdowns (unified)
  - Mobile triggers unified to red `tab-active` token
- **Statistics Leaderboard Highlights:** Added pulsing glow animation when navigating to leaderboards via deep links (mirrors FAQ pattern)
- **Client-Side Internal Links:** Created `useInternalLinks` composable for SPA navigation in v-html content (click interception pattern)
- **FAQ Question Deep Links:** Unified all FAQ anchors under question IDs, TabContainer `externalActiveTabId` prop for external tab control
- **Glow Tokens:** Tokenized deep link highlight colors in `tailwind.config.ts` (`soviet.glowStrong/glowMedium/glowSoft`)
- **WIC LIVE Links:** All internal WIC LIVE links now include `#quick-install` hash for proper tab switching

### October 16, 2025 - Code Quality & Security Improvements
- **Test Infrastructure:** Fixed missing @vitest/coverage-v8 dependency
- **Security Warnings:** Added prominent mock auth warnings (Admin/Login/auth store)
- **Security Documentation:** Created comprehensive docs/security.md (XSS, auth, deployment)
- **Code Cleanup:** Extracted magic numbers to constants.ts (SERVER_MAX_CAPACITY)
- **CSS Migration:** Migrated 3 legacy CSS variables to Tailwind (--g, --t3, --bd)
- **Testing:** All 44 tests passing, ESLint zero errors, TypeScript strict mode clean

### October 13, 2025 - Pinia Migration + Authentication
- **State Management:** Migrated from composables to Pinia stores
- **Authentication:** Mock JWT system (admin/user roles)
- **Protected Routes:** `/login`, `/admin` with route guards
- **Session Persistence:** localStorage-based session restoration
- **Testing:** 44 total tests (19 auth + 15 appData + 10 player display)
- **Documentation:** Comprehensive updates across all docs

### October 12, 2025 - Tailwind CSS Migration
- **80% code reduction:** Deleted 29 CSS module files
- **Utility-first approach:** All design tokens in `tailwind.config.ts`
- **Homepage enhancement:** Glassmorphism widgets, video background
- **Onboarding:** 3-slide first-visit wizard

### October 10, 2025 - Comprehensive Refactoring
- Widget component system (7 modular widgets + base)
- Type safety improvements (error hierarchy, utility types)
- Performance optimizations (IntersectionObserver, memoization)
- Developer experience (feature flags, JSDoc, 25+ utility types)
- Component decomposition (80% complexity reduction)

### January 3, 2026 - CSS Media Query Standardization
- **screen() Function Migration:** All 170+ media queries converted to Tailwind's `screen()` function
- **Breakpoint Standardization:** Eliminated off-by-one values (767px, 1023px, 319px)
- **Single Source of Truth:** All breakpoints now reference `tailwind.config.ts`
- **Duplicate Fix:** Removed duplicate `.skeleton-shimmer` definition
- **New Color Token:** Added `panel-border` color for `#37576D`
- **Documentation:** Updated architecture.md with Media Query Patterns section

### January 2, 2026 - Hash-Based Tab Navigation
- **Route Simplification:** 27 routes → 7 routes (6 pre-rendered)
- **Tab Navigation:** Migrated from child routes to hash fragments
- **URL Format:** `/downloads#dedicated-server`, `/faq#technical-issues`
- **Default Tabs:** No hash in URL (just `/downloads` or `/faq`)
- **Benefits:** Simpler routing, faster tab switching, cleaner URLs

### October 1-9, 2025
- Widget dashboard (replaced hero carousel)
- Discord integration (navigation + events)
- PWA implementation
- Testing infrastructure

---

## When Adding Features

1. **Use Tailwind utilities** (no hardcoded values in style attributes)
2. **Add SSR guards** for browser code (`window`, `document`, `localStorage`)
3. **Use Pinia stores** for global state (not composables)
4. **Avoid destructuring stores** (breaks reactivity - use `store.data` or `storeToRefs()`)
5. **Write tests with hybrid timing** (support both fake and real timers)
6. **Update documentation:**
   - [docs/changelog.md](docs/changelog.md) - Feature history
   - [AGENTS.md](AGENTS.md) - This file for major changes
   - [docs/architecture.md](docs/architecture.md) - Architecture changes

---

## Known Issues

**Dev Server Vulnerability (Non-Critical)**
- CVE: [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99)
- Impact: Dev server only (production safe)
- Mitigation: Trusted networks only

---

**For complete operational rules, see [CLAUDE.md](CLAUDE.md)**
**For detailed documentation, see [docs/](docs/)**

**Last Updated:** January 8, 2026 (Unified anchor highlights)
