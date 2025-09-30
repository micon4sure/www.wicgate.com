# WICGATE Vue 3 (TypeScript)

Modern Vue 3 + TypeScript **Progressive Web App** with SEO-optimized Static Site Generation, offline capability, comprehensive testing, and production-ready monitoring. Hybrid rendering architecture provides unique, pre-rendered HTML to search engines while delivering a smooth single-page user experience with full offline support.

## Tech Stack

- **Vue 3** + `<script setup lang="ts">` with Composition API
- **ViteSSG** - Static Site Generation with client-side hydration
- **PWA** - Progressive Web App with service worker and offline support
- **Vitest** - Unit testing with Vue Test Utils (27 tests, 50%+ coverage)
- **@vueuse/head** - Dynamic meta tags for SEO
- **Vite** - Build tool with optimized bundling
- **Vue Router** - Path-based routing (7 pre-rendered routes)
- **Pinia** - State management with SSR support
- **TypeScript** - Full type safety across codebase
- **PostCSS** + Autoprefixer - Modern CSS processing

## Routes (SEO-Optimized)

**All routes pre-render unique HTML at build time:**

- `/` - Homepage with all sections (Hero, Getting Started, Statistics, Community, About, FAQ)
- `/getting-started` - Installation guide
- `/statistics` - Player leaderboards and rankings
- `/community` - Events, creators, videos, streams
- `/about` - Project information
- `/faq` - Frequently asked questions
- `/game-mode` - Full-screen Game Mode statistics dashboard

**SEO Benefits:**
- ✅ 7 unique HTML files (no duplicate content)
- ✅ Each route has focused, indexable content
- ✅ Progressive enhancement with skeleton loaders
- ✅ Dynamic meta tags per route

## Key Components

- `Navigation.vue` Top nav / hero navigation with **pixel-perfect dynamic scroll positioning**
- `PlayersOnline.vue` Slide-in players panel (persisted lock state in `localStorage`)
- `Leaderboards.vue` Tabbed leaderboards (High / Total / Player / Clan placeholder)
- `Scores.vue` Reusable scoreboard card used in Game Mode
- `Footer.vue` Site footer

## Composables

- `useAppDataStore.ts` - API polling with 3-retry exponential backoff, 90s interval, Page Visibility API
- `useYoutube.ts` - Multi-channel YouTube video fetching (SSR-safe)
- `useEvents.ts` - Discord events with countdown timers (SSR-safe)
- `useFirstVisit.ts` - First-time visitor detection and overlay management

## Content

Static content extracted to `src/content/content.ts` for easier future translation / editing.

## Development

```bash
npm install           # Install dependencies
npm run dev           # Start dev server (http://localhost:5173)
npm test              # Run all 27 tests
npm run test:watch    # Run tests in watch mode
npm run test:ui       # Run tests with Vitest UI
npm run test:coverage # Run tests with coverage report
npm run lint          # Check code quality
npm run lint:fix      # Auto-fix lint issues
```

## Build

```bash
npm run build        # Full production build (icons + sitemap + SSG + PWA)
npm run build:icons  # Generate PWA icons from favicon.svg
npm run preview      # Preview production build
```

**Build Process:**
1. **Generate PWA Icons** - Creates 4 optimized icon sizes from `favicon.svg`
2. **Generate Sitemap** - Auto-generates `sitemap.xml` from route definitions
3. **Static Site Generation** - Pre-renders 7 unique HTML files
4. **PWA Service Worker** - Generates `sw.js` with caching strategies
5. **Image Optimization** - Compresses all images (58-69% size reduction)

**Build Output (`dist/`):**
- 7 unique HTML files (36KB homepage, 7-13KB section pages)
- `manifest.webmanifest` - PWA app manifest
- `sw.js` - Service worker with 49 precached entries
- `sitemap.xml` - SEO sitemap with 7 URLs
- Optimized assets with content hashing
- Bundle size: ~4.1MB (under 5MB limit)

**SSG Architecture:**
- **For Crawlers:** Conditional rendering shows only target section
- **For Users:** All sections render for smooth scrolling after hydration
- **For Offline:** Service worker caches everything for offline access

## Deployment (GitHub Pages)

The site deploys automatically via `.github/workflows/deploy.yml` to:

Primary (GitHub Pages path): https://micon4sure.github.io/www.wicgate.com/
Custom Domain (after DNS): https://www.wicgate.com/

### How it works

- `vite.config.ts` sets `base: './'` so built asset URLs are relative, functioning in both locations.
- Router base is chosen at runtime (`/www.wicgate.com/` if path contains that segment, otherwise `/`).
- Workflow copies `index.html` to `404.html` for History API fallback on refresh/deep links.
- `CNAME` is injected so GitHub Pages serves the custom domain when DNS is ready.

### Steps to finalize

1. Confirm repo name is `www.wicgate.com` (matches deployed path used by detection logic).
2. GitHub > Settings > Pages: Source = GitHub Actions.
3. DNS: Set `www` CNAME → `micon4sure.github.io`.
4. (Optional) Apex/root redirect handled at DNS provider (ALIAS/ANAME or redirect).
5. After propagation, enable "Enforce HTTPS".

### If you fork/rename

Update:

- `runtimeBase` logic in `src/main.ts` if repo folder changes.
- The `CNAME` addition step or remove it if no custom domain.
- Optionally set a different `base` in `vite.config.ts` if you prefer absolute paths.

### Manual redeploy

Use Actions tab → Deploy to GitHub Pages → Run workflow.

### Local test of production build

```powershell
npm run build
npx serve dist  # or any static server
```

## Styling

All global styles are consolidated in `src/assets/styles/base.css` (extracted from original monolith). Component-scoped additions are minimal to keep maintainability high. Autoprefixer provides vendor prefixes for better cross-browser support.

## Architecture Highlights

### SSG + SPA Hybrid
- **Static Site Generation** at build time for SEO
- **Client-Side Hydration** for interactive UX
- **Conditional Rendering** based on SSR context
- **Progressive Enhancement** with skeleton loaders

### PWA Features
- **Offline Support** - Service worker caches all assets for offline access
- **Installable** - Add to home screen on mobile/desktop
- **Auto-Updates** - Automatic service worker updates on new deployments
- **Smart Caching** - CacheFirst for static assets, NetworkFirst for API calls
- **Performance** - Precaches 49 critical assets for instant loading

### Testing & Quality
- **27 Unit Tests** - Comprehensive test coverage with Vitest + Vue Test Utils
- **50%+ Coverage** - Critical paths fully tested (stores, composables, utilities)
- **Type Safety** - Full TypeScript coverage across entire codebase
- **Analytics Tracking** - Type-safe event tracking with predefined categories
- **Error Boundary** - Component-level error handling with user-friendly fallbacks

### Pixel-Perfect Navigation
- **Dynamic Header Measurement** - Real-time DOM queries eliminate hardcoded scroll calculations
- **Standardized Scroll System** - Single source of truth via `src/utils/scroll.ts`
- **Responsive Adaptation** - Automatic adjustment across all breakpoints
- **Active Section Detection** - Buffer-based tolerance for accurate highlighting

### Key Implementation Details
- `src/main.ts` - ViteSSG setup with scroll behavior and service worker registration
- `src/router/routes.ts` - Route metadata for SEO
- `src/views/Home.vue` - `shouldRenderSection()` logic + scroll utilities
- `src/components/skeletons/` - SEO-friendly placeholders
- `src/utils/scroll.ts` - Centralized scroll positioning and detection
- `src/utils/analytics.ts` - Type-safe analytics with predefined events
- SSR guards in stores/composables (`import.meta.env.SSR`)

For complete architecture documentation, see [CLAUDE.md](CLAUDE.md).

## Future Enhancements

- ✅ ~~SSG implementation for SEO~~ (Completed September 2025)
- ✅ ~~Pinia state management~~ (Implemented)
- ✅ ~~Unit tests (Vitest) for composables~~ (Completed October 2025 - 27 tests, 50%+ coverage)
- ✅ ~~PWA implementation~~ (Completed October 2025 - Full offline support)
- ✅ ~~Sitemap.xml generation~~ (Automated in build process)
- ✅ ~~Analytics tracking~~ (Type-safe event tracking implemented)
- Implement lazy loading for video thumbnails
- Add E2E tests with Playwright
- Implement image CDN integration

## License

Custom / Project-specific (add one if needed). Not affiliated with Ubisoft or Massive Entertainment.
