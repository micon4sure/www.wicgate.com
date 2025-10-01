<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@vueuse/head';
import Navigation from '../components/Navigation.vue';
import PlayersOnline from '../components/PlayersOnline.vue';
import SiteFooter from '../components/Footer.vue';
import FAQ from '../screens/FAQ.vue';
import About from '../screens/About.vue';
import FirstVisitOverlay from '../components/FirstVisitOverlay.vue';
import { useAppDataStore } from '../stores/appDataStore';
import { useFirstVisit } from '../composables/useFirstVisit';
import { scrollToSection as scrollToSectionUtil, getHeaderHeightWithBuffer } from '../utils/scroll';
import { generateOrganizationSchema, generateWebSiteSchema } from '../utils/structuredData';
import { initWebVitals } from '../utils/performance';

type SectionId = 'hero' | 'faq' | 'about';

const store = useAppDataStore();
const { data, playerCount } = store;
const { showFirstVisitOverlay, initFirstVisitCheck, dismissOverlay } = useFirstVisit();
const router = useRouter();
const route = useRoute();

const panelRef = ref<InstanceType<typeof PlayersOnline> | null>(null);
const currentSection = ref<SectionId>('hero');

const SECTION_IDS: SectionId[] = ['hero', 'faq', 'about'];
const homeSubnav: Array<{ id: SectionId; label: string }> = [
  { id: 'hero', label: 'Quick Start' },
  { id: 'faq', label: 'FAQ' },
  { id: 'about', label: 'About WiCGATE' },
];

let sectionElements: HTMLElement[] = [];
let scrollListenerAttached = false;

const quickSteps = [
  {
    id: 'install',
    number: '01',
    title: 'Install World in Conflict',
    description: 'Grab it from Steam, GOG, or your original DVD copy.',
  },
  {
    id: 'patch',
    number: '02',
    title: 'Run WIC LIVE',
    description: 'Apply the community patch for modern fixes and map updates.',
  },
  {
    id: 'account',
    number: '03',
    title: 'Create your account',
    description: 'Launch the game, create a WICGATE login, and hop online.',
  },
];

const ctaCards = [
  {
    id: 'wic-live',
    icon: 'fa-solid fa-bolt',
    title: 'Get WIC LIVE',
    description:
      'One-click installer that patches your game, enables community maps, and keeps you ready for multiplayer nights.',
    buttonLabel: 'Download WIC LIVE',
    href: 'https://github.com/micon4sure/WICLIVE/releases/latest/download/wiclive_x64-setup.exe',
    buttonClass: 'btn btn-download',
    footnote: 'Windows 7–11 supported.',
  },
  {
    id: 'discord',
    icon: 'fa-brands fa-discord',
    title: 'Join the Discord',
    description:
      'Matchmaking pings, tech support, tournaments, and voice comms with commanders worldwide.',
    buttonLabel: 'Open Discord',
    href: 'https://discord.gg/WnxwfMTyBe',
    buttonClass: 'btn btn-p',
    footnote: '287+ commanders already connected.',
  },
];

useHead({
  title: () =>
    (route.meta.title as string) || 'WICGATE - Start Playing World in Conflict Multiplayer',
  meta: [
    {
      name: 'description',
      content: () =>
        (route.meta.description as string) ||
        'Install World in Conflict, patch it with WIC LIVE, and join our Discord for live multiplayer support.',
    },
    {
      name: 'keywords',
      content: () =>
        (route.meta.keywords as string) ||
        'world in conflict download, wic live installer, wic discord, world in conflict multiplayer setup',
    },
    {
      property: 'og:title',
      content: () => (route.meta.title as string) || 'WICGATE',
    },
    {
      property: 'og:description',
      content: () =>
        (route.meta.description as string) ||
        'Install World in Conflict, patch it with WIC LIVE, and join our Discord for live multiplayer support.',
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
        'Install World in Conflict, patch it with WIC LIVE, and join our Discord for live multiplayer support.',
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
    { type: 'application/ld+json', children: JSON.stringify(generateOrganizationSchema()) },
    { type: 'application/ld+json', children: JSON.stringify(generateWebSiteSchema()) },
  ],
});

function setCurrentSection(section: SectionId) {
  if (currentSection.value !== section) {
    currentSection.value = section;
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
  const offset = getHeaderHeightWithBuffer();

  for (const el of sectionElements) {
    const rect = el.getBoundingClientRect();
    const top = rect.top + scrollY;
    const bottom = top + rect.height;

    if (scrollY + offset >= top && scrollY + offset < bottom) {
      setCurrentSection(el.id as SectionId);
      return;
    }
  }

  if (scrollY < offset) {
    setCurrentSection('hero');
  }
}

function navigateToSection(section: SectionId, behavior: 'smooth' | 'auto' = 'smooth') {
  setCurrentSection(section);
  scrollToSectionUtil(section, behavior);
  if (section === 'hero') {
    history.replaceState(null, '', window.location.pathname);
  } else {
    history.replaceState(null, '', `#${section}`);
  }
}

function togglePlayers() {
  panelRef.value?.toggle();
}

function handleNavNavigate(section?: string) {
  const target: SectionId = SECTION_IDS.includes(section as SectionId)
    ? (section as SectionId)
    : 'hero';
  navigateToSection(target);
}

function handleResize() {
  collectSectionElements();
  updateActiveSection();
}

const isSSR = import.meta.env.SSR;

onMounted(() => {
  if (isSSR) return;

  initWebVitals();
  store.init();

  const hash = window.location.hash ? window.location.hash.substring(1) : '';
  const initialSection = SECTION_IDS.includes(hash as SectionId) ? (hash as SectionId) : 'hero';
  setCurrentSection(initialSection);

  initFirstVisitCheck(Boolean(hash));

  nextTick(() => {
    collectSectionElements();
    if (hash && SECTION_IDS.includes(hash as SectionId)) {
      setTimeout(() => navigateToSection(hash as SectionId), 120);
    }

    if (!scrollListenerAttached) {
      window.addEventListener('scroll', updateActiveSection, { passive: true });
      window.addEventListener('resize', handleResize);
      scrollListenerAttached = true;
    }

    updateActiveSection();
  });
});

onBeforeUnmount(() => {
  if (scrollListenerAttached) {
    window.removeEventListener('scroll', updateActiveSection);
    window.removeEventListener('resize', handleResize);
    scrollListenerAttached = false;
  }
});

function handleGoHome() {
  dismissOverlay();
  setCurrentSection('hero');
  history.replaceState(null, '', window.location.pathname);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleContinue() {
  dismissOverlay();
  const hash = window.location.hash ? window.location.hash.substring(1) : '';
  if (SECTION_IDS.includes(hash as SectionId)) {
    navigateToSection(hash as SectionId);
  }
}

function enterGameMode() {
  router.push('/game-mode');
}
</script>

<template>
  <div id="siteWrapper" class="site-wrapper">
    <header>
      <Navigation :active-section="currentSection === 'hero' ? undefined : currentSection" :player-count="playerCount"
        :show-players-button="true" @navigate="handleNavNavigate" @toggle-players="togglePlayers">
        <template #subnav>
          <nav class="home-subnav" aria-label="Home sections">
            <button v-for="item in homeSubnav" :key="item.id"
              :class="['home-subnav__item', { active: currentSection === item.id }]" type="button"
              @click="navigateToSection(item.id)">
              {{ item.label }}
            </button>
          </nav>
        </template>
      </Navigation>
    </header>

    <main class="home-main">
      <section id="hero" class="hero">
        <div class="container hero-grid">
          <div class="hero-content">
            <span class="hero-tag">World in Conflict Multiplayer</span>
            <h1 class="military-title">New Commander Quick Start</h1>
            <p class="hero-intro">
              Everything you need to get back online in minutes: install the game, patch it for
              modern systems, and connect with the community that keeps Massgate alive.
            </p>

            <div class="quick-steps" role="list">
              <article v-for="step in quickSteps" :key="step.id" class="quick-step" role="listitem">
                <span class="step-badge">{{ step.number }}</span>
                <div class="step-copy">
                  <h3>{{ step.title }}</h3>
                  <p>{{ step.description }}</p>
                </div>
              </article>
            </div>
          </div>

          <div class="cta-stack">
            <div v-for="card in ctaCards" :key="card.id" class="cta-card">
              <div class="cta-heading">
                <span class="cta-icon">
                  <i :class="card.icon" aria-hidden="true"></i>
                </span>
                <h3>{{ card.title }}</h3>
              </div>
              <p class="cta-description">{{ card.description }}</p>
              <a :href="card.href" class="cta-button" :class="card.buttonClass" target="_blank"
                rel="noopener noreferrer">
                {{ card.buttonLabel }}
              </a>
              <p class="cta-footnote">{{ card.footnote }}</p>
            </div>
          </div>
        </div>
      </section>

      <FAQ />
      <About />
      <SiteFooter />
    </main>
  </div>

  <PlayersOnline ref="panelRef" :players="data.profiles || []" :servers="data.servers || []"
    @enter-game-mode="enterGameMode" />

  <FirstVisitOverlay v-if="showFirstVisitOverlay" :current-section="currentSection" @go-home="handleGoHome"
    @continue="handleContinue" @close="dismissOverlay" />
</template>

<style lang="scss">
.home-main {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.hero {
  position: relative;
  background:
    radial-gradient(ellipse at top, rgba(var(--sw-rgb), 0.12) 0%, transparent 55%),
    radial-gradient(ellipse at bottom, rgba(var(--mg-rgb), 0.15) 0%, transparent 50%),
    linear-gradient(180deg, rgba(var(--bg-rgb), 0.96) 0%, rgba(var(--graphite-dark-rgb), 0.98) 100%);
  padding: clamp(6rem, 12vw, 10rem) 0 clamp(4rem, 10vw, 8rem);
  min-height: calc(100vh - 60px);
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(2rem, 6vw, 4rem);
  align-items: start;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero-tag {
  font-size: 1rem;
  color: var(--sw);
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 18px rgba(var(--sw-rgb), 0.45);
}

.hero-intro {
  font-size: 1.125rem;
  color: var(--t2);
  line-height: 1.7;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 500;
}

.quick-steps {
  display: grid;
  gap: 1rem;
}

.quick-step {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: flex-start;
  background: linear-gradient(180deg,
      rgba(var(--panel-main-rgb), 0.96) 0%,
      rgba(var(--panel-dark-rgb), 0.98) 100%);
  border: 1px solid var(--divider-strong);
  border-left: 3px solid rgba(var(--sw-rgb), 0.7);
  padding: 20px;
  box-shadow:
    0 0 20px rgba(var(--mg-rgb), 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.step-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  background: linear-gradient(180deg, rgba(var(--sw-rgb), 0.96) 0%, rgba(var(--sw-rgb), 0.75) 100%);
  color: var(--ink);
  border: 2px solid rgba(var(--sw-rgb), 0.85);
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
}

.step-copy h3 {
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 8px;
  color: var(--t);
}

.step-copy p {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
  color: var(--t2);
  margin: 0;
  line-height: 1.5;
}

.cta-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cta-card {
  background: linear-gradient(180deg,
      rgba(var(--panel-main-rgb), 0.96) 0%,
      rgba(var(--panel-dark-rgb), 0.98) 100%);
  border: 1px solid var(--divider-strong);
  padding: 24px;
  box-shadow:
    0 12px 28px rgba(4, 9, 14, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cta-heading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cta-icon {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(var(--sw-rgb), 0.9) 0%, rgba(var(--sw-rgb), 0.65) 100%);
  border: 1px solid rgba(var(--sw-rgb), 0.75);
  color: var(--ink);
  font-size: 1.25rem;
}

.cta-heading h3 {
  margin: 0;
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--t);
}

.cta-description {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  color: var(--t2);
  line-height: 1.6;
  margin: 0;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
  font-size: 0.95rem;
}

.cta-footnote {
  margin: 0;
  font-size: 0.85rem;
  color: var(--t3);
  font-family: 'Rajdhani', sans-serif;
}

.home-subnav {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.home-subnav__item {
  background: rgba(var(--graphite-rgb), 0.8);
  border: 1px solid rgba(var(--graphite-dark-rgb), 0.6);
  color: var(--t2);
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 18px;
  border-radius: 999px;
  cursor: pointer;
  transition: var(--tr);
}

.home-subnav__item.active {
  background: var(--sw);
  color: var(--ink);
  border-color: rgba(var(--sw-rgb), 0.8);
}

.home-subnav__item:focus-visible {
  outline: 2px solid var(--sw);
  outline-offset: 2px;
}

@media (max-width: 1024px) {
  .hero {
    padding-top: clamp(5rem, 10vw, 8rem);
  }

  .cta-stack {
    order: -1;
  }
}

@media (max-width: 768px) {
  .quick-step {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .step-badge {
    margin: 0 auto;
  }

  .cta-button {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .hero {
    padding-top: 5rem;
  }

  .hero-tag {
    font-size: 0.9rem;
  }

  .hero-intro {
    font-size: 1rem;
  }

  .cta-stack {
    gap: 1rem;
  }
}
</style>
