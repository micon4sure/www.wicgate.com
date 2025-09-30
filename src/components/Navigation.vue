<script setup lang="ts">
import { ref, toRef, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const mobileOpen = ref(false);
const router = useRouter();

const props = defineProps<{
  activeSection?: string | undefined;
  playerCount?: number;
  showPlayersButton?: boolean;
}>();
const activeSection = toRef(props, 'activeSection');
const playerCount = toRef(props, 'playerCount');
const showPlayersButton = toRef(props, 'showPlayersButton');

const emit = defineEmits<{
  navigate: [string | undefined];
  'toggle-players': [];
}>();

// Track window width for resize handling
const lastWindowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920);

const isActive = (section: string) => activeSection.value === section;

function togglePlayers() {
  emit('toggle-players');
}

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
    if (activeSection.value) {
      // Small delay to ensure CSS has updated after resize
      setTimeout(() => {
        const contentAnchor = document.getElementById(`${activeSection.value}-content`);
        const sectionElement = document.getElementById(activeSection.value!);
        const element = contentAnchor || sectionElement;

        if (element) {
          element.scrollIntoView({ block: 'start' });
          const headerHeight = getDynamicHeaderHeight();
          const currentScroll = window.scrollY || window.pageYOffset;
          window.scrollTo({
            top: currentScroll - headerHeight,
            behavior: 'auto',
          });
        }
      }, 150);
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleEscapeKey);
  window.addEventListener('resize', handleWindowResize);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('keydown', handleEscapeKey);
  window.removeEventListener('resize', handleWindowResize);
  document.body.style.overflow = ''; // Clean up body scroll lock
});

// Dynamic header measurement - only navigation bar now
function getDynamicHeaderHeight() {
  const nav = document.querySelector('header');

  if (!nav) {
    // Fallback if nav not found
    return 80;
  }

  const navHeight = nav.getBoundingClientRect().height;

  // Add small buffer for mobile viewport issues
  const isMobile = window.innerWidth <= 768;
  const buffer = isMobile ? 10 : 5;

  return Math.ceil(navHeight + buffer);
}

function handleNavigation(section: string) {
  emit('navigate', section !== 'hero' ? section : undefined);
  closeMobileMenu();

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
  <div class="hdr container flex items-center justify-between">
    <!-- Logo on left side -->
    <div class="nav-logo">
      <div class="logo-main">WICGATE</div>
      <div class="logo-subtitle">Community Hosted Multiplayer</div>
    </div>

    <!-- Desktop navigation (center) -->
    <nav class="desktop-nav">
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
        :to="getRoutePath('statistics')"
        :class="{ active: isActive('statistics') }"
        @click="handleNavigation('statistics')"
        >Statistics</router-link
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

    <!-- Players button on right side -->
    <div v-if="showPlayersButton" class="nav-players">
      <button class="players-btn-nav" @click="togglePlayers">
        <span class="p-count">{{ playerCount || 0 }}</span>
        <span class="p-divider" />
        <span class="p-label">Players Online</span>
      </button>
    </div>

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
            :to="getRoutePath('statistics')"
            :class="{ active: isActive('statistics') }"
            @click="handleNavigation('statistics')"
            >Statistics</router-link
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
