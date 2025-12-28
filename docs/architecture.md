# Architecture Documentation

## Overview

WiCGATE is a **hybrid SSG/SPA** application that combines Static Site Generation for SEO with Single Page Application behavior for user experience.

**Stack:** Vue 3 + TypeScript, ViteSSG, @unhead/vue, Tailwind CSS, Pinia, Vitest
**Entry:** [src/main.ts](../src/main.ts)
**Routing:** 15 total routes (14 pre-rendered for SSG), path-based nested routing for subsections

---

## Core Architecture

### Rendering Strategy

**Build Time (SSG):**
- ViteSSG pre-renders 13 unique HTML files (main sections + subsections)
- Each route serves focused content with unique meta tags
- Conditional rendering: `shouldRenderSection()` renders only target section per route

**Runtime (SPA):**
- JavaScript hydrates after initial load
- Tab navigation triggers route changes (except Community videos which use local state)
- No page reloads during navigation (Vue Router SPA behavior)
- Hash fragments handle FAQ question deep-linking

### Routing System

**Path-Based Nested Routes (October 2025):**
- **Main Routes (5):** `/`, `/downloads`, `/statistics`, `/community`, `/faq`
- **System Routes (2):** `/login`, `/admin` (not pre-rendered, protected by auth guards)
- **Downloads Subsections (3):** `/downloads/quick`, `/downloads/server`, `/downloads/manual`
- **FAQ Subsections (5):** `/faq/about`, `/faq/getting-started`, `/faq/technical`, `/faq/gameplay`, `/faq/server`
- **Pre-rendered (6):** Main routes + /login only (subsections excluded per SSG best practices - October 2025)
- **FAQ Question Anchors:** Hash fragments within FAQ routes (e.g., `/faq/technical#black-screen`)

### SSG Optimization Strategy (October 2025)

**Pre-rendering Philosophy:** Only pre-render pages with substantial unique content. Avoid thin content by consolidating subsections.

**Current Strategy:**
- **Pre-rendered Routes (6):** `/`, `/downloads`, `/statistics`, `/community`, `/faq`, `/login`
- **Client-side Routes:** All subsections (not pre-rendered to avoid thin content)
  - `/downloads/quick`, `/downloads/server`, `/downloads/manual` → Tab navigation within `/downloads`
  - `/faq/about`, `/faq/getting-started`, `/faq/technical`, `/faq/gameplay`, `/faq/server` → Tab navigation within `/faq`
- **Excluded from sitemap.xml:** Subsections + noindex pages (/login, /admin)
- **Sitemap URLs (5):** Main sections only with substantial content

**SEO Consolidation for Subsections:**
```typescript
// Home.vue - Subsections inherit parent meta
const effectiveSeoPath = computed(() => {
  if (route.meta.subsection) {
    // /downloads/quick → /downloads, /faq/technical → /faq
    const pathParts = route.path.split('/').filter(Boolean);
    return pathParts.length > 1 ? `/${pathParts[0]}` : route.path;
  }
  return route.path;
});

const matchedMeta = computed(() => {
  // For subsections, find parent section meta for consolidated SEO
  if (route.meta.subsection) {
    const matched = [...route.matched].reverse();
    for (const record of matched) {
      if (record.meta && !record.meta.subsection && Object.keys(record.meta).length > 0) {
        return record.meta;
      }
    }
  }
  // Default: use current route meta
  // ...
});
```

**Benefits:**
- ✅ Consolidated SEO signals (one authoritative page per section)
- ✅ No duplicate/thin content issues
- ✅ All subsection content visible to search engines on parent pages
- ✅ Faster builds (6 pages vs 15+, 60% reduction)
- ✅ Better crawl budget usage (Google focuses on quality pages)
- ✅ Canonical URLs point to parents (e.g., /downloads/quick → /downloads)

**Why Path-Based Routing for Subsections:**
- **Granular SEO:** Each subsection targets specific search queries with unique meta tags
- **Better Entry Points:** Users can land directly on relevant subsections from search results
- **Prevents Cannibalization:** Distinct keywords/descriptions for each route (e.g., "install WiC" vs "host WiC server")
- **Shareable URLs:** Full paths are more descriptive than hash anchors
- **FAQ Question Deep-Linking:** Individual questions have shareable URLs (e.g., `/faq/technical#cant-see-servers`)

**Examples:**
- Downloads subsections: `/downloads/quick`, `/downloads/server`, `/downloads/manual`
- FAQ categories: `/faq/about`, `/faq/getting-started`, `/faq/technical`, `/faq/gameplay`, `/faq/server`
- FAQ question anchors: `/faq/technical#game-crashes-on-startup`, `/faq/about#what-is-wicgate`
- Community videos: Local tab state (no routes for dynamic YouTube channels)

**Navigation Helper:** [src/types/navigation.ts](../src/types/navigation.ts) - `getRoutePath()` converts IDs to full paths

**Navigation Structure (October 2025):**
- **Simplified navbar:** Main sections only (Home, Downloads, Statistics, Community, FAQ)
- **No dropdown menus:** Subsections accessed via internal TabContainer components
- **Desktop & Mobile:** Consistent navigation - all sections shown as simple links
- **Helper functions:** Still used for routing, active section tracking, and subsection-to-section mapping

**TabContainer Implementation:**
- **Hybrid Approach:** Uses `router.hasRoute()` to detect if tab has a matching route
- **Route Tabs:** Navigates via `router.push()` (Downloads, FAQ)
- **Local Tabs:** Uses local state (Community videos - dynamic YouTube channels)
- **Auto-URL updates:** Clicking any tab (including active) updates hash
- **Analytics tracking:** Only tracks actual tab switches (not re-clicking active tab)

**Files:**
- [src/router/routes.ts](../src/router/routes.ts) - Route definitions (7 routes)
- [src/main.ts](../src/main.ts) - Router configuration with hash scrollBehavior
- [src/components/TabContainer.vue](../src/components/TabContainer.vue) - Tab management with hash sync

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
scrollBehavior(to, from, savedPosition) {
  if (savedPosition) return savedPosition; // Browser back/forward

  // Hash anchor navigation (e.g., /downloads#quick)
  if (to.hash) {
    return new Promise((resolve) => {
      const isDirectNavigation = !from.name;
      const scrollBehavior = isDirectNavigation ? 'auto' : 'smooth';
      const delay = isDirectNavigation ? 600 : 100;

      setTimeout(() => {
        const targetId = to.hash.slice(1); // Remove #
        const element = document.getElementById(targetId);
        if (!element) {
          resolve({ top: 0 });
          return;
        }

        const headerHeight = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--header-height').trim()) || 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight;

        resolve({ top: offsetPosition, behavior: scrollBehavior });
      }, delay);
    });
  }

  // Section route navigation
  const targetId = to.meta.section as string | undefined;
  if (targetId) {
    return new Promise((resolve) => {
      const isDirectNavigation = !from.name;
      const scrollBehavior = isDirectNavigation ? 'auto' : 'smooth';
      const delay = isDirectNavigation ? 400 : 100;

      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (!element) {
          resolve({ top: 0 });
          return;
        }

        const headerHeight = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--header-height').trim()) || 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight;

        resolve({ top: offsetPosition, behavior: scrollBehavior });
      }, delay);
    });
  }

  return { top: 0 }; // Default: scroll to top
}
```

**Handles both hash anchors and section routes** with proper delays and header offset calculation.

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

**Critical Areas:**
1. **Router scrollBehavior** - Runs during SSG build, needs guards for DOM APIs
2. **Component script setup** - Top-level code executes during SSR
3. **Lifecycle hooks** - Only `onMounted`/`onBeforeUnmount` are client-only
4. **Event handlers** - Never need guards (@click, @keydown, etc. don't run during SSR)

**Pattern:**
```typescript
// Guard entire function
if (import.meta.env.SSR) return;

// Or guard specific code
if (!import.meta.env.SSR) {
  window.setInterval(fetchData, 90000);
}

// scrollBehavior guard (critical!)
scrollBehavior(to, from, savedPosition) {
  if (to.hash) {
    return new Promise((resolve) => {
      // SSR guard - scrollBehavior runs during SSG build
      if (typeof window === 'undefined') {
        resolve({ top: 0 });
        return;
      }
      // DOM operations safe here
    });
  }
}
```

**What DON'T Need Guards:**
- Event handlers (`@click`, `@submit`, `@keydown`, etc.)
- `onMounted()` lifecycle hook content
- `onBeforeUnmount()` lifecycle hook content

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

**FAQ Schema Best Practice (October 2025):**
```typescript
// FAQ.vue - SSR-compatible structured data
const faqSchema = computed(() => generateFAQSchema(allFaqItems.value));

useHead({
  script: [
    {
      type: 'application/ld+json',
      textContent: () => JSON.stringify(faqSchema.value), // Function for reactivity
      key: 'faq-schema', // Prevents duplicates
    },
  ],
});

// ❌ WRONG - Manual DOM injection in onMounted
onMounted(() => {
  const script = document.createElement('script');
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script); // Not SSR-compatible
});
```

**Critical API Difference from @vueuse/head:**
- ✅ Use `textContent` property for script blocks
- ❌ Do NOT use `children` property (produces malformed HTML)
- ✅ Use `textContent: () => value` for reactive computed schemas
- ✅ Use `key` property to prevent duplicate schema injection

**FAQ Copy Link Feature (October 2025):**

Industry-standard pattern for question sharing, following GitHub/MDN/Stack Overflow documentation sites:

```typescript
// FAQ.vue - Copy link with category detection
function getQuestionCategory(questionId: string): string | null {
  for (const category of faq) {
    const found = category.items.find((item) => item.id === questionId);
    if (found) {
      return getCategoryAnchor(category.cat); // Returns 'server', 'technical', etc.
    }
  }
  return null;
}

function copyQuestionLink(questionId: string) {
  if (typeof window === 'undefined' || !navigator.clipboard) return; // SSR guard

  const categorySlug = getQuestionCategory(questionId);
  const url = categorySlug
    ? `${window.location.origin}/faq/${categorySlug}#${questionId}`
    : `${window.location.origin}/faq#${questionId}`;

  navigator.clipboard.writeText(url); // Copy to clipboard
}
```

**UX Features:**
- Link icon (🔗) appears on question hover (hidden by default)
- Click copies full category URL: `/faq/server#technical-advantages`
- Icon changes to checkmark (✓) for 2 seconds
- Toast notification: "Link copied to clipboard!" (top-right, auto-dismiss)
- :target CSS animation: 2s orange border pulse on deep-link arrival
- Keyboard accessible: ARIA labels, focus states, works without mouse

**Technical Implementation:**
- `@click.stop` prevents parent accordion toggle
- `opacity-0 group-hover:opacity-100` for progressive disclosure
- `copiedQuestionId` state tracks which button was clicked
- Toast uses Vue Transition with translate animations
- CSS keyframe animation for :target highlighting
- All 21 questions automatically get copy buttons

### Structured Data for Rich Search Results (October 2025)

**Comprehensive Schema Implementation:**

The site implements 6 different Schema.org types for enhanced search visibility and rich results.

**1. BreadcrumbList** - Navigation breadcrumbs in search results
```typescript
// src/utils/structuredData.ts - generateBreadcrumbSchema()
// Shows: Home > Downloads, Home > FAQ
// Applied to all section pages (Downloads, Statistics, Community, FAQ)
// Improves navigation clarity and click-through rates
```

**2. SoftwareApplication** - Rich app cards for installers
```typescript
// generateSoftwareApplicationSchema()
// WIC LIVE installer: name, price (free), OS requirements, download URL, file size
// Applied to Downloads page
// Enables app download cards in Google search results
```

**3. HowTo** - Step-by-step installation guides
```typescript
// generateHowToSchema(name, description, steps)
// 4-step installation guide with detailed instructions
// Applied to Downloads page
// Enables rich how-to cards with numbered steps in Google
```

**4. VideoGame** - Game information with ratings
```typescript
// generateVideoGameSchema()
// World in Conflict: 4.5/5 rating, platform (PC), publisher (Ubisoft)
// Applied to homepage
// Shows star ratings and game details in search results
```

**5. WebPage** - Page structure wrapper
```typescript
// generateWebPageSchema(path, name, description, breadcrumbId)
// Links breadcrumbs (when present) to main content entity
// References parent WebSite schema
// Applied to all pages for better context
```

**6. Enhanced FAQPage** - FAQ with author and dates
```typescript
// generateFAQSchema(faqItems)
// Added: Organization author (WICGATE), dateModified field
// Individual items support optional dateModified and author
// Applied to FAQ page and homepage
// Enables FAQ rich snippets with expandable dropdowns in Google
```

**Schema Integration in Home.vue:**
```typescript
script: [
  // Organization (all pages)
  { type: 'application/ld+json', textContent: JSON.stringify(generateOrganizationSchema()), key: 'organization-schema' },

  // Homepage only: WebSite + VideoGame
  ...(!targetSection.value ? [
    { type: 'application/ld+json', textContent: JSON.stringify(generateWebSiteSchema()), key: 'website-schema' },
    { type: 'application/ld+json', textContent: JSON.stringify(generateVideoGameSchema()), key: 'videogame-schema' },
  ] : []),

  // Section pages: BreadcrumbList
  ...(breadcrumbs.value.length > 1 ? [
    { type: 'application/ld+json', textContent: JSON.stringify(generateBreadcrumbSchema(breadcrumbs.value)), key: 'breadcrumb-schema' },
  ] : []),

  // All pages: WebPage wrapper
  { type: 'application/ld+json', textContent: JSON.stringify(generateWebPageSchema(...)), key: 'webpage-schema' },

  // Downloads page: SoftwareApplication + HowTo
  ...(targetSection.value === 'downloads' ? [
    { type: 'application/ld+json', textContent: JSON.stringify(generateSoftwareApplicationSchema()), key: 'software-schema' },
    { type: 'application/ld+json', textContent: JSON.stringify(generateHowToSchema(...)), key: 'howto-schema' },
  ] : []),
]
```

**Expected Search Result Enhancements:**
- ✅ Breadcrumb trails below page titles in SERPs
- ✅ FAQ dropdowns directly in Google (click to expand answers)
- ✅ How-to cards with numbered step-by-step instructions
- ✅ App download cards with pricing and system requirements
- ✅ Star ratings for game reviews (4.5/5 display)
- ✅ Enhanced knowledge graph information

**Files:**
- [Home.vue](../src/views/Home.vue) - Dynamic head management with `useHead()`
- [pageMeta.ts](../src/content/pageMeta.ts) - Single source of truth for meta tags
- [structuredData.ts](../src/utils/structuredData.ts) - JSON-LD schema generation
- [scripts/apply-head-meta.ts](../scripts/apply-head-meta.ts) - Post-build meta injection

**Meta Tags Per Route:**
- Unique title, description, keywords for each of 5 pre-rendered pages
- OpenGraph tags for social sharing
- Twitter Card tags
- Canonical URLs
- JSON-LD structured data (Organization schema on all pages, WebSite schema on homepage)
- Noindex meta tags for login/admin pages

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

**CSS Variable Elimination (October 2025):** 89% reduction (56 → 6 usages)
- Eliminated all legacy CSS variables except `--header-height` (JS-synced for dynamic layout)
- Migrated spacing, colors, RGB triplets, transitions, and gradients to Tailwind utilities
- Fixed 8 critical bugs from undefined variables (--player-neutral, --spacing-*, --grad-card)
- Only exception: `--header-height` in `tailwind.css:8-11` (dynamically updated by `headerHeight.ts`)

### Configuration

**File:** [tailwind.config.ts](../tailwind.config.ts)

**All design tokens defined here (single source of truth):**
- Colors: `massgate-red`, `teal` (structure/badges), `soviet`/`massgate-orange` (interactive/hover), `graphite`, `mg`, texture variants
- Color Hierarchy: Teal for structural elements (icon badges, borders, accents), Orange for interactive states (hover, active, links)
- Dividers: `divider` (DEFAULT, strong, soft) with rgba values for opacity control
- Shadows: `teal-glow`, `orange-glow`, `massgate-glow`, `gold-glow`
- Animations: `red-pulse`, `gold-shimmer`, `teal-glow`
- Breakpoints: xs(320), sm(375), md(425) phones, lg(768) tablet, xl(1024 NAV SWITCH), 2xl(1440) large laptop, 3xl(2560) desktop

### Layout Width Standard (October 2025)

**Standardized Container Width:** All content sections use consistent **1280px (max-w-7xl)** maximum width.

**Base Container Class:**
```css
/* tailwind.css - @layer components */
.container {
  @apply max-w-7xl mx-auto px-5;
}
```

**Effective Content Width:** 1240px (1280px - 20px padding each side)

**Pattern for Tab Content:**
```vue
<!-- ✅ CORRECT - Vertical padding only -->
<template #tab-name>
  <div class="py-8 md:py-12">
    <!-- Full 1240px width content with vertical spacing -->
  </div>
</template>

<!-- ❌ WRONG - Horizontal padding reduces width -->
<template #tab-name>
  <div class="p-8 md:p-12">
    <!-- Content 64-96px narrower than non-tabbed sections -->
  </div>
</template>
```

**Benefits:**
- No visual width jumping between sections during scroll
- Consistent 1240px effective width across all pages (Home, Downloads, Statistics, Community, FAQ)
- Tab content no longer narrower than non-tabbed content
- Full-width leaderboard tables for better readability
- Professional, polished appearance

**Files:**
- [tailwind.css](../src/assets/styles/tailwind.css) - `.container` definition (line 127-129)
- [Downloads.vue](../src/screens/Downloads.vue) - Vertical-only padding on tabs (lines 38, 98, 183)
- [Community.vue](../src/screens/Community.vue) - Vertical-only padding on tabs (lines 152, 201)
- [FAQ.vue](../src/screens/FAQ.vue) - Vertical-only padding on tabs (line 186)
- [Leaderboards.vue](../src/components/Leaderboards.vue) - Single-column layout (line 32)

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

**7-tier breakpoint system (December 2025):**

| Tier | Value   | Device | Key Behaviors |
|------|---------|--------|---------------|
| xs   | 320px   | Small phone | Minimum supported width |
| sm   | 375px   | Medium phone | iPhone SE, standard phones |
| md   | 425px   | Large phone | iPhone Plus, large phones |
| lg   | 768px   | Tablet | 2-column grids, glassmorphism enabled |
| xl   | 1024px  | Laptop | **NAV/TABS SWITCH** - desktop navigation appears |
| 2xl  | 1440px  | Large laptop | Full 3-column layouts, spacious spacing |
| 3xl  | 2560px  | Desktop | Ultra-wide, 4K displays |

**Mobile-first with progressive enhancement:**
- Base styles = below minimum (edge cases)
- `xs:` = small phones (320-374px)
- `sm:` = medium phones (375-424px)
- `md:` = large phones (425-767px)
- `lg:` = tablets (768-1023px), enable glassmorphism/video
- `xl:` = laptops (1024-1439px), desktop nav/tabs
- `2xl:` = large laptops (1440-2559px), full layouts
- `3xl:` = desktops (2560px+), 4K optimization

**Single source of truth:** `tailwind.config.ts` and `constants.ts` (NAV_BREAKPOINT=1024)

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
**[useOverlayState.ts](../src/composables/useOverlayState.ts)** - Cross-component overlay visibility tracking (used by BaseOverlay to pause hero video when any overlay is open)
**[useMobileTabs.ts](../src/composables/useMobileTabs.ts)** - Mobile tab dropdown behavior (breakpoint detection, dropdown state, click-outside/escape handling) - used internally by MobileTabDropdown component
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

**[navigation.ts](../src/types/navigation.ts)** - Navigation structure & routing helpers
- Main sections only in NAVIGATION_STRUCTURE (no subsections)
- Helper functions: `getSectionFromSubsection()`, `isSubsection()`, `getAllValidIds()`, `getRoutePath()`
- Subsection mappings maintained for routing and active section tracking

---

## Component Architecture

### Widget System (October 2025: Streamlined to 2-Card System)

**[WidgetDashboard.vue](../src/components/WidgetDashboard.vue)** - Homepage hero with 2 large interactive carousel cards in side-by-side layout (md:grid-cols-2)

**New Card Components:**

1. **[ContentCarouselCard.vue](../src/components/widgets/ContentCarouselCard.vue)** (364 lines)
   - Auto-rotating 4-slide carousel (5-second intervals)
   - Slides: Quick Start, Latest Videos, Getting Help, Upcoming Events (full scrollable list)
   - Hybrid rotation: auto-rotates with pause-on-hover (also pauses during touch interaction)
   - Manual controls: prev/next arrow buttons (desktop only) + dot indicators (all devices)
   - Touch/swipe support: 50px threshold for left/right swipes on mobile
   - Navigation: arrows hidden on mobile (<768px), visible on desktop with z-20 layering
   - Integrated with useYoutube() and useEvents() composables
   - SSR-safe guards for timer initialization

2. **[DynamicInfoCard.vue](../src/components/widgets/DynamicInfoCard.vue)** (254 lines)
   - Smart conditional rendering based on player activity
   - **Players Online view** (when playerCount > 0): Groups individual players by server, shows server names with player lists underneath, compact formatting (13px names, 11px clan tags, 16px rank insignias), "Lobby" always at bottom without player count
   - **Top Players view** (when no activity): Displays top 5 ladder entries, podium styling for top 3 (gold/silver/bronze)
   - Custom military-themed scrollbar for overflow content

**Custom Scrollbar Styling:**
- Utility class `.custom-scrollbar` in tailwind.css (lines 710-744)
- Teal gradient thumb (#00d9ff), dark track, glow effects on hover/active
- Applied across 3 scrollable areas in both cards
- Cross-browser support (Webkit + Firefox)

**Migration from 6-Widget System (October 2025):**
- Previous system: 6 separate widgets (QuickStartWidget, LiveServersWidget, TopPlayersWidget, CommunityWidget, LatestVideosWidget, GettingHelpWidget)
- New system: 2 large interactive cards consolidating all functionality
- Benefits: Better engagement, compact player display optimized for small communities, rotating content keeps homepage fresh, cohesive military aesthetics

### Screen Components

**[Downloads.vue](../src/screens/Downloads.vue)** - 3-tab installation guide (Quick Install, Dedicated Server, Manual Install) using TabContainer with hash navigation
**[Statistics.vue](../src/screens/Statistics.vue)** - Player rankings and competitive leaderboards with tabbed interface
**[Community.vue](../src/screens/Community.vue)** - Community links, live streams, dynamic content creator video tabs
**[FAQ.vue](../src/screens/FAQ.vue)** - 5-category tabbed FAQ (About WICGATE, Getting Started, Technical Issues, Gameplay & Features, Server & Community) with:
  - SSR-compatible structured data via `useHead()`
  - Copy link buttons on all 21 questions (industry-standard pattern)
  - Category-specific URLs (e.g., `/faq/server#technical-advantages`)
  - Toast notifications and :target CSS animations
  - Full keyboard accessibility (ARIA labels, focus states)

### Other Components

**[Navigation.vue](../src/components/Navigation.vue)** - Simplified navigation with main sections only (no dropdown menus), desktop left-aligned nav (gaming industry standard), mobile hamburger
**[MobileTabDropdown.vue](../src/components/MobileTabDropdown.vue)** - Reusable mobile hamburger dropdown for sub-tabs: accepts tabs array (id, label, icon), activeTabId, optional formatLabel function, wrapperClass/triggerClass for layout customization; provides trigger-badge and option-badge slots for custom badges; internally uses useMobileTabs composable - used by TabContainer, LeaderboardGroup, DynamicInfoCard, MediaEventCard
**[WidgetDashboard.vue](../src/components/WidgetDashboard.vue)** - Homepage hero grid with 2 large interactive cards, pauses video when overlays are active via `useOverlayState`
**[BaseOverlay.vue](../src/components/BaseOverlay.vue)** - Reusable overlay wrapper handling scroll lock, Escape key, backdrop click (mobile only), Teleport, and ARIA accessibility
**[YouTubeTheater.vue](../src/components/YouTubeTheater.vue)** - YouTube video theater using BaseOverlay (youtube-nocookie.com embed)
**[FirstVisitOverlay.vue](../src/components/FirstVisitOverlay.vue)** - Welcome primer using BaseOverlay with quick start guide
**[OnlinePlayersModal.vue](../src/components/OnlinePlayersModal.vue)** - Online players modal using BaseOverlay with server-grouped player lists
**[ErrorBoundary.vue](../src/components/ErrorBoundary.vue)** - Error handling with retry
**Skeletons** - SEO-friendly loading states with `<noscript>` fallbacks

---

## Build System

### Production Build

**Command:** `npm run build`

**Steps:**
1. Generate PWA icons from `public/favicon.svg` (4 sizes)
2. Generate sitemap.xml (14 URLs - all main sections + subsections)
3. ViteSSG build - Pre-render 14 routes (main sections + subsections)
4. Apply head meta - Inject route-specific titles/descriptions/structured data
5. PWA service worker generation (~54 precached entries)
6. Asset optimization (code splitting, tree shaking, content hashing)

**Output:** `dist/` with 14 unique HTML files + optimized assets

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
│   └── routes.ts              # Route definitions (7 routes, 5 pre-rendered)
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
│   └── FAQ.vue                # FAQ (5 categories: About, Getting Started, Technical, Gameplay, Server & Community)
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
