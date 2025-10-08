<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@vueuse/head';
import Navigation from '../components/Navigation.vue';
import LivePlayersBadge from '../components/LivePlayersBadge.vue';
import SiteFooter from '../components/Footer.vue';
import GettingStarted from '../screens/GettingStarted.vue';
import Multiplayer from '../screens/Multiplayer.vue';
import Community from '../screens/Community.vue';
import About from '../screens/About.vue';
import FAQ from '../screens/FAQ.vue';
import FirstVisitOverlay from '../components/FirstVisitOverlay.vue';
import { useAppDataStore } from '../stores/appDataStore';
import { useFirstVisit } from '../composables/useFirstVisit';
import { getHeaderHeightWithBuffer, scrollToSection as scrollToSectionUtil } from '../utils/scroll';
import { generateOrganizationSchema, generateWebSiteSchema } from '../utils/structuredData';
import { initWebVitals } from '../utils/performance';
import { rafThrottle } from '../utils/rafThrottle';
import { SCROLL_SMOOTH_DURATION, SCROLL_FAST_SETTLE, SCROLL_TOP_DURATION } from '../constants';

const store = useAppDataStore();
const { data, playerCount, loading } = store;
const { showFirstVisitOverlay, initFirstVisitCheck, dismissOverlay } = useFirstVisit();
const route = useRoute();
const router = useRouter();
const currentSection = ref<string | undefined>();
const SECTION_IDS = ['hero', 'getting-started', 'multiplayer', 'community', 'about', 'faq'];
let sectionElements: HTMLElement[] = [];
let scrollListenerAttached = false;

// Fast scroll detection for smooth navigation animations
const isFastScrolling = ref(false);
let lastSectionChangeTime = 0;
let fastScrollTimeout: number | undefined;

// Programmatic scroll detection to prevent listener interference
const isProgrammaticScrolling = ref(false);
let programmaticScrollTimeout: number | undefined;

// SSG conditional rendering
const isSSR = import.meta.env.SSR;
const targetSection = computed(() => route.meta.section as string | undefined);

// Determine which sections to render based on SSR vs CSR
function shouldRenderSection(sectionId: string): boolean {
  // Client-side: always render all sections for smooth long-scroll
  if (!isSSR) return true;

  // Server-side/build-time rendering
  if (!targetSection.value) {
    // Homepage: render all sections
    return true;
  }

  // Specific section page: render only that section for SEO
  return targetSection.value === sectionId;
}

// Dynamic meta tags based on route
useHead({
  title: () => (route.meta.title as string) || 'WICGATE - World in Conflict Multiplayer Revival',
  meta: [
    {
      name: 'description',
      content: () =>
        (route.meta.description as string) ||
        'Play World in Conflict online with restored multiplayer servers.',
    },
    {
      name: 'keywords',
      content: () =>
        (route.meta.keywords as string) || 'world in conflict, wic multiplayer, massgate',
    },
    // Open Graph
    {
      property: 'og:title',
      content: () => (route.meta.title as string) || 'WICGATE',
    },
    {
      property: 'og:description',
      content: () =>
        (route.meta.description as string) ||
        'Play World in Conflict online with restored multiplayer servers.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: () => `https://wicgate.com${route.path}`,
    },
    {
      property: 'og:image',
      content: () => (route.meta.ogImage as string) || 'https://wicgate.com/og-default.jpg',
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: () => (route.meta.title as string) || 'WICGATE',
    },
    {
      name: 'twitter:description',
      content: () =>
        (route.meta.description as string) ||
        'Play World in Conflict online with restored multiplayer servers.',
    },
    {
      name: 'twitter:image',
      content: () => (route.meta.ogImage as string) || 'https://wicgate.com/og-default.jpg',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: () => `https://wicgate.com${route.path}`,
    },
  ],
  script: [
    // Organization schema for all pages
    {
      type: 'application/ld+json',
      children: JSON.stringify(generateOrganizationSchema()),
    },
    // WebSite schema for homepage only
    ...(!targetSection.value
      ? [
          {
            type: 'application/ld+json',
            children: JSON.stringify(generateWebSiteSchema()),
          },
        ]
      : []),
  ],
});

function setCurrentSection(id?: string | null) {
  const normalized = id && id !== 'hero' ? id : undefined;
  if (currentSection.value !== normalized) {
    // Detect fast scrolling (section changes within 150ms)
    const now = Date.now();
    const timeSinceLastChange = now - lastSectionChangeTime;

    if (timeSinceLastChange < 150 && lastSectionChangeTime > 0) {
      // Fast scrolling detected - disable transitions
      isFastScrolling.value = true;

      // Clear any existing timeout
      if (fastScrollTimeout) {
        clearTimeout(fastScrollTimeout);
      }

      // Re-enable transitions after scrolling settles
      fastScrollTimeout = setTimeout(() => {
        isFastScrolling.value = false;
      }, SCROLL_FAST_SETTLE) as unknown as number;
    }

    lastSectionChangeTime = now;
    currentSection.value = normalized;
  }
}

// Dynamic header measurement imported from utils/scroll.ts
// (Removed duplicate code - now using shared utility)

function collectSectionElements() {
  sectionElements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
    Boolean
  ) as HTMLElement[];
}

function updateActiveSection() {
  if (!sectionElements.length) return;

  // Skip during programmatic scrolling to prevent flash
  if (isProgrammaticScrolling.value) return;

  const scrollY = window.scrollY || window.pageYOffset;
  // Use buffer for detection tolerance (allows slight scroll past before switching)
  const offset = getHeaderHeightWithBuffer();

  for (const el of sectionElements) {
    const rect = el.getBoundingClientRect();
    const top = rect.top + scrollY;
    const bottom = top + rect.height;

    if (scrollY + offset >= top && scrollY + offset < bottom) {
      setCurrentSection(el.id);
      return;
    }
  }

  // Use responsive offset for hero section threshold too
  if (scrollY < offset - 40) {
    setCurrentSection('hero');
  }
}

// Throttle scroll/resize handlers with RAF for 60fps performance
const throttledUpdateSection = rafThrottle(updateActiveSection);

interface Slide {
  icon: string;
  title: string;
  sub: string;
}
// Using Font Awesome icon class names instead of emoji
const slides: Slide[] = [
  {
    icon: 'fa-solid fa-explosion',
    title: 'Massive Multiplayer Battles',
    sub: '16-player combined arms warfare',
  },
  {
    icon: 'fa-solid fa-helicopter',
    title: 'Air Superiority',
    sub: 'Command attack helicopters and air strikes',
  },
  {
    icon: 'fa-solid fa-shield-halved',
    title: 'Armored Divisions',
    sub: 'Lead heavy armor in breakthrough operations',
  },
  {
    icon: 'fa-solid fa-bullseye',
    title: 'Tactical Support',
    sub: 'Artillery, repair, and strategic coordination',
  },
  {
    icon: 'fa-solid fa-trophy',
    title: 'Competitive Tournaments',
    sub: 'Weekly events and seasonal championships',
  },
];
const curSlide = ref(0);
let int: number | undefined;
function nextSlide() {
  curSlide.value = (curSlide.value + 1) % slides.length;
  resetInterval();
}
function prevSlide() {
  curSlide.value = (curSlide.value - 1 + slides.length) % slides.length;
  resetInterval();
}
function resetInterval() {
  clearInterval(int);
  int = setInterval(() => {
    curSlide.value = (curSlide.value + 1) % slides.length;
  }, 6000);
}

// Touch/swipe handling
const touchStartX = ref(0);
const touchEndX = ref(0);
const minSwipeDistance = 50;

function handleTouchStart(e: TouchEvent) {
  touchStartX.value = e.touches[0].clientX;
}

function handleTouchEnd(e: TouchEvent) {
  touchEndX.value = e.changedTouches[0].clientX;
  handleSwipe();
}

function handleSwipe() {
  const swipeDistance = touchEndX.value - touchStartX.value;

  if (Math.abs(swipeDistance) > minSwipeDistance) {
    if (swipeDistance > 0) {
      // Swiped right - go to previous slide
      prevSlide();
    } else {
      // Swiped left - go to next slide
      nextSlide();
    }
  }
}

onMounted(() => {
  // Skip client-side initialization during SSG
  if (isSSR) return;

  // Initialize performance monitoring
  initWebVitals();

  // Initialize store data
  store.init();

  resetInterval();

  // Determine initial section from route
  const sectionFromRoute = targetSection.value;
  const hash = window.location.hash ? window.location.hash.substring(1) : undefined;

  // Set current section for first visit overlay
  setCurrentSection(sectionFromRoute || hash);

  // Check for first visit and show overlay if needed
  initFirstVisitCheck(!!(hash || sectionFromRoute));

  // Scroll handling moved to router's async scrollBehavior in main.ts
  // This ensures content loads before scrolling, preventing position jumps
  // (No manual scroll on mount - let router handle it after content ready)

  nextTick(() => {
    collectSectionElements();
    if (!scrollListenerAttached) {
      window.addEventListener('scroll', throttledUpdateSection, { passive: true });
      window.addEventListener('resize', throttledUpdateSection);
      scrollListenerAttached = true;
    }
    updateActiveSection();
  });
});

onBeforeUnmount(() => {
  // Clear slide carousel interval
  clearInterval(int);

  // Remove scroll listeners and cancel pending RAF
  if (scrollListenerAttached) {
    throttledUpdateSection.cancel();
    window.removeEventListener('scroll', throttledUpdateSection);
    window.removeEventListener('resize', throttledUpdateSection);
    scrollListenerAttached = false;
  }

  // Clear all timeouts to prevent memory leaks
  if (fastScrollTimeout !== undefined) {
    clearTimeout(fastScrollTimeout);
    fastScrollTimeout = undefined;
  }
  if (programmaticScrollTimeout !== undefined) {
    clearTimeout(programmaticScrollTimeout);
    programmaticScrollTimeout = undefined;
  }
});

// First visit overlay handlers
function handleGoHome() {
  dismissOverlay();
  // Clear any hash and show home page
  history.replaceState(null, '', window.location.pathname);
  setCurrentSection(undefined);
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleContinue() {
  dismissOverlay();
  const hash = window.location.hash ? window.location.hash.substring(1) : undefined;

  if (hash) {
    setCurrentSection(hash);
    const element = document.getElementById(hash);
    if (element) {
      // Use the shared scroll utility to ensure consistency with active section detection
      scrollToSectionUtil(hash, 'smooth');
    }
  }
}
function scrollToGettingStarted() {
  router.push('/getting-started');
}

function handleLiveBadgeClick() {
  router.push('/multiplayer');
}

function handleNavNavigate(section?: string) {
  setCurrentSection(section);

  // Set flag for programmatic scroll on every nav click
  // This handles both route changes AND same-route clicks (e.g., click FAQ while already on /faq)
  isProgrammaticScrolling.value = true;

  if (programmaticScrollTimeout) {
    clearTimeout(programmaticScrollTimeout);
  }
  programmaticScrollTimeout = setTimeout(() => {
    isProgrammaticScrolling.value = false;
  }, SCROLL_SMOOTH_DURATION) as unknown as number;
}

// Scroll to section when route changes (wraps utility for nextTick)
function scrollToSection(sectionId: string) {
  // Wait for all sections to render on client-side
  nextTick(() => {
    scrollToSectionUtil(sectionId);
  });
}

// Watch for route changes and scroll to the target section
watch(
  () => route.meta.section,
  (newSection) => {
    if (isSSR) return;

    if (newSection) {
      setCurrentSection(newSection as string);

      // Disable scroll listener during programmatic scroll
      isProgrammaticScrolling.value = true;

      // Scroll to section immediately
      scrollToSection(newSection as string);

      // Re-enable scroll listener after smooth scroll completes
      if (programmaticScrollTimeout) {
        clearTimeout(programmaticScrollTimeout);
      }
      programmaticScrollTimeout = setTimeout(() => {
        isProgrammaticScrolling.value = false;
      }, SCROLL_SMOOTH_DURATION) as unknown as number;
    } else {
      // Homepage - scroll to top
      setCurrentSection(undefined);
      isProgrammaticScrolling.value = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (programmaticScrollTimeout) {
        clearTimeout(programmaticScrollTimeout);
      }
      programmaticScrollTimeout = setTimeout(() => {
        isProgrammaticScrolling.value = false;
      }, SCROLL_TOP_DURATION) as unknown as number;
    }
  }
);
</script>
<template>
  <div id="siteWrapper" class="site-wrapper">
    <header>
      <Navigation
        :active-section="currentSection"
        :is-fast-scrolling="isFastScrolling"
        @navigate="handleNavNavigate"
      />
    </header>

    <div class="main-content">
      <!-- Hero - only rendered on homepage -->
      <section v-if="shouldRenderSection('hero')" id="hero" class="hero">
        <div class="hero-grid container">
          <div class="hero-content">
            <div class="hero-tag">THE WAR CONTINUES</div>
            <h1 class="military-title">
              World in Conflict<br /><span class="hero-subtitle">is Live Again</span>
            </h1>
            <p class="hero-description">
              Join our community in epic Cold War battles. Fully restored multiplayer servers with
              the real Massgate code.
            </p>
            <div class="hero-acts">
              <a
                href="#getting-started"
                class="btn btn-download"
                @click.prevent="scrollToGettingStarted"
                ><i class="fa-solid fa-arrow-down" aria-hidden="true"></i> INSTALL WICGATE</a
              >
              <a
                href="https://discord.gg/WnxwfMTyBe"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-d"
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path
                    d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"
                  />
                </svg>
                Join Discord
              </a>
            </div>
            <LivePlayersBadge
              :player-count="playerCount"
              :loading="loading"
              @click="handleLiveBadgeClick"
            />
          </div>
          <div class="hero-vis" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
            <div
              v-for="(s, i) in slides"
              :key="s.title"
              class="h-slide"
              :class="{ active: i === curSlide }"
            >
              <div class="slide-cont">
                <div class="icon-ph"><i :class="s.icon" aria-hidden="true"></i></div>
                <h3>{{ s.title }}</h3>
                <p class="text-muted">{{ s.sub }}</p>
              </div>
            </div>
            <!-- Navigation arrows -->
            <button
              class="slide-arrow slide-arrow-prev"
              aria-label="Previous slide"
              @click="prevSlide"
            >
              <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
            </button>
            <button class="slide-arrow slide-arrow-next" aria-label="Next slide" @click="nextSlide">
              <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </section>

      <div id="screens">
        <GettingStarted v-if="shouldRenderSection('getting-started')" />
        <Multiplayer v-if="shouldRenderSection('multiplayer')" :data="data" :loading="loading" />
        <Community v-if="shouldRenderSection('community')" />
        <About v-if="shouldRenderSection('about')" />
        <FAQ v-if="shouldRenderSection('faq')" />
      </div>
      <SiteFooter />
    </div>
  </div>

  <!-- First Visit Overlay -->
  <FirstVisitOverlay
    v-if="showFirstVisitOverlay"
    :current-section="currentSection"
    @go-home="handleGoHome"
    @continue="handleContinue"
    @close="dismissOverlay"
  />
</template>
<style lang="scss">
// Section stacking with military-themed subtle variations
#screens {
  > * {
    padding: 48px 0;
    border-top: 2px solid rgba(var(--mg-rgb), 0.1);

    // Even-indexed screens: subtle orange military tint
    &:nth-child(even) {
      background: linear-gradient(
        180deg,
        rgba(var(--mg-rgb), 0.02) 0%,
        rgba(15, 15, 15, 0.95) 100%
      );
    }

    // Odd-indexed screens: subtle accent tint
    &:nth-child(odd) {
      background: linear-gradient(
        180deg,
        rgba(var(--sw-rgb), 0.06) 0%,
        rgba(10, 16, 21, 0.96) 100%
      );
    }
  }
}

// Military typography for hero content
.military-title {
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--t);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
