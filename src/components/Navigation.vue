<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const mobileOpen = ref(false);
const router = useRouter();

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    // Update URL hash (except for hero section)
    if (id !== 'hero') {
      history.replaceState(null, '', `#${id}`);
    } else {
      // Clear hash for hero section
      history.replaceState(null, '', window.location.pathname);
    }
  }
  mobileOpen.value = false;
}

function goHomeAndScroll(section: string) {
  // If not on home page, navigate there first
  if (router.currentRoute.value.path !== '/') {
    const targetPath = section === 'hero' ? '/' : `/#${section}`;
    router.push(targetPath).then(() => requestAnimationFrame(() => scrollTo(section)));
  } else {
    // Check if we're in game mode - if so, trigger home mode first
    const event = new CustomEvent('exitGameMode');
    window.dispatchEvent(event);

    // Small delay to ensure we exit game mode before scrolling
    setTimeout(() => scrollTo(section), 100);
  }
}

defineProps<{ showPlayersButton?: boolean }>();
const emit = defineEmits<{ (e: 'toggle-players'): void }>();
</script>
<template>
  <div class="hdr container flex items-center justify-between">
    <div class="flex items-center">
      <a class="logo grad-text" @click="goHomeAndScroll('hero')">WICGATE</a>
      <div class="social" v-if="showPlayersButton">
        <button @click="emit('toggle-players')" class="players-btn">
          <div class="status-indicator" />
          <span class="p-count" id="pCountHeader">
            <slot name="player-count">0</slot>
          </span>
          <span class="p-divider" />
          <span class="p-label-header">Players Online</span>
        </button>
      </div>
    </div>
    <nav :class="{ 'mobile-open': mobileOpen }">
      <a @click.prevent="goHomeAndScroll('getting-started')">Getting Started</a>
      <a @click.prevent="goHomeAndScroll('statistics')">Statistics</a>
      <a @click.prevent="goHomeAndScroll('community')">Community</a>
      <a @click.prevent="goHomeAndScroll('faq')">FAQ</a>
    </nav>
    <button class="mob-menu" @click="mobileOpen = !mobileOpen">☰</button>
  </div>
</template>
<style scoped>
header {
  width: 100%
}
</style>
