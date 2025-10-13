<script setup lang="ts">
import { ref, toRef, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { AnalyticsEvents } from '../utils/analytics';
import { debounce } from '../utils/debounce';
import { DEBOUNCE_RESIZE } from '../constants';
import { NAVIGATION_STRUCTURE, getRoutePath } from '../types/navigation';
import type { NavigationSection } from '../types/navigation';

const router = useRouter();
const authStore = useAuthStore();

const mobileOpen = ref(false);
const openDropdown = ref<string | null>(null);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => authStore.isAdmin);

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

function handleLogout() {
  authStore.logout();
  closeMobileMenu();
  router.push('/');
}
</script>
<template>
  <!-- Header content within container -->
  <div
    class="h-20 min-h-[80px] px-5 container flex items-center max-[1024px]:h-[70px] max-[1024px]:min-h-[70px] max-[1024px]:justify-between max-[768px]:h-[65px] max-[768px]:min-h-[65px] max-[768px]:px-[18px] max-[480px]:h-[60px] max-[480px]:min-h-[60px] max-[480px]:px-4 max-[360px]:px-3"
  >
    <!-- Logo on left side -->
    <div
      class="flex flex-col items-start min-w-[200px] md:min-w-[200px] sm:min-w-[160px] xs:min-w-[140px]"
    >
      <div
        class="font-military text-2xl font-bold text-massgate-red-bright uppercase tracking-[2px] select-none leading-none transition-all duration-300 hover:text-massgate-red-glow md:text-2xl sm:text-xl xs:text-lg"
        style="
          text-shadow:
            0 0 20px rgba(229, 53, 53, 0.5),
            0 0 40px rgba(198, 40, 40, 0.3);
        "
      >
        WICGATE
      </div>
      <div
        class="font-body text-[11px] font-medium text-battlefield-mist uppercase tracking-[1px] mt-0.5 leading-none md:text-[11px] sm:text-[10px] xs:text-[9px]"
      >
        Community Hosted Multiplayer
      </div>
    </div>

    <!-- Desktop navigation (left-aligned) -->
    <nav class="hidden lg:flex gap-2 items-center h-full ml-5 flex-1">
      <template v-for="section in navSections" :key="section.id">
        <!-- Sections without subsections -->
        <router-link
          v-if="!section.subsections"
          :to="getRoutePath(section.id)"
          :class="{ active: section.id === 'hero' ? !activeSection : isActive(section.id) }"
          class="nav-tab"
          @click.prevent="handleNavigation(section.id)"
        >
          {{ section.label }}
        </router-link>

        <!-- Sections with subsections (dropdown) -->
        <div
          v-else
          class="relative h-full flex items-center"
          @mouseenter="openDropdown = section.id"
          @mouseleave="closeDropdown"
        >
          <router-link
            :to="getRoutePath(section.id)"
            :class="{ active: isSectionOrSubsectionActive(section) }"
            class="nav-tab gap-1.5"
            @click.prevent="handleNavigation(section.id)"
          >
            {{ section.label }}
            <i
              class="fa-solid fa-chevron-down text-[10px] transition-transform duration-300"
              aria-hidden="true"
            ></i>
          </router-link>
          <div v-show="openDropdown === section.id" class="nav-dropdown">
            <router-link
              v-for="subsection in section.subsections"
              :key="subsection.id"
              :to="getRoutePath(subsection.id)"
              :class="{ active: isActive(subsection.id) }"
              class="nav-dropdown-item"
              @click.prevent="handleNavigation(subsection.id)"
            >
              {{ subsection.label }}
            </router-link>
          </div>
        </div>
      </template>
    </nav>

    <!-- Auth & Social Buttons (Desktop) -->
    <div class="hidden lg:flex items-center gap-3 ml-auto">
      <!-- Admin Link (if admin) -->
      <router-link
        v-if="isAdmin"
        to="/admin"
        class="flex items-center gap-2 px-4 py-2 bg-massgate-gold/15 border border-massgate-gold/40 text-massgate-gold font-body text-sm uppercase tracking-wide transition-all duration-300 hover:bg-massgate-gold hover:border-massgate-gold-bright hover:text-ink hover:shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0"
      >
        <i class="fa-solid fa-crown"></i>
        Admin
      </router-link>

      <!-- Logout Button (if authenticated) -->
      <button
        v-if="isAuthenticated"
        class="flex items-center gap-2 px-4 py-2 bg-massgate-red/15 border border-massgate-red/40 text-massgate-red-bright font-body text-sm uppercase tracking-wide transition-all duration-300 hover:bg-massgate-red hover:border-massgate-red-bright hover:text-white hover:shadow-massgate-border hover:-translate-y-0.5 active:translate-y-0"
        @click="handleLogout"
      >
        <i class="fa-solid fa-right-from-bracket"></i>
        Logout
      </button>

      <!-- Login Link (if not authenticated) -->
      <router-link
        v-if="!isAuthenticated"
        to="/login"
        class="flex items-center gap-2 px-4 py-2 bg-teal/15 border border-teal/40 text-teal font-body text-sm uppercase tracking-wide transition-all duration-300 hover:bg-teal hover:border-teal-bright hover:text-ink hover:shadow-teal-border hover:-translate-y-0.5 active:translate-y-0"
      >
        <i class="fa-solid fa-right-to-bracket"></i>
        Login
      </router-link>

      <!-- Discord Social Button -->
      <a
        href="https://discord.gg/WnxwfMTyBe"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-center w-11 h-11 bg-discord/15 border border-discord/30 rounded-none text-discord transition-all duration-300 cursor-pointer no-underline hover:bg-discord hover:border-discord-dark hover:text-white hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(88,101,242,0.4),0_0_36px_rgba(88,101,242,0.3)] active:translate-y-0 active:shadow-[0_4px_16px_rgba(88,101,242,0.35),0_0_24px_rgba(88,101,242,0.25)]"
        aria-label="Join Discord Server"
      >
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16" class="w-6 h-6">
          <path
            d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"
          />
        </svg>
      </a>
    </div>

    <!-- Enhanced hamburger menu button -->
    <button
      :class="{ active: mobileOpen }"
      class="flex lg:hidden bg-gradient-to-br from-texture-panel/95 to-texture-dark/95 border-2 border-teal/60 rounded-none p-3 cursor-pointer transition-all duration-300 relative w-12 h-12 justify-center items-center flex-col gap-1 [-webkit-tap-highlight-color:transparent] z-[1001] hover:bg-teal/10 hover:border-teal sm:w-11 sm:h-11 sm:p-2.5 xs:w-10 xs:h-10 xs:p-2"
      aria-label="Toggle mobile menu"
      aria-expanded="mobileOpen"
      @click="toggleMobileMenu"
    >
      <span
        class="block w-6 h-[3px] bg-t-secondary rounded-none transition-all duration-300 origin-center sm:w-5 sm:h-0.5 xs:w-[18px] [.active_&]:translate-y-[7px] [.active_&]:rotate-45 [.active_&]:bg-t [.active_&:hover]:bg-teal-bright sm:[.active_&]:translate-y-1.5"
      ></span>
      <span
        class="block w-6 h-[3px] bg-t-secondary rounded-none transition-all duration-300 origin-center sm:w-5 sm:h-0.5 xs:w-[18px] [.active_&]:opacity-0 [.active_&]:scale-0"
      ></span>
      <span
        class="block w-6 h-[3px] bg-t-secondary rounded-none transition-all duration-300 origin-center sm:w-5 sm:h-0.5 xs:w-[18px] [.active_&]:-translate-y-[7px] [.active_&]:-rotate-45 [.active_&]:bg-t [.active_&:hover]:bg-teal-bright sm:[.active_&]:-translate-y-1.5"
      ></span>
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
          class="absolute top-[var(--header-height)] left-0 w-screen border-t-[3px] border-t-teal shadow-teal-subtle pointer-events-auto flex flex-col p-0 min-h-[calc(100vh-var(--header-height))]"
          style="
            background: linear-gradient(
              180deg,
              rgba(10, 10, 10, 0.98) 0%,
              rgba(5, 5, 5, 0.99) 100%
            );
          "
        >
          <template v-for="section in navSections" :key="section.id">
            <!-- Sections without subsections -->
            <router-link
              v-if="!section.subsections"
              :to="getRoutePath(section.id)"
              :class="{ active: section.id === 'hero' ? !activeSection : isActive(section.id) }"
              class="nav-mobile-link"
              @click.prevent="handleNavigation(section.id)"
            >
              {{ section.label }}
            </router-link>

            <!-- Sections with subsections (expandable) -->
            <div v-else class="flex flex-col w-full">
              <div class="flex items-center w-full border-b border-teal-dark/20">
                <router-link
                  :to="getRoutePath(section.id)"
                  :class="{ active: isSectionOrSubsectionActive(section) }"
                  class="nav-mobile-link flex-1 border-b-0"
                  @click.prevent="handleNavigation(section.id)"
                >
                  {{ section.label }}
                </router-link>
                <button
                  :class="{ open: openDropdown === section.id }"
                  class="bg-transparent border-0 text-teal text-base py-6 px-8 min-h-[72px] cursor-pointer transition-all duration-300 flex items-center justify-center hover:bg-teal-dark/30 hover:text-teal-bright [&.open>i]:rotate-180"
                  @click="toggleDropdown(section.id)"
                >
                  <i
                    class="fa-solid fa-chevron-down transition-transform duration-300"
                    aria-hidden="true"
                  ></i>
                </button>
              </div>
              <div
                v-show="openDropdown === section.id"
                class="flex flex-col bg-gradient-to-b from-teal-dark/20 to-teal/10 border-b border-teal-dark/20"
              >
                <router-link
                  v-for="subsection in section.subsections"
                  :key="subsection.id"
                  :to="getRoutePath(subsection.id)"
                  :class="{
                    'bg-gradient-to-r from-teal-dark/50 to-teal/30 text-white font-bold pl-[60px] before:text-teal-bright before:opacity-100 shadow-teal-border':
                      isActive(subsection.id),
                  }"
                  class="flex items-center w-full py-[18px] px-8 pl-[52px] min-h-[60px] text-battlefield-mist no-underline font-body text-base font-semibold normal-case tracking-wide bg-transparent transition-all duration-300 relative border-b border-teal-dark/10 last:border-b-0 before:content-['•'] before:absolute before:left-8 before:text-teal before:text-xl before:opacity-60 hover:bg-gradient-to-r hover:from-teal-dark/40 hover:to-transparent hover:via-teal/30 hover:text-t hover:pl-[60px]"
                  @click.prevent="handleNavigation(subsection.id)"
                >
                  {{ subsection.label }}
                </router-link>
              </div>
            </div>
          </template>

          <!-- Auth Links in Mobile Menu -->
          <router-link
            v-if="isAdmin"
            to="/admin"
            class="flex items-center gap-3 w-full py-5 px-8 min-h-[70px] text-massgate-gold no-underline font-military text-base font-semibold uppercase tracking-wider bg-gradient-to-r from-massgate-gold/15 to-massgate-gold/5 border-t border-b border-massgate-gold/30 transition-all duration-300 hover:bg-gradient-to-r hover:from-massgate-gold hover:to-massgate-gold/30 hover:via-massgate-gold-dark hover:text-ink hover:pl-10 hover:border-massgate-gold-bright"
            @click="closeMobileMenu"
          >
            <i class="fa-solid fa-crown w-5 h-5 flex-shrink-0"></i>
            Admin Dashboard
          </router-link>

          <button
            v-if="isAuthenticated"
            class="flex items-center gap-3 w-full py-5 px-8 min-h-[70px] text-massgate-red-bright no-underline font-military text-base font-semibold uppercase tracking-wider bg-gradient-to-r from-massgate-red/15 to-massgate-red/5 border-t border-b border-massgate-red/30 transition-all duration-300 hover:bg-gradient-to-r hover:from-massgate-red hover:to-massgate-red/30 hover:via-massgate-red-dark hover:text-white hover:pl-10 hover:border-massgate-red-bright text-left"
            @click="handleLogout"
          >
            <i class="fa-solid fa-right-from-bracket w-5 h-5 flex-shrink-0"></i>
            Logout
          </button>

          <router-link
            v-if="!isAuthenticated"
            to="/login"
            class="flex items-center gap-3 w-full py-5 px-8 min-h-[70px] text-teal no-underline font-military text-base font-semibold uppercase tracking-wider bg-gradient-to-r from-teal/15 to-teal/5 border-t border-b border-teal/30 transition-all duration-300 hover:bg-gradient-to-r hover:from-teal hover:to-teal/30 hover:via-teal-dark hover:text-ink hover:pl-10 hover:border-teal-bright"
            @click="closeMobileMenu"
          >
            <i class="fa-solid fa-right-to-bracket w-5 h-5 flex-shrink-0"></i>
            Login
          </router-link>

          <!-- Discord Link in Mobile Menu -->
          <a
            href="https://discord.gg/WnxwfMTyBe"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 w-full py-5 px-8 min-h-[70px] text-discord no-underline font-military text-base font-semibold uppercase tracking-wider bg-gradient-to-r from-discord/15 to-discord/5 border-t border-b border-discord/30 mt-auto transition-all duration-300 hover:bg-gradient-to-r hover:from-discord hover:to-discord/30 hover:via-discord-dark hover:text-white hover:pl-10 hover:border-discord-dark"
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
<style scoped>
header {
  width: 100%;
}

/* Vue transition animations */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: all 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.mobile-nav-enter-from > div,
.mobile-nav-leave-to > div {
  transform: translateY(-100%);
  opacity: 0;
}

.mobile-nav-enter-to > div,
.mobile-nav-leave-from > div {
  transform: translateY(0);
  opacity: 1;
}
</style>
