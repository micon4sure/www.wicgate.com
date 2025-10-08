<script setup lang="ts">
import { ref, toRef, onMounted, onUnmounted } from 'vue';
import { scrollToSection } from '../utils/scroll';
import { AnalyticsEvents } from '../utils/analytics';
import { debounce } from '../utils/debounce';
import { DEBOUNCE_RESIZE } from '../constants';

const mobileOpen = ref(false);

const props = defineProps<{
  activeSection?: string | undefined;
  isFastScrolling?: boolean;
}>();
const activeSection = toRef(props, 'activeSection');
const isFastScrolling = toRef(props, 'isFastScrolling');

const emit = defineEmits<{
  navigate: [string | undefined];
}>();

// Track window width for resize handling
const lastWindowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920);

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

// Handle window resize for scroll position recalculation
function handleWindowResize() {
  const currentWidth = window.innerWidth;
  const widthDifference = Math.abs(currentWidth - lastWindowWidth.value);

  // Only recalculate if there's a significant width change (breakpoint crossing)
  if (widthDifference > 100) {
    lastWindowWidth.value = currentWidth;

    // If user is currently viewing a section (not hero), re-scroll to maintain position
    const section = activeSection.value;
    if (section) {
      // Small delay to ensure CSS has updated after resize
      setTimeout(() => {
        scrollToSection(section, 'auto');
      }, DEBOUNCE_RESIZE);
    }
  }
}

// Debounce resize handler to improve performance
const debouncedResize = debounce(handleWindowResize, DEBOUNCE_RESIZE);

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleEscapeKey);
  window.addEventListener('resize', debouncedResize);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('keydown', handleEscapeKey);
  debouncedResize.cancel();
  window.removeEventListener('resize', debouncedResize);
  document.body.style.overflow = ''; // Clean up body scroll lock
});

// Dynamic header measurement imported from utils/scroll.ts
// (Removed duplicate code - now using shared utility)

function handleNavigation(section: string) {
  const sectionName = section === 'hero' ? 'Home' : section;
  AnalyticsEvents.sectionView(sectionName);
  emit('navigate', section !== 'hero' ? section : undefined);
  closeMobileMenu();

  // Always scroll to section, even if already on that route
  // This fixes the issue where clicking FAQ again after scrolling away doesn't work
  scrollToSection(section === 'hero' ? 'hero' : section);

  // Check if we're in game mode - if so, trigger home mode first
  const event = new CustomEvent('exitGameMode');
  window.dispatchEvent(event);
}

// Get route path for section
function getRoutePath(section: string): string {
  if (section === 'hero') return '/';
  return `/${section}`;
}
</script>
<template>
  <!-- Header content within container -->
  <div class="hdr container flex items-center">
    <!-- Logo on left side -->
    <div class="nav-logo">
      <div class="logo-main">WICGATE</div>
      <div class="logo-subtitle">Community Hosted Multiplayer</div>
    </div>

    <!-- Desktop navigation (left-aligned) -->
    <nav class="desktop-nav" :class="{ 'fast-scroll': isFastScrolling }">
      <router-link
        :to="getRoutePath('hero')"
        :class="{ active: !activeSection }"
        class="home-btn"
        @click="handleNavigation('hero')"
        >Home</router-link
      >
      <router-link
        :to="getRoutePath('getting-started')"
        :class="{ active: isActive('getting-started') }"
        @click="handleNavigation('getting-started')"
        >Getting Started</router-link
      >
      <router-link
        :to="getRoutePath('multiplayer')"
        :class="{ active: isActive('multiplayer') }"
        @click="handleNavigation('multiplayer')"
        >Multiplayer</router-link
      >
      <router-link
        :to="getRoutePath('community')"
        :class="{ active: isActive('community') }"
        @click="handleNavigation('community')"
        >Community</router-link
      >
      <router-link
        :to="getRoutePath('about')"
        :class="{ active: isActive('about') }"
        @click="handleNavigation('about')"
        >About</router-link
      >
      <router-link
        :to="getRoutePath('faq')"
        :class="{ active: isActive('faq') }"
        @click="handleNavigation('faq')"
        >FAQ</router-link
      >
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
          <router-link
            :to="getRoutePath('hero')"
            :class="{ active: !activeSection }"
            class="home-btn"
            @click="handleNavigation('hero')"
            >Home</router-link
          >
          <router-link
            :to="getRoutePath('getting-started')"
            :class="{ active: isActive('getting-started') }"
            @click="handleNavigation('getting-started')"
            >Getting Started</router-link
          >
          <router-link
            :to="getRoutePath('multiplayer')"
            :class="{ active: isActive('multiplayer') }"
            @click="handleNavigation('multiplayer')"
            >Multiplayer</router-link
          >
          <router-link
            :to="getRoutePath('community')"
            :class="{ active: isActive('community') }"
            @click="handleNavigation('community')"
            >Community</router-link
          >
          <router-link
            :to="getRoutePath('about')"
            :class="{ active: isActive('about') }"
            @click="handleNavigation('about')"
            >About</router-link
          >
          <router-link
            :to="getRoutePath('faq')"
            :class="{ active: isActive('faq') }"
            @click="handleNavigation('faq')"
            >FAQ</router-link
          >
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
