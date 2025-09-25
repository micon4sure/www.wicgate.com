<script setup lang="ts">
import { ref, toRef, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const mobileOpen = ref(false);
const router = useRouter();

const props = defineProps<{ showPlayersButton?: boolean; activeSection?: string | undefined }>();
const showPlayersButton = toRef(props, 'showPlayersButton');
const activeSection = toRef(props, 'activeSection');

const emit = defineEmits<{ 'toggle-players': []; navigate: [string | undefined] }>();

const isActive = (section: string) => activeSection.value === section;

// Enhanced mobile menu functionality
function toggleMobileMenu() {
  mobileOpen.value = !mobileOpen.value;
  // Prevent body scroll when menu is open
  if (mobileOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

function closeMobileMenu() {
  mobileOpen.value = false;
  document.body.style.overflow = '';
}

// Close menu when clicking outside
function handleOutsideClick(event: Event) {
  const nav = document.querySelector('nav');
  const hamburger = document.querySelector('.mob-menu');
  const target = event.target as Node;

  if (
    mobileOpen.value &&
    nav &&
    hamburger &&
    !nav.contains(target) &&
    !hamburger.contains(target)
  ) {
    closeMobileMenu();
  }
}

// Close menu on escape key
function handleEscapeKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && mobileOpen.value) {
    closeMobileMenu();
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('keydown', handleEscapeKey);
  document.body.style.overflow = ''; // Clean up body scroll lock
});

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
  closeMobileMenu();
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
  <!-- Header content within container -->
  <div class="hdr container flex items-center justify-between">
    <div class="flex items-center">
      <a class="logo" @click="goHomeAndScroll('hero')">WICGATE</a>
      <div v-if="showPlayersButton" class="social">
        <button class="players-btn" @click="emit('toggle-players')">
          <span id="pCountHeader" class="p-count">
            <slot name="player-count">0</slot>
          </span>
          <span class="p-divider" />
          <span class="p-label-header">Players Online</span>
        </button>
      </div>
    </div>

    <!-- Desktop navigation (stays in container) -->
    <nav class="desktop-nav">
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

    <!-- Enhanced hamburger menu button -->
    <button
      class="mob-menu"
      :class="{ active: mobileOpen }"
      aria-label="Toggle mobile menu"
      aria-expanded="mobileOpen"
      @click="toggleMobileMenu"
    >
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>
  </div>

  <!-- Mobile navigation (full-screen, outside container) -->
  <Teleport to="body">
    <!-- Mobile menu backdrop -->
    <Transition name="backdrop">
      <div v-if="mobileOpen" class="mobile-backdrop" @click="closeMobileMenu"></div>
    </Transition>

    <!-- Mobile navigation menu -->
    <Transition name="mobile-nav">
      <nav v-if="mobileOpen" class="mobile-nav">
        <div class="mobile-nav-content">
          <a
            :class="{ active: isActive('getting-started') }"
            @click.prevent="goHomeAndScroll('getting-started')"
            >Getting Started</a
          >
          <a
            :class="{ active: isActive('statistics') }"
            @click.prevent="goHomeAndScroll('statistics')"
            >Statistics</a
          >
          <a
            :class="{ active: isActive('community') }"
            @click.prevent="goHomeAndScroll('community')"
            >Community</a
          >
          <a :class="{ active: isActive('about') }" @click.prevent="goHomeAndScroll('about')"
            >About</a
          >
          <a :class="{ active: isActive('faq') }" @click.prevent="goHomeAndScroll('faq')">FAQ</a>
        </div>
      </nav>
    </Transition>
  </Teleport>
</template>
<style scoped>
header {
  width: 100%;
}
</style>
