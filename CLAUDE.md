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

1. ❌ NEVER use hardcoded colors → ✅ ALWAYS use `var(--token)`
2. ❌ NEVER use hardcoded scroll values → ✅ ALWAYS use `scrollToSection()`
3. ❌ NEVER use browser APIs without SSR guards
4. ❌ NEVER use Pinia (this project uses composable modules)
5. ❌ NEVER commit CRLF line endings (LF only)
6. ❌ NEVER use `bun test` → ✅ ALWAYS use `bun run test`
7. ❌ NEVER use `any` types → ✅ ALWAYS use typed errors from `types/errors.ts`
8. ❌ NEVER duplicate logic → ✅ ALWAYS use composables (`useServerCapacity`, `usePlayerDisplay`, etc.)

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

**Stack:** Vue 3 + TypeScript, Vite, ViteSSG, Composable Modules, Vitest
**Entry:** [src/main.ts](src/main.ts)
**Updated:** October 10, 2025
