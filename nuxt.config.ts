// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Enable SSR
  ssr: true,

  // Disable app manifest to work around Nuxt bug #30461/#30700/#33606
  // The #app-manifest import fails during Vite pre-transform in Nuxt 3.15+
  experimental: {
    appManifest: false,
  },

  // Modules
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt',
  ],

  // Hybrid rendering - SSG for static pages, SSR for dynamic, CSR for auth
  routeRules: {
    '/': { ssr: true },
    '/downloads': { prerender: true },
    '/statistics': { ssr: true },
    '/community': { ssr: true },
    '/faq': { prerender: true },
    '/login': { ssr: false },
    '/admin-login': { ssr: false },
    '/admin': { ssr: false },
    '/user': { ssr: false },
  },

  // Source directory (keep existing structure)
  srcDir: 'src/',

  // Directories configuration (relative to srcDir)
  // Note: public/ symlink at root points to src/public/ for Nuxt 4 compatibility
  dir: {
    pages: 'pages',
    layouts: 'layouts',
    middleware: 'middleware',
    plugins: 'plugins',
    assets: 'assets',
  },

  // Auto-imports
  imports: {
    dirs: ['composables', 'stores', 'utils'],
  },

  // Components
  components: [
    { path: '~/components', pathPrefix: false },
    { path: '~/screens', pathPrefix: false },
  ],

  // Pinia configuration
  pinia: {
    storesDirs: ['./src/stores/**'],
  },

  // PWA configuration
  pwa: {
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
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
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
      enabled: false, // Disable PWA in development
      type: 'module',
    },
  },

  // Tailwind CSS configuration
  tailwindcss: {
    configPath: '~/tailwind.config.ts',
    cssPath: '~/assets/styles/tailwind.css',
  },

  // Vite configuration
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Use modern Sass API - https://sass-lang.com/documentation/js-api/
          api: 'modern-compiler' as const,
        } as Record<string, unknown>,
      },
    },
    build: {
      sourcemap: true,
      target: 'es2020',
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia'],
    },
  },

  // Nitro server configuration
  nitro: {
    preset: 'vercel',
    routeRules: {
      '/api/**': { proxy: 'https://www.wicgate.com/api/**' },
      '/admin-api/**': { proxy: 'https://www.wicgate.com:8080/**' },
    },
    devProxy: {
      '/api': {
        target: 'https://www.wicgate.com',
        changeOrigin: true,
      },
      '/admin-api': {
        target: 'https://www.wicgate.com:8080',
        changeOrigin: true,
        prependPath: true,
      },
    },
  },

  // Runtime config
  runtimeConfig: {
    public: {
      apiBase: process.env.VITE_API_BASE || 'https://www.wicgate.com/api',
      siteUrl: process.env.VITE_SITE_URL || 'https://wicgate.com',
    },
  },

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: false, // Disable for now - fix types separately
  },

  // Global CSS
  css: [
    '@fortawesome/fontawesome-free/css/all.min.css',
  ],

  // App configuration
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Oswald:wght@200;300;400;500;600;700&family=Roboto+Mono:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  // Dev tools
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  // Compatibility date
  compatibilityDate: '2025-01-01',
});