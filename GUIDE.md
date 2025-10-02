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
- [docs/design-system.md](docs/design-system.md) - CSS tokens, patterns, hover effects
- [docs/testing.md](docs/testing.md) - Test commands, hybrid timing, coverage
- [docs/api.md](docs/api.md) - API endpoints, data structures, integration
- [docs/troubleshooting.md](docs/troubleshooting.md) - Common issues and solutions
- [docs/changelog.md](docs/changelog.md) - Feature history

**Quick Reference:**
- [AGENTS.md](AGENTS.md) - Condensed summary

---

## Essential Patterns

### 1. Design Tokens (NO EXCEPTIONS)

❌ **NEVER:** `color: #ff6600;`
✅ **ALWAYS:** `color: var(--sw);`

**All visual values use tokens.** Never hardcode hex colors, pixel values, or shadow definitions.

📖 **Deep dive:** [docs/design-system.md - Design Tokens](docs/design-system.md#design-tokens)
📍 **Location:** [src/assets/styles/modules/variables.css](src/assets/styles/modules/variables.css)

---

### 2. Dynamic Scroll (NO HARDCODED VALUES)

❌ **NEVER:** `scroll-margin-top: 120px;` or manual calculations
✅ **ALWAYS:** `import { scrollToSection } from '@/utils/scroll';`

**Header height is dynamic** across breakpoints. Hardcoded values break on mobile.

📖 **Deep dive:** [docs/architecture.md - Navigation System](docs/architecture.md#navigation-system)
📍 **Location:** [src/utils/scroll.ts](src/utils/scroll.ts)

---

### 3. SSR Guards (MANDATORY)

❌ **NEVER:** `document.querySelector()` without guards
✅ **ALWAYS:** `if (!import.meta.env.SSR) { /* browser code */ }`

**ViteSSG pre-renders in Node.js** where `window`/`document` don't exist. Build crashes without guards.

📖 **Deep dive:** [docs/architecture.md - SSR Guards](docs/architecture.md#ssr-guards)

---

### 4. Interactive Element Hover Pattern

**Standard for all clickable elements:**
- Inactive: `color: var(--t2)`
- Hover: Orange gradient background + `color: var(--ink)` + scale transform

📖 **Deep dive:** [docs/design-system.md - Interactive Elements](docs/design-system.md#interactive-element-standards)

---

### 5. Button Hierarchy

- **Red (`.btn-download`):** ONLY for executable programs (WIC LIVE installer)
- **Orange (`.btn-p`):** Standard primary actions
- **Hyperlinks:** File downloads, external links

📖 **Deep dive:** [docs/design-system.md - Button Hierarchy](docs/design-system.md#download-button-hierarchy)

---

### 6. Styling Organization

- Add styles to `src/assets/styles/modules/components/*.css`
- Import via `base.css`
- Keep component `<style>` blocks minimal

📖 **Deep dive:** [docs/design-system.md - Modular CSS](docs/design-system.md#modular-css-architecture)

---

### 7. Testing Requirements

- Support hybrid timing: `if (!process.env.TEST_REAL_TIMERS) { vi.useFakeTimers(); }`
- Maintain 50%+ coverage
- Use `*.test.ts` or `*.spec.ts` suffix

📖 **Deep dive:** [docs/testing.md](docs/testing.md)

---

### 8. Formatting & Quality

- LF line endings (no CRLF)
- Prettier via ESLint
- TypeScript strict mode
- Pre-commit: `npm run lint && npm test && npx tsc --noEmit`

---

## Critical Gotchas

### State Management: Composables NOT Pinia

⚠️ **This project uses COMPOSABLES, not Pinia**

```typescript
// ✅ CORRECT - What this project uses
const data = ref<DataResponse>({});
export function useAppDataStore() {
  return { data, loading, fetchData };
}
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
| `color: #ff6600` | `color: var(--sw)` | [Design Tokens](docs/design-system.md#design-tokens) |
| `scroll-margin-top: 120px` | `scrollToSection('id')` | [Navigation](docs/architecture.md#navigation-system) |
| `document.querySelector()` | `if (!import.meta.env.SSR) {...}` | [SSR Guards](docs/architecture.md#ssr-guards) |
| `bun test` | `bun run test` | [Testing](docs/testing.md#package-manager-comparison) |
| Red button for ZIP | Hyperlink for files | [Button Hierarchy](docs/design-system.md#download-button-hierarchy) |
| Styles in component | Styles in `components/*.css` | [Modular CSS](docs/design-system.md#modular-css-architecture) |

---

## Key Files (Quick Reference)

| File | Purpose |
|------|---------|
| [src/utils/scroll.ts](src/utils/scroll.ts) | Dynamic scroll (single source of truth) |
| [src/assets/styles/modules/variables.css](src/assets/styles/modules/variables.css) | All design tokens |
| [src/views/Home.vue](src/views/Home.vue) | SSG conditional rendering |
| [src/stores/appDataStore.ts](src/stores/appDataStore.ts) | API data fetching (composable pattern) |
| [vite.config.ts](vite.config.ts) | SSG + PWA config |

---

## When You're Stuck

**Build errors?** → [docs/troubleshooting.md](docs/troubleshooting.md)
**Test failures?** → [docs/troubleshooting.md](docs/troubleshooting.md)
**Styling issues?** → [docs/design-system.md](docs/design-system.md)
**API issues?** → [docs/api.md](docs/api.md)
**Architecture questions?** → [docs/architecture.md](docs/architecture.md)

---

*Last Updated: October 2, 2025*
