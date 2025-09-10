import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Home from './views/Home.vue';
import GameMode from './views/GameMode.vue';
import './assets/styles/base.css';

// Dynamic base: works for both custom domain root and GitHub Pages subdirectory.
// If hosted at https://micon4sure.github.io/www.wicgate.com/ the pathname contains the repo segment.
// On custom domain (CNAME) it will not.
const runtimeBase = (() => {
  const seg = '/www.wicgate.com/';
  return window.location.pathname.startsWith(seg) ? seg : '/';
})();

const router = createRouter({
  history: createWebHistory(runtimeBase),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/gamemode', name: 'gamemode', component: GameMode }
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
  }
});

createApp(App).use(router).mount('#app');
