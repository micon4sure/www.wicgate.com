import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// For GitHub Pages under user/repo path we use relative asset paths.
// base './' keeps asset links working both at https://micon4sure.github.io/www.wicgate.com/ and
// at custom domain https://www.wicgate.com/ (once DNS + CNAME active) because paths are relative.
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: { port: 5173 },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: {
      reduceInlineStyles: false,
    },
    // Pre-render all routes automatically
    includedRoutes(paths) {
      return paths;
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
    include: ['vue', 'vue-router', 'lodash'],
  },
});
