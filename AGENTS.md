# AGENTS.md – AI Agent Operational Guide

> **Purpose:** Quick-reference guide for AI agents working on WiCGATE. For detailed documentation, see [GUIDE.md](GUIDE.md) and [docs/](docs/).

---

## Quick Links

- **[GUIDE.md](GUIDE.md)** - Complete agent guide with detailed patterns and examples
- **[CLAUDE.md](CLAUDE.md)** - User preferences and mandatory constraints
- **[README.md](README.md)** - Project overview and setup
- **[docs/architecture.md](docs/architecture.md)** - Technical architecture
- **[docs/design-system.md](docs/design-system.md)** - CSS tokens and UI patterns
- **[docs/testing.md](docs/testing.md)** - Testing guide
- **[docs/api.md](docs/api.md)** - API endpoints and data structures
- **[docs/changelog.md](docs/changelog.md)** - Recent changes

---

## Project Overview

**WiCGATE** - Community portal for World in Conflict multiplayer revival

- **Stack:** Vue 3 + TypeScript, Vite + ViteSSG, Composable Modules, Vue Router
- **Architecture:** Hybrid SSG/SPA with PWA support
- **Purpose:** Massgate-inspired UI with live player data and community tools

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

### 1. Design Tokens (MANDATORY)
❌ `color: #ff6600;`
✅ `color: var(--sw);`

Location: [src/assets/styles/modules/variables.css](src/assets/styles/modules/variables.css)

### 2. Dynamic Scroll (MANDATORY)
❌ `scroll-margin-top: 120px;`
✅ `import { scrollToSection } from '@/utils/scroll';`

Location: [src/utils/scroll.ts](src/utils/scroll.ts)

### 3. SSR Guards (MANDATORY)
❌ `document.querySelector()`
✅ `if (!import.meta.env.SSR) { /* browser code */ }`

### 4. Interactive Element Hover Pattern
- Inactive: `color: var(--t2)`
- Hover: Orange gradient + `color: var(--ink)` + scale transform

### 5. Button Hierarchy
- **Red (`.btn-download`):** ONLY for executables
- **Orange (`.btn-p`):** Primary actions
- **Hyperlinks:** File downloads, external links

### 6. Styling Organization
- Add to `src/assets/styles/modules/components/*.css`
- Import via `base.css`

---

## Visual Identity

### Color Palette
All in [variables.css](src/assets/styles/modules/variables.css):

- Steel: `--mg`, `--mg-dark`, `--mg-muted`
- Graphite nav: `--graphite`, `--graphite-dark`, `--graphite-light`
- Massgate orange: `--sw` (primary)
- Alert red: `--dl` (downloads only)
- Text: `--t` (primary), `--t2` (inactive), `--ink` (dark on light)

### Typography
- Headers: Oswald
- Body: Rajdhani
- Data: Courier New

---

## Key Features (October 2025)

- **PWA:** Offline capability, installable, service worker
- **SSG:** 7 unique pre-rendered HTML files for SEO
- **Navigation:** Dynamic header measurement (pixel-perfect)
- **Analytics:** Type-safe event tracking (15 categories)
- **Testing:** 27 tests, hybrid timing strategy (fast/thorough)
- **Error Handling:** 3-retry exponential backoff, 90s polling

---

## Architecture Highlights

### Entry Point
[src/main.ts](src/main.ts) - ViteSSG initialization + PWA registration

### Routing
7 pre-rendered routes: `/`, `/getting-started`, `/statistics`, `/community`, `/about`, `/faq`, `/game-mode`

### State Management
[src/stores/appDataStore.ts](src/stores/appDataStore.ts) - Player data with retry logic

### Composables (SSR-safe)
- [useYoutube.ts](src/composables/useYoutube.ts) - Video fetching
- [useEvents.ts](src/composables/useEvents.ts) - Discord events
- [useFirstVisit.ts](src/composables/useFirstVisit.ts) - Welcome overlay

### Utilities
- [scroll.ts](src/utils/scroll.ts) - Navigation scroll (single source of truth)
- [analytics.ts](src/utils/analytics.ts) - Event tracking
- [performance.ts](src/utils/performance.ts) - Web Vitals

---

## File Organization

```
src/
├── main.ts              # ViteSSG entry
├── router/              # Vue Router
├── stores/              # Composable state modules
├── components/          # Reusable widgets
├── screens/             # Section components
├── views/               # Routed pages
├── composables/         # Composition functions
├── utils/               # Utilities
├── assets/styles/       # Modular CSS
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

### October 2025
- PWA implementation (offline support)
- Analytics integration (type-safe tracking)
- Testing infrastructure (27 tests)
- Scroll system refactor (standardized)
- Enhanced error handling (retry logic)
- SEO revolution (SSG with vite-ssg)
- Design system refinement (rectangular nav)
- Documentation reorganization (this file!)

### September 2025
- Navigation revolution (dynamic measurement)
- Events system (Discord integration)
- Mobile navigation overhaul
- First visit experience

---

## When Adding Features

1. Use design tokens (no hardcoded values)
2. Add SSR guards for browser code
3. Create CSS modules in `components/`
4. Write tests with hybrid timing
5. Update [docs/changelog.md](docs/changelog.md)
6. Update this file for major visual changes

---

## Known Issues

**Dev Server Vulnerability (Non-Critical)**
- CVE: [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99)
- Impact: Dev server only (production safe)
- Mitigation: Trusted networks only

---

**For complete operational rules, see [CLAUDE.md](CLAUDE.md)**
**For detailed documentation, see [docs/](docs/)**

**Last Updated:** October 1, 2025
