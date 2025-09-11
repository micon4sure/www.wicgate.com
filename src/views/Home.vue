<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import Navigation from '../components/Navigation.vue';
import PlayersOnline from '../components/PlayersOnline.vue';
import SiteFooter from '../components/Footer.vue';
import GettingStarted from '../screens/GettingStarted.vue';
import Statistics from '../screens/Statistics.vue';
import Community from '../screens/Community.vue';
import FAQ from '../screens/FAQ.vue';
import FirstVisitOverlay from '../components/FirstVisitOverlay.vue';
import { useAppData } from '../composables/useAppData';
import { useFirstVisit } from '../composables/useFirstVisit';

const { data, playerCount } = useAppData();
const { showFirstVisitOverlay, initFirstVisitCheck, dismissOverlay } = useFirstVisit();
const router = useRouter();
const panelRef = ref<InstanceType<typeof PlayersOnline> | null>(null);
const currentSection = ref<string | undefined>();

interface Slide { icon: string; title: string; sub: string }
const slides: Slide[] = [
  { icon: '💥', title: 'Massive Multiplayer Battles', sub: '16-player combined arms warfare' },
  { icon: '🚁', title: 'Air Superiority', sub: 'Command attack helicopters and air strikes' },
  { icon: '🛡️', title: 'Armored Divisions', sub: 'Lead heavy armor in breakthrough operations' },
  { icon: '🎯', title: 'Tactical Support', sub: 'Artillery, repair, and strategic coordination' },
  { icon: '🏆', title: 'Competitive Tournaments', sub: 'Weekly events and seasonal championships' }
];
const curSlide = ref(0);
let int: any;
function changeSlide(i: number) { curSlide.value = i; resetInterval(); }
function resetInterval() { clearInterval(int); int = setInterval(() => { curSlide.value = (curSlide.value + 1) % slides.length; }, 6000); }

onMounted(() => {
  resetInterval();

  const hash = window.location.hash ? window.location.hash.substring(1) : undefined;

  // Set current section for first visit overlay
  if (hash) {
    currentSection.value = hash;
  }

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
});

onBeforeUnmount(() => {
  clearInterval(int);
});

function togglePlayers() { panelRef.value?.toggle(); }

// First visit overlay handlers
function handleGoHome() {
  dismissOverlay();
  // Clear any hash and show home page
  history.replaceState(null, '', window.location.pathname);
  currentSection.value = undefined;
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleContinue() {
  dismissOverlay();
  const hash = window.location.hash ? window.location.hash.substring(1) : undefined;

  if (hash) {
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
  }
}
</script>
<template>
  <div class="site-wrapper" id="siteWrapper">
    <div>
      <header>
        <Navigation :show-players-button="true" @toggle-players="togglePlayers">
          <template #player-count>{{ playerCount }}</template>
        </Navigation>
      </header>

      <!-- Hero -->
      <section class="hero" id="hero">
        <div class="hero-grid container">
          <div class="hero-content">
            <div class="hero-tag">The War Continues</div>
            <h1>World in Conflict<br>Lives Again</h1>
            <p>Join our community in epic Cold War battles. Fully restored multiplayer servers with the real Massgate
              code.
            </p>
            <div class="hero-acts">
              <a href="#getting-started" class="btn btn-p" @click.prevent="scrollToGettingStarted">↓
                Get WIC LIVE</a>
              <a href="https://discord.gg/WnxwfMTyBe" target="_blank" class="btn btn-d">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path
                    d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
                </svg>
                Join Discord
              </a>
            </div>
          </div>
          <div class="hero-vis">
            <div v-for="(s, i) in slides" :key="s.title" class="h-slide" :class="{ active: i === curSlide }">
              <div class="slide-cont">
                <div class="icon-ph">{{ s.icon }}</div>
                <h3>{{ s.title }}</h3>
                <p class="text-muted">{{ s.sub }}</p>
              </div>
            </div>
            <div class="slide-ind">
              <div v-for="(s, i) in slides" :key="s.title + 'dot'" class="s-dot" :class="{ active: i === curSlide }"
                @click="changeSlide(i)" />
            </div>
          </div>
        </div>
      </section>

      <div id="screens">
        <GettingStarted />
        <Statistics />
        <Community />
        <FAQ />
      </div>
      <SiteFooter />
    </div>
  </div>

  <!-- Players Panel -->
  <PlayersOnline ref="panelRef" :players="data.profiles || []" @enter-game-mode="enterGameMode" />

  <!-- First Visit Overlay -->
  <FirstVisitOverlay v-if="showFirstVisitOverlay" :current-section="currentSection" @go-home="handleGoHome"
    @continue="handleContinue" @close="dismissOverlay" />
</template>
<style lang="scss">
// Section stacking and subtle alternating tints within the #screens container
#screens {
  >* {
    padding: 48px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.02);

    // Even-indexed screens (2, 4, ...): warm/red tint
    &:nth-child(even) {
      background: linear-gradient(180deg,
          rgba(255, 200, 200, 0.02),
          rgba(255, 180, 180, 0.1));
    }

    // Odd-indexed screens (3, 5, ...): cool/blue tint
    &:nth-child(odd) {
      background: linear-gradient(180deg,
          rgba(200, 220, 255, 0.02),
          rgba(180, 200, 255, 0.2));
    }
  }
}
</style>
