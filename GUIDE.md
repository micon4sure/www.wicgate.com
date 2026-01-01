# AI Agent Guide - WiCGATE

> **First-time onboarding guide.** Read ONCE to understand essential patterns, then reference [docs/](docs/) for deep dives.

## Quick Start

1. Read [CLAUDE.md](CLAUDE.md) - Mandatory user preferences
2. Read this guide - Essential patterns
3. Reference [docs/](docs/) - Detailed documentation as needed

---

## Documentation Index

**Core Docs:**
- [README.md](README.md) - Project overview, quick start
- [docs/architecture.md](docs/architecture.md) - SSG/SSR, navigation, PWA, state
- [docs/deployment_guide.md](docs/deployment_guide.md) - Deployment configs (env vars, asset paths)
- [tailwind.config.ts](tailwind.config.ts) - Design tokens (colors, shadows, animations)
- [docs/testing.md](docs/testing.md) - Test commands, hybrid timing, coverage
- [docs/api.md](docs/api.md) - API endpoints, data structures, integration
- [docs/troubleshooting.md](docs/troubleshooting.md) - Common issues and solutions
- [docs/changelog.md](docs/changelog.md) - Feature history
- [docs/SEO_NEXT_STEPS.md](docs/SEO_NEXT_STEPS.md) - SEO enhancement roadmap

**Quick Reference:**
- [AGENTS.md](AGENTS.md) - Condensed summary

---

## Essential Patterns

### 1. Tailwind Utility-First (NO EXCEPTIONS) *(Updated Oct 12, 2025)*

❌ **NEVER:** `color: #ff6600;` or custom CSS classes for simple styles
✅ **ALWAYS:** `class="text-soviet"` (Tailwind utility classes)

**All styling uses Tailwind utilities.** Design tokens defined in `tailwind.config.ts`, not CSS variables.

📍 **Location:** [tailwind.config.ts](tailwind.config.ts)

---

### 2. Native Scroll System (NO HARDCODED VALUES)

❌ **NEVER:** `padding-top: 80px;` or `scroll-margin-top: 120px;`
✅ **ALWAYS:** `padding-top: var(--header-height);`

**Browser handles scrolling natively.** CSS variable auto-synced by JavaScript.

📖 **Deep dive:** [docs/architecture.md#scroll--navigation-system](docs/architecture.md#scroll--navigation-system)
📍 **Location:** [src/utils/headerHeight.ts](src/utils/headerHeight.ts)

---

### 3. Path-Based Navigation (SSG REQUIRED)

❌ **NEVER:** `history.replaceState(null, '', '#section');`
✅ **ALWAYS:** `router.push('/section');`

**SSG pre-renders path-based routes** (`/multiplayer`, `/community`). Hash URLs (`/#section`) break shareable URLs and SEO.

📖 **Deep dive:** [docs/architecture.md - Routes & SEO](docs/architecture.md#routes--seo)
📍 **Location:** [src/router/routes.ts](src/router/routes.ts)

---

### 4. SSR Guards (MANDATORY)

❌ **NEVER:** `document.querySelector()` without guards
✅ **ALWAYS:** `if (!import.meta.env.SSR) { /* browser code */ }`

**ViteSSG pre-renders in Node.js** where `window`/`document` don't exist. Build crashes without guards.

📖 **Deep dive:** [docs/architecture.md - SSR Guards](docs/architecture.md#ssr-guards)

---

### 5. Interactive Element Hover Pattern

**Standard for all clickable elements:**
- Inactive: `color: var(--t2)`
- Hover: Orange gradient background + `color: var(--ink)` + scale transform

---

### 6. Button Hierarchy

- **Red (`.btn-download`):** ONLY for executable programs (WIC LIVE installer)
- **Orange (`.btn-p`):** Standard primary actions
- **Hyperlinks:** File downloads, external links

---

### 7. Styling Organization *(Updated Oct 12, 2025)*

- **Use Tailwind utility classes directly in templates** (95% of styling)
- **Use `@layer components`** only for complex reusable patterns (e.g., `.widget`)
- **No custom CSS** for simple style combinations

---

### 8. Testing Requirements

- Support hybrid timing: `if (!process.env.TEST_REAL_TIMERS) { vi.useFakeTimers(); }`
- Maintain 50%+ coverage
- Use `*.test.ts` or `*.spec.ts` suffix

📖 **Deep dive:** [docs/testing.md](docs/testing.md)

---

### 9. Formatting & Quality

- LF line endings (no CRLF)
- Prettier via ESLint
- TypeScript strict mode
- Pre-commit: `npm run lint && npm test && npx tsc --noEmit`

---

## Critical Gotchas

### State Management: Pinia Stores *(Updated Oct 13, 2025)*

⚠️ **This project uses PINIA for state management**

```typescript
// ✅ CORRECT - Pinia store pattern
import { defineStore } from 'pinia';

export const useAppDataStore = defineStore('appData', () => {
  const data = ref<DataResponse>({});
  const loading = ref(false);

  async function fetchData() { /* ... */ }

  return { data, loading, fetchData };
});
```

**Critical Reactivity Warning:**
```typescript
// ❌ WRONG - Loses reactivity
const { data, loading } = useAppDataStore();

// ✅ CORRECT - Maintains reactivity
const store = useAppDataStore();
// Access via store.data, store.loading

// ✅ Alternative with storeToRefs()
import { storeToRefs } from 'pinia';
const { data, loading } = storeToRefs(store);
```

📖 **Why?** [docs/architecture.md - State Management](docs/architecture.md#state-management)

---

### Package Manager: bun run test NOT bun test

⚠️ **Use `bun run test` (NOT `bun test`)**

```bash
bun run test  # ✅ CORRECT - Uses Vitest
bun test      # ❌ WRONG - Uses Bun's native test runner
```

📖 **Why?** [docs/testing.md - Package Manager](docs/testing.md#package-manager-comparison)

---

## Common Mistakes

| ❌ Wrong | ✅ Correct | See |
|----------|-----------|-----|
| `color: #ff6600` | `class="text-soviet"` | [tailwind.config.ts](tailwind.config.ts) |
| Custom CSS class | Tailwind utilities | [CLAUDE.md](CLAUDE.md) |
| `padding-top: 80px` | `pt-[var(--header-height)]` | [Scroll System](docs/architecture.md#scroll--navigation-system) |
| `history.replaceState('#id')` | `router.push('/section')` | [Routing System](docs/architecture.md#routing-system) |
| `document.querySelector()` | `if (!import.meta.env.SSR) {...}` | [SSR Guards](docs/architecture.md#ssr-guards) |
| `bun test` | `bun run test` | [Testing](docs/testing.md#package-manager-comparison) |
| Red button for ZIP | Hyperlink for files | [CLAUDE.md](CLAUDE.md) |

---

## Key Files (Quick Reference)

| File | Purpose |
|------|---------|
| [tailwind.config.ts](tailwind.config.ts) | **Universal design tokens** (colors, fonts, spacing used project-wide) |
| [src/assets/styles/tailwind.css](src/assets/styles/tailwind.css) | **Component-specific patterns** (@layer components, animations for 1-2 components) |
| [src/utils/headerHeight.ts](src/utils/headerHeight.ts) | Header height sync for native scroll |
| [src/views/Home.vue](src/views/Home.vue) | SSG conditional rendering |
| [src/stores/appDataStore.ts](src/stores/appDataStore.ts) | API data fetching (Pinia store) |
| [src/stores/auth.ts](src/stores/auth.ts) | Authentication (mock JWT, Pinia store) |
| [vite.config.ts](vite.config.ts) | SSG + PWA config |

**Design System Separation:**
- Add to `tailwind.config.ts` → "Will I use this in 5+ components?"
- Add to `tailwind.css` → "Is this specific to 1-2 components?"

---

## When You're Stuck

**Build errors?** → [docs/troubleshooting.md](docs/troubleshooting.md)
**Test failures?** → [docs/troubleshooting.md](docs/troubleshooting.md)
**Styling issues?** → [tailwind.config.ts](tailwind.config.ts) or [tailwind.css](src/assets/styles/tailwind.css)
**API issues?** → [docs/api.md](docs/api.md)
**Architecture questions?** → [docs/architecture.md](docs/architecture.md)

---

*Last Updated: October 22, 2025 (SSG Optimization & SEO)*
