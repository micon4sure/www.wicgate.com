import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Nostalgic Massgate Color Palette
      colors: {
        // Massgate Red Theme (primary branding)
        'massgate-red': {
          DEFAULT: '#c62828',      // Primary red (headers, accents)
          dark: '#8b0000',         // Deep maroon (backgrounds, shadows)
          bright: '#e53935',       // Bright red (hover states)
          shadow: '#6d0000',       // Dark shadow red
          glow: '#ff1744',         // Intense glow effect
        },


        // Massgate Gold (CTAs, important buttons)
        'massgate-gold': {
          DEFAULT: '#ffca28',      // Primary gold
          bright: '#ffd54f',       // Hover shine
          dark: '#ffa000',         // Active/pressed state
        },

        // Dark Textures
        'texture': {
          dark: '#0a0a0a',         // Main background
          panel: '#151515',        // Panel backgrounds
          lighter: '#1e1e1e',      // Elevated elements
        },

        // Steel/Graphite structure (kept for compatibility)
        'mg': {
          DEFAULT: '#1f2f3b',
          dark: '#101a22',
          muted: '#344654',
        },
        'graphite': {
          DEFAULT: '#0f1215',
          dark: '#08090b',
          light: '#1a1e22',
        },

        // Soviet Orange (primary accent - original Massgate color)
        'soviet': {
          DEFAULT: '#ff6600',      // Original Massgate orange
          light: '#ff8533',        // Light orange hover
          dark: '#e65c00',         // Slightly darker
        },

        // Backgrounds (dark theme colors)
        'night': '#050a0f',
        'night-panel': '#0e1a22',
        'night-alt': '#14222a',

        // Text hierarchy
        't': {
          DEFAULT: '#f3f6f8',
          secondary: '#a7b7c3',
          dim: '#6c7a85',
        },

        // Functional colors
        'ink': '#0b141a',
        'online': '#7cb342',
        'discord': {
          DEFAULT: '#4f7bd7',      // Classic Discord blue (matches master)
          light: '#6b7ff3',
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
        // Massgate Red Gradients
        'massgate-header': 'linear-gradient(180deg, #c62828 0%, #8b0000 100%)',
        'massgate-header-shine': 'linear-gradient(180deg, #e53935 0%, #c62828 50%, #8b0000 100%)',
        'massgate-panel': 'linear-gradient(180deg, rgba(139, 0, 0, 0.15) 0%, rgba(109, 0, 0, 0.08) 100%)',
        'massgate-panel-hover': 'linear-gradient(180deg, rgba(198, 40, 40, 0.2) 0%, rgba(139, 0, 0, 0.12) 100%)',

        // Gold Gradients
        'gold-shimmer': 'linear-gradient(135deg, #ffd54f 0%, #ffca28 50%, #ffa000 100%)',
        'gold-cta': 'linear-gradient(180deg, #ffd54f 0%, #ffca28 100%)',

        // Atmospheric Effects
        'battlefield-atmosphere': 'linear-gradient(180deg, rgba(38, 198, 218, 0.1) 0%, transparent 60%)',
        'battlefield-fog': 'linear-gradient(90deg, transparent 0%, rgba(77, 208, 225, 0.15) 50%, transparent 100%)',
        'teal-glow-subtle': 'radial-gradient(circle, rgba(38, 198, 218, 0.2) 0%, transparent 70%)',

        // Texture Backgrounds
        'texture-dark-gradient': 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
        'texture-panel-gradient': 'linear-gradient(180deg, #151515 0%, #0f0f0f 100%)',

        // Legacy (kept for compatibility)
        'panel-main': 'linear-gradient(180deg, rgba(18, 30, 39, 0.96) 0%, rgba(9, 15, 20, 0.98) 100%)',
        'soviet-gradient': 'linear-gradient(180deg, rgba(255, 102, 0, 0.98) 0%, rgba(255, 102, 0, 0.8) 100%)',
        'graphite-gradient': 'linear-gradient(180deg, rgba(15, 18, 21, 0.9) 0%, rgba(8, 9, 11, 0.92) 100%)',
      },

      boxShadow: {
        // Massgate Red Glows
        'massgate-glow': '0 0 30px rgba(198, 40, 40, 0.6), 0 0 60px rgba(198, 40, 40, 0.3)',
        'massgate-glow-intense': '0 0 40px rgba(229, 53, 53, 0.8), 0 0 80px rgba(198, 40, 40, 0.5)',
        'massgate-border': '0 0 15px rgba(198, 40, 40, 0.4), inset 0 0 10px rgba(198, 40, 40, 0.1)',
        'massgate-panel': '0 4px 20px rgba(139, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03)',

        // Gold Glows
        'gold-glow': '0 0 30px rgba(255, 202, 40, 0.7), 0 0 60px rgba(255, 202, 40, 0.4)',
        'gold-shine': '0 4px 20px rgba(255, 202, 40, 0.5), inset 0 -1px 10px rgba(255, 213, 79, 0.3)',

        // Teal Atmospheric Glows
        'teal-glow': '0 0 25px rgba(38, 198, 218, 0.4), 0 0 50px rgba(38, 198, 218, 0.2)',
        'teal-subtle': '0 0 15px rgba(77, 208, 225, 0.3)',

        // Texture Shadows
        'texture-depth': '0 6px 25px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.02)',

        // Legacy (kept for compatibility)
        'military': '0 12px 30px rgba(4, 9, 14, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        'soviet-glow': '0 0 30px rgba(255, 102, 0, 0.6), 0 0 60px rgba(255, 102, 0, 0.3)',
        'panel': '0 0 20px rgba(31, 47, 59, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },

      animation: {
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'red-pulse': 'redPulse 2.5s ease-in-out infinite',
        'gold-shimmer': 'goldShimmer 3s ease-in-out infinite',
        'teal-glow': 'tealGlow 4s ease-in-out infinite',
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
        redPulse: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(198, 40, 40, 0.4), 0 0 40px rgba(198, 40, 40, 0.2)'
          },
          '50%': {
            boxShadow: '0 0 30px rgba(229, 53, 53, 0.6), 0 0 60px rgba(198, 40, 40, 0.4)'
          },
        },
        goldShimmer: {
          '0%, 100%': {
            boxShadow: '0 0 15px rgba(255, 202, 40, 0.4), 0 0 30px rgba(255, 202, 40, 0.2)'
          },
          '50%': {
            boxShadow: '0 0 25px rgba(255, 213, 79, 0.6), 0 0 50px rgba(255, 202, 40, 0.4)'
          },
        },
        tealGlow: {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(38, 198, 218, 0.3), 0 0 20px rgba(38, 198, 218, 0.1)'
          },
          '50%': {
            boxShadow: '0 0 20px rgba(77, 208, 225, 0.5), 0 0 40px rgba(38, 198, 218, 0.3)'
          },
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
