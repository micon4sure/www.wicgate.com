# CLAUDE.md – Agent Operational Rules

> **Purpose:** Essential rules and commands for AI agents. All detailed documentation is in [README.md](README.md) and [docs/](docs/).

## Quick Links

- **[README.md](README.md)** - Project overview, quick start, deployment
- **[docs/architecture.md](docs/architecture.md)** - SSG/SSR, navigation, PWA, state management
- **[docs/design-system.md](docs/design-system.md)** - CSS tokens, patterns, hover effects
- **[docs/testing.md](docs/testing.md)** - Test commands, hybrid timing, coverage
- **[docs/changelog.md](docs/changelog.md)** - Feature history and recent changes

---

## Commands

```bash
npm run dev          # Dev server (localhost:5173)
npm test             # Fast tests (~0.7s, fake timers)
npm run test:thorough # Thorough tests (~14s, real timers, for CI)
npm run lint:fix     # Fix linting issues
npm run build        # Production build (SSG + PWA)
```

**Important:** Use `bun run test` (NOT `bun test` - wrong runner)

---

## Mandatory Rules

### 1. Design Tokens (NO EXCEPTIONS)

❌ **NEVER:** `color: #ff6600;`
✅ **ALWAYS:** `color: var(--sw);`

**Location:** [src/assets/styles/modules/variables.css](src/assets/styles/modules/variables.css)
**Details:** [docs/design-system.md](docs/design-system.md#design-tokens)

### 2. Dynamic Scroll (NO HARDCODED VALUES)

❌ **NEVER:** `scroll-margin-top: 120px;` or manual calculations
✅ **ALWAYS:** `import { scrollToSection } from '@/utils/scroll';`

**Location:** [src/utils/scroll.ts](src/utils/scroll.ts)
**Details:** [docs/architecture.md](docs/architecture.md#navigation-system)

### 3. SSR Guards (NO BROWSER CODE AT BUILD TIME)

❌ **NEVER:** `document.querySelector()` without guards
✅ **ALWAYS:** `if (!import.meta.env.SSR) { /* browser code */ }`

**Files needing guards:** Stores, composables, components with window/document access
**Details:** [docs/architecture.md](docs/architecture.md#ssr-guards)

### 4. Interactive Element Hover Pattern

**Standard for all clickable elements:**
- Inactive: `color: var(--t2)`
- Hover: Orange gradient background + `color: var(--ink)` + scale transform
- Multi-layer shadow: elevation + glow + highlight

**Details:** [docs/design-system.md](docs/design-system.md#interactive-element-standards)

### 5. Button Hierarchy

- **Red button (`.btn-download`):** ONLY for executable programs (WIC LIVE)
- **Orange button (`.btn-p`):** Standard primary actions
- **Hyperlinks:** File downloads, external links (Discord, docs)

**Details:** [docs/design-system.md](docs/design-system.md#download-button-hierarchy)

### 6. Styling Organization

- Add styles to `src/assets/styles/modules/components/*.css`
- Import via `base.css`
- Keep component `<style>` blocks minimal

**Details:** [docs/design-system.md](docs/design-system.md#modular-css-architecture)

### 7. Testing Requirements

- Support hybrid timing: `if (!process.env.TEST_REAL_TIMERS) { vi.useFakeTimers(); }`
- Maintain 50%+ coverage
- Use `*.test.ts` or `*.spec.ts` suffix

**Details:** [docs/testing.md](docs/testing.md)

### 8. Formatting

- LF line endings (no CRLF)
- Prettier via ESLint
- TypeScript strict mode
- **Pre-commit:** `npm run lint && npm test && npx tsc --noEmit`

---

## Common Mistakes

| ❌ Wrong | ✅ Correct | See |
|----------|-----------|-----|
| `color: #ff6600` | `color: var(--sw)` | [Design tokens](docs/design-system.md#design-tokens) |
| `scroll-margin-top: 120px` | `scrollToSection('id')` | [Scroll system](docs/architecture.md#navigation-system) |
| `document.querySelector()` | `if (!import.meta.env.SSR) {...}` | [SSR guards](docs/architecture.md#ssr-guards) |
| `bun test` | `bun run test` | [Testing](docs/testing.md#package-manager-comparison) |
| Red button for files | Hyperlink for files | [Button hierarchy](docs/design-system.md#download-button-hierarchy) |

---

## Key Files

| File | Purpose |
|------|---------|
| [src/utils/scroll.ts](src/utils/scroll.ts) | Dynamic scroll (single source of truth) |
| [src/assets/styles/modules/variables.css](src/assets/styles/modules/variables.css) | All design tokens |
| [src/views/Home.vue](src/views/Home.vue) | SSG conditional rendering |
| [vite.config.ts](vite.config.ts) | SSG + PWA config |

---

## Documentation Updates

**When you make changes:**
- Architecture → Update [docs/architecture.md](docs/architecture.md)
- Design patterns → Update [docs/design-system.md](docs/design-system.md)
- New features → Update [docs/changelog.md](docs/changelog.md)
- **NEVER update this file** unless changing operational rules

---

**Stack:** Vue 3 + TypeScript, Vite, ViteSSG, Pinia, Vitest
**Entry:** [src/main.ts](src/main.ts)
**Updated:** October 2025
