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
}>();
const activeSection = toRef(props, 'activeSection');

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

function handleNavigation(sectionId: string) {
  const sectionName = sectionId === 'hero' ? 'Home' : sectionId;
  AnalyticsEvents.sectionView(sectionName);

  closeMobileMenu();
  closeDropdown();

  // Navigate using router - browser handles scrolling via scrollBehavior + CSS
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
    <nav class="desktop-nav">
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

    <!-- Discord Social Button (Desktop) -->
    <a
      href="https://discord.gg/WnxwfMTyBe"
      target="_blank"
      rel="noopener noreferrer"
      class="discord-nav-btn"
      aria-label="Join Discord Server"
    >
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path
          d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"
        />
      </svg>
    </a>

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

          <!-- Discord Link in Mobile Menu -->
          <a
            href="https://discord.gg/WnxwfMTyBe"
            target="_blank"
            rel="noopener noreferrer"
            class="mobile-discord-link"
            @click="closeMobileMenu"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
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
<style scoped>
header {
  width: 100%;
}
</style>
