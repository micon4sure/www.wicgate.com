<script setup lang="ts">
import { ref, toRef, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { AnalyticsEvents } from '../utils/analytics';
import { debounce } from '../utils/debounce';
import { DEBOUNCE_RESIZE } from '../constants';
import { NAVIGATION_STRUCTURE, getRoutePath } from '../types/navigation';
import type { NavigationSection } from '../types/navigation';

const router = useRouter();

const mobileOpen = ref(false);
const openDropdown = ref<string | null>(null);

const props = defineProps<{
  activeSection?: string | undefined;
  isFastScrolling?: boolean;
}>();
const activeSection = toRef(props, 'activeSection');
const isFastScrolling = toRef(props, 'isFastScrolling');

// Track window width for resize handling
const lastWindowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920);

const isActive = (section: string) => activeSection.value === section;

// Check if a section or any of its subsections is active
const isSectionOrSubsectionActive = (section: NavigationSection): boolean => {
  if (isActive(section.id)) return true;
  if (section.subsections && activeSection.value) {
    return section.subsections.some((sub) => activeSection.value === sub.id);
  }
  return false;
};

// Get navigation sections
const navSections = computed(() => NAVIGATION_STRUCTURE);

// Dropdown management
function toggleDropdown(sectionId: string) {
  openDropdown.value = openDropdown.value === sectionId ? null : sectionId;
}

function closeDropdown() {
  openDropdown.value = null;
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
  closeDropdown();
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

// Dynamic header measurement imported from utils/scroll.ts
// (Removed duplicate code - now using shared utility)

function handleNavigation(sectionId: string) {
  const sectionName = sectionId === 'hero' ? 'Home' : sectionId;
  AnalyticsEvents.sectionView(sectionName);

  closeMobileMenu();
  closeDropdown();

  // Navigate using router
  router.push(getRoutePath(sectionId));

  // Check if we're in game mode - if so, trigger home mode first
  const event = new CustomEvent('exitGameMode');
  window.dispatchEvent(event);
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
      <template v-for="section in navSections" :key="section.id">
        <!-- Sections without subsections -->
        <router-link
          v-if="!section.subsections"
          :to="getRoutePath(section.id)"
          :class="{ active: section.id === 'hero' ? !activeSection : isActive(section.id) }"
          :class-home-btn="section.id === 'hero'"
          @click.prevent="handleNavigation(section.id)"
        >
          {{ section.label }}
        </router-link>

        <!-- Sections with subsections (dropdown) -->
        <div
          v-else
          class="nav-dropdown"
          @mouseenter="openDropdown = section.id"
          @mouseleave="closeDropdown"
        >
          <router-link
            :to="getRoutePath(section.id)"
            :class="{ active: isSectionOrSubsectionActive(section) }"
            class="nav-dropdown-trigger"
            @click.prevent="handleNavigation(section.id)"
          >
            {{ section.label }}
            <i class="fa-solid fa-chevron-down dropdown-icon" aria-hidden="true"></i>
          </router-link>
          <div v-show="openDropdown === section.id" class="dropdown-menu">
            <router-link
              v-for="subsection in section.subsections"
              :key="subsection.id"
              :to="getRoutePath(subsection.id)"
              :class="{ active: isActive(subsection.id) }"
              class="dropdown-item"
              @click.prevent="handleNavigation(subsection.id)"
            >
              {{ subsection.label }}
            </router-link>
          </div>
        </div>
      </template>
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
          <template v-for="section in navSections" :key="section.id">
            <!-- Sections without subsections -->
            <router-link
              v-if="!section.subsections"
              :to="getRoutePath(section.id)"
              :class="{ active: section.id === 'hero' ? !activeSection : isActive(section.id) }"
              @click.prevent="handleNavigation(section.id)"
            >
              {{ section.label }}
            </router-link>

            <!-- Sections with subsections (expandable) -->
            <div v-else class="mobile-nav-section">
              <div class="mobile-nav-section-header">
                <router-link
                  :to="getRoutePath(section.id)"
                  :class="{ active: isSectionOrSubsectionActive(section) }"
                  @click.prevent="handleNavigation(section.id)"
                >
                  {{ section.label }}
                </router-link>
                <button
                  class="mobile-dropdown-toggle"
                  :class="{ open: openDropdown === section.id }"
                  @click="toggleDropdown(section.id)"
                >
                  <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
                </button>
              </div>
              <div v-show="openDropdown === section.id" class="mobile-dropdown-content">
                <router-link
                  v-for="subsection in section.subsections"
                  :key="subsection.id"
                  :to="getRoutePath(subsection.id)"
                  :class="{ active: isActive(subsection.id) }"
                  class="mobile-dropdown-item"
                  @click.prevent="handleNavigation(subsection.id)"
                >
                  {{ subsection.label }}
                </router-link>
              </div>
            </div>
          </template>
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
