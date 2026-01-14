# Troubleshooting Guide

> **⚠️ UPDATE (October 2025):** Scroll-related issues resolved by native scroll system. Old programmatic scroll troubleshooting no longer relevant. See [Architecture](architecture.md#native-scroll--navigation-system-october-2025) for current implementation.

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
- All stores (appDataStore.ts, youtubeStore.ts, calendarStore.ts)
- All composables (useFirstVisit.ts, useTwitchStreams.ts)
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

### Tailwind Classes Not Applying *(Updated Oct 12, 2025)*

**Cause:** Class not defined in Tailwind config or typo in class name.

**Solution:**

1. **Check class exists in Tailwind config:**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'soviet': '#ff6600', // Custom color
      }
    }
  }
}
```

2. **Verify class spelling:**
```vue
<!-- ❌ WRONG - Typo -->
<div class="text-sovit">...</div>

<!-- ✅ CORRECT -->
<div class="text-soviet">...</div>
```

3. **Check Tailwind is imported:**
```typescript
// src/main.ts
import './assets/styles/tailwind.css'; // Must be imported
```

4. **Restart dev server after config changes:**
```bash
npm run dev
```

**Common Issues:**
- Custom color not in `tailwind.config.ts` → Add to `theme.extend.colors`
- Opacity modifier on custom shadow (e.g., `shadow-soviet-glow/50`) → Use manual CSS
- Missing responsive prefix (e.g., `block` instead of `hidden md:block`)

**Reference:** [docs/design-system.md - Tailwind Best Practices](design-system.md#tailwind-best-practices)

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

### Design Token Not Working *(Updated Oct 12, 2025)*

**Cause:** Token doesn't exist in Tailwind config or wrong syntax.

**Solution:** Check token exists in `tailwind.config.ts`:

```typescript
// Check color definitions
export default {
  theme: {
    extend: {
      colors: {
        'soviet': '#ff6600',           // ✅ Use: text-soviet, bg-soviet
        'mg': '#1a2633',                // ✅ Use: bg-mg, border-mg/70
        'massgate-red': '#e53935',      // ✅ Use: text-massgate-red
      }
    }
  }
}
```

**Common token issues:**
- Using CSS variable syntax (`var(--sw)`) → Use Tailwind class (`text-soviet`)
- Token doesn't exist → Add to `tailwind.config.ts`
- Wrong token name → Check spelling in config

**Common fixes:**
```vue
<!-- ❌ WRONG - CSS variable syntax (old approach) -->
<div style="color: var(--sw)">...</div>

<!-- ✅ CORRECT - Tailwind utility class -->
<div class="text-soviet">...</div>

<!-- ❌ WRONG - Token doesn't exist -->
<div class="text-primary">...</div>

<!-- ✅ CORRECT - Use defined token -->
<div class="text-soviet">...</div>
```

**All tokens:** [tailwind.config.ts](../tailwind.config.ts)

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

### Error Type Issues *(Phase 2.1 - Oct 10, 2025)*

**Error:**
```
Property 'statusCode' does not exist on type 'Error'
```

**Cause:** Using typed error classes but catching as generic Error.

**Solution:** Use type guards from `src/types/errors.ts`:

```typescript
// ❌ WRONG - Generic Error type
try {
  await fetchData();
} catch (err) {
  console.error(err.statusCode); // Error: Property doesn't exist!
}

// ✅ CORRECT - Use type guards
import { isApiError, isNetworkError } from '@/types/errors';

try {
  await fetchData();
} catch (err) {
  if (isApiError(err)) {
    console.error(`API Error (${err.endpoint}): HTTP ${err.statusCode}`);
  } else if (isNetworkError(err)) {
    console.error(`Network Error: ${err.message}`);
  } else {
    console.error('Unknown error:', err);
  }
}
```

**Available error types:**
- `ApiError` - HTTP errors with endpoint and status code
- `NetworkError` - Network failures (timeout, offline, DNS)
- `ValidationError` - Data validation failures
- `StorageError` - localStorage/quota errors

**Reference:** [docs/architecture.md - Error Types](architecture.md#error-types-phase-21)

---

### Utility Type Errors *(Phase 5.1 - Oct 10, 2025)*

**Error:**
```
Type 'string | null' is not assignable to type 'string'
```

**Cause:** Missing null/undefined handling.

**Solution:** Use utility types from `src/types/utils.ts`:

```typescript
// ❌ WRONG - Type mismatch
const name: string = localStorage.getItem('name'); // Returns string | null!

// ✅ CORRECT - Use Nullable type
import { Nullable } from '@/types/utils';

const name: Nullable<string> = localStorage.getItem('name');
if (name !== null) {
  console.log(name.toUpperCase()); // Safe now
}

// ✅ ALSO CORRECT - Use type guard
import { isDefined } from '@/types/utils';

const name = localStorage.getItem('name');
if (isDefined(name)) {
  console.log(name.toUpperCase()); // TypeScript knows it's string
}
```

**Available utility types:**
- `Nullable<T>`, `Optional<T>`, `Maybe<T>` - Handle null/undefined
- `ReadonlyDeep<T>`, `Mutable<T>` - Deep readonly operations
- `ApiResponse<T>`, `PaginatedResponse<T>` - API types
- Type guards: `isDefined()`, `isString()`, `isNumber()`, etc.

**Reference:** [docs/architecture.md - Utility Types](architecture.md#utility-types-phase-51)

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

## Pinia Store Issues *(Oct 13, 2025)*

### Store Data Not Reactive

**Symptom:** UI doesn't update when store data changes.

**Error:**
```typescript
// Component shows stale data, doesn't update on changes
const { data, loading } = useAppDataStore();
```

**Cause:** Destructuring from Pinia stores breaks reactivity.

**Solution:** Access store properties directly or use `storeToRefs()`:

```typescript
// ❌ WRONG - Loses reactivity
import { useAppDataStore } from '@/stores/appDataStore';

const { data, loading } = useAppDataStore(); // Static snapshot!

// ✅ CORRECT Option 1 - Direct access
const store = useAppDataStore();
// Use store.data, store.loading in template

// ✅ CORRECT Option 2 - storeToRefs()
import { storeToRefs } from 'pinia';
const { data, loading } = storeToRefs(store);
// Now data and loading are reactive
```

**Why this happens:**
- Destructuring creates static snapshots of current values
- Vue's reactivity system can't track changes to destructured values
- Store properties must be accessed via the store object to remain reactive

**Template usage:**
```vue
<template>
  <!-- ❌ WRONG - Won't update -->
  <div v-if="loading">Loading...</div>
  <div>{{ data.servers }}</div>

  <!-- ✅ CORRECT - Reactive -->
  <div v-if="store.loading">Loading...</div>
  <div>{{ store.data.servers }}</div>
</template>

<script setup lang="ts">
const store = useAppDataStore();
// Don't destructure!
</script>
```

**Reference:** [GUIDE.md - Pinia Reactivity](../GUIDE.md#state-management-pinia-stores-updated-oct-13-2025)

---

### Pinia Store Not Initialized in Tests

**Error:**
```
getActivePinia was called with no active Pinia. Did you forget to install pinia?
```

**Cause:** Tests need a Pinia instance set up before using stores.

**Solution:** Create fresh Pinia instance in test setup:

```typescript
import { setActivePinia, createPinia } from 'pinia';
import { useAppDataStore } from './appDataStore';

describe('appDataStore', () => {
  beforeEach(() => {
    // Create fresh Pinia instance for each test
    setActivePinia(createPinia());
  });

  it('should initialize with default state', () => {
    const store = useAppDataStore();

    expect(store.data).toEqual({});
    expect(store.loading).toBe(false);
  });
});
```

**For auth tests with localStorage:**
```typescript
beforeEach(() => {
  setActivePinia(createPinia());

  // Mock localStorage
  global.localStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  } as any;
});
```

**Reference:** [docs/testing.md - Authentication Store Tests](testing.md#authentication-store-test-suite-pinia)

---

### Auth Store Not Persisting Session

**Symptom:** User gets logged out on page refresh.

**Cause:** Session restoration not called on app initialization.

**Solution:** Ensure `checkAuth()` is called in app entry point:

```typescript
// src/views/Home.vue or main.ts
import { useAuthStore } from '@/stores/auth';

onMounted(() => {
  const authStore = useAuthStore();
  authStore.checkAuth(); // Restores session from localStorage
});
```

**Check localStorage:**
```javascript
// In browser console
localStorage.getItem('wicgate_auth_token');
// Should show: "mock_jwt_admin_1234567890" or similar
```

**Reference:** [docs/api.md - Authentication Integration](api.md#authentication-integration-authstore)

---

### Cannot Access Store in Route Guards

**Error:**
```
Cannot call useAuthStore() before app is initialized
```

**Cause:** Pinia not installed before router is created.

**Solution:** Ensure Pinia is added to app before router in `main.ts`:

```typescript
// ❌ WRONG - Router before Pinia
app.use(router);
app.use(pinia);

// ✅ CORRECT - Pinia before router
import { createPinia } from 'pinia';

const pinia = createPinia();
app.use(pinia);  // Must come first!
app.use(router); // Router can now use stores in guards
```

**Route guard pattern:**
```typescript
// src/router/routes.ts
import { useAuthStore } from '../stores/auth';

{
  path: '/admin',
  beforeEnter: (_to, _from, next) => {
    const authStore = useAuthStore(); // Works because Pinia is installed
    if (!authStore.isAuthenticated) {
      next({ name: 'login' });
    } else {
      next();
    }
  }
}
```

**Reference:** [docs/architecture.md - State Management](architecture.md#state-management)

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

## Refactoring-Related Issues *(Oct 10, 2025 Refactoring)*

### Cannot Find Composable

**Error:**
```
Cannot find module '@/composables/useServerCapacity'
Module '"@/composables/useServerCapacity"' has no exported member 'getCapacityColor'
```

**Cause:** Trying to import function directly instead of using composable pattern.

**Solution:** Use the composable correctly:

```typescript
// ❌ WRONG - Direct import doesn't exist
import { getCapacityColor } from '@/composables/useServerCapacity';

// ✅ CORRECT - Use composable pattern
import { useServerCapacity } from '@/composables/useServerCapacity';

const { getCapacityColor, getCapacityLabel, getCapacityPercentage } = useServerCapacity();
const color = getCapacityColor(12, 16); // Returns color token
```

**Available composables (Phase 1 & 3):**
- `useServerCapacity` - Server capacity colors and labels
- `usePlayerDisplay` - Player name parsing, colorization, grouping
- `useActiveSection` - Scroll state management
- `useSectionObserver` - IntersectionObserver for scroll detection

**Reference:** [docs/architecture.md - Composables](architecture.md#composables)

---

### Widget Component Not Rendering

**Error:**
```
Failed to resolve component: QuickStartWidget
```

**Cause:** Widget components moved to separate files (Phase 3.2).

**Solution:** Import widget components explicitly:

```typescript
// ❌ WRONG - Components not global
<QuickStartWidget /> // Won't work without import

// ✅ CORRECT - Import widget components
import QuickStartWidget from '@/components/widgets/QuickStartWidget.vue';
import LiveServersWidget from '@/components/widgets/LiveServersWidget.vue';

// Then use in template
<QuickStartWidget />
<LiveServersWidget />
```

**Available widget components (Phase 3.2):**
- `WidgetBase.vue` - Base widget structure (wrap content)
- `QuickStartWidget.vue` - Installation quick links
- `LiveServersWidget.vue` - Real-time server status
- `TopPlayersWidget.vue` - Leaderboard preview
- `CommunityWidget.vue` - Discord events
- `LatestVideosWidget.vue` - YouTube videos
- `GettingHelpWidget.vue` - FAQ/support links

**Reference:** [docs/design-system.md - Widget Components](design-system.md#widget-components-phase-32)

---

### Feature Flag Not Working

**Error:**
```
Cannot find name 'isFeatureEnabled'
Feature always returns false
```

**Cause:** Feature flag system introduced in Phase 5.3.

**Solution:** Import and use feature flags correctly:

```typescript
// ✅ CORRECT - Check if feature is enabled
import { isFeatureEnabled } from '@/utils/features';

if (isFeatureEnabled('intersection-observer')) {
  // Use IntersectionObserver
} else {
  // Fallback to scroll listeners
}
```

**Development/testing:**
```typescript
// Enable feature for testing (localStorage override)
import { setFeatureOverride } from '@/utils/features';

setFeatureOverride('experimental-search', true);

// Or use console in browser (DEV mode only)
window.features.enable('dark-mode');
window.features.list(); // Show all features
```

**Available feature flags:**
- Performance: `intersection-observer`, `memoized-sorting`, `lazy-widgets`
- UI: `enhanced-statistics`, `player-profiles`, `dark-mode`
- Experimental: `experimental-search`, `beta-notifications`, `analytics`
- Debug: `debug-mode`, `verbose-logging`

**Reference:** [docs/architecture.md - Feature Flag System](architecture.md#featurests-phase-53)

---

### Memoization Cache Not Working

**Cause:** Memoization utilities added in Phase 4.

**Solution:** Use memoization utilities correctly:

```typescript
// ✅ CORRECT - Memoize expensive operations
import { memoizeWithDeps } from '@/utils/memoize';

const sortedVideos = memoizeWithDeps(
  (videos: Video[]) => [...videos].sort((a, b) => b.views - a.views),
  (videos) => [videos.length] // Only recompute when length changes
);

// Use it
const result = sortedVideos(allVideos);
```

**Available memoization utilities:**
- `MemoCache<T>` - TTL-based caching class
- `memoizeWithDeps()` - React useMemo-style memoization
- `memoize()` - Simple single-argument memoizer
- `memoizeJson()` - Object argument memoizer

**Reference:** [docs/architecture.md - Memoization Utilities](architecture.md#memoizets-phase-4)

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

*Last Updated: October 13, 2025 (Pinia Migration)*
