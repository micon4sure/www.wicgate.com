# Troubleshooting Guide

Common issues and solutions for WiCGATE development.

---

## Build Issues

### Build Fails with "document is not defined"

**Error:**
```
ReferenceError: document is not defined
  at src/stores/appDataStore.ts:75:5
```

**Cause:** Missing SSR guards around browser API calls.

**Solution:** Add SSR guards around any code that uses `window`, `document`, `localStorage`, or `navigator`:

```typescript
// ❌ WRONG - Crashes during SSG build
export function useAppDataStore() {
  const intervalId = window.setInterval(fetchData, 90000); // ReferenceError!
}

// ✅ CORRECT - SSR-safe
export function useAppDataStore() {
  if (!import.meta.env.SSR) {
    const intervalId = window.setInterval(fetchData, 90000);
  }
}

// ✅ ALSO CORRECT - Guard entire function
function init() {
  if (import.meta.env.SSR) return; // Exit early during SSG

  // All browser code here is safe
  fetchData();
  window.setInterval(fetchData, 90000);
  document.addEventListener('visibilitychange', handleVisibility);
}
```

**Files commonly needing guards:**
- All stores (appDataStore.ts)
- All composables (useYoutube.ts, useEvents.ts, useFirstVisit.ts)
- Components using window/document/localStorage

**Reference:** [docs/architecture.md - SSR Guards](architecture.md#ssr-guards)

---

### Build Fails with "Cannot find module"

**Error:**
```
Error: Cannot find module '@/utils/scroll'
```

**Cause:** Missing alias configuration or incorrect import path.

**Solution:** Check that path aliases are configured in both `vite.config.ts` and `tsconfig.json`:

```typescript
// vite.config.ts
resolve: {
  alias: {
    '@': resolve(__dirname, './src'),
  },
}

// tsconfig.json
"paths": {
  "@/*": ["./src/*"]
}
```

---

### Deprecated Function Errors

**Error:**
```
Cannot find name 'getDynamicHeaderHeight'
  Property 'getDynamicHeaderHeight' does not exist
```

**Cause:** Attempting to use removed deprecated function.

**Solution:** Use the current function:

```typescript
// ❌ WRONG - Deprecated and removed (Oct 4, 2025)
import { getDynamicHeaderHeight } from '@/utils/scroll';
const height = getDynamicHeaderHeight();

// ✅ CORRECT - Current function
import { getHeaderHeightWithBuffer } from '@/utils/scroll';
const height = getHeaderHeightWithBuffer();
```

**Context:**
- `getDynamicHeaderHeight()` was a backward compatibility wrapper
- Marked `@deprecated` in code review
- Removed during code cleanup (October 4, 2025)
- All production code uses `getHeaderHeightWithBuffer()` directly

**Reference:** [docs/changelog.md - Code Review Cleanup](changelog.md#code-review-cleanup)

---

## Test Issues

### Tests Fail with "unexpected token" or "document is not defined"

**Error:**
```
SyntaxError: Unexpected token
  at node_modules/lodash/...
```

**Cause:** Using `bun test` instead of `bun run test`.

**Why this happens:**
- `bun test` invokes Bun's built-in test runner (not Vitest)
- Our tests use Vitest + Vue Test Utils + happy-dom
- Bun's runner doesn't understand Vitest syntax

**Solution:**
```bash
# ❌ WRONG
bun test              # Uses Bun's native test runner

# ✅ CORRECT
bun run test          # Executes package.json script → Vitest
npm test              # Also works (uses Vitest)
```

**Reference:** [docs/testing.md - Package Manager Comparison](testing.md#package-manager-comparison)

---

### Tests Pass Locally but Fail in CI

**Cause:** Using fake timers in tests that need real timing validation.

**Solution:** Run thorough mode locally to match CI behavior:

```bash
npm run test:thorough  # Uses real timers like CI
```

Check if test uses `vi.useFakeTimers()` and needs hybrid timing support:

```typescript
// Support both fake and real timers
if (!process.env.TEST_REAL_TIMERS) {
  vi.useFakeTimers();
}
```

**Reference:** [docs/testing.md - Hybrid Timing](testing.md#hybrid-timing-strategy)

---

### Coverage Below Threshold

**Error:**
```
ERROR: Coverage for lines (45%) does not meet threshold (50%)
```

**Cause:** New code added without corresponding tests.

**Solution:**
1. Check coverage report: `npm run test:coverage`
2. Open `coverage/index.html` in browser
3. Identify uncovered lines (highlighted in red)
4. Add tests for uncovered code paths

**Files exempt from coverage:**
- `*.test.ts` and `*.spec.ts` files
- `main.ts` (entry point)
- `env.d.ts` (type declarations)

---

## Styling Issues

### Styles Not Applying

**Cause:** CSS module not imported in `base.css`.

**Solution:** Ensure your CSS file is imported:

```bash
# 1. Create CSS module
touch src/assets/styles/modules/components/my-feature.css

# 2. Add to base.css
echo "@import './modules/components/my-feature.css';" >> src/assets/styles/base.css
```

**Verify import order in base.css:**
```css
/* Core foundation (first) */
@import './modules/variables.css';
@import './modules/reset.css';

/* Component modules (after foundation) */
@import './modules/components/my-feature.css';
```

**Reference:** [docs/design-system.md - Modular CSS](design-system.md#modular-css-architecture)

---

### Scroll Positioning is Off on Mobile

**Cause:** Hardcoded scroll values that don't account for dynamic header height.

**Solution:** Use the scroll utility instead of manual calculations:

```typescript
// ❌ WRONG - Hardcoded value breaks on mobile
const target = document.getElementById('statistics');
window.scrollTo({
  top: target.offsetTop - 120, // Breaks when header height changes!
  behavior: 'smooth'
});

// ✅ CORRECT - Dynamic measurement
import { scrollToSection } from '@/utils/scroll';
scrollToSection('statistics');
```

**Why it matters:**
- Header height varies by breakpoint (desktop vs tablet vs mobile)
- Mobile browsers have dynamic UI (address bar, toolbars)
- Hardcoded values cause misalignment

**Reference:** [docs/architecture.md - Navigation System](architecture.md#navigation-system)

---

### Design Token Not Working

**Cause:** Token doesn't exist or has typo.

**Solution:** Check token exists in `variables.css`:

```bash
# Find token definition
grep "var(--sw)" src/assets/styles/modules/variables.css
```

**Common token typos:**
- `--primary` (doesn't exist) → Use `--sw` (Massgate orange)
- `--text` (doesn't exist) → Use `--t` (primary text color)
- `--bg` (doesn't exist) → Use `--graphite` (background color)

**All tokens:** [src/assets/styles/modules/variables.css](../src/assets/styles/modules/variables.css)

**Reference:** [docs/design-system.md - Design Tokens](design-system.md#design-tokens)

---

## Type Errors

### Type Error After API Changes

**Error:**
```
Property 'newField' does not exist on type 'DataResponse'
```

**Cause:** TypeScript interfaces out of sync with API changes.

**Solution:** Update types in `src/api-types.ts`:

```typescript
// Add new field to interface
export interface DataResponse {
  servers: ServerEntry[];
  profiles: OnlineProfile[];
  newField: string; // Add this
  // ...
}
```

**Reference:** [docs/api.md - Type Definitions](api.md)

---

### Cannot Find Type Declaration

**Error:**
```
Could not find a declaration file for module 'some-package'
```

**Solution:**

1. Check if `@types/package-name` exists:
```bash
npm search @types/package-name
npm install -D @types/package-name
```

2. If no types available, create declaration:
```typescript
// src/types/package-name.d.ts
declare module 'package-name' {
  export function someFunction(): void;
}
```

---

## Environment Issues

### Environment Variables Not Loading

**Cause:** Missing `.env` file or wrong variable name.

**Solution:**

1. Check `.env` file exists (copy from `.env.example`):
```bash
cp .env.example .env
```

2. Verify variable name uses `VITE_` prefix:
```env
# ❌ WRONG - Missing VITE_ prefix
API_BASE=https://www.wicgate.com/api

# ✅ CORRECT - Has VITE_ prefix
VITE_API_BASE=https://www.wicgate.com/api
```

3. Restart dev server after `.env` changes:
```bash
# Kill server (Ctrl+C) and restart
npm run dev
```

**Reference:** [README.md - Environment Variables](../README.md#environment-variables)

---

## Runtime Errors

### "Cannot read property of undefined"

**Common scenarios:**

#### 1. API data not loaded yet

```typescript
// ❌ WRONG - No loading state check
const servers = store.data.servers; // undefined during loading!

// ✅ CORRECT - Check loading state
if (store.loading) return <SkeletonLoader />;
const servers = store.data.servers || [];
```

#### 2. Optional chaining needed

```typescript
// ❌ WRONG - Crashes if profile is null
const clanTag = player.profile.tagFormat.toUpperCase();

// ✅ CORRECT - Optional chaining
const clanTag = player.profile?.tagFormat?.toUpperCase() || '';
```

---

### Infinite Re-render Loop

**Cause:** State mutation in render or computed property.

**Solution:**

```typescript
// ❌ WRONG - Mutates state in computed
const sortedItems = computed(() => {
  items.value.sort(); // Mutates original array!
  return items.value;
});

// ✅ CORRECT - Create new array
const sortedItems = computed(() => {
  return [...items.value].sort(); // New array, doesn't mutate
});
```

---

## Performance Issues

### Slow Test Execution

**Cause:** Using real timers when fake timers would work.

**Solution:** Ensure hybrid timing support:

```typescript
// Add this at top of test file
if (!process.env.TEST_REAL_TIMERS) {
  vi.useFakeTimers();
}
```

**Run fast mode locally:**
```bash
npm test              # ~0.7s (fake timers)
npm run test:thorough # ~14s (real timers, for CI)
```

**Reference:** [docs/testing.md - Hybrid Timing](testing.md#hybrid-timing-strategy)

---

### Large Bundle Size

**Check bundle size:**
```bash
npm run build
# Check dist/ folder sizes and stats.html for bundle analysis
```

**Recent Optimizations (October 2025):**
- ✅ **Axios removed** (-13KB) - Now using native `fetch()` API
- ✅ **Lodash removed** (-70KB) - Replaced with native ES6 methods (flatMap, Object.values)
- ✅ **Debounced resize handlers** - Reduced event spam by 95%
- ✅ **RAF throttled scroll** - 60fps locked performance
- ✅ **Total savings:** ~83KB bundle reduction

**Current Bundle Stats:**
- Total dist: ~4.1MB (under 5MB limit ✓)
- Core JS/CSS: ~27KB
- Main dependencies: Vue 3, Vue Router (no heavy libs)

**If bundle size increases:**

**Common causes:**
1. New unused dependencies imported
2. Large images not optimized
3. Duplicate imports across routes

**Solution:**
```typescript
// ❌ WRONG - Would import entire library (if any heavy libs added)
import _ from 'some-heavy-library';

// ✅ CORRECT - Import specific functions only
import { specificFunction } from 'some-heavy-library';

// ✅ EVEN BETTER - Use native alternatives
const unique = [...new Set(array)]; // Instead of _.uniq()
const values = Object.values(obj);   // Instead of _.values()
const flattened = arr.flatMap(x => x); // Instead of _.flatMap()
```

**Verification:**
```bash
npm run build
# Check bundle output
ls -lh dist/assets/*.js
```

**Reference:** [docs/changelog.md - Performance & Bundle Optimization](changelog.md#performance--bundle-optimization)

---

## Git Issues

### Pre-commit Hook Fails

**Cause:** Quality gates failing (lint, tests, type check).

**Solution:** Fix issues before committing:

```bash
# Run all quality gates manually
npm run lint:fix      # Auto-fix lint issues
npm test              # Run tests
npx tsc --noEmit      # Type check

# Check what failed
git commit -m "feat: something"
# Read error message to see which gate failed
```

**Skip hooks (NOT recommended):**
```bash
git commit --no-verify  # Skips hooks (use only in emergencies)
```

---

### CRLF Line Ending Warnings

**Error:**
```
warning: LF will be replaced by CRLF
```

**Cause:** Windows line endings (CRLF) instead of Unix (LF).

**Solution:**

1. Configure Git to use LF:
```bash
git config core.autocrlf false
```

2. Fix existing files:
```bash
# Convert CRLF → LF
npm run format
```

3. Verify `.editorconfig`:
```ini
[*]
end_of_line = lf
```

---

## Quick Diagnostic Commands

```bash
# Check Node/npm versions
node --version
npm --version

# Clear all caches
rm -rf node_modules package-lock.json
npm install

# Reset build artifacts
rm -rf dist .vite

# Check for TypeScript errors
npx tsc --noEmit

# Run all quality gates
npm run lint && npm test && npx tsc --noEmit
```

---

## Known Issues

### Development Server Vulnerability (Non-Critical)

**CVE:** [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99)

**Component:** esbuild ≤0.24.2 (bundled with Vite 5.4.20)

**Impact:**
- Affects **development server only** (production builds unaffected)
- Potential security risk when running `npm run dev` on untrusted networks
- Does not affect deployed sites or production builds

**Mitigation Strategies:**
1. **Use trusted networks** when running development server
2. **Avoid public WiFi** during development
3. **Firewall protection** - Ensure dev server (port 5173) not exposed externally
4. **Local development only** - Never expose dev server to internet

**Status:**
- Monitoring for Vite 5.x maintenance patch
- Vite 6.x upgrade planned (breaking changes require testing)
- Production builds remain secure and unaffected

**Verification:**
```bash
# Check if dev server is exposed (should only show localhost)
npm run dev
# Output should show: http://localhost:5173
# NOT: http://0.0.0.0:5173 or http://192.168.x.x:5173
```

**Additional Context:**
- This vulnerability only affects the **build tooling**, not the application code
- GitHub Actions CI/CD runs in isolated environment (unaffected)
- Deployed sites use static HTML + optimized assets (no esbuild runtime)

---

## Getting Help

If issue persists:

1. Check [docs/architecture.md](architecture.md) for technical details
2. Check [docs/design-system.md](design-system.md) for styling patterns
3. Check [docs/api.md](api.md) for API issues
4. Check [docs/testing.md](testing.md) for test issues
5. Review [GUIDE.md](../GUIDE.md) for essential patterns
6. Check [CLAUDE.md](../CLAUDE.md) for mandatory constraints

---

*Last Updated: October 3, 2025*
