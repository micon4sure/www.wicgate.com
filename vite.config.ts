import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// For GitHub Pages under user/repo path we use relative asset paths.
// base './' keeps asset links working both at https://micon4sure.github.io/www.wicgate.com/ and
// at custom domain https://www.wicgate.com/ (once DNS + CNAME active) because paths are relative.
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: { port: 5173 }
});
