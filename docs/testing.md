# Testing Documentation

> **⚠️ UPDATE (October 2025):** Scroll utility tests removed as part of native scroll system refactor. Browser handles scrolling natively now. See [Changelog](changelog.md) for details.

## Overview

WiCGATE uses a comprehensive testing infrastructure with **Vitest** and **Vue Test Utils** for component and utility testing. The test suite implements a hybrid timing strategy for optimal development speed and CI thoroughness.

## Test Suite Statistics

- **Total Tests:** 44 comprehensive tests
- **Coverage:** 50%+ (enforced thresholds)
- **Execution Time:** ~0.7s (fast mode) / ~14s (thorough mode)
- **Test Files:** 3 primary test suites
  - `usePlayerDisplay.test.ts` - 10 tests covering player display utilities
  - `appDataStore.test.ts` - 15 tests covering API data store (Pinia)
  - `auth.test.ts` - 19 tests covering authentication store (Pinia)

## Test Frameworks & Tools

### Core Testing Stack

```json
{
  "vitest": "^2.1.8",           // Fast unit test framework
  "vue-test-utils": "^2.4.6",   // Vue component testing
  "happy-dom": "^15.11.6",      // Fast DOM simulation
  "@vitest/coverage-v8": "^2.1.8", // Coverage reporting
  "@vitest/ui": "^2.1.8"        // Web UI for debugging
}
```

### Framework Features

- **Vitest:** ESM-native, Vite-powered, blazing fast execution
- **Vue Test Utils:** Official Vue testing utilities, full Composition API support
- **happy-dom:** Lightweight DOM implementation (faster than jsdom)
- **Coverage:** V8 native coverage with line/branch/function/statement metrics

## Test Commands

### Quick Reference

```bash
# Fast mode (default) - Uses fake timers
npm test                 # ~0.7s execution
bun run test             # ~0.57s (22% faster with Bun)

# Thorough mode - Uses real timers for CI
npm run test:thorough    # ~14s execution
bun run test:thorough    # ~14.8s with Bun

# Development workflows
npm run test:watch       # Watch mode for TDD
npm run test:ui          # Vitest UI at http://localhost:51204
npm run test:coverage    # Generate coverage report

# Type checking
npx tsc --noEmit         # TypeScript validation
```

### ⚠️ Important: Bun Test Gotcha

```bash
# ❌ WRONG - Uses Bun's native test runner (incompatible)
bun test

# ✅ CORRECT - Uses Vitest via package.json script
bun run test
```

**Why:**
- `bun test` invokes Bun's **built-in test runner** (not Vitest)
- Results in "document is not defined" errors and 54 failures
- **Always use `bun run test`** to execute the package.json script correctly
- `bun run` works with all scripts: `bun run dev`, `bun run build`, etc.

## Package Manager Comparison

### npm vs Bun for Testing

**Both package managers work perfectly - choose based on preference:**

#### npm (Standard - Maximum Compatibility)

```bash
npm test              # Fast mode: ~0.7s
npm run test:thorough # Thorough mode: ~14s
```

**Pros:**
- Maximum compatibility across environments
- Standard Node.js package manager
- Widely documented and supported

**Use When:**
- Working in team environments
- Requiring maximum stability
- Following standard Node.js workflows

#### Bun (Optional - 22% Faster)

```bash
bun run test          # Fast mode: ~0.57s (22% faster!)
bun run test:thorough # Thorough mode: ~14.8s
```

**Pros:**
- 22% faster test execution
- Modern JavaScript runtime
- Growing ecosystem support

**Use When:**
- Speed is a priority
- Working on personal/small projects
- Comfortable with newer tooling

## Hybrid Timing Strategy

### Overview

The test suite uses **environment-aware timing** to balance speed and thoroughness. This optimization provides 21x faster local development while maintaining full validation in CI.

### Fast Mode (Default - Local Development)

```bash
npm test  # Completes in ~0.7s
```

**Features:**
- **Fake timers** via `vi.useFakeTimers()` for instant test execution
- Retry tests simulate 7 seconds of delays in ~20ms
- **21x faster** than real timing
- Perfect for TDD workflow and rapid iteration

**Implementation:**
```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

beforeEach(() => {
  // Only use fake timers if not in thorough mode
  if (!process.env.TEST_REAL_TIMERS) {
    vi.useFakeTimers();
  }
});

afterEach(() => {
  if (!process.env.TEST_REAL_TIMERS) {
    vi.runAllTimers();
    vi.useRealTimers();
  }
});

it('should retry API call with exponential backoff', async () => {
  // Test implementation...

  if (!process.env.TEST_REAL_TIMERS) {
    // Fast mode: Advance timers instantly
    await vi.advanceTimersByTimeAsync(7000);
  } else {
    // Thorough mode: Wait for real delays
    await new Promise(resolve => setTimeout(resolve, 7000));
  }
});
```

### Thorough Mode (CI/Production Validation)

```bash
npm run test:thorough  # Completes in ~14s
```

**Features:**
- **Real timers** validate actual retry delays (1s, 2s, 4s exponential backoff)
- Ensures timing-dependent code behaves correctly
- Automatically used in GitHub Actions CI workflows
- Catches timing bugs that fake timers might miss

**Package.json Configuration:**
```json
{
  "scripts": {
    "test": "vitest run",
    "test:thorough": "cross-env TEST_REAL_TIMERS=true vitest run"
  }
}
```

### Cross-Platform Compatibility

**Package:** `cross-env` ensures environment variables work on Windows/Mac/Linux

```bash
# Works identically on all platforms
npm run test:thorough
```

## Test Coverage

### Coverage Thresholds

**File:** [vitest.config.ts](../vitest.config.ts)

```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  include: ['src/**/*.{ts,vue}'],
  exclude: [
    'node_modules/',
    'src/**/*.spec.ts',
    'src/**/*.test.ts',
  ],
  thresholds: {
    lines: 50,
    functions: 50,
    branches: 50,
    statements: 50
  }
}
```

### Coverage Reports

```bash
npm run test:coverage
```

**Output:**
- **Terminal:** Text summary with color-coded coverage
- **HTML:** Detailed report in `coverage/index.html`
- **JSON:** Machine-readable data in `coverage/coverage-final.json`

### Current Coverage Statistics

```
File                    | Lines  | Branches | Functions | Statements
------------------------|--------|----------|-----------|------------
src/utils/scroll.ts     | 85.7%  | 75.0%    | 100%      | 85.7%
src/stores/appDataStore | 68.4%  | 61.5%    | 71.4%     | 68.4%
------------------------|--------|----------|-----------|------------
All files               | 76.2%  | 67.8%    | 84.6%     | 76.2%
```

## Test Suites

### Scroll Utilities Test Suite

**File:** [src/utils/scroll.test.ts](../src/utils/scroll.test.ts)

**Tests:** 11 comprehensive tests

**Coverage Areas:**
- `getNavHeight()` - Header measurement with SSR fallbacks
- `getHeaderHeightWithBuffer()` - Buffer calculation for mobile/desktop
- `scrollToSection()` - Pixel-perfect scroll positioning
- Edge cases: Missing elements, SSR environment, mobile detection

**Note:** Previously had 12 tests - removed 1 deprecated function test during code cleanup (Oct 4, 2025)

**Key Test Patterns:**

```typescript
describe('getNavHeight', () => {
  it('should return actual header height when available', () => {
    const mockHeader = { getBoundingClientRect: () => ({ height: 100 }) };
    document.querySelector = vi.fn().mockReturnValue(mockHeader);

    expect(getNavHeight()).toBe(100);
  });

  it('should return fallback height in SSR context', () => {
    document.querySelector = vi.fn().mockReturnValue(null);

    expect(getNavHeight()).toBe(80); // SSR fallback
  });
});
```

### Data Store Test Suite (Pinia)

**File:** [src/stores/appDataStore.test.ts](../src/stores/appDataStore.test.ts)

**Tests:** 15 comprehensive tests

**Coverage Areas:**
- State initialization and defaults
- API fetching with retry logic
- Exponential backoff (1s, 2s, 4s delays)
- Error handling and recovery
- Page Visibility API integration
- SSR guards and safety checks

**Key Test Patterns:**

```typescript
import { setActivePinia, createPinia } from 'pinia';

describe('appDataStore', () => {
  beforeEach(() => {
    // Create fresh Pinia instance for each test
    setActivePinia(createPinia());
  });

  it('should retry failed requests with exponential backoff', async () => {
    global.fetch = vi.fn()
      .mockRejectedValueOnce(new Error('Network error')) // Attempt 1
      .mockRejectedValueOnce(new Error('Network error')) // Attempt 2
      .mockRejectedValueOnce(new Error('Network error')) // Attempt 3
      .mockResolvedValueOnce({ ok: true, json: async () => mockData }); // Success

    const store = useAppDataStore();
    await store.fetchData();

    expect(global.fetch).toHaveBeenCalledTimes(4);
    expect(store.data).toEqual(mockData);
  });
});
```

**Important:** Pinia stores expose refs directly (no `.value` needed in tests)

---

### Authentication Store Test Suite (Pinia)

**File:** [src/stores/auth.test.ts](../src/stores/auth.test.ts)

**Tests:** 19 comprehensive tests

**Coverage Areas:**
- Initial state verification
- Login with admin and user credentials
- Login failure handling (invalid credentials)
- Logout functionality
- Session restoration from localStorage
- Invalid/expired token handling
- SSR guards for auth operations
- Computed properties (isAuthenticated, isAdmin, userName)
- Session persistence across "page reloads"

**Key Test Patterns:**

```typescript
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from './auth';

describe('auth store', () => {
  let authStore: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    authStore = useAuthStore();

    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    } as any;

    // Use fake timers for mock API delays
    if (!process.env.TEST_REAL_TIMERS) {
      vi.useFakeTimers();
    }
  });

  it('should login successfully with admin credentials', async () => {
    const loginPromise = authStore.login({
      username: 'admin',
      password: 'admin123'
    });

    // Fast-forward mock delay
    if (!process.env.TEST_REAL_TIMERS) {
      await vi.advanceTimersByTimeAsync(500);
    }

    await loginPromise;

    expect(authStore.currentUser).toEqual({
      username: 'admin',
      role: 'admin'
    });
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.isAdmin).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'wicgate_auth_token',
      expect.stringContaining('mock_jwt_admin')
    );
  });

  it('should persist session across page reloads', async () => {
    // Login first
    await authStore.login({ username: 'admin', password: 'admin123' });
    const token = authStore.authToken;

    // Simulate page reload with fresh Pinia instance
    setActivePinia(createPinia());
    const newStore = useAuthStore();

    // Mock localStorage returning the token
    (localStorage.getItem as any).mockReturnValue(token);

    // Restore session
    await newStore.checkAuth();

    expect(newStore.isAuthenticated).toBe(true);
    expect(newStore.currentUser?.username).toBe('admin');
  });
});
```

**Testing Mock JWT:**
- Mock token format: `mock_jwt_{username}_{timestamp}`
- Mock delays: 500ms for login, 200ms for token validation
- Mock localStorage for session persistence testing

## SSR-Safe Test Mocks

### DOM Mocking for SSR Tests

```typescript
// Mock SSR environment
const mockSSR = () => {
  const originalDocument = global.document;
  global.document = undefined as any;

  return () => {
    global.document = originalDocument;
  };
};

it('should handle SSR gracefully', () => {
  const restore = mockSSR();

  // Test SSR behavior
  expect(getNavHeight()).toBe(80); // Fallback

  restore();
});
```

### API Mocking

```typescript
beforeEach(() => {
  // Mock fetch globally
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ players: 42 })
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
```

### Timer Mocking (Hybrid Strategy)

```typescript
beforeEach(() => {
  if (!process.env.TEST_REAL_TIMERS) {
    vi.useFakeTimers();
  }
});

afterEach(() => {
  if (!process.env.TEST_REAL_TIMERS) {
    vi.runAllTimers();
    vi.useRealTimers();
  }
});

it('should delay retry attempts', async () => {
  // Setup failing fetch
  global.fetch = vi.fn().mockRejectedValue(new Error('Fail'));

  const promise = store.fetchData();

  if (!process.env.TEST_REAL_TIMERS) {
    // Fast mode: Instant timer advancement
    await vi.advanceTimersByTimeAsync(7000); // 1s + 2s + 4s
  } else {
    // Thorough mode: Real delay
    await new Promise(resolve => setTimeout(resolve, 7000));
  }

  await promise;
  expect(global.fetch).toHaveBeenCalledTimes(4); // Initial + 3 retries
});
```

## CI/CD Integration

### GitHub Actions Configuration

**File:** [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)

```yaml
- name: Run tests
  run: npm run test:thorough  # Uses real timers for production validation

- name: Run linter
  run: npm run lint

- name: Type check
  run: npx tsc --noEmit

- name: Build
  run: npm run build
```

### Pull Request Checks

**File:** [.github/workflows/pr-checks.yml](../.github/workflows/pr-checks.yml)

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests (thorough mode)
        run: npm run test:thorough

      - name: Coverage check
        run: npm run test:coverage
```

### Quality Gates

Tests must pass before:
- ✅ Merging pull requests
- ✅ Deploying to production
- ✅ Creating release tags

## Test-Driven Development (TDD)

### Recommended Workflow

```bash
# Start watch mode in terminal
npm run test:watch

# Make code changes in editor
# Tests auto-run on file save
# Get instant feedback

# Optional: Open Vitest UI for debugging
npm run test:ui
```

### Vitest UI Features

Access at `http://localhost:51204` when running `npm run test:ui`

- **Visual test runner** with file tree
- **Real-time execution** with instant feedback
- **Stack trace inspection** with source maps
- **Coverage visualization** per file
- **Filter controls** for focused testing

## Writing New Tests

### Test File Naming Convention

```
src/
├── utils/
│   ├── scroll.ts
│   └── scroll.test.ts        # *.test.ts suffix
├── stores/
│   ├── appDataStore.ts
│   └── appDataStore.test.ts
└── components/
    ├── Navigation.vue
    └── Navigation.spec.ts    # *.spec.ts also supported
```

### Test Template

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup fake timers if not in thorough mode
    if (!process.env.TEST_REAL_TIMERS) {
      vi.useFakeTimers();
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();

    if (!process.env.TEST_REAL_TIMERS) {
      vi.runAllTimers();
      vi.useRealTimers();
    }
  });

  it('should do something', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

### Vue Component Test Template

```typescript
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import MyComponent from './MyComponent.vue';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const wrapper = mount(MyComponent, {
      props: { title: 'Test' }
    });

    expect(wrapper.text()).toContain('Test');
    expect(wrapper.find('.component-class').exists()).toBe(true);
  });

  it('should emit events on interaction', async () => {
    const wrapper = mount(MyComponent);

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')![0]).toEqual(['payload']);
  });
});
```

## Best Practices

### 1. Hybrid Timing Awareness

```typescript
// ✅ GOOD: Supports both modes
if (!process.env.TEST_REAL_TIMERS) {
  await vi.advanceTimersByTimeAsync(1000);
} else {
  await new Promise(resolve => setTimeout(resolve, 1000));
}

// ❌ BAD: Only works in fake timer mode
await vi.advanceTimersByTimeAsync(1000);
```

### 2. SSR Safety

```typescript
// ✅ GOOD: Handles SSR gracefully
const element = document?.querySelector('header');
if (!element) return FALLBACK_VALUE;

// ❌ BAD: Crashes in SSR
const element = document.querySelector('header');
return element.getBoundingClientRect().height;
```

### 3. Mock Cleanup

```typescript
// ✅ GOOD: Clean up in afterEach
afterEach(() => {
  vi.restoreAllMocks();
});

// ❌ BAD: Mocks persist across tests
// (No cleanup)
```

### 4. Descriptive Test Names

```typescript
// ✅ GOOD: Clear and specific
it('should retry failed API call 3 times with exponential backoff', () => {});

// ❌ BAD: Vague
it('should work', () => {});
```

### 5. Arrange-Act-Assert Pattern

```typescript
it('should calculate total with tax', () => {
  // Arrange
  const subtotal = 100;
  const taxRate = 0.08;

  // Act
  const total = calculateTotal(subtotal, taxRate);

  // Assert
  expect(total).toBe(108);
});
```

## Troubleshooting

### Common Issues

#### "document is not defined" Error

```typescript
// Problem: Missing SSR guard
const height = document.querySelector('header').offsetHeight;

// Solution: Add SSR check
const header = document?.querySelector('header');
const height = header?.offsetHeight || FALLBACK;
```

#### Tests Timing Out

```bash
# Problem: Test expects real timers but fake timers are active
# Solution: Use thorough mode
npm run test:thorough
```

#### Coverage Below Threshold

```bash
# Check coverage report
npm run test:coverage

# View HTML report
open coverage/index.html

# Add tests for uncovered code
```

#### Bun Test Failures

```bash
# Problem: Using wrong test runner
bun test  # ❌ Wrong

# Solution: Use package.json script
bun run test  # ✅ Correct
```

## Refactored Code Coverage Status *(Oct 10, 2025)*

### New Composables (Phases 1-4)

The following composables were created during the October 2025 refactoring. **Test coverage is pending** but functionality is validated through integration with existing tested components:

**Phase 1 - Shared Business Logic:**
- ✅ `useServerCapacity.ts` - **Integration tested** (used by LiveServersWidget, Multiplayer section)
- ✅ `usePlayerDisplay.ts` - **Integration tested** (used by TopPlayersWidget, leaderboard)

**Phase 3 - Scroll State:**
- ✅ `useActiveSection.ts` - **Integration tested** (used by Home.vue with existing scroll tests)

**Phase 4 - Performance:**
- ✅ `useSectionObserver.ts` - **Integration tested** (replaces scroll listeners in Home.vue)

### New Utilities (Phases 2, 4, 5)

**Phase 2 - Type Safety:**
- ⏳ `types/errors.ts` - **Unit tests pending** (error classes and type guards)
  - Used in `appDataStore.ts` (which is tested)
  - Type guards: `isApiError()`, `isNetworkError()`, etc.

**Phase 4 - Memoization:**
- ⏳ `utils/memoize.ts` - **Unit tests pending** (memoization utilities)
  - `MemoCache<T>`, `memoizeWithDeps()`, `memoize()`, `memoizeJson()`
  - Used in `useYoutube.ts` and `usePlayerDisplay.ts`

**Phase 5 - Developer Experience:**
- ⏳ `types/utils.ts` - **Unit tests pending** (25+ utility types and type guards)
  - Type guards: `isDefined()`, `isString()`, `isNumber()`, etc.
  - Utility types: `Nullable<T>`, `ApiResponse<T>`, `ReadonlyDeep<T>`, etc.
- ⏳ `utils/features.ts` - **Unit tests pending** (feature flag system)
  - 11 feature flags with environment-specific configuration
  - `isFeatureEnabled()`, `setFeatureOverride()`, etc.

### Widget Components (Phase 3.2)

**Component tests pending:**
- ⏳ `components/widgets/WidgetBase.vue`
- ⏳ `components/widgets/QuickStartWidget.vue`
- ⏳ `components/widgets/LiveServersWidget.vue`
- ⏳ `components/widgets/TopPlayersWidget.vue`
- ⏳ `components/widgets/CommunityWidget.vue`
- ⏳ `components/widgets/LatestVideosWidget.vue`
- ⏳ `components/widgets/GettingHelpWidget.vue`

**Current validation:** Manual testing + integration with existing tested components (WidgetDashboard, Home)

### Test Coverage Roadmap

**Priority 1: Core Utilities (High Value)**
```bash
# Recommended test files to create
src/utils/memoize.test.ts           # Memoization utilities
src/types/errors.test.ts            # Error type guards
src/utils/features.test.ts          # Feature flag system
```

**Priority 2: Composables (Medium Value)**
```bash
# Integration-tested, but unit tests add value
src/composables/useServerCapacity.test.ts
src/composables/usePlayerDisplay.test.ts
src/composables/useSectionObserver.test.ts
```

**Priority 3: Widget Components (Lower Priority)**
```bash
# Integration-tested via WidgetDashboard
src/components/widgets/WidgetBase.spec.ts
src/components/widgets/LiveServersWidget.spec.ts
# ... other widgets
```

**Note:** All refactored code follows existing patterns and is **functionally validated** through:
- ✅ Manual testing during development
- ✅ Integration with existing tested components
- ✅ TypeScript strict mode compilation
- ✅ Linting and code review

Unit tests are recommended for:
1. **Edge case coverage** (error handling, null checks)
2. **Regression prevention** (ensure future changes don't break logic)
3. **Documentation** (tests as examples of usage)

## Future Testing Enhancements

Planned improvements:
- [ ] Unit tests for new composables (useServerCapacity, usePlayerDisplay, etc.)
- [ ] Unit tests for new utilities (memoize, features, error types)
- [ ] Component tests for widget system
- [ ] E2E tests with Playwright
- [ ] Visual regression testing
- [ ] Component snapshot testing
- [ ] Performance benchmarking
- [ ] Accessibility testing (axe-core)

---

*For architectural details, see [architecture.md](architecture.md). For design guidelines, see [design-system.md](design-system.md).*
