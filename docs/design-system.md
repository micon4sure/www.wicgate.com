# Design System Documentation

> **⚠️ MAJOR UPDATE (October 12, 2025):** Complete migration from modular CSS to **Tailwind CSS utility-first approach**. This resulted in ~80% code reduction (8,154 deletions vs 1,569 additions). See [Changelog](changelog.md) for migration details.

## Overview

WiCGATE uses a **Tailwind-first design system** inspired by the original Massgate military aesthetic. All design tokens are defined in Tailwind configuration, and 95% of styling is done with utility classes directly in Vue templates.

**Migration Impact:**
- 29 CSS module files deleted (~8,000+ lines)
- All components now use Tailwind utility classes
- Design tokens moved from CSS variables to Tailwind config
- One exception: `--header-height` CSS variable (synced by JavaScript for dynamic measurement)

## Design Philosophy

### Utility-First Approach

**Critical Rule:** ALWAYS use Tailwind utility classes. NEVER create custom CSS classes for simple style combinations.

**Why Tailwind?**
- **Visibility:** All styles visible in template, no jumping between files
- **No Naming:** No need to invent class names (`.widget-header`, `.player-card`, etc.)
- **Consistency:** Design tokens enforced through Tailwind config
- **Performance:** Purges unused styles automatically, smaller bundle
- **Maintainability:** Changes are localized, no cascading effects

**Example:**
```vue
<!-- ❌ BEFORE: Modular CSS approach -->
<style scoped>
.widget-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(26, 38, 51, 0.3);
}
</style>

<template>
  <div class="widget-header">
    <i class="icon"></i>
    <h3>Title</h3>
  </div>
</template>

<!-- ✅ AFTER: Tailwind utility-first -->
<template>
  <div class="flex items-center gap-3 py-5 px-6 border-b border-mg/30">
    <i class="icon"></i>
    <h3>Title</h3>
  </div>
</template>
```

**Result:** Deleted entire `<style>` block, more readable, easier to maintain.

## Design Tokens

### Tailwind Configuration

**File:** [tailwind.config.ts](../tailwind.config.ts)

All design tokens now live in Tailwind configuration instead of CSS variables. This enables direct usage in utility classes with autocomplete and type safety.

### Color Palette

**Usage:** Reference colors in utility classes (e.g., `text-soviet`, `bg-mg-dark`, `border-battlefield-teal/40`)

#### Massgate Red Theme
```typescript
'massgate-red': '#e53935',          // Primary brand red
'massgate-red-dark': '#b71c1c',     // Darker red for depth
'massgate-red-bright': '#ff5252',   // Bright accent red
'massgate-gold': '#ffd700',         // Gold accents
```

**Usage:** `bg-massgate-red`, `text-massgate-gold`, `border-massgate-red-bright`

#### Military Theme
```typescript
'soviet': '#ff6600',                // Primary orange (accent)
'battlefield-teal': '#00d9ff',      // Teal blue accent
'battlefield-cyan': '#00ffff',      // Cyan highlight
```

**Usage:** `text-soviet`, `bg-battlefield-teal/30`, `border-battlefield-cyan/40`

#### Panel Colors
```typescript
'mg': '#1a2633',                    // Base panel color
'mg-dark': '#0d1419',               // Dark panel variant
'texture-panel': '#1c2a38',         // Textured panel
'texture-dark': '#0f1a24',          // Dark textured panel
'night-panel': '#141e28',           // Night mode panel
```

**Usage:** `bg-mg`, `bg-gradient-to-b from-texture-panel to-texture-dark`, `border-mg/70`

#### Text Colors
```typescript
't': '#e8eaed',                     // Primary text (headings)
't-secondary': '#b8bec5',           // Secondary text (body)
't-dim': '#8a9199',                 // Dimmed text (subtle)
```

**Usage:** `text-t`, `text-t-secondary`, `text-t-dim`

#### Status Colors
```typescript
'online': '#4caf50',                // Online status (green)
'offline': '#666',                  // Offline status (gray)
```

**Usage:** `text-online`, `bg-offline`

### Custom Box Shadows

**Usage:** Reference in utility classes (e.g., `shadow-soviet-glow`, `shadow-teal-glow`)

```typescript
boxShadow: {
  'soviet-glow': '0 0 20px rgba(255, 102, 0, 0.5)',
  'teal-glow': '0 0 20px rgba(0, 217, 255, 0.5)',
  'red-glow': '0 0 20px rgba(229, 57, 53, 0.5)',
  'gold-glow': '0 0 20px rgba(255, 215, 0, 0.5)',
}
```

**Usage:** `shadow-soviet-glow`, `hover:shadow-teal-glow`

**⚠️ Important:** Opacity modifiers (e.g., `shadow-soviet-glow/50`) DO NOT work with custom shadows in `@apply` directive. Use manual CSS `box-shadow` for variable opacity.

### Custom Animations

**Usage:** Reference in utility classes (e.g., `animate-pulse-slow`)

```typescript
animation: {
  'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'red-pulse': 'redPulse 2s ease-in-out infinite',
  'gold-shimmer': 'goldShimmer 3s ease-in-out infinite',
}
```

**Usage:** `animate-pulse-slow`, `animate-red-pulse`, `animate-gold-shimmer`

### Custom Breakpoints

**Usage:** Use responsive prefixes in utility classes (e.g., `md:block`, `lg:flex`, `2xl:text-6xl`)

```typescript
screens: {
  'xs': '360px',      // Very small phones
  'sm': '480px',      // Small phones
  'md': '768px',      // Tablets (glassmorphism/video enabled)
  'lg': '900px',      // Small laptops
  'xl': '1024px',     // Standard laptops
  '2xl': '1200px',    // Large screens
  '3xl': '1366px',    // Extra large screens
  '4xl': '1920px',    // 1080p displays
}
```

**Usage:** `hidden md:block`, `text-sm lg:text-base 2xl:text-lg`

## Typography

### Font Families

**Defined in Tailwind Config:**
```typescript
fontFamily: {
  'military': ['Oswald', 'sans-serif'],      // Headers, navigation
  'body': ['Rajdhani', 'sans-serif'],        // Body text
  'mono': ['Courier New', 'monospace'],      // Player names, data
}
```

**Usage:** `font-military`, `font-body`, `font-mono`

### Font Sizes & Responsive Scaling

**Tailwind Default Scale (Extended):**
- `text-xs` (0.75rem/12px)
- `text-sm` (0.875rem/14px)
- `text-base` (1rem/16px)
- `text-lg` (1.125rem/18px)
- `text-xl` (1.25rem/20px)
- `text-2xl` (1.5rem/24px)
- `text-3xl` (1.875rem/30px)
- `text-4xl` (2.25rem/36px)
- `text-5xl` (3rem/48px)
- `text-6xl` (3.75rem/60px)

**Responsive Typography Pattern:**
```vue
<!-- Mobile → Tablet → Desktop progression -->
<h1 class="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl">
  World in Conflict
</h1>

<p class="text-sm md:text-base lg:text-lg">
  Body text that scales
</p>
```

## Component Patterns with Tailwind

### Glassmorphism Widget Pattern (Homepage)

**Files:**
- [src/assets/styles/tailwind.css](../src/assets/styles/tailwind.css) - `.widget` component class
- [src/components/WidgetDashboard.vue](../src/components/WidgetDashboard.vue) - Widget grid orchestrator
- [src/components/widgets/](../src/components/widgets/) - 6 modular widget components

**Design Pattern:** Frosted glass effect (glassmorphism) on desktop for video background transparency, solid backgrounds on mobile for performance.

#### Widget Base Structure

[WidgetBase.vue](../src/components/WidgetBase.vue) - Base component for all widgets:

```vue
<template>
  <div :class="widgetClass" class="widget" @click="handleClick">
    <!-- Header -->
    <div class="flex items-center gap-3 py-5 px-6 pb-4 border-b border-mg/30
                max-[900px]:py-4 max-[900px]:px-5 max-[900px]:pb-3
                max-[480px]:py-3.5 max-[480px]:px-4 max-[480px]:pb-2.5 max-[480px]:gap-2.5">
      <div :class="iconClass"
           class="w-10 h-10 flex items-center justify-center
                  bg-gradient-to-br from-battlefield-teal/30 to-battlefield-teal/15
                  border border-battlefield-teal/40 text-xl text-battlefield-teal flex-shrink-0
                  max-[480px]:w-9 max-[480px]:h-9 max-[480px]:text-lg">
        <i :class="icon" aria-hidden="true"></i>
      </div>
      <h3 class="m-0 text-xl font-bold text-t font-military uppercase tracking-[0.5px]
                 max-[768px]:text-lg max-[480px]:text-base">
        {{ title }}
      </h3>
    </div>

    <!-- Body (slot) -->
    <div class="flex-1 py-5 px-6 flex flex-col gap-4
                max-[900px]:py-4 max-[900px]:px-5
                max-[480px]:py-3.5 max-[480px]:px-4 max-[480px]:gap-3">
      <slot />
    </div>

    <!-- Footer -->
    <div class="py-4 px-6 border-t border-mg/30 bg-gradient-to-b from-mg/10 to-mg-dark/20
                max-[900px]:py-3 max-[900px]:px-5 max-[480px]:py-2.5 max-[480px]:px-4">
      <span class="flex items-center justify-between text-battlefield-teal font-military text-sm font-semibold uppercase tracking-[0.5px] transition-all duration-200 group-hover:text-battlefield-cyan group-hover:translate-x-1">
        <slot name="action">{{ action }} <i class="fa-solid fa-arrow-right ml-2"></i></slot>
      </span>
    </div>
  </div>
</template>
```

**Key Features:**
- All styling done with Tailwind utility classes
- Responsive at multiple breakpoints (`max-[900px]`, `max-[768px]`, `max-[480px]`)
- No custom CSS needed in component
- Flexible slots for content customization

#### Glassmorphism `.widget` Class

**File:** [src/assets/styles/tailwind.css](../src/assets/styles/tailwind.css)

```css
@layer components {
  .widget {
    @apply rounded-none overflow-hidden;
    @apply transition-all duration-300 flex flex-col min-h-[280px];
    @apply cursor-pointer;

    /* Glassmorphism for desktop */
    @apply md:backdrop-blur-md md:bg-black/30 md:border md:border-white/20;
    @apply md:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)];

    /* Solid background for mobile (performance) */
    @apply bg-gradient-to-b from-texture-panel to-texture-dark;
    @apply border border-mg/70 shadow-[0_12px_28px_rgba(4,9,14,0.55)];
  }

  @media (hover: hover) and (min-width: 768px) {
    .widget:hover {
      @apply md:bg-black/40 md:border-white/30;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5),
                  0 0 24px rgba(var(--sw-rgb), 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.15);
      transform: translateY(-4px) scale(1.02);
    }
  }
}
```

**Why `@layer components`?**
- Complex pattern used across 6 widgets
- Needs hover state with manual `box-shadow` (opacity modifiers don't work with custom shadows)
- Combines 10+ Tailwind utilities into one semantic class
- Still uses `@apply` for most styles (Tailwind utilities)

#### Widget Grid Layout

**File:** [src/components/WidgetDashboard.vue](../src/components/WidgetDashboard.vue)

```vue
<div class="grid grid-cols-1 gap-4 mb-10
            sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3
            sm:gap-4 md:gap-5 xl:gap-6 md:mb-12 xl:mb-16">
  <QuickStartWidget @navigate="goToSection" />
  <LiveServersWidget :data="data" :player-count="playerCount" :loading="storeLoading"
                     :is-s-s-r="isSSR" @navigate="goToSection" />
  <CommunityWidget :events="events" @navigate="goToSection" />
  <TopPlayersWidget :ladder="data.ladder || []" :loading="storeLoading"
                    :is-s-s-r="isSSR" @navigate="goToSection" />
  <LatestVideosWidget :videos="videosSorted" :is-s-s-r="isSSR" @navigate="goToSection" />
  <GettingHelpWidget @navigate="goToSection" />
</div>
```

**Responsive Breakpoints:**
- Mobile (`grid-cols-1`): 1 column stacked
- Tablet (`md:grid-cols-2`): 2 columns
- Desktop (`xl:grid-cols-3`): 3 columns

**Gap Progression:**
- Mobile: `gap-4` (1rem)
- Tablet: `md:gap-5` (1.25rem)
- Desktop: `xl:gap-6` (1.5rem)

### Video Background Pattern

**Context:** Homepage hero section with video background requires special handling for SSR and performance.

**Pattern:**

```vue
<script setup lang="ts">
const isSSR = import.meta.env.SSR;
</script>

<template>
  <section class="relative min-h-[85vh] pt-[calc(var(--header-height)+40px)] pb-20 overflow-hidden
                  2xl:pt-[calc(var(--header-height)+40px)] xl:pt-[calc(var(--header-height)+30px)]
                  md:pt-[calc(var(--header-height)+20px)] sm:pt-[calc(var(--header-height)+10px)]
                  md:pb-20 sm:pb-12 sm:min-h-0">
    <!-- Video (desktop only, SSR-safe) -->
    <video v-if="!isSSR" autoplay muted loop playsinline preload="metadata"
           class="absolute inset-0 w-full h-full object-cover hidden md:block">
      <source src="/hero-background.mp4" type="video/mp4" />
    </video>

    <!-- Light overlay for readability -->
    <div class="absolute inset-0 bg-black/20 md:bg-black/15"></div>

    <!-- Content with glassmorphism widgets -->
    <div class="container relative z-10">
      <!-- Widgets here -->
    </div>
  </section>
</template>
```

**Key Classes:**
- `min-h-[85vh]` - Tall hero section to showcase video
- `pt-[calc(var(--header-height)+40px)]` - Dynamic header offset
- `hidden md:block` - Desktop only (performance)
- `v-if="!isSSR"` - SSR-safe
- `bg-black/20` - Semi-transparent overlay

### Text Readability Over Video

**Pattern:** Use drop shadows for text over dynamic backgrounds:

```vue
<h1 class="text-6xl leading-tight mb-4 font-military font-bold text-t uppercase tracking-wide
           drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]
           2xl:text-6xl xl:text-5xl md:text-[2.5rem] sm:text-3xl">
  World in Conflict
</h1>

<p class="text-lg text-t leading-relaxed font-body font-semibold
          drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]
          2xl:text-lg xl:text-base md:text-base sm:text-sm">
  Experience the critically acclaimed 2007 Cold War RTS masterpiece online again.
</p>
```

**Key Techniques:**
- `drop-shadow-[custom]` - Arbitrary value for precise shadow
- Strong opacity (`0.9`) ensures readability
- Responsive font sizes (`2xl:text-6xl xl:text-5xl ...`)
- `font-semibold` or `font-bold` for weight

### Responsive Strategy

**Mobile-First with Progressive Enhancement:**

```vue
<!-- Base (Mobile) → Tablet → Desktop progression -->
<div class="py-3.5 px-4 gap-2.5
            max-[900px]:py-4 max-[900px]:px-5
            max-[480px]:py-3.5 max-[480px]:px-4 max-[480px]:gap-3">
  <!-- Content -->
</div>
```

**Standard Breakpoints:**
- `sm:` (480px) - Small phones
- `md:` (768px) - Tablets (glassmorphism/video enabled)
- `lg:` (900px) - Small laptops
- `xl:` (1024px) - Standard laptops
- `2xl:` (1200px+) - Large screens

**Arbitrary Breakpoints:**
- `max-[900px]:` - Custom max-width query
- `max-[480px]:` - Custom max-width query

### Performance Considerations

**Desktop-Only Features:**
```vue
<!-- Glassmorphism (GPU-intensive) -->
<div class="md:backdrop-blur-md md:bg-black/30">...</div>

<!-- Video background (bandwidth/CPU-intensive) -->
<video class="hidden md:block">...</video>

<!-- Complex animations -->
<div class="md:animate-pulse-slow">...</div>
```

**Mobile Optimization:**
```vue
<!-- Solid backgrounds (no blur) -->
<div class="bg-mg border border-mg/70 md:backdrop-blur-md md:bg-black/30">
  <!-- Fallback solid, desktop gets glassmorphism -->
</div>

<!-- Simpler layouts -->
<div class="grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
  <!-- 1 col mobile, 2 tablet, 3 desktop -->
</div>
```

## Tailwind Best Practices

### DO: Utility-First

```vue
<!-- ✅ GOOD: Inline utilities -->
<div class="flex items-center gap-3 py-5 px-6 border-b border-mg/30">
  <span class="text-xl font-bold text-t font-military uppercase tracking-[0.5px]">
    Title
  </span>
</div>
```

### DON'T: Create Custom Classes

```vue
<!-- ❌ BAD: Custom class for simple combination -->
<style>
.my-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
}
</style>

<div class="my-header">...</div>
```

### DO: Use Design Tokens

```vue
<!-- ✅ GOOD: Tailwind colors from config -->
<div class="text-soviet bg-mg border-battlefield-teal/40">...</div>
```

### DON'T: Hardcode Colors

```vue
<!-- ❌ BAD: Hardcoded hex values -->
<div style="color: #ff6600; background: #1a2633;">...</div>

<!-- ❌ BAD: Arbitrary colors -->
<div class="text-[#ff6600] bg-[#1a2633]">...</div>
```

### DO: Responsive Prefixes

```vue
<!-- ✅ GOOD: Mobile-first with breakpoints -->
<h1 class="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl">
  Heading
</h1>
```

### DON'T: Media Queries in Styles

```vue
<!-- ❌ BAD: Custom media queries -->
<style>
h1 {
  font-size: 1.875rem;
}
@media (min-width: 768px) {
  h1 { font-size: 2.25rem; }
}
</style>
```

### DO: Component Layer for Complex Patterns

```css
/* ✅ GOOD: Reusable complex pattern */
@layer components {
  .widget {
    @apply rounded-none overflow-hidden transition-all duration-300;
    @apply md:backdrop-blur-md md:bg-black/30;
    /* Complex hover with manual box-shadow */
  }
}
```

### DON'T: Component Layer for Simple Combos

```css
/* ❌ BAD: Unnecessary component class */
@layer components {
  .flex-center {
    @apply flex items-center justify-center;
  }
}
```

## Dynamic Header Height

**Exception to "No CSS Variables" Rule:** `--header-height` is the ONLY CSS variable used (synced by JavaScript).

**Usage:**
```vue
<section class="pt-[calc(var(--header-height)+40px)]">
  <!-- Dynamic padding based on header height -->
</section>
```

**Why:**
- Header height changes at responsive breakpoints
- JavaScript measures actual rendered height
- Auto-syncs on resize
- No hardcoded pixel values needed

**File:** [src/utils/headerHeight.ts](../src/utils/headerHeight.ts)

## Arbitrary Values

**When to Use:**

```vue
<!-- ✅ GOOD: Non-standard spacing -->
<div class="pt-[calc(var(--header-height)+40px)]">...</div>

<!-- ✅ GOOD: Custom drop shadow -->
<h1 class="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">...</h1>

<!-- ✅ GOOD: Precise tracking -->
<span class="tracking-[0.5px]">...</span>

<!-- ✅ GOOD: Min-height not in scale -->
<div class="min-h-[85vh]">...</div>
```

**When NOT to Use:**

```vue
<!-- ❌ BAD: Color exists in config -->
<div class="text-[#ff6600]">...</div>
<!-- ✅ GOOD: Use token -->
<div class="text-soviet">...</div>

<!-- ❌ BAD: Spacing exists in scale -->
<div class="p-[20px]">...</div>
<!-- ✅ GOOD: Use scale -->
<div class="p-5">...</div> <!-- 20px = 1.25rem = p-5 -->
```

## Opacity Modifiers

**Usage:** Add `/opacity` to colors:

```vue
<!-- Backgrounds -->
<div class="bg-black/30">...</div>
<div class="bg-mg/70">...</div>

<!-- Borders -->
<div class="border-mg/30">...</div>
<div class="border-white/20">...</div>

<!-- Text -->
<span class="text-t/80">...</span>
```

**⚠️ Limitation:** Does NOT work with custom `boxShadow` in `@apply`:

```css
/* ❌ WRONG: Build error */
.element {
  @apply shadow-soviet-glow/50; /* ERROR: class does not exist */
}

/* ✅ CORRECT: Manual CSS */
.element {
  box-shadow: 0 0 20px rgba(255, 102, 0, 0.5);
}
```

## Gradients

**Built-in Gradient Utilities:**

```vue
<!-- Direction -->
<div class="bg-gradient-to-r">...</div>  <!-- left to right -->
<div class="bg-gradient-to-b">...</div>  <!-- top to bottom -->
<div class="bg-gradient-to-br">...</div> <!-- top-left to bottom-right -->

<!-- With opacity -->
<div class="bg-gradient-to-b from-texture-panel to-texture-dark">...</div>
<div class="bg-gradient-to-b from-mg/10 to-mg-dark/20">...</div>

<!-- Three stops -->
<div class="bg-gradient-to-b from-texture-dark/30 via-transparent to-night-panel/60">...</div>
```

## Transitions & Animations

**Built-in Transitions:**

```vue
<!-- Standard durations -->
<div class="transition-all duration-200">...</div>
<div class="transition-all duration-300">...</div>

<!-- Specific properties -->
<div class="transition-colors duration-200">...</div>
<div class="transition-transform duration-300">...</div>
```

**Custom Animations (from config):**

```vue
<div class="animate-pulse-slow">...</div>
<div class="animate-red-pulse">...</div>
<div class="animate-gold-shimmer">...</div>
```

## Hover & Focus States

**Standard Pattern:**

```vue
<button class="text-t-secondary hover:text-t
               bg-mg hover:bg-soviet
               border border-mg/30 hover:border-soviet/70
               transition-all duration-200
               transform hover:scale-105 hover:-translate-y-0.5">
  Click Me
</button>
```

**Focus States:**

```vue
<button class="focus:outline-none focus:ring-2 focus:ring-soviet focus:ring-offset-2">
  Accessible Button
</button>
```

## Migration Guide

### From Modular CSS to Tailwind

**Step 1:** Remove CSS module imports

```typescript
// ❌ BEFORE: main.ts
import './assets/styles/modules/variables.css';
import './assets/styles/modules/typography.css';
import './assets/styles/modules/components/navigation.css';
// ... 29 imports

// ✅ AFTER: main.ts
import './assets/styles/tailwind.css'; // One import!
```

**Step 2:** Convert component styles

```vue
<!-- BEFORE -->
<style scoped>
.widget-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(26, 38, 51, 0.3);
  background: linear-gradient(180deg, #1c2a38 0%, #0f1a24 100%);
}
</style>

<template>
  <div class="widget-header">
    <!-- Content -->
  </div>
</template>

<!-- AFTER -->
<template>
  <div class="flex items-center gap-3 py-5 px-6 border-b border-mg/30 bg-gradient-to-b from-texture-panel to-texture-dark">
    <!-- Content -->
  </div>
</template>
```

**Step 3:** Move design tokens to Tailwind config

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'mg': '#1a2633',
        'soviet': '#ff6600',
        // ... all tokens
      }
    }
  }
}
```

**Step 4:** Delete CSS modules

```bash
# Delete 29 CSS module files
rm -rf src/assets/styles/modules/
```

**Result:** ~80% code reduction (8,154 deletions vs 1,569 additions)

## Accessibility with Tailwind

### Focus States

```vue
<button class="focus:outline-none focus:ring-2 focus:ring-soviet focus:ring-offset-2">
  Accessible
</button>
```

### Screen Reader Only

```vue
<span class="sr-only">Skip to content</span>
```

### Aria Labels

```vue
<button aria-label="Close" class="...">
  <i class="fa-solid fa-times" aria-hidden="true"></i>
</button>
```

### Touch Targets (Mobile)

```vue
<!-- Minimum 44x44px -->
<button class="min-h-[44px] min-w-[44px] md:min-h-[40px] md:min-w-[40px]">
  Tap Me
</button>
```

## Common Patterns

### Card Pattern

```vue
<div class="bg-mg border border-mg/70 overflow-hidden transition-all duration-300
            hover:border-soviet/70 hover:shadow-[0_0_30px_rgba(255,102,0,0.32)]
            hover:transform hover:-translate-y-1">
  <!-- Card content -->
</div>
```

### Badge Pattern

```vue
<span class="inline-flex items-center gap-2 py-1.5 px-4
             bg-gradient-to-b from-mg/40 to-mg-dark/60
             border border-soviet/40 text-soviet
             font-military text-xs font-bold tracking-widest uppercase
             shadow-soviet-glow/30">
  THE WAR CONTINUES
</span>
```

### Button Pattern

```vue
<button class="py-3 px-6 bg-soviet text-t font-military font-bold uppercase
               rounded transition-all duration-200
               hover:bg-soviet/90 hover:scale-105 hover:shadow-soviet-glow
               active:scale-95">
  Download Now
</button>
```

## Troubleshooting

### Issue: Class Not Working

**Problem:**
```vue
<div class="text-soviet"><!-- No color --></div>
```

**Solution:** Check Tailwind config has the color defined:
```typescript
colors: {
  'soviet': '#ff6600', // ✅ Defined
}
```

### Issue: Opacity Modifier Not Working

**Problem:**
```css
.element {
  @apply shadow-soviet-glow/50; /* ERROR */
}
```

**Solution:** Use manual CSS for custom shadows:
```css
.element {
  box-shadow: 0 0 20px rgba(255, 102, 0, 0.5);
}
```

### Issue: Arbitrary Value Not Working

**Problem:**
```vue
<div class="min-h-[85vh"><!-- Missing bracket --></div>
```

**Solution:** Close bracket:
```vue
<div class="min-h-[85vh]"><!-- ✅ Fixed --></div>
```

### Issue: Responsive Classes Not Applying

**Problem:**
```vue
<div class="md:block"><!-- Still hidden on desktop --></div>
```

**Solution:** Need base class too:
```vue
<div class="hidden md:block"><!-- ✅ Fixed --></div>
```

---

*This document defines the complete Tailwind-first design system for WiCGATE. For architectural details, see [architecture.md](architecture.md).*
