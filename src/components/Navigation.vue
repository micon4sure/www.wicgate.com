<script setup lang="ts">
import { ref, toRef, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { debounce } from '../utils/debounce';
import { DEBOUNCE_RESIZE } from '../constants';
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
  document.body.style.overflow = ''; // Clean up body scroll lock
});

async function handleNavigation(sectionId: string) {
  closeMobileMenu();

  // Exit game mode if active
  const event = new CustomEvent('exitGameMode');
  window.dispatchEvent(event);

  // Always update URL via router on both mobile and desktop
  // Router's scrollBehavior (main.ts) handles scrolling to section automatically
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
      <nav class="hidden lg:flex gap-1 xl:gap-2 items-center h-full ml-4 xl:ml-5 flex-1">
        <router-link
          v-for="section in navSections"
          :key="section.id"
          :to="getRoutePath(section.id)"
          :class="{
            'tab-btn-active': section.id === 'hero' ? !activeSection : isActive(section.id),
          }"
          class="tab-btn tab-btn-nav"
          @click.prevent="handleNavigation(section.id)"
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
          href="https://discord.gg/Udbv9UDBBb"
          target="_blank"
          rel="noopener noreferrer"
          class="auth-btn-discord"
          aria-label="Join Discord Server"
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

    <!-- Enhanced hamburger menu button (Mobile - Far Right) -->
    <button
      :class="{ active: mobileOpen }"
      class="hamburger-btn lg:hidden ml-auto"
      aria-label="Toggle mobile menu"
      :aria-expanded="mobileOpen"
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
      <div
        v-if="mobileOpen"
        class="fixed top-0 left-0 w-screen h-screen bg-black/70 backdrop-blur-md z-[998]"
        @click="closeMobileMenu"
      ></div>
    </Transition>

    <!-- Mobile navigation menu -->
    <Transition name="mobile-nav">
      <nav
        v-if="mobileOpen"
        class="fixed top-0 left-0 w-screen h-screen z-[999] pointer-events-none"
      >
        <div
          class="absolute top-[var(--header-height)] left-0 w-screen pointer-events-auto flex flex-col p-0 min-h-[calc(100vh-var(--header-height))]"
          style="
            background: linear-gradient(
              180deg,
              rgba(10, 10, 10, 0.98) 0%,
              rgba(5, 5, 5, 0.99) 100%
            );
          "
        >
          <button
            v-for="section in navSections"
            :key="section.id"
            type="button"
            :class="{
              active: section.id === 'hero' ? !activeSection : isActive(section.id),
            }"
            class="nav-mobile-link"
            @click="handleNavigation(section.id)"
          >
            {{ section.label }}
          </button>

          <!-- Admin Link in Mobile Menu (if admin) -->
          <router-link
            v-if="isAdmin"
            to="/admin"
            class="mobile-auth-admin"
            @click="closeMobileMenu"
          >
            <i class="fa-solid fa-crown w-5 h-5 flex-shrink-0"></i>
            Admin Dashboard
          </router-link>

          <!-- Discord Link in Mobile Menu -->
          <a
            href="https://discord.gg/Udbv9UDBBb"
            target="_blank"
            rel="noopener noreferrer"
            class="mobile-auth-discord"
            @click="closeMobileMenu"
          >
            <svg
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
              class="w-5 h-5 flex-shrink-0"
            >
              <path
                d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"
              />
            </svg>
            Join Discord
          </a>
        </div>
      </nav>
    </Transition>
  </Teleport>
</template>
