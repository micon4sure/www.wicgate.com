# Architecture Documentation

## Overview

WiCGATE is a **hybrid SSG/SPA** application that combines Static Site Generation for SEO with Single Page Application behavior for user experience.

**Stack:** Vue 3 + TypeScript, ViteSSG, @unhead/vue, Tailwind CSS, Pinia, Vitest
**Entry:** [src/main.ts](../src/main.ts)
**Routing:** 7 Vue Router routes, hash-based tab navigation within sections (see Routing System below)

---

## Core Architecture

### Rendering Strategy

**Build Time (SSG):**
- ViteSSG pre-renders 6 unique HTML files (main sections only)
- Each route serves focused content with unique meta tags
- Tab content handled client-side via hash navigation
- Conditional rendering: `shouldRenderSection()` renders only target section per route

**Runtime (SPA):**
- JavaScript hydrates after initial load
- Tab navigation triggers route changes (except Community videos which use local state)
- No page reloads during navigation (Vue Router SPA behavior)
- Hash fragments handle FAQ question deep-linking

### Routing System

**Two Navigation Mechanisms:**

1. **Vue Router Routes (7 total)** - Section navigation, triggers full route change:
   - `/` - Home (hero section)
   - `/downloads` - Downloads section
   - `/statistics` - Statistics/leaderboards section
   - `/community` - Community section
   - `/faq` - FAQ section
   - `/login` - User login page
   - `/admin` - Admin panel

2. **Hash-Based Tab Navigation** - Tab switching within sections, no route change:
   - Downloads tabs: `#quick-install` (default, no hash shown), `#dedicated-server`, `#manual-install`
   - FAQ tabs: `#about-wicgate` (default, no hash shown), `#getting-started`, `#technical-issues`, `#gameplay-features`
   - FAQ questions: `#game-crashes-on-startup`, `#what-is-wicgate`, etc.
   - Community sections: `#streams` (Live Streams), `#videos` (Latest Videos)
   - Community video tabs: `#latest` (default), `#{channelId}` (creator channels)

**Key distinction:** Clicking a navbar link triggers Vue Router navigation (section change). Clicking a tab within a section only updates the URL hash (no route change, content swaps instantly via TabContainer).

### SSG Optimization Strategy

**Pre-rendering Philosophy:** Only pre-render pages with substantial unique content. Tab content is handled client-side.

**Current Strategy:**
- **Pre-rendered Routes (6):** `/`, `/downloads`, `/statistics`, `/community`, `/faq`, `/login`
- **Hash-based tabs:** Not separate routes - handled by TabContainer component
- **Excluded from sitemap.xml:** noindex pages (/login, /admin)
- **Sitemap URLs (5):** Main sections only with substantial content

**Benefits:**
- ✅ Consolidated SEO signals (one authoritative page per section)
- ✅ No duplicate/thin content issues
- ✅ Clean URL structure - default tabs don't clutter address bar
- ✅ Faster builds (6 pages only)
- ✅ Better crawl budget usage (Google focuses on quality pages)
- ✅ Browser back/forward works with hash history

**Hash-Based Navigation Implementation:**
```typescript
// TabContainer.vue - Hash-based tab switching
function switchTab(tab: Tab) {
  const anchor = getAnchor(tab.id);
  const isDefault = tab.id === props.tabs[0]?.id;

  if (isDefault) {
    // Clear hash for default tab
    history.replaceState(null, '', window.location.pathname);
  } else {
    // Set hash for non-default tab
    history.pushState(null, '', `#${anchor}`);
  }
  localActiveTabId.value = tab.id;
}
```

**Examples:**
- Downloads tabs: `/downloads`, `/downloads#dedicated-server`, `/downloads#manual-install`
- FAQ categories: `/faq`, `/faq#getting-started`, `/faq#technical-issues`, `/faq#gameplay-features`
- FAQ questions: `/faq#game-crashes-on-startup`, `/faq#what-is-wicgate`
- Community sections: `/community#streams`, `/community#videos`
- Community video tabs: `/community#latest` (or just `/community` for default)

**Navigation Helper:** [src/types/navigation.ts](../src/types/navigation.ts) - `getRoutePath()` converts IDs to paths

**Navigation Structure:**
- **Simplified navbar:** Main sections only (Home, Downloads, Statistics, Community, FAQ)
- **No dropdown menus:** Subsections accessed via internal TabContainer components with hash URLs
- **Desktop & Mobile:** Consistent navigation - all sections shown as simple links
- **Helper functions:** Used for routing and active section tracking

**TabContainer Implementation:**
- **Hash-based navigation:** Updates URL hash on tab click (e.g., `#dedicated-server`)
- **Default tab:** No hash shown (e.g., `/downloads` for Quick Install)
- **Browser history:** Uses `history.pushState()` for back/forward support
- **Local state fallback:** Community videos use local state (dynamic YouTube channels)
- **SSR-safe:** Guards against window/history access during SSR
- **External tab control:** `externalActiveTabId` prop allows parent components to switch tabs programmatically (used by FAQ.vue for question deep links - hash like `#game-crashes-on-startup` maps to parent category tab via `questionToTabId` computed)

**SEO Strategy:**
- **All content in DOM:** Tab panels use CSS hiding (`hidden`/`block` classes), not `v-if`. This ensures all tab content is present in SSG-rendered HTML for search engine indexing.
- **No `hidden` attribute:** Uses pure CSS (`display: none`) instead of HTML `hidden` attribute, which has semantic implications ("not relevant").
- **Shared panels:** Tab panels are rendered once and shared between desktop tabs and MobileTabDropdown. The mobile dropdown only handles tab selection UI.

**Files:**
- [src/router/routes.ts](../src/router/routes.ts) - Route definitions (7 routes, no child routes)
- [src/main.ts](../src/main.ts) - Router configuration
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
        const offsetPosition = elementPosition - headerHeight - 16; // Extra breathing room

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
  const routeSection = route.meta.section as string | undefined;
  // Desktop: always use route-based section
  // Mobile: use scroll-based tracking for manual scrolling
  return isDesktopMode.value || isProgrammaticScroll.value
    ? routeSection
    : scrollBasedSection.value;
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

### FirstVisitOverlay SSG Safety

The first visit overlay uses **client-side only rendering** to avoid Google's "Intrusive Interstitial" SEO penalty:

- **Default hidden:** `showFirstVisitOverlay = ref(false)` - starts as false
- **Client-side activation:** `initFirstVisitCheck()` only runs in `onMounted()`
- **Conditional rendering:** `v-if` excludes overlay HTML from SSG entirely

This ensures Googlebot receives clean HTML with no overlay (since `onMounted` never runs during SSG), while real users see the onboarding overlay on their first visit.

**Why this matters:** Googlebot is stateless - every crawl is a "first visit." If the overlay appeared in pre-rendered HTML, Google would see it 100% of the time, potentially triggering the mobile interstitial penalty.

### MobileTabDropdown SSG Visibility

The mobile tab dropdown uses **CSS class visibility** instead of `v-if` to ensure tab navigation is present in SSG HTML for Mobile-First Indexing:

- **Always rendered:** `MobileTabDropdown.vue` wrapper is always in DOM
- **CSS-based hiding:** Uses `:class="isMobile ? 'block' : 'hidden'"` instead of `v-if="isMobile"`
- **Desktop tabs:** Consumer components use `:class="{ hidden: isMobile }"` on desktop tab navs

**Why this matters:** Google uses Mobile-First Indexing, meaning Googlebot crawls the mobile version of pages. Since `isMobile` defaults to `false` during SSG (only becomes `true` client-side in `onMounted`), using `v-if="isMobile"` would completely remove mobile tab navigation from the DOM. This leaves crawlers with no tab buttons to understand the relationship between navigation and content.

**Files using this pattern:**
- `MobileTabDropdown.vue` - Core component with CSS visibility
- `TabContainer.vue`, `MediaEventCard.vue`, `DynamicInfoCard.vue`, `LeaderboardGroup.vue` - Consumer components

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

**Copy Link Feature (FAQ + Statistics Leaderboards):**

Industry-standard pattern for content sharing, following GitHub/MDN/Stack Overflow documentation sites. Used in FAQ questions and Statistics leaderboard cards:

```typescript
// FAQ.vue - Copy link with base path for GitHub Pages support
const appBase = inject<string>('appBase', '/'); // From main.ts

function copyQuestionLink(questionId: string) {
  if (typeof window === 'undefined' || !navigator.clipboard) return; // SSR guard

  // Build URL with base path for GitHub Pages deployment
  const url = `${window.location.origin}${appBase}faq#${questionId}`;

  navigator.clipboard.writeText(url); // Copy to clipboard
}

// LeaderboardGroup.vue / ClanLeaderboard.vue - Same pattern
const url = `${window.location.origin}${appBase}statistics#${hash}`;
```

**Note:** The `appBase` injection handles deployment to subdirectories (GitHub Pages) automatically. See [deployment_guide.md](deployment_guide.md) for details.

**UX Features:**
- Link icon (🔗) appears on hover (hidden by default)
- Click copies URL: `/faq#question-id` or `/statistics#leaderboard-id`
- Icon changes to checkmark (✓) for 2 seconds
- Toast notification: "Link copied to clipboard!" (gold themed, top-right, auto-dismiss after 2s)
- :target CSS animation: 2s orange border pulse on deep-link arrival (FAQ only)
- Keyboard accessible: ARIA labels, focus states, works without mouse

**Technical Implementation:**
- `@click.stop` prevents parent accordion/card toggle
- `opacity-0 group-hover:opacity-100` for progressive disclosure
- State tracking: `copiedQuestionId` (FAQ), `copied` ref (leaderboards)
- Toast uses Vue `<transition>` with inline Tailwind classes for enter/leave animations
- CSS classes: `.faq-copy-link-btn`, `.lb-copy-link-btn` (gold themed), `.toast-notification`
- Leaderboards: `LeaderboardGroup.vue`, `ClanLeaderboard.vue` with category-aware URLs

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

### Theme Tokens (January 2026)

**Semantic color tokens for easy theme switching.** Change these values in `tailwind.config.ts` to update all tab/header colors site-wide:

```typescript
// Tab active state gradient + accent (navbar, sub-tabs, mobile)
'tab-active': {
  from: '#c62828',    // Gradient top (Massgate Red)
  to: '#8b0000',      // Gradient bottom (Massgate Red Dark)
  accent: '#e53935',  // Underline/glow (Massgate Red Bright)
},
// Section header gradient (leaderboard, FAQ, overlays)
'section-header': {
  from: '#4a1f5c',    // Gradient top (Purple)
  to: '#2d1236',      // Gradient bottom (Purple Dark)
},
```

**CSS Usage:** Reference tokens via `theme()` function:
```css
.tab-btn-active {
  background: linear-gradient(to bottom, theme('colors.tab-active.from'), theme('colors.tab-active.to'));
}
.leaderboard-header {
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.12) 1px, transparent 1px),  /* micro-dot mesh */
    linear-gradient(to bottom, theme('colors.section-header.from'), theme('colors.section-header.to'));
  background-size: 4px 4px, 100% 100%;
}
```

**Affected Components:**
- **Tab Active** (7 classes): `.tab-btn-active`, `.nav-mobile-link.active`, `.tab-btn-sub-active`, `.tab-mobile-option-active`, `.tab-mobile-trigger-sub`, `.tab-mobile-trigger-sub-open`, `.tab-mobile-option-sub-active`
- **Tab Underline** (2 classes): `.tab-btn::before`, `.tab-btn-sub::before`
- **Section Headers** (5 classes): `.server-group-header`, `.event-accordion-expanded .event-accordion-header`, `.faq-item-open .faq-question-header`, `.leaderboard-header`, `.overlay-header`

### Deep Link Highlight System (January 2026)

**Unified glow effect for deep link navigation.** When users navigate to FAQ questions or Statistics leaderboards via deep links, a pulsing glow animation draws attention to the target element.

**Timing Constant:**
```typescript
// src/constants.ts
export const ANCHOR_HIGHLIGHT_DELAY = 300; // Delay before highlight animation (ms)
```

**Color Tokens:**
```typescript
// tailwind.config.ts - soviet color group
'soviet': {
  DEFAULT: '#ff6600',
  // Deep link highlight glow - baked-in opacity (theme() modifier fails in @keyframes)
  glowStrong: 'rgba(255, 102, 0, 0.7)',  // Initial glow (0%)
  glowMedium: 'rgba(255, 102, 0, 0.6)',  // Peak glow (50%)
  glowSoft: 'rgba(255, 102, 0, 0.4)',    // Ambient glow
},
```

**CSS Animation (shared):**
```css
/* tailwind.css - single shared animation for FAQ and Statistics */
.anchor-highlight {
  animation: anchor-highlight-pulse 2s ease-out;
}

@keyframes anchor-highlight-pulse {
  0% {
    box-shadow: 0 0 0 0 theme('colors.soviet.glowStrong'),
                0 0 20px theme('colors.soviet.glowSoft');
  }
  50% {
    box-shadow: 0 0 0 8px transparent,
                0 0 30px theme('colors.soviet.glowMedium');
  }
  100% { /* fades to transparent */ }
}
```

**Usage Pattern (both FAQ.vue and Statistics.vue):**
```typescript
import { ANCHOR_HIGHLIGHT_DELAY } from '../constants';

// After scrolling to element
setTimeout(() => {
  element.classList.add('anchor-highlight');
  setTimeout(() => {
    element.classList.remove('anchor-highlight');
  }, 2000);
}, ANCHOR_HIGHLIGHT_DELAY);
```

### Card Background Tokens (January 2026)

**Tokenized card/container backgrounds** for consistent styling across the site. Two-level hierarchy: main containers and nested items.

```typescript
// tailwind.config.ts - backgroundImage (gradients)
'card-surface': 'linear-gradient(to bottom right, rgba(18, 30, 39, 0.5), rgba(9, 15, 20, 0.5))',
'video-card': 'linear-gradient(180deg, rgba(15, 18, 21, 0.96) 0%, rgba(8, 9, 11, 0.98) 100%)',

// Leaderboard row backgrounds (steel blue, 50% transparent)
'lb-row': 'linear-gradient(to right, rgba(18, 30, 39, 0.5), rgba(9, 15, 20, 0.5))',
'lb-row-even': 'linear-gradient(to right, rgba(24, 38, 48, 0.5), rgba(14, 24, 31, 0.5))',
'lb-header': 'linear-gradient(to bottom, rgba(31, 49, 61, 0.5), rgba(18, 30, 39, 0.5))',

// tailwind.config.ts - colors (solid with opacity)
'list-item': {
  DEFAULT: 'rgba(15, 18, 21, 0.4)',    // Nested items
  hover: 'rgba(15, 18, 21, 0.55)',     // Hover state
  alt: 'rgba(15, 18, 21, 0.5)',        // Alternative variant
}

// tailwind.config.ts - boxShadow
'medal-text': '0 2px 4px rgba(0, 0, 0, 0.8)',  // Medal rank text shadow
```

**Token Usage:**

| Token | Type | Used By |
|-------|------|---------|
| `bg-card-surface` | Gradient (steel blue 50%) | `.dashboard-card`, `.step-card`, `.faq-item`, `.leaderboard-panel`, `.help-cta-box`, `.leaderboard-container` |
| `bg-video-card` | Gradient (graphite) | `.card` (video cards, community cards) |
| `bg-lb-row` | Gradient (steel blue 50%) | `.lb-row` (leaderboard data rows) |
| `bg-lb-row-even` | Gradient (steel blue 50%) | `.lb-row:nth-child(even)` (alternating rows) |
| `bg-lb-header` | Gradient (steel blue 50%) | `.leaderboard-th` (table headers) |
| `bg-list-item` | Solid color | `.server-group-card`, `.video-item-card`, `.event-accordion-item`, `.ladder-player-item` |
| `bg-list-item-hover` | Solid color | Nested item hover states |
| `bg-list-item-alt` | Solid color | `.event-card`, `.event-accordion-header:hover` |

**Visual Hierarchy:**
```
┌─────────────────────────────────┐
│  bg-card-surface (steel blue)   │  ← Main containers
│  ┌───────────────────────────┐  │
│  │ bg-list-item (dark)       │  │  ← Nested items
│  └───────────────────────────┘  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  bg-video-card (graphite)       │  ← Standalone cards
└─────────────────────────────────┘
```

### Navigation Background Tokens (January 2026)

**Tokenized navigation backgrounds** for consistent styling. Separate tokens for main nav and sub nav (future flexibility).

```typescript
// tailwind.config.ts - backgroundImage
'nav-main': 'linear-gradient(to bottom, rgba(15, 18, 21, 0.95), rgba(8, 9, 11, 0.95))',
'nav-sub': 'linear-gradient(to bottom, rgba(15, 18, 21, 0.95), rgba(8, 9, 11, 0.95))',
```

**Token Usage:**

| Token | Used By |
|-------|---------|
| `bg-nav-main` | `.tab-nav` (main navigation bar) |
| `bg-nav-sub` | `.tab-nav-sub`, `.tab-mobile-dropdown`, `.tab-mobile-dropdown-sub` |

**Mobile Triggers:** Use `tab-active` token (red gradient) - unified across main and sub nav.

### Layout Width Standard (October 2025)

**Standardized Container Width:** All content sections use consistent **1440px (max-w-site)** maximum width.

**Base Container Class:**
```css
/* tailwind.css - @layer components */
.container {
  @apply max-w-site mx-auto px-5;
}
```

**Effective Content Width:** 1400px (1440px - 20px padding each side)

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
- Create section-specific link overrides (use link helper classes)

### Link Helper Classes (January 2026)

**Authoritative link styling** - no section-specific overrides. All inline text links use these classes:

| Class | Purpose | Style |
|-------|---------|-------|
| `.internal-link` | Internal navigation (e.g., "WIC LIVE" in warnings) | Gold, underlined, uppercase, Rajdhani font |
| `.inline-link` | Base class for inline text links | Gold, underline on hover |
| `.download-link` | File downloads (.exe, .zip) | Extends `.inline-link` + download icon |
| `.external-link` | External services (Discord, GOG, YouTube) | Extends `.inline-link` + external arrow icon |

**Usage in content strings:**
```typescript
// content.ts - Use appropriate link class
'Download <a href="..." class="download-link">WIC LIVE</a>'
'Join our <a href="..." class="external-link">Discord</a>'
'See <a href="/downloads#quick-install" class="internal-link">Quick Install</a>'
```

**Icons:** Font Awesome icons auto-appended via `::after` pseudo-element (download: `fa-download`, external: `fa-arrow-up-right-from-square`).

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

**Single source of truth:** `tailwind.config.ts` and `constants.ts`
- `NAV_BREAKPOINT` = 1024px (main navigation mobile/desktop switch)
- `SUB_TAB_BREAKPOINT` = 640px (sub-tabs mobile dropdown/desktop horizontal switch)

### Media Query Patterns (January 2026)

**All media queries use Tailwind's `screen()` function** to reference breakpoints from `tailwind.config.ts`. This ensures consistency and prevents breakpoint collisions.

**Patterns:**
```css
/* Above breakpoint (min-width) */
@media screen(lg) { ... }           /* ≥768px */
@media screen(xl) { ... }           /* ≥1024px */

/* Below breakpoint (max-width equivalent) */
@media not all and screen(lg) { ... }   /* <768px */
@media not all and screen(xl) { ... }   /* <1024px */

/* Range queries */
@media screen(lg) and not all and screen(xl) { ... }  /* 768px to 1023px */

/* Combined with other conditions */
@media (hover: hover) and screen(lg) { ... }  /* Hover + ≥768px */
```

**Why `not all and screen()`:**
- Native CSS for max-width equivalent
- Auto-syncs with config changes
- No off-by-one bugs (767px, 1023px eliminated)
- Matches Tailwind's `max-lg:` utility behavior

**Files:**
- [tailwind.css](../src/assets/styles/tailwind.css) - All media queries use `screen()`
- [tailwind.config.ts](../tailwind.config.ts) - Breakpoint definitions

### Semantic Typography Scale (January 2026)

**All typography uses semantic tokens** defined in `tailwind.config.ts` with fluid scaling via CSS `clamp()`. Enforces 12px minimum font size.

**Token Set (9 tokens):**
| Token | Size Range | Use Case |
|-------|------------|----------|
| `text-hero` | 28px → 36px | Hero title only |
| `text-heading` | 20px → 26px | All panel/card headers |
| `text-mainnav` | 19px → 23px | Header navigation tabs |
| `text-subtab` | 16px → 20px | Secondary navigation tabs |
| `text-tab` | 14px → 18px | Content tabs, leaderboard tabs |
| `text-data` | 15px → 19px | Data display (leaderboards, widgets, descriptions, body text) |
| `text-label` | 13px → 15px | Labels, subtitles |
| `text-ui` | 12px → 14px | Small UI elements (code blocks, admin UI) |
| `text-min` | 12px fixed | Badges, absolute minimum |

**Fluid Typography:**
All tokens use CSS `clamp()` for smooth viewport-based scaling between 375px and 1280px:
```typescript
// Example: text-data (15px → 19px)
'data': ['clamp(0.9375rem, 0.8339rem + 0.442vw, 1.1875rem)', { lineHeight: '1.4' }]
```

**12px Minimum Enforcement:**
- `text-min` is the floor value (12px, no fluid scaling)
- All components respect this minimum
- No font size should go below 12px for readability

**Usage:**
```css
/* Panel headers */
.leaderboard-header-title { @apply text-heading; }
.dashboard-card-header h3 { @apply text-heading; }

/* Data display */
.lb-cell-score { @apply text-data; }
.player-name { @apply text-data; }

/* Labels */
.leaderboard-header-subtitle { @apply text-label; }
```

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
**[useMobileTabs.ts](../src/composables/useMobileTabs.ts)** - Mobile tab dropdown behavior (breakpoint detection, dropdown state, click-outside/escape handling) - defaults to `SUB_TAB_BREAKPOINT` (640px), used by MobileTabDropdown and sub-tab components
**[useServerCapacity.ts](../src/composables/useServerCapacity.ts)** - Dynamic capacity colors (90% red, 50% orange, <50% green)
**[usePlayerDisplay.ts](../src/composables/usePlayerDisplay.ts)** - Player name parsing/colorization with memoization
**[useInternalLinks.ts](../src/composables/useInternalLinks.ts)** - Client-side navigation for internal links in v-html content (click interception pattern - industry standard used by Gatsby, Nuxt, Next.js); intercepts `.internal-link` clicks and routes through Vue Router for SPA transitions instead of full page reloads

**When to use `useInternalLinks` vs `<router-link>`:**
- **Vue templates:** Use `<router-link to="/path">` directly - Vue Router handles it natively
- **v-html content:** Use `useInternalLinks` composable - Vue can't process `<router-link>` in raw HTML strings
- **Currently applied in:** FAQ.vue (answer content), Downloads.vue (warning message)
- **Usage:** Import composable, apply `@click="handleContentClick"` to v-html container

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
- Main sections only in NAVIGATION_STRUCTURE
- Helper functions: `getAllValidIds()`, `getRoutePath()`

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
- Previous system: 6 separate widgets (deleted January 2026: QuickStartWidget, LiveServersWidget, TopPlayersWidget, CommunityWidget, LatestVideosWidget, GettingHelpWidget, WidgetBase)
- New system: 2 large interactive cards (DynamicInfoCard, MediaEventCard) consolidating all functionality
- Benefits: Better engagement, compact player display optimized for small communities, rotating content keeps homepage fresh, cohesive military aesthetics

### Screen Components

**[Downloads.vue](../src/screens/Downloads.vue)** - 3-tab installation guide (Quick Install, Dedicated Server, Manual Install) using TabContainer with hash navigation
**[Statistics.vue](../src/screens/Statistics.vue)** - Player rankings and competitive leaderboards with tabbed interface
**[Community.vue](../src/screens/Community.vue)** - Community links, live streams, dynamic content creator video tabs
**[FAQ.vue](../src/screens/FAQ.vue)** - 4-category tabbed FAQ (About WICGATE, Getting Started, Technical Issues, Gameplay & Features) with:
  - SSR-compatible structured data via `useHead()`
  - Copy link buttons on all 21 questions (industry-standard pattern)
  - Direct question URLs (e.g., `/faq#technical-advantages`)
  - Toast notifications and :target CSS animations
  - Full keyboard accessibility (ARIA labels, focus states)

### Other Components

**[Navigation.vue](../src/components/Navigation.vue)** - Simplified navigation with main sections only (no dropdown menus), desktop left-aligned nav (gaming industry standard), mobile hamburger
**[MobileTabDropdown.vue](../src/components/MobileTabDropdown.vue)** - Reusable mobile dropdown for sub-tabs (< 640px): accepts tabs array (id, label, icon), activeTabId, optional formatLabel function, wrapperClass/triggerClass for layout customization; provides trigger-badge and option-badge slots for custom badges; defaults to `SUB_TAB_BREAKPOINT` - used by TabContainer, LeaderboardGroup, DynamicInfoCard, MediaEventCard
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
2. Generate sitemap.xml (5 URLs - main sections only)
3. ViteSSG build - Pre-render 6 routes (main sections + /login)
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
├── deployment_guide.md        # Deployment configurations (env vars, asset paths)
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
