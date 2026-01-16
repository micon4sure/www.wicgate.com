<script setup lang="ts">
import { ref, toRef, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { debounce } from '../utils/debounce';
import { DEBOUNCE_RESIZE, DISCORD_URL } from '../constants';
import { NAVIGATION_STRUCTURE, getRoutePath } from '../types/navigation';

const router = useRouter();
const authStore = useAuthStore();

const mobileOpen = ref(false);

const isAdmin = computed(() => authStore.isAdmin);

const props = defineProps<{
  activeSection?: string | undefined;
}>();
const activeSection = toRef(props, 'activeSection');

// Track window width for resize handling
const lastWindowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920);

const isActive = (section: string) => activeSection.value === section;

// Get navigation sections
const navSections = computed(() => NAVIGATION_STRUCTURE);

// Get checkbox element (for programmatic control)
function getMobileCheckbox(): HTMLInputElement | null {
  if (typeof document === 'undefined') return null;
  return document.getElementById('mobile-menu-toggle') as HTMLInputElement | null;
}

// Sync checkbox state with reactive state
function syncCheckboxState(open: boolean) {
  const checkbox = getMobileCheckbox();
  if (checkbox) checkbox.checked = open;
  mobileOpen.value = open;

  // Update scroll lock
  if (open) {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  } else {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }
}

// Handle checkbox change (from user clicking label)
function handleCheckboxChange(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  syncCheckboxState(checked);
}

function closeMobileMenu() {
  syncCheckboxState(false);
}

// Close menu when clicking outside
function handleOutsideClick(event: Event) {
  const nav = document.querySelector('.mobile-menu');
  const hamburger = document.querySelector('.hamburger-label');
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

// Handle window resize (simplified - no manual scrolling needed)
function handleWindowResize() {
  const currentWidth = window.innerWidth;
  const widthDifference = Math.abs(currentWidth - lastWindowWidth.value);

  // Only update if there's a significant width change (breakpoint crossing)
  if (widthDifference > 100) {
    lastWindowWidth.value = currentWidth;
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
  // Clean up scroll lock
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
});

// Desktop nav click handler - performs side effects only, doesn't prevent default
// Native <a> behavior works when JS is disabled; this adds SPA enhancements
function handleNavClick(_sectionId: string, _event: MouseEvent) {
  // Exit game mode if active
  const exitEvent = new CustomEvent('exitGameMode');
  window.dispatchEvent(exitEvent);

  // Let vue-router handle the navigation via its click handler
  // We only need to add our custom side effects here
}

// Mobile nav handler - uses router.push for SPA navigation
async function handleMobileNavigation(sectionId: string) {
  closeMobileMenu();

  // Exit game mode if active
  const event = new CustomEvent('exitGameMode');
  window.dispatchEvent(event);

  // Use router for SPA navigation (scrollBehavior handles scroll)
  await router.push(getRoutePath(sectionId));
}
</script>
<template>
  <!-- Header content within container -->
  <div class="header-container">
    <!-- Inner container for main content -->
    <div class="header-inner">
      <!-- WICGATE Logo -->
      <div class="logo-wrapper">
        <img src="/wicgate-white.png" alt="WICGATE" class="logo-image" />
      </div>

      <!-- Desktop navigation (left-aligned) -->
      <nav class="hidden lg:flex gap-0 xl:gap-2 items-center h-full ml-4 xl:ml-5 flex-1">
        <router-link
          v-for="section in navSections"
          :key="section.id"
          :to="getRoutePath(section.id)"
          :class="{
            'tab-btn-active': section.id === 'hero' ? !activeSection : isActive(section.id),
          }"
          class="tab-btn tab-btn-nav"
          @click="handleNavClick(section.id, $event)"
        >
          {{ section.label }}
        </router-link>
      </nav>

      <!-- Auth & Social Buttons (Desktop) -->
      <div class="hidden lg:flex items-center gap-2 xl:gap-3">
        <!-- Admin Link (if admin) -->
        <router-link v-if="isAdmin" to="/admin" class="auth-btn-admin">
          <i class="fa-solid fa-crown"></i>
          Admin
        </router-link>

        <!-- Discord Social Button -->
        <a
          :href="DISCORD_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="auth-btn-discord"
          aria-label="Join Discord Server"
          title="Join Discord Server (opens in new tab)"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="w-5 h-5">
            <path
              d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"
            />
          </svg>
          Discord
        </a>
      </div>
    </div>

    <!-- Hidden checkbox for CSS-only mobile menu toggle (no-JS fallback) -->
    <input
      id="mobile-menu-toggle"
      type="checkbox"
      class="sr-only peer"
      :checked="mobileOpen"
      @change="handleCheckboxChange"
    />

    <!-- Hamburger label (replaces button for CSS-only functionality) -->
    <label
      for="mobile-menu-toggle"
      class="hamburger-label lg:hidden"
      role="button"
      aria-label="Toggle mobile menu"
      :aria-expanded="mobileOpen"
    >
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </label>

    <!-- Mobile menu backdrop (CSS-controlled via :has selector) -->
    <div class="mobile-backdrop lg:hidden" @click="closeMobileMenu"></div>

    <!-- Mobile navigation menu (CSS-controlled via :has selector) -->
    <nav class="mobile-menu lg:hidden">
      <div class="mobile-menu-inner">
        <a
          v-for="section in navSections"
          :key="section.id"
          :href="getRoutePath(section.id)"
          :class="{
            active: section.id === 'hero' ? !activeSection : isActive(section.id),
          }"
          class="nav-mobile-link"
          @click.prevent="handleMobileNavigation(section.id)"
        >
          {{ section.label }}
        </a>

        <!-- Admin Link in Mobile Menu (if admin) -->
        <router-link v-if="isAdmin" to="/admin" class="mobile-auth-admin" @click="closeMobileMenu">
          <i class="fa-solid fa-crown w-5 h-5 flex-shrink-0"></i>
          Admin Dashboard
        </router-link>
      </div>
    </nav>
  </div>
</template>
