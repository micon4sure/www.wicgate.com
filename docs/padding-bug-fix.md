# Fix: Extra Padding Between Navbar and Hero

## Symptoms
- Large gap (~80-100px+) between navbar and hero video
- Happens randomly, persists until page reload
- Occurs on both desktop and mobile

## Investigation Summary

**Extensive investigation checked:**
- CSS specificity and cascade order
- Inline styles (none found)
- Dynamic JavaScript style changes (none found)
- Overlay positioning (fixed, doesn't affect layout)
- Margin collapsing (no margins on hero elements)
- Header height sync timing
- SSR/CSR hydration mismatch

**Most likely cause - CSS override issue:**
```css
/* Line 259-262: All sections get 50px padding */
#screens > * {
  padding-top: 50px;
}

/* Line 265-268: Hero should override to 0 */
#hero {
  @apply pt-0;
  border-top: none;
}
```

**Specificity:** Both selectors = 0-1-0 (equal). Source order means `#hero` should win. However, the intermittent nature suggests something may be interfering with Tailwind's `@apply` processing.

**Uncertainty:** Cannot reproduce or definitively confirm this is the root cause. The fix below makes the CSS more bulletproof, which should help even if the exact cause is different.

## Proposed Fix (Diagnostic)

Make the override explicit and guaranteed:

**File:** `src/assets/styles/tailwind.css` (lines 265-268)

Change from:
```css
#hero {
  @apply pt-0;
  border-top: none;
}
```

To:
```css
#screens > #hero {
  padding-top: 0;
  border-top: none;
}
```

**Why this helps:**
1. `#screens > #hero` has specificity 0-2-0 - HIGHER than `#screens > *` (0-1-0)
2. Uses explicit `padding-top: 0` instead of `@apply`
3. Guaranteed to override regardless of any edge cases

**If this doesn't fix it:** The issue is elsewhere, and we should add debugging to capture the exact state when it occurs (e.g., logging computed styles on page load).

---

*Created: January 2, 2026*
