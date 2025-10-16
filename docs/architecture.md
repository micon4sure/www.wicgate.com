# Architecture Documentation

## Overview

WiCGATE is a **hybrid SSG/SPA** application that combines Static Site Generation for SEO with Single Page Application behavior for user experience.

**Stack:** Vue 3 + TypeScript, ViteSSG, @unhead/vue, Tailwind CSS, Pinia, Vitest
**Entry:** [src/main.ts](../src/main.ts)
**Routing:** 27 routes total (23 pre-rendered for SSG, /admin excluded)

---

## Core Architecture

### Rendering Strategy

**Build Time (SSG):**
- ViteSSG pre-renders 23 unique HTML files (excludes /admin)
- Each route serves focused content with unique meta tags
- Conditional rendering: `shouldRenderSection()` renders only target section per route

**Runtime (SPA):**
- JavaScript hydrates after initial load
- All sections render for smooth scrolling
- No page reloads during navigation

### Routing System

**Path-Based Nested Routes:**
- **Main (6):** `/`, `/downloads`, `/statistics`, `/community`, `/about`, `/faq`
- **Subsections (18):** `/downloads/quick`, `/downloads/server`, `/downloads/manual`, `/statistics/leaderboards`, `/community/streams`, `/community/videos`, `/faq/technical`, etc.

**Navigation Helper:** [src/types/navigation.ts](../src/types/navigation.ts) - `getRoutePath()` converts IDs to paths

**Benefits:**
- Clean URLs (`/statistics/leaderboards` vs `/#statistics-leaderboards`)
- Unique meta tags per subsection
- Proper browser back/forward support
- All routes pre-rendered for SEO

**Files:**
- [src/router/routes.ts](../src/router/routes.ts) - Route definitions
- [src/main.ts](../src/main.ts) - Router configuration with scrollBehavior

---

## Scroll & Navigation System

### Philosophy

**Let the browser handle scrolling natively.** Use CSS for smooth scrolling, JavaScript only for dynamic header measurement and navigation highlighting.

### Implementation

#### 1. Dynamic Header Height

**CSS Variable + JavaScript Sync:**
```css
/* reset.css */
:root {
  --header-height: 80px;  /* Fallback */
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: var(--header-height);
}
```

```typescript
// src/utils/headerHeight.ts
export function syncHeaderHeight() {
  const updateHeight = () => {
    const header = document.querySelector('header');
    const height = header?.getBoundingClientRect().height || 80;
    document.documentElement.style.setProperty('--header-height', `${height}px`);
  };

  updateHeight(); // Initial sync
  window.addEventListener('resize', () => requestAnimationFrame(updateHeight));
}
```

**Benefits:**
- Zero maintenance (header changes auto-update offset)
- Pixel-perfect at all breakpoints
- Uses `pt-[var(--header-height)]` in templates

#### 2. Native Scroll Restoration

```typescript
// main.ts
if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
  history.scrollRestoration = 'auto'; // Browser handles scroll position
}
```

#### 3. Router scrollBehavior

```typescript
scrollBehavior(to, _from, savedPosition) {
  if (savedPosition) return savedPosition; // Browser back/forward

  const targetId = to.meta.subsection || to.meta.section;
  if (targetId) {
    return {
      el: `#${targetId}`,
      behavior: 'smooth', // Uses CSS scroll-behavior
    };
  }

  return { top: 0 }; // Default: scroll to top
}
```

**Reduced from 60+ lines to 15 lines** by leveraging browser APIs.

#### 4. Navigation Highlighting

**File:** [src/composables/useActiveSection.ts](../src/composables/useActiveSection.ts)

**Hybrid Tracking:**
- **Click navigation:** Uses route immediately (instant highlight)
- **Manual scrolling:** Uses scroll position tracking
- **Programmatic scroll protection:** Disables tracking for 800ms during smooth scroll

```typescript
const currentSection = computed(() => {
  const routeSection = route.meta.subsection || route.meta.section;
  return isProgrammaticScroll.value ? routeSection : scrollBasedSection.value;
});
```

**What Was Removed:**
- Complex IntersectionObserver logic (100+ lines)
- Manual scroll position calculations
- Expandable sections (now always visible)
- 500+ lines total → ~100 lines

---

## State Management

### Pinia Stores

**Migration (October 2025):** Moved from composable modules to Pinia for authentication support and protected routes.

**Stores:**
1. **[appDataStore.ts](../src/stores/appDataStore.ts)** - Game data (players, servers, leaderboards)
   - 3-retry exponential backoff (1s, 2s, 4s delays)
   - 90s polling interval
   - Page Visibility API integration
   - SSR guards

2. **[auth.ts](../src/stores/auth.ts)** - Authentication & session management
   - Mock JWT API (admin/admin123, user/user123)
   - localStorage persistence (key: `wicgate_auth_token`)
   - Route guards for protected pages (`/admin`)
   - Role-based access control

**Key Pattern:**
```typescript
// ❌ WRONG - Loses reactivity
const { data, loading } = useAppDataStore();

// ✅ CORRECT - Maintains reactivity
const store = useAppDataStore();
// Access via store.data, store.loading

// ✅ ALTERNATIVE - Use storeToRefs
const { data, loading } = storeToRefs(useAppDataStore());
```

---

## SSR/SSG Architecture

### SSR Guards

**Required for:** Browser APIs (`window`, `document`, `localStorage`, `navigator`)

**Pattern:**
```typescript
// Guard entire function
if (import.meta.env.SSR) return;

// Or guard specific code
if (!import.meta.env.SSR) {
  window.setInterval(fetchData, 90000);
}
```

### Hydration Best Practices

**Problem:** Server/client HTML mismatch causes hydration warnings.

**Solution:** Initialize to SSR-safe defaults, read browser state `onMounted`:

```typescript
const expanded = ref(false); // SSR-safe default

onMounted(() => {
  const stored = localStorage.getItem('key');
  if (stored === '1') expanded.value = true; // Update after hydration
});
```

**v-show vs v-if:**
- **Use `v-show`:** Expandable sections (prevents layout shifts, SEO-friendly)
- **Use `v-if`:** Content that's never needed again

### Async Content Handling

**Challenge:** API content loads after scroll positioning, causing layout shifts.

**Solutions:**
1. **Manual scroll restoration:** `history.scrollRestoration = 'manual'`
2. **Delayed scrollBehavior:** 400ms Promise delay for DOM + skeleton rendering
3. **Skeleton height matching:** `min-height` matches real content
4. **localStorage timing:** Read expanded state before first render

**Files:**
- [Home.vue](../src/views/Home.vue) - Conditional rendering + route watcher
- [Community.vue](../src/screens/Community.vue) - Async content example
- Skeleton components with `<noscript>` fallbacks

---

## Head Management & Meta Tags

**Library:** @unhead/vue (official successor to deprecated @vueuse/head)

**Integration:**
- ViteSSG v28+ automatically sets up @unhead/vue (no manual `createHead()` needed)
- Used in Home.vue for dynamic meta tags based on route
- JSON-LD structured data for SEO (Organization + WebSite schemas)

**Belt-and-Suspenders Approach:**

1. **Runtime (Primary):** `useHead()` in components injects meta tags during SSG build
2. **Build-time (Safety Net):** Post-build script ensures metadata in all pre-rendered HTML

**Pattern:**
```typescript
// Home.vue
import { useHead } from '@unhead/vue';

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    // ...
  ],
  script: [
    {
      type: 'application/ld+json',
      textContent: JSON.stringify(generateOrganizationSchema()), // ⚠️ Use textContent, NOT children
    },
  ],
});
```

**Critical API Difference from @vueuse/head:**
- ✅ Use `textContent` property for script blocks
- ❌ Do NOT use `children` property (produces malformed HTML)

**Files:**
- [Home.vue](../src/views/Home.vue) - Dynamic head management with `useHead()`
- [pageMeta.ts](../src/content/pageMeta.ts) - Single source of truth for meta tags
- [structuredData.ts](../src/utils/structuredData.ts) - JSON-LD schema generation
- [scripts/apply-head-meta.ts](../scripts/apply-head-meta.ts) - Post-build meta injection

**Meta Tags Per Route:**
- Unique title, description, keywords for each of 23 pre-rendered pages
- OpenGraph tags for social sharing
- Twitter Card tags
- Canonical URLs
- JSON-LD structured data (Organization schema on all pages, WebSite schema on homepage)

---

## PWA Architecture

**File:** [vite.config.ts](../vite.config.ts)

**Features:**
- Service worker with precaching (~49 entries production)
- CacheFirst for static assets
- NetworkFirst for API calls (5-min fallback)
- Auto-generated manifest from [public/favicon.svg](../public/favicon.svg)
- 4 icon sizes: 64px, 192px, 512px, maskable

**Build:** `npm run build:icons` generates all PWA icons

---

## Tailwind CSS System

**Migration (October 2025):** 80% code reduction (8,154 deletions vs 1,569 additions)

### Configuration

**File:** [tailwind.config.ts](../tailwind.config.ts)

**All design tokens defined here:**
- Colors: `massgate-red`, `teal`, `soviet`, `graphite`, `mg`, texture variants
- Shadows: `teal-glow`, `orange-glow`, `massgate-glow`, `gold-glow`
- Animations: `red-pulse`, `gold-shimmer`, `teal-glow`
- Breakpoints: xs(360px), sm(480px), md(768px), lg(900px), xl(1024px), 2xl+(1200px+)

### Usage Philosophy

**95% utility classes in templates:**
```vue
<div class="flex items-center gap-3 py-5 px-6 border-b border-mg/30">
  <span class="text-xl font-bold text-t uppercase tracking-[0.5px]">
    {{ title }}
  </span>
</div>
```

**5% component layer for complex patterns:**
```css
/* tailwind.css */
@layer components {
  .widget {
    @apply rounded-none overflow-hidden transition-all duration-300;
    @apply md:backdrop-blur-md md:bg-black/30 md:border md:border-white/20;
  }
}
```

**When to use `@layer components`:**
- Complex patterns used in 3+ places
- Patterns with hover states + transforms
- Patterns where inline would be >10 classes

**DO NOT:**
- Create custom CSS for simple combinations
- Use hardcoded colors (use tokens)
- Use inline `style="..."` attributes
- Use `<style scoped>` blocks

### Responsive Strategy

**Mobile-first with desktop enhancements:**
- Base styles = mobile
- `md:` prefix = tablets+ (768px), enable glassmorphism/video
- `lg:` prefix = laptops+ (900px)
- Desktop-only features: backdrop blur, video backgrounds, glassmorphism

### Dynamic Header Integration

Use CSS variable for spacing:
```vue
<section class="pt-[calc(var(--header-height)+40px)]">
  <!-- Dynamic padding based on measured header height -->
</section>
```

---

## Data Layer

### API Overview

**Base:** `https://www.wicgate.com/api`

**Endpoints:**
- `GET /api/data` - Complete dataset (servers, players, leaderboards)
- `GET /api/events` - Discord community events
- `GET /api/online` - Currently online players

**See [api.md](api.md) for complete documentation.**

### Key Composables

**[useYoutube.ts](../src/composables/useYoutube.ts)** - Multi-channel video fetching (Atom feeds, SSR-safe)
**[useEvents.ts](../src/composables/useEvents.ts)** - Discord events with countdown timers
**[useFirstVisit.ts](../src/composables/useFirstVisit.ts)** - Welcome overlay management
**[useServerCapacity.ts](../src/composables/useServerCapacity.ts)** - Dynamic capacity colors (90% red, 50% orange, <50% green)
**[usePlayerDisplay.ts](../src/composables/usePlayerDisplay.ts)** - Player name parsing/colorization with memoization

### Utilities

**[scroll.ts](../src/utils/scroll.ts)** - Dynamic header measurement:
- `getNavHeight()` - Single source of truth for nav height
- `getHeaderHeightWithBuffer()` - Detection tolerance
- `scrollToSection()` - Pixel-perfect positioning

**[constants.ts](../src/constants.ts)** - Application-wide constants:
- `SERVER_MAX_CAPACITY` - Max players per server (16)
- `SERVER_CAPACITY_THRESHOLDS` - Capacity color thresholds (90% red, 50% orange, <50% green)
- `API_POLLING_INTERVAL`, `API_RETRY_DELAYS` - Network configuration

**[analytics.ts](../src/utils/analytics.ts)** - Type-safe event tracking (15 categories)
**[performance.ts](../src/utils/performance.ts)** - Core Web Vitals (CLS, FCP, INP, LCP, TTFB)
**[structuredData.ts](../src/utils/structuredData.ts)** - JSON-LD schemas for SEO
**[storage.ts](../src/utils/storage.ts)** - Type-safe localStorage wrapper
**[features.ts](../src/utils/features.ts)** - Feature flags for gradual rollout

---

## Type System

**[errors.ts](../src/types/errors.ts)** - Structured error hierarchy
- `ApiError`, `NetworkError`, `ValidationError`, `StorageError`
- Type guards: `isApiError()`, `isNetworkError()`, etc.

**[utils.ts](../src/types/utils.ts)** - TypeScript utility types
- `Nullable<T>`, `Optional<T>`, `Maybe<T>`, `ReadonlyDeep<T>`
- `ApiResponse<T>`, `PaginatedResponse<T>`, `FetchResult<T>`
- Type guards: `isDefined()`, `isNullish()`, `isString()`, etc.

**[navigation.ts](../src/types/navigation.ts)** - Navigation structure & helpers
- `getSectionFromSubsection()`, `isSubsection()`, `getAllValidIds()`, `getRoutePath()`

---

## Component Architecture

### Widget System

**[WidgetBase.vue](../src/components/widgets/WidgetBase.vue)** - Base component enforcing consistent structure

**Widgets:**
1. **QuickStartWidget** - Installation quick links
2. **LiveServersWidget** - Real-time server status with capacity colors
3. **TopPlayersWidget** - Top 5 leaderboard preview
4. **CommunityWidget** - Upcoming events countdown
5. **LatestVideosWidget** - Latest 3 YouTube videos
6. **GettingHelpWidget** - FAQ quick links

**Reduced WidgetDashboard.vue from 376 lines to 77 lines (80% reduction).**

### Screen Components

**[Downloads.vue](../src/screens/Downloads.vue)** - 3-tab installation guide (Quick Install, Dedicated Server, Manual Install)
**[Statistics.vue](../src/screens/Statistics.vue)** - Player rankings and competitive leaderboards
**[Community.vue](../src/screens/Community.vue)** - Community links, live streams, latest videos
**[About.vue](../src/screens/About.vue)** - Project information with 4-tab structure
**[FAQ.vue](../src/screens/FAQ.vue)** - 4-category tabbed FAQ (Getting Started, Technical Issues, Gameplay & Features, Server & Community)

### Other Components

**[Navigation.vue](../src/components/Navigation.vue)** - Desktop left-aligned nav (gaming industry standard), mobile hamburger
**[WidgetDashboard.vue](../src/components/WidgetDashboard.vue)** - Homepage hero grid (6 widgets)
**[ErrorBoundary.vue](../src/components/ErrorBoundary.vue)** - Error handling with retry
**Skeletons** - SEO-friendly loading states with `<noscript>` fallbacks

---

## Build System

### Production Build

**Command:** `npm run build`

**Steps:**
1. Generate PWA icons from `public/favicon.svg` (4 sizes)
2. ViteSSG build - Pre-render 23 routes (excludes /admin)
3. Apply head meta - Inject route-specific titles/descriptions/structured data
4. Generate sitemap.xml from routes
5. PWA service worker generation (~49 precached entries)
6. Asset optimization (code splitting, tree shaking, content hashing)

**Output:** `dist/` with 23 unique HTML files + optimized assets

### Configuration

**[vite.config.ts](../vite.config.ts)** - Vite + ViteSSG + PWA plugins
**[vitest.config.ts](../vitest.config.ts)** - Test config (hybrid timing)
**[tailwind.config.ts](../tailwind.config.ts)** - Design tokens
**[eslint.config.js](../eslint.config.js)** - ESLint + Prettier

### Bundle Optimization

- **Code splitting:** Route-based chunks
- **Tree shaking:** Dead code elimination
- **Content hashing:** Cache busting
- **Chunk size limit:** 5MB max (currently ~4.1MB)

---

## Deployment

### GitHub Pages (Active)

**Live:** https://www.wicgate.com/
**Workflow:** [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)

**Pipeline:**
1. Checkout → Setup Node.js (v20)
2. Install dependencies → Lint check → Type check
3. Test (thorough with real timers, 44 tests)
4. Build → Bundle size check (<5MB)
5. 404 fallback (copy index.html to 404.html)
6. CNAME setup (www.wicgate.com)
7. Deploy to GitHub Pages

**Configuration:**
- Branch: `master` (auto-deploy on push)
- Custom domain: DNS CNAME `www` → `micon4sure.github.io`
- HTTPS enforced

### Alternative Platforms

**Netlify/Vercel:**
- Build: `npm run build`
- Publish dir: `dist`
- SPA routing: `public/_redirects` (fallback to `/index.html 200`)

---

## Performance

### SSG Benefits
- Instant first paint (pre-rendered HTML)
- Reduced JavaScript for initial render
- SEO crawlability without JS execution

### PWA Benefits
- Offline capability (cached assets)
- Background sync (non-blocking updates)
- Cache-first for static assets

### Navigation Performance
- Dynamic measurement (no layout thrashing)
- Passive listeners (non-blocking scroll)
- Debounced resize (RAF at 60fps)

### Bundle Performance
- Route-based splitting (load on demand)
- Tree shaking (remove unused)
- Asset optimization (compression)
- Content hashing (efficient caching)

---

## Project Structure

```
src/
├── main.ts                    # ViteSSG entry
├── router/
│   ├── index.ts               # Router config
│   └── routes.ts              # Route definitions (27 routes, 23 pre-rendered)
├── stores/
│   ├── appDataStore.ts        # Game data
│   └── auth.ts                # Authentication
├── components/
│   ├── Navigation.vue         # Responsive nav
│   ├── WidgetDashboard.vue    # Homepage hero
│   ├── widgets/               # 6 widget components
│   ├── skeletons/             # SEO-friendly loaders
│   └── ...
├── screens/                   # Section components
│   ├── Downloads.vue          # 3-tab installation guide
│   ├── Statistics.vue         # Player leaderboards
│   ├── Community.vue          # Streams, videos, links
│   ├── About.vue              # Project info (4 tabs)
│   └── FAQ.vue                # FAQ (4 categories)
├── views/
│   └── Home.vue               # Main SPA
├── composables/               # Composition functions
├── utils/                     # Utilities
├── types/                     # TypeScript types
├── assets/styles/
│   └── tailwind.css           # Tailwind imports + components
└── content/
    └── content.ts             # Static content

docs/
├── architecture.md            # This file
├── api.md                     # API documentation
├── testing.md                 # Test strategies
├── troubleshooting.md         # Common issues
├── security.md                # Security guidelines (XSS, auth, deployment)
└── changelog.md               # Feature history

Configuration:
├── tailwind.config.ts         # Design tokens
├── vite.config.ts             # Build config
├── vitest.config.ts           # Test config
├── tsconfig.json              # TypeScript strict mode
└── eslint.config.js           # Linting config
```

---

## Contributing

### Guidelines

1. Fork repository and create feature branch
2. Follow patterns:
   - Use design tokens from [tailwind.config.ts](../tailwind.config.ts)
   - Tailwind-first approach (see [CLAUDE.md](../CLAUDE.md))
   - `v-show` for expandable sections (not `v-if`)
   - SSR guards for browser APIs
3. Write tests (maintain 50%+ coverage)
4. Run checks: `npm run lint && npm test && npx tsc --noEmit`
5. Document changes in [changelog.md](changelog.md)
6. Commit with descriptive messages (conventional commits)
7. Submit pull request

### Quality Standards

- TypeScript strict mode, no `any` types
- 50%+ test coverage (enforced)
- Zero ESLint errors
- WCAG AA compliance
- Bundle size <5MB
- All content in pre-rendered HTML

---

*For design tokens, see [tailwind.config.ts](../tailwind.config.ts). For API details, see [api.md](api.md). For testing, see [testing.md](testing.md).*
