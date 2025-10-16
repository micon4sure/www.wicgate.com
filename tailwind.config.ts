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

        // Panel Colors (AUTHENTIC MASTER BRANCH - military steel blue for cards)
        'panel': {
          DEFAULT: '#121e27',      // Panel main (authentic steel blue from master)
          dark: '#090f14',         // Panel dark (very dark steel blue)
          alt: '#1f313d',          // Alternating surface
        },
        'panel-striped': {
          DEFAULT: '#182630',      // Authentic alternating row color from master
          dark: '#0e181f',         // Darker alternating row
        },

        'graphite': {
          DEFAULT: '#0f1215',      // Primary dark base
          dark: '#08090b',         // Darkest variant
          light: '#1a1e22',        // Light variant
        },

        // Soviet Orange (CTAs & DOWNLOAD BUTTONS - primary action color)
        'soviet': {
          DEFAULT: '#ff6600',      // Orange for CTAs, downloads, card hover borders
          light: '#ff8533',        // Light orange hover
          dark: '#e65c00',         // Darker orange active
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

        // Brand colors
        'youtube': {
          DEFAULT: '#e53935',
          bright: '#ff5722',
        },
        'twitch': {
          DEFAULT: '#9146ff',
          dark: '#7a38d8',
        },
      },

      fontFamily: {
        'military': ['Oswald', 'Impact', 'sans-serif'],
        'body': ['Rajdhani', 'sans-serif'],
        'mono': ['Courier New', 'monospace'],
      },

      backgroundImage: {
        // Note: Most gradients can be created inline with Tailwind utilities
        // Example: bg-gradient-to-b from-massgate-red to-massgate-red-dark

        // Massgate Red (leaderboard headers - heavily used)
        'massgate-header': 'linear-gradient(180deg, #c62828 0%, #8b0000 100%)',

        // Legacy compatibility (TODO: migrate to inline Tailwind gradients)
        'massgate-header-shine': 'linear-gradient(180deg, #e53935 0%, #c62828 50%, #8b0000 100%)',
        'panel-main': 'linear-gradient(180deg, rgba(15, 18, 21, 0.96) 0%, rgba(8, 9, 11, 0.98) 100%)',
        'graphite-gradient': 'linear-gradient(180deg, rgba(15, 18, 21, 0.9) 0%, rgba(8, 9, 11, 0.92) 100%)',
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
        'xs': '360px',
        'sm': '480px',
        'md': '768px',
        'lg': '850px',
        'xl': '900px',
        '2xl': '1000px',
        '3xl': '1100px',
        '4xl': '1200px',
      },
    },
  },
  plugins: [],
} satisfies Config;
