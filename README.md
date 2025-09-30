# WICGATE Vue 3 (TypeScript)

Modern Vue 3 + TypeScript website with **SEO-optimized Static Site Generation (SSG)** and seamless single-page user experience. Hybrid rendering architecture provides unique, pre-rendered HTML to search engines while delivering a smooth long-scroll experience to users.

## Tech Stack

- Vue 3 + `<script setup lang="ts">`
- **ViteSSG** - Static Site Generation with client-side hydration
- **@vueuse/head** - Dynamic meta tags for SEO
- Vite build tool
- Vue Router (path-based routing)
- Pinia state management
- PostCSS + Autoprefixer

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

- `useAppData.ts` Handles periodic API polling (`/api/data`) every 60s and updates player online body classes.

## Content

Static content extracted to `src/content/content.ts` for easier future translation / editing.

## Development

```powershell
npm install
npm run dev
```

## Build

```powershell
npm run build
```

**Build Process:**
- Uses `vite-ssg build` for Static Site Generation
- Generates 7 unique HTML files in `dist/`:
  - `index.html` (36KB) - Full homepage
  - `statistics.html` (7KB) - Statistics only
  - `community.html` (13KB) - Community only
  - `getting-started.html`, `about.html`, `faq.html`, `game-mode.html`
- Each file contains unique, pre-rendered content for SEO
- JavaScript hydrates pages for full SPA experience

**SSG Architecture:**
- **For Crawlers:** Conditional rendering shows only target section
- **For Users:** All sections render for smooth scrolling after hydration

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

### Key Implementation Details
- `src/main.ts` - ViteSSG setup with scroll behavior
- `src/router/routes.ts` - Route metadata for SEO
- `src/views/Home.vue` - `shouldRenderSection()` logic
- `src/components/skeletons/` - SEO-friendly placeholders
- SSR guards in stores/composables (`import.meta.env.SSR`)

For complete architecture documentation, see [CLAUDE.md](CLAUDE.md).

## Future Enhancements

- ✅ ~~SSG implementation for SEO~~ (Completed September 2025)
- ✅ ~~Pinia state management~~ (Implemented)
- Add unit tests (Vitest) for composables
- Implement lazy loading for video thumbnails
- Add sitemap.xml generation

## License

Custom / Project-specific (add one if needed). Not affiliated with Ubisoft or Massive Entertainment.
