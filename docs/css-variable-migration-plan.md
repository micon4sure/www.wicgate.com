# CSS Variable Migration to Tailwind - Complete Plan

**Goal:** Eliminate all CSS variables except `--header-height` (which is JavaScript-synced)

**Status:** 56 CSS variable usages → 6 usages (89% reduction)

---

## 📊 Current State Analysis

### Variables Found (56 total usages):
- **Keep (JS-dependent):** 6× `--header-height`
- **Broken/Undefined:** 8× (CRITICAL BUGS!)
  - 5× spacing variables (`--spacing-xs/sm/md/lg/xl`)
  - 1× `--grad-card`
  - 2× `--player-neutral`
- **Simple migrations:** 12× (colors, transitions)
- **Complex (RGB triplets):** 16× (used for dynamic opacity)
- **Other legacy:** ~14× (skeletons, etc.)

---

## 🐛 PHASE 1: Fix Critical Bugs (Priority)

### 1.1 Fix Undefined Spacing Variables

**Problem:** Classes use undefined `--spacing-*` variables
- **Files affected:**
  - `src/components/Leaderboards.vue` line 32
  - `src/assets/styles/tailwind.css` lines 788-792

**Changes:**
```diff
# src/components/Leaderboards.vue
- <div class="grid grid-2 mb-lg">
+ <div class="grid grid-2 mb-6">

# src/assets/styles/tailwind.css (DELETE lines 788-792)
- .mb-xs { margin-bottom: var(--spacing-xs); }
- .mb-sm { margin-bottom: var(--spacing-sm); }
- .mb-md { margin-bottom: var(--spacing-md); }
- .mb-lg { margin-bottom: var(--spacing-lg); }
- .mb-xl { margin-bottom: var(--spacing-xl); }
```

### 1.2 Fix `--grad-card` Undefined Variable

**Problem:** `.error-content` uses undefined gradient variable
- **File:** `src/assets/styles/tailwind.css` line 1044

**Changes:**
```diff
- @apply max-w-[600px] text-center bg-[var(--grad-card)] p-10 rounded-lg border border-massgate-red/20;
+ @apply max-w-[600px] text-center bg-gradient-to-b from-graphite-light to-graphite-dark p-10 rounded-lg border border-massgate-red/20;
```

### 1.3 Fix `--player-neutral` Undefined Variable

**Problem:** Dynamic HTML uses undefined color variable
- **Files affected:**
  - `src/utils/playerDisplay.ts` line 37
  - `src/composables/usePlayerDisplay.ts` line 64
  - `src/composables/usePlayerDisplay.test.ts` line 162

**Changes:**
```diff
# src/utils/playerDisplay.ts
- let out = '<span style="color:var(--player-neutral)">';
+ let out = '<span style="color:#f3f6f8">';

# src/composables/usePlayerDisplay.ts
- let out = '<span style="color:var(--player-neutral)">';
+ let out = '<span style="color:#f3f6f8">';

# src/composables/usePlayerDisplay.test.ts
- expect(result).toBe('<span style="color:var(--player-neutral)">PlainName</span>');
+ expect(result).toBe('<span style="color:#f3f6f8">PlainName</span>');
```

---

## ✅ PHASE 2: Migrate Simple Color Variables

**File:** `src/assets/styles/tailwind.css`

### 2.1 Replace `var(--t)` → Tailwind
```diff
Line 132 (.btn-teal:hover):
- color: var(--t);
+ @apply text-t;
```

### 2.2 Replace `var(--t2)` → Tailwind (2×)
```diff
Line 219 (.nav-tab):
- color: var(--t2);
+ @apply text-t-secondary;

Line 274 (.nav-mobile-link):
- color: var(--t2);
+ @apply text-t-secondary;
```

### 2.3 Replace `var(--ink)` → Tailwind (3×)
```diff
Line 281 (.nav-mobile-link:hover):
- color: var(--ink);
+ @apply text-ink;

Line 306 (.nav-mobile-link:active):
- color: var(--ink);
+ @apply text-ink;

Line 323 (.nav-mobile-link.active):
- color: var(--ink);
+ @apply text-ink;
```

### 2.4 Replace `var(--sw)` → Tailwind (4×)
```diff
Line 552 (.stat-number):
- color: var(--sw);
+ @apply text-soviet;

Line 674 (.player-rating):
- color: var(--sw);
+ @apply text-soviet;

Line 714 (.ladder-score):
- color: var(--sw);
+ @apply text-soviet;

Line 730 (.help-item i):
- color: var(--sw);
+ @apply text-soviet;
```

---

## 🔄 PHASE 3: Replace Transition Variable

**File:** `src/assets/styles/tailwind.css`

```diff
Line 251 (.nav-tab::before):
- transition: var(--tr);
+ transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
```

---

## 🎨 PHASE 4: Migrate Skeleton Loader Colors

**File:** `src/assets/styles/tailwind.css`

```diff
Line 986 (.skeleton-shimmer):
- background: linear-gradient(90deg, var(--s2) 0%, var(--mg-muted) 50%, var(--s2) 100%);
+ background: linear-gradient(90deg, #1a1e22 0%, #344654 50%, #1a1e22 100%);
```

---

## 🔢 PHASE 5: Migrate RGB Triplets (16 occurrences)

**File:** `src/assets/styles/tailwind.css`

### 5.1 `--graphite-light-rgb` (26, 30, 34) - 1×
```diff
Line 201 (header):
- rgba(var(--graphite-light-rgb), 0.95) 0%,
+ rgba(26, 30, 34, 0.95) 0%,
```

### 5.2 `--graphite-dark-rgb` (8, 9, 11) - 2×
```diff
Line 202 (header):
- rgba(var(--graphite-dark-rgb), 0.98) 100%);
+ rgba(8, 9, 11, 0.98) 100%);

Line 216 (.nav-tab):
- background: linear-gradient(180deg, rgba(var(--graphite-rgb), 0.9) 0%, rgba(var(--graphite-dark-rgb), 0.92) 100%);
+ background: linear-gradient(180deg, rgba(15, 18, 21, 0.9) 0%, rgba(8, 9, 11, 0.92) 100%);
```

### 5.3 `--graphite-rgb` (15, 18, 21) - 3×
```diff
Line 203 (header border):
- border-bottom: 3px solid rgba(var(--graphite-rgb), 0.85);
+ @apply border-b-[3px] border-b-graphite/85;

Line 206 (header shadow):
- 0 0 36px rgba(var(--graphite-rgb), 0.35);
+ 0 0 36px rgba(15, 18, 21, 0.35);

Line 216 (.nav-tab - already in 5.2):
+ background: linear-gradient(180deg, rgba(15, 18, 21, 0.9) 0%, rgba(8, 9, 11, 0.92) 100%);
```

### 5.4 `--massgate-orange-rgb` (243, 124, 43) - 8×
```diff
Line 228 (.nav-tab:hover):
- 0 0 24px rgba(var(--massgate-orange-rgb), 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15);
+ 0 0 24px rgba(243, 124, 43, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15);

Line 236 (.nav-tab:active):
- box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(var(--massgate-orange-rgb), 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.1);
+ box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(243, 124, 43, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.1);

Line 243 (.nav-tab.active):
- box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 32px rgba(var(--massgate-orange-rgb), 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.2);
+ box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 32px rgba(243, 124, 43, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.2);

Line 250 (.nav-tab::before):
- background: linear-gradient(90deg, rgba(var(--massgate-orange-rgb), 0.95) 0%, rgba(var(--massgate-orange-rgb), 0.6) 100%);
+ background: linear-gradient(90deg, rgba(243, 124, 43, 0.95) 0%, rgba(243, 124, 43, 0.6) 100%);

Line 262 (.nav-tab.active::before):
- background: linear-gradient(90deg, rgba(var(--massgate-orange-rgb), 0.98) 0%, rgba(var(--massgate-orange-rgb), 0.7) 100%);
+ background: linear-gradient(90deg, rgba(243, 124, 43, 0.98) 0%, rgba(243, 124, 43, 0.7) 100%);

Line 275 (.nav-mobile-link):
- border-bottom: 1px solid rgba(var(--massgate-orange-rgb), 0.2);
+ @apply border-b border-b-massgate-orange/20;

Line 305 (.nav-mobile-link:active):
- background: linear-gradient(90deg, theme('colors.massgate-orange.DEFAULT') 0%, rgba(var(--massgate-orange-rgb), 0.85) 100%);
+ background: linear-gradient(90deg, theme('colors.massgate-orange.DEFAULT') 0%, rgba(243, 124, 43, 0.85) 100%);

Line 314 (.nav-mobile-link::before):
- background: linear-gradient(180deg, rgba(var(--massgate-orange-rgb), 0.95) 0%, rgba(var(--massgate-orange-rgb), 0.65) 100%);
+ background: linear-gradient(180deg, rgba(243, 124, 43, 0.95) 0%, rgba(243, 124, 43, 0.65) 100%);
```

### 5.5 `--panel-main-rgb` & `--panel-dark-rgb` - 2×
```diff
Lines 889-890 (.card):
- background: linear-gradient(
-   180deg,
-   rgba(var(--panel-main-rgb), 0.96) 0%,
-   rgba(var(--panel-dark-rgb), 0.98) 100%
- );
+ background: linear-gradient(
+   180deg,
+   rgba(15, 18, 21, 0.96) 0%,
+   rgba(8, 9, 11, 0.98) 100%
+ );
```

### 5.6 `--dl-rgb` & `--bg-rgb` - 2×
```diff
Line 1040 (.error-boundary):
- background: linear-gradient(135deg, rgba(var(--dl-rgb), 0.05) 0%, rgba(var(--bg-rgb), 0.95) 100%);
+ background: linear-gradient(135deg, rgba(139, 29, 20, 0.05) 0%, rgba(5, 10, 15, 0.95) 100%);
```

---

## 🧹 PHASE 6: Clean Up :root CSS Variables

**File:** `src/assets/styles/tailwind.css`

Replace entire `:root` block (lines 8-47) with minimal version:

```css
:root {
  /* CRITICAL: DO NOT REMOVE - Synced by JavaScript */
  --header-height: 80px; /* Dynamic - synced by headerHeight.ts */
}
```

**Deleted variables:**
- All RGB triplets (--massgate-orange-rgb, --mg-rgb, --graphite-rgb, etc.)
- All color shortcuts (--t, --t2, --t3, --sw, --ink, --g, --bg, --bd, --dl, --s1, --s2, --mg-muted)
- Transition helper (--tr)
- Divider variables (--divider-strong, --divider-soft)

---

## ✅ PHASE 7: Verify Dynamic Calc Usage

**No changes needed** - These MUST keep `var(--header-height)`:
- ✅ tailwind.css line 58: `scroll-padding-top: var(--header-height)`
- ✅ tailwind.css line 75: `padding-top: var(--header-height)`
- ✅ tailwind.css line 171: `padding-top: var(--header-height)`
- ✅ WidgetDashboard.vue line 32: `pt-[var(--header-height)]`
- ✅ Navigation.vue line 241: `top-[var(--header-height)]`, `min-h-[calc(100vh-var(--header-height))]`
- ✅ FAQ.vue line 326: `top: calc(var(--header-height) + 16px)`

**Reason:** Dynamically synced by `src/utils/headerHeight.ts`

---

## 🧪 PHASE 8: Testing & Verification

### 8.1 Run Unit Tests
```bash
bun run test
```
**Expected:** All 44 tests pass

### 8.2 Visual Regression Checks
- [ ] Leaderboards page (mb-lg → mb-6 spacing)
- [ ] Navigation hover/active states (RGB migrations)
- [ ] Error boundary page (gradient fix)
- [ ] Skeleton loaders (shimmer animation)
- [ ] Player names with color codes (#f3f6f8)

### 8.3 Build Verification
```bash
npm run build
```
**Expected:** Clean build, no Tailwind warnings

---

## 📊 Migration Summary

### Files Modified:
1. `docs/css-variable-migration-plan.md` (NEW)
2. `src/components/Leaderboards.vue`
3. `src/utils/playerDisplay.ts`
4. `src/composables/usePlayerDisplay.ts`
5. `src/composables/usePlayerDisplay.test.ts`
6. `src/assets/styles/tailwind.css` (major refactoring)

### Variables Eliminated:
- ❌ 5 spacing classes (undefined variables)
- ❌ 1 grad-card (undefined)
- ❌ 2 player-neutral (undefined)
- ❌ 9 simple color variables
- ❌ 1 transition variable
- ❌ 2 skeleton colors
- ❌ 16 RGB triplet variables

### Variables Retained:
- ✅ 6 usages of `--header-height` (JS-synced)

### Final Metrics:
- **Before:** 56 CSS variable usages (8 broken!)
- **After:** 6 CSS variable usages (1 type only)
- **Reduction:** 89%
- **Bugs fixed:** 8
- **CLAUDE.md compliance:** ✅ Maximum Tailwind usage

---

## 🎯 Expected Outcome

✨ **Zero undefined CSS variables**
✨ **89% reduction in CSS variable usage**
✨ **All tests passing**
✨ **Full Tailwind utility migration**
✨ **Only essential JS-synced variable remains**
