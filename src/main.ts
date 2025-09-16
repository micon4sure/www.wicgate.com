import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/styles/base-new.css';
import App from './App.vue';
import Home from './views/Home.vue';
import GameMode from './views/GameMode.vue';

// Router base derived from Vite's BASE_URL. When base is './' (our config),
// normalizing against the current URL yields the correct mount path in all environments:
// - Dev server: '/'
// - Custom domain: '/'
// - GitHub Pages under repo path: '/www.wicgate.com/'
const runtimeBase = new URL(import.meta.env.BASE_URL, window.location.href).pathname;

const router = createRouter({
  history: createWebHistory(runtimeBase),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/game-mode', name: 'game-mode', component: GameMode },
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved;
    if (to.hash) {
      const el = document.querySelector(to.hash);
      if (el) {
        return { el: to.hash, behavior: 'smooth' } as any;
      }
    }
    return { top: 0 };
  },
});

const app = createApp(App);
// Provide the app base so components can construct asset URLs that work under
// both root (/) and GitHub Pages subpath (/www.wicgate.com/)
app.provide('appBase', runtimeBase.endsWith('/') ? runtimeBase : runtimeBase + '/');
app.use(router).mount('#app');
