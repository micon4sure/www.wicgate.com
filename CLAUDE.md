# CLAUDE.md – Agent Preferences

> **Auto-read by AI agents.** Personal preferences that override default behavior. Read [GUIDE.md](GUIDE.md) for complete documentation.

## Documentation

**Start here:** [GUIDE.md](GUIDE.md) - Complete agent guide with detailed patterns and examples

## Commands

```bash
npm run dev          # Dev server (localhost:5173)
npm test             # Fast tests (~0.7s, fake timers)
npm run test:thorough # Thorough tests (~14s, real timers, for CI)
npm run lint:fix     # Fix linting issues
npm run build        # Production build (SSG + PWA)
```

**Package Manager:** Use `bun run test` (NOT `bun test` - wrong runner)

---

## Mandatory Constraints (NO EXCEPTIONS)

1. ✅ ALWAYS use Tailwind utility classes for styling
2. ✅ Design tokens live in `tailwind.config.ts` (colors, spacing, fonts)
3. ❌ NEVER use hardcoded scroll offsets → ✅ ALWAYS use `pt-[var(--header-height)]`
4. ❌ NEVER use browser APIs without SSR guards
5. ✅ ALWAYS use Pinia for state management (stores in `src/stores/`)
6. ❌ NEVER commit CRLF line endings (LF only)
7. ❌ NEVER use `bun test` → ✅ ALWAYS use `bun run test`
8. ❌ NEVER use `any` types → ✅ ALWAYS use typed errors from `types/errors.ts`
9. ❌ NEVER duplicate logic → ✅ ALWAYS use composables (`useServerCapacity`, `usePlayerDisplay`, etc.)

---

## Styling Philosophy

**Tailwind-First Approach:**
- Use Tailwind utility classes directly in templates for 95% of styling
- Only create custom CSS when truly necessary (complex animations, very specific states)
- Design tokens defined in `tailwind.config.ts`, not CSS variables (except `--header-height` for JS sync)
- Use `@layer components` sparingly for truly reusable component patterns only
- Prefer inline utilities over semantic CSS classes for maintainability and visibility

---

## Workflow Preferences

**When you make changes:**
- Architecture → Update [docs/architecture.md](docs/architecture.md)
- Design patterns → Update [docs/design-system.md](docs/design-system.md)
- New features → Update [docs/changelog.md](docs/changelog.md)
- API changes → Update [docs/api.md](docs/api.md)
- Testing changes → Update [docs/testing.md](docs/testing.md)
- Common issues → Update [docs/troubleshooting.md](docs/troubleshooting.md)
- Preference changes → Update THIS file only

---

## Quality Gates

- 50%+ test coverage (enforced)
- Tests must pass before commit
- TypeScript strict mode
- ESLint + Prettier (zero errors)
- Pre-commit: `npm run lint && npm test && npx tsc --noEmit`

---

**Stack:** Vue 3 + TypeScript, Vite, ViteSSG, Tailwind CSS, Pinia, Vitest
**Entry:** [src/main.ts](src/main.ts)
**Updated:** October 13, 2025
