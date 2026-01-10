import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // WiCGate Color Hierarchy: Graphite Base → Teal Accents → Orange CTAs → Red Alerts
      colors: {
        // Massgate Red Theme (IMPORTANT HIGHLIGHTS ONLY - alerts, critical stats, badges)
        'massgate-red': {
          DEFAULT: '#c62828',      // Important highlights
          dark: '#8b0000',         // Critical elements
          bright: '#e53935',       // Alerts, warnings
          shadow: '#6d0000',       // Deep shadow
          glow: '#ff1744',         // Intense glow for alerts
        },


        // Massgate Orange (STRUCTURAL ACCENTS - timelines, badges, borders, headers)
        'massgate-orange': {
          DEFAULT: '#f37c2b',      // Massgate orange (authentic color from original)
          light: '#f8a85e',        // Lighter variant
          dark: '#e06820',         // Darker variant
        },

        // Massgate Gold (DECORATIVE ACCENTS - medals, special highlights)
        'massgate-gold': {
          DEFAULT: '#ffca28',      // Gold accent
          bright: '#ffd54f',       // Bright gold
          dark: '#ffa000',         // Dark gold
        },

        // Clan Tag Teal (leaderboard clan tags)
        'clan-teal': '#0d9488',

        // Dark Textures (PRIMARY BASE - main background, body)
        'texture': {
          dark: '#0a0a0a',         // Main site background
          panel: '#151515',        // Card/panel backgrounds
          lighter: '#1e1e1e',      // Elevated elements
        },

        // Steel/Graphite (structural steel tones)
        'mg': {
          DEFAULT: '#1f2f3b',      // Base steel tone
          dark: '#101a22',         // Deep steel
          muted: '#344654',        // Mid steel accent
        },

        // Panel Colors (military steel blue for cards)
        'panel': {
          DEFAULT: '#121e27',      // Panel main (steel blue)
          dark: '#090f14',         // Panel dark (very dark steel blue)
          alt: '#1f313d',          // Alternating surface
        },
        'panel-striped': {
          DEFAULT: '#182630',      // Alternating row color
          dark: '#0e181f',         // Darker alternating row
        },
        'panel-border': {
          DEFAULT: '#37576D',      // Steel blue border for panels/cards
          soft: '#37576D80',       // 50% opacity variant
        },

        'dark-navy': {
          DEFAULT: '#0a1018',      // Dark navy (with blue tint)
          dark: '#060b10',         // Near-black navy
          light: '#0c1620',        // Very dark navy
        },

        // Soviet Orange (CTAs & DOWNLOAD BUTTONS - primary action color)
        'soviet': {
          DEFAULT: '#ff6600',      // Orange for CTAs, downloads, card hover borders
          light: '#ff8533',        // Light orange hover
          dark: '#e65c00',         // Darker orange active
          // Deep link highlight glow - pulsing effect when navigating to FAQ questions or Statistics leaderboards
          // Uses baked-in opacity because theme() with /opacity modifier fails in @keyframes
          glowStrong: 'rgba(255, 102, 0, 0.7)',  // Initial glow (0%)
          glowMedium: 'rgba(255, 102, 0, 0.6)',  // Peak glow (50%)
          glowSoft: 'rgba(255, 102, 0, 0.4)',    // Ambient glow
        },

        // Teal Theme (PRIMARY ACCENT - navigation, highlights, active states)
        'teal': {
          DEFAULT: '#00d9ff',      // Primary teal accent (navigation, active states)
          bright: '#4de8ff',       // Bright teal (hover highlights)
          dark: '#00b8d4',         // Dark teal (borders)
          darker: '#008b9e',       // Darker teal (headers, badges)
          glow: '#26c6da',         // Teal glow effect
        },

        // Legacy compatibility (TODO: migrate components and remove)
        'battlefield-mist': '#a7b7c3',  // Used in Navigation.vue

        // Text hierarchy
        't': {
          DEFAULT: '#ffffff',      // Pure white for maximum contrast on steel blue
          secondary: '#c5d5e0',    // Brighter gray-blue for better visibility
          dim: '#8a9aa8',          // Brightened tertiary text
          tertiary: '#6c7a85',     // Muted text (replaces --t3)
        },

        // Functional colors
        'ink': '#0b141a',
        'online': '#7cb342',
        'discord': {
          DEFAULT: '#5865F2',      // Discord brand blue (official)
          light: '#7289da',
          dark: '#4752c4',
          darker: '#3c4399',
        },

        // Medals
        'gold': '#ffd700',
        'silver': '#c0c0c0',
        'bronze': '#cd7f32',

        // Dividers
        'divider': {
          DEFAULT: '#447592',                    // Base divider color (steel blue)
          strong: 'rgba(68, 117, 146, 0.7)',    // Strong divider borders
          soft: 'rgba(68, 117, 146, 0.35)',     // Soft divider borders
        },

        // Brand colors
        'youtube': {
          DEFAULT: '#e53935',
          bright: '#ff5722',
        },
        'twitch': {
          DEFAULT: '#9146ff',
          dark: '#7a38d8',
        },

        // List item backgrounds (nested items inside widgets/cards)
        'list-item': {
          DEFAULT: 'rgba(12, 22, 32, 0.8)',    // server-group, video-item, ladder-player, accordion-item
          hover: 'rgba(12, 22, 32, 0.8)',      // hover state
          alt: 'rgba(12, 22, 32, 0.8)',        // event-card, accordion-header hover
        },

        // ========== THEME TOKENS (change these to switch theme) ==========
        // Tab active state gradient + accent (navbar, sub-tabs)
        'tab-active': {
          from: '#c62828',    // Gradient top (Massgate Red)
          to: '#8b0000',      // Gradient bottom (Massgate Red Dark)
          accent: '#e53935',  // Underline/glow (Massgate Red Bright)
        },
        // Section header gradient (leaderboard, FAQ, overlays)
        'section-header': {
          from: '#1a3a5c',    // Gradient top (Deep Navy)
          to: '#0d1f36',      // Gradient bottom (Deep Navy Dark)
        },
      },

      fontFamily: {
        'military': ['Oswald', 'Impact', 'sans-serif'],
        'body': ['Rajdhani', 'sans-serif'],
        'mono': ['Courier New', 'monospace'],
        'futuristic': ['Orbitron', 'sans-serif'],
      },

      // Fluid Typography Scale
      // Formula: clamp(min, intercept + slope*vw, max)
      fontSize: {
        // ========== STANDARD TAILWIND SCALE (Fluid, 375px-1280px) ==========
        // slope = (max-min)/905
        'xs': ['0.75rem', { lineHeight: '1rem' }],  // 12px - MINIMUM, no fluid
        'sm': ['clamp(0.8125rem, 0.7638rem + 0.1105vw, 0.875rem)', { lineHeight: '1.25rem' }],  // 13px → 14px
        'base': ['clamp(0.9375rem, 0.8132rem + 0.3315vw, 1.125rem)', { lineHeight: '1.5rem' }],  // 15px → 18px
        'lg': ['clamp(1.0625rem, 0.9383rem + 0.3315vw, 1.25rem)', { lineHeight: '1.75rem' }],  // 17px → 20px
        'xl': ['clamp(1.1875rem, 0.9804rem + 0.5525vw, 1.5rem)', { lineHeight: '1.75rem' }],  // 19px → 24px
        '2xl': ['clamp(1.375rem, 1.043rem + 0.884vw, 1.875rem)', { lineHeight: '2rem' }],  // 22px → 30px
        '3xl': ['clamp(1.625rem, 1.2103rem + 1.105vw, 2.25rem)', { lineHeight: '2.25rem' }],  // 26px → 36px
        '4xl': ['clamp(2rem, 1.337rem + 1.768vw, 3rem)', { lineHeight: '2.5rem' }],  // 32px → 48px
        '5xl': ['clamp(2.5rem, 1.6713rem + 2.2099vw, 3.75rem)', { lineHeight: '1' }],  // 40px → 60px
        '6xl': ['clamp(3rem, 2.0055rem + 2.6519vw, 4.5rem)', { lineHeight: '1' }],  // 48px → 72px
        '7xl': ['clamp(3.5rem, 2.3398rem + 3.0939vw, 5.25rem)', { lineHeight: '1' }],  // 56px → 84px
        '8xl': ['clamp(4rem, 2.674rem + 3.5359vw, 6rem)', { lineHeight: '1' }],  // 64px → 96px
        '9xl': ['clamp(5rem, 3.3425rem + 4.4199vw, 7.5rem)', { lineHeight: '1' }],  // 80px → 120px

        // ========== SEMANTIC TOKENS (Fluid, 320px-1440px) ==========
        // slope = (max-min)/1120

        // Hero title (homepage hero only)
        'hero': ['clamp(1.75rem, 1.607rem + 0.714vw, 2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],  // 28px → 36px

        // Panel/card headers (leaderboards, dashboard cards, FAQ, overlays, downloads)
        'heading': ['clamp(1.25rem, 1.143rem + 0.536vw, 1.625rem)', { lineHeight: '1.3' }],  // 20px → 26px

        // Main navigation (header nav tabs)
        'mainnav': ['clamp(1.1875rem, 1.116rem + 0.357vw, 1.4375rem)', { lineHeight: '1.2', letterSpacing: '0.02em' }],  // 19px → 23px

        // Sub-tab (secondary navigation tabs)
        'subtab': ['clamp(1rem, 0.929rem + 0.357vw, 1.25rem)', { lineHeight: '1.3', letterSpacing: '0.02em' }],  // 16px → 20px

        // Tab buttons (generic tabs, leaderboard tabs, content tabs)
        'tab': ['clamp(0.875rem, 0.804rem + 0.357vw, 1.125rem)', { lineHeight: '1.2', letterSpacing: '0.03em' }],  // 14px → 18px

        // Data display (leaderboards, widget stats, hero description)
        'data': ['clamp(0.9375rem, 0.866rem + 0.357vw, 1.1875rem)', { lineHeight: '1.4' }],  // 15px → 19px

        // Labels and subtitles (logo, leaderboard headers, stat labels)
        'label': ['clamp(0.8125rem, 0.777rem + 0.179vw, 0.9375rem)', { lineHeight: '1.5' }],  // 13px → 15px
      },

      backgroundImage: {
        // Note: Most gradients can be created inline with Tailwind utilities
        // Example: bg-gradient-to-b from-massgate-red to-massgate-red-dark

        // Card backgrounds
        'video-card': 'linear-gradient(180deg, rgba(12, 22, 32, 0.96) 0%, rgba(6, 11, 16, 0.98) 100%)',
        'card-surface': 'linear-gradient(to bottom right, rgba(18, 30, 39, 0.6), rgba(9, 15, 20, 0.6))',

        // Leaderboard row backgrounds (steel blue, 50% opacity)
        'lb-row': 'linear-gradient(to right, rgba(18, 30, 39, 0.5), rgba(9, 15, 20, 0.5))',
        'lb-row-even': 'linear-gradient(to right, rgba(24, 38, 48, 0.5), rgba(14, 24, 31, 0.5))',
        'lb-header': 'linear-gradient(to bottom, rgba(31, 49, 61, 0.5), rgba(18, 30, 39, 0.5))',

        // Navigation backgrounds (dark-navy gradients)
        'nav-main': 'linear-gradient(to bottom, rgba(12, 22, 32, 0.95), rgba(6, 11, 16, 0.95))',
        'nav-sub': 'linear-gradient(to bottom, rgba(12, 22, 32, 0.95), rgba(6, 11, 16, 0.95))',

        // Massgate Red (leaderboard headers - heavily used)
        'massgate-header': 'linear-gradient(180deg, #c62828 0%, #8b0000 100%)',

        // Legacy compatibility (TODO: migrate to inline Tailwind gradients)
        'massgate-header-shine': 'linear-gradient(180deg, #e53935 0%, #c62828 50%, #8b0000 100%)',
        'panel-main': 'linear-gradient(180deg, rgba(12, 22, 32, 0.96) 0%, rgba(6, 11, 16, 0.98) 100%)',
        'dark-navy-gradient': 'linear-gradient(180deg, rgba(12, 22, 32, 0.9) 0%, rgba(6, 11, 16, 0.92) 100%)',
      },

      boxShadow: {
        // Note: Use shadow-lg shadow-color/50 for custom intensity variations

        // Core glows (one per color family)
        'massgate-glow': '0 0 15px rgba(198, 40, 40, 0.4), 0 0 30px rgba(198, 40, 40, 0.2)',
        'massgate-border': '0 0 15px rgba(198, 40, 40, 0.4), inset 0 0 10px rgba(198, 40, 40, 0.1)',
        'gold-glow': '0 0 15px rgba(255, 202, 40, 0.5), 0 0 30px rgba(255, 202, 40, 0.3)',
        'teal-glow': '0 0 15px rgba(0, 217, 255, 0.4), 0 0 30px rgba(0, 217, 255, 0.2)',
        'teal-border': '0 0 20px rgba(0, 217, 255, 0.4), inset 0 0 10px rgba(0, 217, 255, 0.1)',
        'orange-glow': '0 0 15px rgba(255, 102, 0, 0.4), 0 0 30px rgba(255, 102, 0, 0.2)',
        'orange-border': '0 0 20px rgba(255, 102, 0, 0.5), inset 0 0 10px rgba(255, 102, 0, 0.1)',

        // Depth/structure shadows
        'texture-depth': '0 6px 25px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.02)',
        'military': '0 12px 30px rgba(4, 9, 14, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        'medal-text': '0 2px 4px rgba(0, 0, 0, 0.8)',

        // Legacy compatibility (TODO: migrate to core shadows)
        'massgate-panel': '0 4px 20px rgba(139, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
        'gold-shine': '0 4px 20px rgba(255, 202, 40, 0.5), inset 0 -1px 10px rgba(255, 213, 79, 0.3)',
        'teal-subtle': '0 0 15px rgba(0, 217, 255, 0.3)',
        'soviet-glow': '0 0 30px rgba(255, 102, 0, 0.6), 0 0 60px rgba(255, 102, 0, 0.3)',
        'panel': '0 0 20px rgba(31, 47, 59, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },

      animation: {
        // Core utility animations (use Tailwind's built-in animate-pulse for simple cases)
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
      },

      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '0.9' },
          '50%': { opacity: '0.4' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      spacing: {
        'header': 'var(--header-height)',
      },

      screens: {
        'xs': '375px',   // Custom (small phone)
        'sm': '640px',   // Tailwind default
        'md': '768px',   // Tailwind default (tablet)
        'lg': '1024px',  // Tailwind default - NAV/TABS SWITCH POINT
        'xl': '1280px',  // Tailwind default (site max-width)
      },

      maxWidth: {
        'site': '1440px',  // Site container max-width
      },

      borderColor: {
        'card': 'rgba(255, 255, 255, 0.3)',  // Outer card border
        'card-inner': 'rgba(255, 255, 255, 0.2)',  // Nested card border (cards inside cards)
        'card-hover': 'rgba(255, 202, 40, 0.6)',  // Gold hover border (standard)
        'card-hover-subtle': 'rgba(255, 202, 40, 0.5)',  // Gold hover border (subtle)
      },
    },
  },
  plugins: [],
} satisfies Config;
