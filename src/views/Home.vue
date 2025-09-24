<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import Navigation from '../components/Navigation.vue';
import PlayersOnline from '../components/PlayersOnline.vue';
import SiteFooter from '../components/Footer.vue';
import GettingStarted from '../screens/GettingStarted.vue';
import Statistics from '../screens/Statistics.vue';
import Community from '../screens/Community.vue';
import About from '../screens/About.vue';
import FAQ from '../screens/FAQ.vue';
import FirstVisitOverlay from '../components/FirstVisitOverlay.vue';
import { useAppDataStore } from '../stores/appDataStore';
import { useFirstVisit } from '../composables/useFirstVisit';

const store = useAppDataStore();
const { data, playerCount } = store;
const { showFirstVisitOverlay, initFirstVisitCheck, dismissOverlay } = useFirstVisit();
const router = useRouter();
const panelRef = ref<InstanceType<typeof PlayersOnline> | null>(null);
const currentSection = ref<string | undefined>();
const SECTION_IDS = ['hero', 'getting-started', 'statistics', 'community', 'about', 'faq'];
let sectionElements: HTMLElement[] = [];
let scrollListenerAttached = false;

function setCurrentSection(id?: string | null) {
  const normalized = id && id !== 'hero' ? id : undefined;
  if (currentSection.value !== normalized) {
    currentSection.value = normalized;
  }
}

function collectSectionElements() {
  sectionElements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
    Boolean
  ) as HTMLElement[];
}

function updateActiveSection() {
  if (!sectionElements.length) return;

  const scrollY = window.scrollY || window.pageYOffset;
  const offset = 160; // account for fixed header height

  for (const el of sectionElements) {
    const rect = el.getBoundingClientRect();
    const top = rect.top + scrollY;
    const bottom = top + rect.height;

    if (scrollY + offset >= top && scrollY + offset < bottom) {
      setCurrentSection(el.id);
      return;
    }
  }

  if (scrollY < 120) {
    setCurrentSection('hero');
  }
}

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
let int: any;
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
  // Initialize store data
  store.init();

  resetInterval();

  const hash = window.location.hash ? window.location.hash.substring(1) : undefined;

  // Set current section for first visit overlay
  setCurrentSection(hash);

  // Check for first visit and show overlay if needed
  initFirstVisitCheck(!!hash);

  // Only enter modes if not showing first visit overlay
  if (!showFirstVisitOverlay.value && hash) {
    const element = document.getElementById(hash);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  nextTick(() => {
    collectSectionElements();
    if (!scrollListenerAttached) {
      window.addEventListener('scroll', updateActiveSection, { passive: true });
      window.addEventListener('resize', updateActiveSection);
      scrollListenerAttached = true;
    }
    updateActiveSection();
  });
});

onBeforeUnmount(() => {
  clearInterval(int);
  if (scrollListenerAttached) {
    window.removeEventListener('scroll', updateActiveSection);
    window.removeEventListener('resize', updateActiveSection);
    scrollListenerAttached = false;
  }
});

function togglePlayers() {
  panelRef.value?.toggle();
}

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
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
}
function enterGameMode() {
  router.push('/game-mode');
}
function scrollToGettingStarted() {
  const element = document.getElementById('getting-started');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', '#getting-started');
    setCurrentSection('getting-started');
  }
}

function handleNavNavigate(section?: string) {
  setCurrentSection(section);
}
</script>
<template>
  <div id="siteWrapper" class="site-wrapper">
    <header>
      <Navigation
        :show-players-button="true"
        :active-section="currentSection"
        @toggle-players="togglePlayers"
        @navigate="handleNavNavigate"
      >
        <template #player-count>{{ playerCount }}</template>
      </Navigation>
    </header>

    <div class="main-content">
      <!-- Hero -->
      <section id="hero" class="hero">
        <div class="hero-grid container">
          <div class="hero-content">
            <div class="hero-tag">The War Continues</div>
            <h1 class="military-title">World in Conflict<br />Is Live Again</h1>
            <p>
              Join our community in epic Cold War battles. Fully restored multiplayer servers with
              the real Massgate code.
            </p>
            <div class="hero-acts">
              <a
                href="#getting-started"
                class="btn btn-download"
                @click.prevent="scrollToGettingStarted"
                ><i class="fa-solid fa-arrow-down" aria-hidden="true"></i> Get WIC LIVE</a
              >
              <a href="https://discord.gg/WnxwfMTyBe" target="_blank" class="btn btn-d">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path
                    d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"
                  />
                </svg>
                Join Discord
              </a>
            </div>
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
        <GettingStarted />
        <Statistics />
        <Community />
        <About />
        <FAQ />
      </div>
      <SiteFooter />
    </div>
  </div>

  <!-- Players Panel -->
  <PlayersOnline
    ref="panelRef"
    :players="data.profiles || []"
    :servers="data.servers || []"
    @enter-game-mode="enterGameMode"
  />

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
