<script setup lang="ts">
import { ref, toRef, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const mobileOpen = ref(false);
const router = useRouter();

const props = defineProps<{ activeSection?: string | undefined }>();
const activeSection = toRef(props, 'activeSection');

const emit = defineEmits<{ navigate: [string | undefined] }>();

// Track window width for resize handling
const lastWindowWidth = ref(window.innerWidth);

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

// Dynamic header measurement - eliminates all guesswork
function getDynamicHeaderHeight() {
  const banner = document.querySelector('.header-banner');
  const nav = document.querySelector('header');

  if (!banner || !nav) {
    // Fallback if elements not found
    return 200;
  }

  const bannerHeight = banner.getBoundingClientRect().height;
  const navHeight = nav.getBoundingClientRect().height;

  // Add small buffer for mobile viewport issues
  const isMobile = window.innerWidth <= 768;
  const buffer = isMobile ? 20 : 5;

  return Math.ceil(bannerHeight + navHeight + buffer);
}

function scrollTo(id: string) {
  if (id === 'hero') {
    // For hero, scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', window.location.pathname);
  } else {
    // Pixel-perfect positioning with dynamic measurement - zero guesswork
    const sectionElement = document.getElementById(id);

    if (sectionElement) {
      // Measure actual header height at scroll time
      const headerBanner = document.querySelector('.header-banner');
      const nav = document.querySelector('header');
      const actualHeaderHeight = (headerBanner?.offsetHeight || 0) + (nav?.offsetHeight || 0);

      // Get section's exact position
      const sectionRect = sectionElement.getBoundingClientRect();
      const sectionTop = sectionRect.top + window.scrollY;

      // Calculate pixel-perfect scroll position
      const targetY = sectionTop - actualHeaderHeight;

      // Scroll to exact position
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth',
      });
    }

    history.replaceState(null, '', `#${id}`);
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
    <!-- Desktop navigation (stays in container) -->
    <nav class="desktop-nav">
      <a
        :class="{ active: !activeSection }"
        class="home-btn"
        @click.prevent="goHomeAndScroll('hero')"
        >Home</a
      >
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
            :class="{ active: !activeSection }"
            class="home-btn"
            @click.prevent="goHomeAndScroll('hero')"
            >Home</a
          >
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
