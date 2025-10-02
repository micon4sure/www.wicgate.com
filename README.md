# WiCGATE Community Portal

> Modern community portal for the World in Conflict revival initiative (WiCGATE/Massgate)

[![Deploy Status](https://github.com/micon4sure/www.wicgate.com/actions/workflows/deploy.yml/badge.svg)](https://github.com/micon4sure/www.wicgate.com/actions/workflows/deploy.yml)

## Overview

WiCGATE delivers a Massgate-inspired experience for the World in Conflict revival, featuring live player statistics, onboarding guides, community events, and military-themed styling. Built as a Progressive Web App with SEO-optimized Static Site Generation for offline capability and search engine visibility.

**Live Site:** [wicgate.com](https://wicgate.com)

## Tech Stack

- **Framework:** Vue 3 + TypeScript (Composition API)
- **Build System:** Vite with ViteSSG for Static Site Generation
- **State Management:** Composable modules with reactive refs
- **Routing:** Vue Router (path-based, 7 pre-rendered routes)
- **Styling:** Modular CSS with design tokens
- **PWA:** Service worker with offline capability
- **Testing:** Vitest + Vue Test Utils (27 tests, 50%+ coverage)
- **Analytics:** Custom type-safe event tracking
- **CI/CD:** GitHub Actions + Netlify

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Run tests (fast mode ~0.7s)
npm test

# Production build
npm run build

# Preview production build
npm run preview
```

### Alternative: Using Bun (22% faster)

```bash
bun install
bun run dev
bun run test  # ~0.57s (22% faster than npm)
```

**⚠️ Important:** Use `bun run test`, NOT `bun test` (invokes Bun's native test runner instead of Vitest)

## Available Commands

```bash
npm run dev              # Development server
npm run build            # Production build (SSG + PWA + icons + sitemap)
npm run build:icons      # Generate PWA icons from favicon.svg
npm run preview          # Preview production build
npm test                 # Tests - fast mode with fake timers (~0.7s)
npm run test:thorough    # Tests - real timers for CI (~14s)
npm run test:watch       # Tests in watch mode
npm run test:ui          # Tests with Vitest UI
npm run test:coverage    # Coverage report (50%+ threshold)
npm run lint             # ESLint + Prettier
npm run lint:fix         # Auto-fix linting issues
```

## Routes (SEO-Optimized)

All routes pre-render unique HTML at build time:

- `/` - Homepage with all sections (35.59 KB)
- `/getting-started` - Installation guide (10.74 KB)
- `/statistics` - Player leaderboards (6.99 KB)
- `/community` - Events, creators, videos (12.60 KB)
- `/about` - Project information (8.27 KB)
- `/faq` - Frequently asked questions (12.39 KB)
- `/game-mode` - Full-screen statistics dashboard (11.37 KB)

**SEO Benefits:**
- ✅ 7 unique HTML files (no duplicate content)
- ✅ Focused, indexable content per route
- ✅ Progressive enhancement with skeleton loaders
- ✅ Dynamic meta tags and JSON-LD schemas

## Project Structure

```
src/
├── main.ts              # ViteSSG entry point + PWA registration
├── router/              # Vue Router with SEO metadata
├── stores/              # Composable state modules
├── components/          # Reusable components
│   ├── Navigation.vue   # Mobile-first responsive nav with pixel-perfect scrolling
│   ├── LeaderboardGroup.vue  # Enhanced leaderboard tables with rank styling
│   ├── PlayersOnline.vue     # Slide-in panel for live player list
│   ├── FirstVisitOverlay.vue # Welcome overlay for new users
│   ├── ErrorBoundary.vue     # Error handling with retry functionality
│   └── skeletons/       # SEO-friendly loading states
├── screens/             # Section components
│   ├── GettingStarted.vue
│   ├── Community.vue
│   ├── Statistics.vue
│   ├── About.vue
│   └── FAQ.vue
├── views/               # Routed pages
│   ├── Home.vue         # Main SPA with all sections
│   └── GameMode.vue     # Standalone game mode page
├── composables/         # Composition functions
│   ├── useYoutube.ts    # Multi-channel video fetching (SSR-safe)
│   ├── useEvents.ts     # Discord events integration (SSR-safe)
│   └── useFirstVisit.ts # First-time visitor detection
├── utils/               # Utility functions
│   ├── scroll.ts        # Dynamic navigation scroll system
│   ├── analytics.ts     # Type-safe event tracking
│   ├── performance.ts   # Web Vitals monitoring
│   └── structuredData.ts # SEO JSON-LD schemas
├── assets/
│   └── styles/
│       ├── base.css
│       └── modules/     # Modular CSS with design tokens
└── content/
    └── content.ts       # Static content
```

## Key Features

### 📱 Progressive Web App (PWA)
- Full offline capability with intelligent caching
- Installable as desktop/mobile app
- Auto-generated manifest with 4 icon sizes (64px, 192px, 512px, maskable)
- Environment-aware precaching (dev: minimal, prod: ~49 entries)
- Automatic background updates

### 🔍 SEO-Optimized Architecture
- Hybrid SSG/SPA: Pre-rendered HTML for crawlers, full SPA for users
- 7 unique pre-rendered routes with focused content
- Progressive enhancement with skeleton loaders
- Eliminates duplicate content issues
- JSON-LD structured data for rich search results

### 🎯 Pixel-Perfect Navigation
- Dynamic header measurement (zero hardcoded values)
- Smooth scroll with exact positioning
- Responsive across all breakpoints
- Auto-scroll to sections on direct URL access
- Active section detection with buffer tolerance

### 📊 Analytics & Monitoring
- Type-safe event tracking (15 predefined categories)
- Core Web Vitals monitoring (CLS, FCP, INP, LCP, TTFB)
- Error tracking with Sentry integration
- SSR-safe execution
- `navigator.sendBeacon()` for reliable delivery

### 🧪 Comprehensive Testing
- 27 tests covering scroll utilities (12) and data store (15)
- Hybrid timing strategy (fast mode ~0.7s, thorough mode ~14s)
- 50%+ coverage thresholds enforced
- CI/CD integration via GitHub Actions
- SSR-safe mocks and test utilities

### 🎨 Design System
- Military-themed Massgate aesthetic
- Design tokens for all colors/shadows/transitions
- Consistent hover effects and animations (scale transforms, cubic-bezier)
- Responsive typography and layouts
- Modular CSS architecture

### 🔧 Robust Error Handling
- 3-retry exponential backoff (1s, 2s, 4s) for API calls
- 90s polling interval with Page Visibility API integration
- ErrorBoundary component with user-friendly fallbacks
- Comprehensive error analytics

## Build Process

Production build executes:

1. **Generate PWA Icons** - Creates 4 optimized sizes from `favicon.svg`
2. **Generate Sitemap** - Auto-generates `sitemap.xml` from route definitions
3. **Static Site Generation** - Pre-renders 7 unique HTML files
4. **PWA Service Worker** - Generates `sw.js` with caching strategies
5. **Asset Optimization** - Code splitting and content hashing

**Build Output (`dist/`):**
- 7 unique HTML files (36KB homepage, 7-13KB section pages)
- `manifest.webmanifest` - PWA app manifest
- `sw.js` - Service worker with precached entries
- `sitemap.xml` - SEO sitemap with 7 URLs
- Optimized assets with content hashing
- Total bundle: ~4.1MB (under 5MB limit)

## Documentation

- **[Architecture Guide](docs/architecture.md)** - SSG, navigation, PWA, state management
- **[Design System](docs/design-system.md)** - CSS tokens, patterns, components
- **[Testing Guide](docs/testing.md)** - Test commands, strategies, CI/CD
- **[Changelog](docs/changelog.md)** - Recent changes and feature history
- **[Agent Instructions](CLAUDE.md)** - AI agent operational rules

## Development Notes

### Editor Setup
- **Recommended:** VS Code with Volar/Vetur for Vue 3
- **Formatting:** Prettier via ESLint (no CRLF)
- **Type Checking:** TypeScript strict mode

### Environment Variables
Create `.env` for local development:
```env
VITE_API_BASE=https://www.wicgate.com/api
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_SENTRY_DSN=
```

See [.env.example](.env.example) for complete configuration options.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the design system
4. Run tests and linting (`npm test && npm run lint`)
5. Commit with descriptive messages
6. Push to your fork and submit a pull request

### Contribution Guidelines
- Follow established design patterns (see [docs/design-system.md](docs/design-system.md))
- **Follow navigation patterns** for new interactive elements (see [docs/design-system.md](docs/design-system.md#interactive-element-standards))
- Use design tokens (no hardcoded hex values)
- Maintain test coverage (50%+ threshold)
- Document architectural changes in relevant docs
- **Document major changes** in both [CLAUDE.md](CLAUDE.md) (operational rules) and [AGENTS.md](AGENTS.md) (quick reference)
- **Work from feature branches**; keep commits scoped and atomic
- Add styles to `src/assets/styles/modules/components/*.css` and import via `base.css`

## Deployment

### Active Deployment: GitHub Pages

**Live Site:** https://www.wicgate.com/

Auto-deploys on every push to `master` via `.github/workflows/deploy.yml`

**Deployment Workflow:**
1. **Lint & Type Check** - Ensures code quality
2. **Test (Thorough Mode)** - 27 tests with real timers
3. **Build** - ViteSSG generates 7 pre-rendered HTML files
4. **Bundle Size Check** - Enforces 5MB limit
5. **Deploy** - Publishes to GitHub Pages with CNAME

**URLs:**
- **Primary:** https://micon4sure.github.io/www.wicgate.com/
- **Custom Domain:** https://www.wicgate.com/ (via CNAME)

**Configuration:**
- Repo: `www.wicgate.com` (matches deployed path)
- Settings > Pages: Source = GitHub Actions
- DNS: `www` CNAME → `micon4sure.github.io`
- HTTPS: Enforced

### Alternative Platforms (Not Currently Used)

This project can also be deployed to **Netlify** or **Vercel** if needed:

**Configuration:**
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **SPA Routing:** `public/_redirects` supports both platforms

**Note:** The `_redirects` file exists for platform portability and SSG/SPA fallback routing. GitHub Pages uses `404.html` instead (auto-generated during build).

## Known Issues

### Development Server Vulnerability (Non-Critical)
- **CVE:** [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99)
- **Component:** esbuild ≤0.24.2 (bundled with Vite 5.4.20)
- **Impact:** Development server only (production unaffected)
- **Mitigation:** Use trusted networks, avoid public WiFi when developing
- **Status:** Monitoring for Vite 5.x maintenance patch

## License

Custom / Project-specific. Not affiliated with Ubisoft or Massive Entertainment.

## Support

- **Issues:** [GitHub Issues](https://github.com/your-org/wicgate/issues)
- **Discord:** [WiCGATE Community](https://discord.gg/wicgate)
- **Documentation:** [docs/](docs/)

---

Built with ❤️ for the World in Conflict community
