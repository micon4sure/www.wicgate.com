import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueDevTools from 'vite-plugin-vue-devtools';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { VitePWA } from 'vite-plugin-pwa';

const DEPLOY_BASE = process.env.DEPLOY_BASE || '/';

// DEPLOY_BASE allows overriding the public base path (e.g. '/www.wicgate.com/' for GitHub Pages).
// Defaults to '/' so pre-rendered pages resolve assets from the site root.
export default defineConfig(({ mode }) => ({
  base: DEPLOY_BASE,
  plugins: [
    vue(),
    // Vue DevTools - only in development
    mode === 'development' && VueDevTools(),
    // PWA configuration
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'WICGATE - World in Conflict Multiplayer',
        short_name: 'WICGATE',
        description: 'Play World in Conflict online with restored multiplayer servers. Join our active community in epic Cold War battles.',
        theme_color: '#1a1a1a',
        background_color: '#0a0a0a',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'any',
        categories: ['games', 'entertainment'],
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Cache strategies - only precache files in production build
        // In dev mode, files are served from memory, not disk, so skip precaching
        globPatterns: mode === 'development' ? [] : ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/www\.wicgate\.com\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true, // Enable PWA in development for testing
        type: 'module',
      },
    }),
    // Bundle size visualization (generates stats.html)
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    // Image optimization (compresses images in public/)
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
    }),
  ],
  server: { port: 5173 },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: {
      reduceInlineStyles: false,
    },
    // Pre-render only main routes (not subsections) to avoid thin content pages
    // Subsections are client-side tab navigation within main pages
    includedRoutes(paths) {
      const mainRoutes = ['/', '/downloads', '/statistics', '/community', '/faq', '/login'];
      return paths.filter((path) => mainRoutes.includes(path));
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // Fix Sass legacy JS API deprecation warning
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/views': resolve(__dirname, './src/views'),
      '@/stores': resolve(__dirname, './src/stores'),
      '@/composables': resolve(__dirname, './src/composables'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/assets': resolve(__dirname, './src/assets'),
    },
  },
  build: {
    // Enable source maps for better debugging
    sourcemap: true,
    // Target modern browsers for better performance
    target: 'es2020',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Optimize rollup configuration
    rollupOptions: {
      output: {
        // Optimize asset naming for caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // CSS optimization
    cssCodeSplit: true,
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  // Performance optimizations
  optimizeDeps: {
    include: ['vue', 'vue-router'],
  },
}));
