<script setup lang="ts">
import { ref, toRef } from 'vue';
import { useRouter } from 'vue-router';

const mobileOpen = ref(false);
const router = useRouter();

const props = defineProps<{ showPlayersButton?: boolean; activeSection?: string | undefined }>();
const showPlayersButton = toRef(props, 'showPlayersButton');
const activeSection = toRef(props, 'activeSection');

const emit = defineEmits<{ 'toggle-players': []; navigate: [string | undefined] }>();

const isActive = (section: string) => activeSection.value === section;

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
  emit('navigate', id !== 'hero' ? id : undefined);
  mobileOpen.value = false;
}

function goHomeAndScroll(section: string) {
  emit('navigate', section !== 'hero' ? section : undefined);
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
</script>
<template>
  <div class="hdr container flex items-center justify-between">
    <div class="flex items-center">
      <a class="logo" @click="goHomeAndScroll('hero')">WICGATE</a>
      <div v-if="showPlayersButton" class="social">
        <button class="players-btn" @click="emit('toggle-players')">
          <div class="status-indicator" />
          <span id="pCountHeader" class="p-count">
            <slot name="player-count">0</slot>
          </span>
          <span class="p-divider" />
          <span class="p-label-header">Players Online</span>
        </button>
      </div>
    </div>
    <nav :class="{ 'mobile-open': mobileOpen }">
      <a
        :class="{ active: isActive('getting-started') }"
        @click.prevent="goHomeAndScroll('getting-started')"
        >Getting Started</a
      >
      <a :class="{ active: isActive('statistics') }" @click.prevent="goHomeAndScroll('statistics')"
        >Statistics</a
      >
      <a :class="{ active: isActive('community') }" @click.prevent="goHomeAndScroll('community')"
        >Community</a
      >
      <a :class="{ active: isActive('about') }" @click.prevent="goHomeAndScroll('about')">About</a>
      <a :class="{ active: isActive('faq') }" @click.prevent="goHomeAndScroll('faq')">FAQ</a>
    </nav>
    <button class="mob-menu" @click="mobileOpen = !mobileOpen">☰</button>
  </div>
</template>
<style scoped>
header {
  width: 100%;
}
</style>
