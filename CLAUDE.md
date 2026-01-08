# CLAUDE.md – Agent Preferences

> **Auto-read by AI agents.** Personal preferences that override default behavior. Read [GUIDE.md](GUIDE.md) for complete documentation.

## Documentation

**Start here:** [GUIDE.md](GUIDE.md) - Complete agent guide with detailed patterns and examples

## Commands

```bash
npm run dev          # Dev server (localhost:5173)
npm test             # Fast tests (~0.7s, fake timers)
npm run test:thorough # Thorough tests (~14s, real timers, for CI)
npm run typecheck    # Type-check Vue + TS files
npm run lint:fix     # Fix linting issues
npm run build        # Production build (SSG + PWA)
npm run build:og     # Regenerate OG images (social sharing)
```

**Package Manager:** Use `bun run test` (NOT `bun test` - wrong runner)

---

## Mandatory Constraints (NO EXCEPTIONS)

1. ✅ ALWAYS use Tailwind utility classes for styling
   - ❌ NEVER use `<style scoped>` blocks
   - ✅ Inline Tailwind in templates OR `@apply` in `tailwind.css` (`@layer components`)
2. ✅ Universal design tokens → `tailwind.config.ts` (used in 5+ components)
   - ✅ Component-specific patterns → `tailwind.css` (@layer components, 1-2 uses)
   - When unsure: start in CSS, promote to config if widely used
3. ❌ NEVER use hardcoded scroll offsets → ✅ ALWAYS use `pt-[var(--header-height)]`
4. ❌ NEVER use browser APIs without SSR guards
5. ✅ ALWAYS use Pinia for state management (stores in `src/stores/`)
6. ❌ NEVER commit CRLF line endings (LF only)
7. ❌ NEVER use `bun test` → ✅ ALWAYS use `bun run test`
8. ❌ NEVER use `any` types → ✅ ALWAYS use typed errors from `types/errors.ts`
9. ❌ NEVER duplicate logic → ✅ ALWAYS use composables (`useServerCapacity`, `usePlayerDisplay`, `useInternalLinks`, etc.)
10. ⚠️ Security considerations → See [docs/security.md](docs/security.md) for XSS prevention, auth best practices
11. ✅ ALWAYS use Tailwind default breakpoints + xs custom: xs(375), sm(640), md(768), lg(1024), xl(1280)
    - xs is the only custom breakpoint (375px for small phones)
    - Main nav switches at lg (1024px) - use `NAV_BREAKPOINT` from constants.ts
    - Sub-tabs switch at sm (640px) - use `SUB_TAB_BREAKPOINT` from constants.ts (default for `useMobileTabs()`)
    - Site container max-width is 1440px via `max-w-site` token (breakpoints stay at 1280px)
12. ✅ ALWAYS use `screen()` function for CSS media queries in `tailwind.css`
    - ❌ NEVER use hardcoded pixel values like `@media (max-width: 767px)`
    - ✅ Use `@media screen(md)` for min-width, `@media not all and screen(md)` for max-width
    - See `tailwind.css` header comment for pattern reference
13. ✅ ALWAYS enforce 12px minimum font size at small breakpoints
    - ❌ NEVER use font sizes below `text-caption-md` (12px) or `text-nav-xs` (12px)
    - ✅ Use semantic typography tokens: `text-display-*`, `text-heading-*`, `text-body-*`, `text-caption-*`, `text-nav-*`
    - See `tailwind.config.ts` for the complete typography scale
14. ✅ ALWAYS use unified link classes for inline text links (gold themed)
    - `.internal-link` for internal navigation (no icon)
    - `.download-link` for file downloads - shows download icon
    - `.external-link` for external services (Discord, GOG, YouTube) - shows external arrow icon
    - Anchor copy buttons: `.faq-copy-link-btn`, `.lb-copy-link-btn`

---

## Workflow Preferences

**When you make changes:**
- Architecture → Update [docs/architecture.md](docs/architecture.md)
- Deployment/env vars → Update [docs/deployment_guide.md](docs/deployment_guide.md)
- Design tokens → Update [tailwind.config.ts](tailwind.config.ts) or [tailwind.css](src/assets/styles/tailwind.css)
- New features → Update [docs/changelog.md](docs/changelog.md)
- API changes → Update [docs/api.md](docs/api.md)
- Security concerns → Update [docs/security.md](docs/security.md)
- Testing changes → Update [docs/testing.md](docs/testing.md)
- Common issues → Update [docs/troubleshooting.md](docs/troubleshooting.md)
- Preference changes → Update THIS file only

---

## Quality Gates

- Tests must pass before commit
- Critical business logic (stores) has comprehensive test coverage
- TypeScript strict mode
- ESLint + Prettier (zero errors)
- Pre-commit: `npm run lint && npm test && npm run typecheck`

---

**Stack:** Vue 3 + TypeScript, Vite, ViteSSG, @unhead/vue, Tailwind CSS, Pinia, Vitest
**Entry:** [src/main.ts](src/main.ts)
**Updated:** January 8, 2026 (Unified anchor highlights)
