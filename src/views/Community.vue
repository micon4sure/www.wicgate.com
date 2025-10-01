<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import type { Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@vueuse/head';
import Navigation from '../components/Navigation.vue';
import SiteFooter from '../components/Footer.vue';
import PlayersOnline from '../components/PlayersOnline.vue';
import CommunityEventsModule from '../components/community/CommunityEventsModule.vue';
import CommunityStreamsModule from '../components/community/CommunityStreamsModule.vue';
import CommunityVideosModule from '../components/community/CommunityVideosModule.vue';
import CommunityPlayersModule from '../components/community/CommunityPlayersModule.vue';
import CommunityStatsModule from '../components/community/CommunityStatsModule.vue';
import { useAppDataStore } from '../stores/appDataStore';
import { scrollToSection as scrollToSectionUtil, getHeaderHeightWithBuffer } from '../utils/scroll';
import { generateOrganizationSchema } from '../utils/structuredData';

interface ModuleConfig {
  id: ModuleId;
  label: string;
  enabled: boolean;
}

type ModuleId = 'events' | 'streams' | 'videos' | 'players' | 'statistics';

const MODULE_STORAGE_KEY = 'community_module_layout_v1';

const defaultModules: ModuleConfig[] = [
  { id: 'events', label: 'Events', enabled: true },
  { id: 'streams', label: 'Live Streams', enabled: true },
  { id: 'videos', label: 'Videos', enabled: true },
  { id: 'players', label: 'Online Players', enabled: true },
  { id: 'statistics', label: 'Statistics', enabled: true },
];

function loadModules(): ModuleConfig[] {
  if (typeof window === 'undefined') return [...defaultModules];
  try {
    const raw = window.localStorage.getItem(MODULE_STORAGE_KEY);
    if (!raw) return [...defaultModules];
    const parsed = JSON.parse(raw) as ModuleConfig[];
    const validIds = new Set(defaultModules.map((m) => m.id));
    const sanitized = parsed.filter((m) => validIds.has(m.id));
    const missing = defaultModules.filter((m) => !sanitized.some((s) => s.id === m.id));
    return [...sanitized, ...missing];
  } catch {
    return [...defaultModules];
  }
}

const modules = ref<ModuleConfig[]>(loadModules());
const customizeOpen = ref(false);
const currentSection = ref<ModuleId>(
  modules.value.find((module: ModuleConfig) => module.enabled)?.id || 'events'
);
const panelRef = ref<InstanceType<typeof PlayersOnline> | null>(null);

const store = useAppDataStore();
const route = useRoute();
const router = useRouter();

const visibleModules = computed(() =>
  modules.value.filter((module: ModuleConfig) => module.enabled)
);
const sectionIds = computed(() => visibleModules.value.map((module: ModuleConfig) => module.id));

const lastUpdated = computed(() => store.lastFetchedAt.value);
const playerCount = computed(() => store.playerCount.value);

const moduleComponentMap: Record<ModuleId, Component> = {
  events: CommunityEventsModule,
  streams: CommunityStreamsModule,
  videos: CommunityVideosModule,
  players: CommunityPlayersModule,
  statistics: CommunityStatsModule,
};

const moduleProps = computed<Record<ModuleId, Record<string, unknown>>>(() => ({
  events: {
    heading: 'Events',
    subheading: 'Tournaments, community nights, and special operations',
  },
  streams: {},
  videos: {},
  players: {
    players: store.data.value.profiles || [],
    servers: store.data.value.servers || [],
    loading: store.loading.value,
    lastUpdated: lastUpdated.value,
  },
  statistics: {
    data: store.data.value,
    loading: store.loading.value,
  },
}));

let sectionElements: HTMLElement[] = [];
let scrollListenerAttached = false;

function persistModules() {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MODULE_STORAGE_KEY, JSON.stringify(modules.value));
}

function toggleModule(id: ModuleId) {
  const target = modules.value.find((module: ModuleConfig) => module.id === id);
  if (!target) return;
  target.enabled = !target.enabled;
  if (!modules.value.some((module: ModuleConfig) => module.enabled)) {
    target.enabled = true;
  }
  persistModules();
  nextTick(() => {
    collectSectionElements();
    updateActiveSection();
  });
}

function moveModule(id: ModuleId, direction: 'up' | 'down') {
  const index = modules.value.findIndex((module: ModuleConfig) => module.id === id);
  if (index === -1) return;
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= modules.value.length) return;
  const [module] = modules.value.splice(index, 1);
  modules.value.splice(swapIndex, 0, module);
  persistModules();
  nextTick(() => {
    collectSectionElements();
    updateActiveSection();
  });
}

function resetModules() {
  modules.value = [...defaultModules.map((module: ModuleConfig) => ({ ...module }))];
  persistModules();
  nextTick(() => {
    collectSectionElements();
    updateActiveSection();
  });
}

function setCurrentSection(section: ModuleId) {
  if (currentSection.value !== section) {
    currentSection.value = section;
  }
}

function collectSectionElements() {
  sectionElements = sectionIds.value
    .map((id: ModuleId) => document.getElementById(id))
    .filter(Boolean) as HTMLElement[];
}

function updateActiveSection() {
  if (!sectionElements.length) return;
  const scrollY = window.scrollY || window.pageYOffset;
  const offset = getHeaderHeightWithBuffer();

  for (const element of sectionElements) {
    const rect = element.getBoundingClientRect();
    const top = rect.top + scrollY;
    const bottom = top + rect.height;

    if (scrollY + offset >= top && scrollY + offset < bottom) {
      setCurrentSection(element.id as ModuleId);
      return;
    }
  }

  const firstVisible = sectionIds.value[0];
  if (firstVisible) {
    setCurrentSection(firstVisible);
  }
}

function navigateToSection(section: ModuleId, behavior: 'smooth' | 'auto' = 'smooth') {
  setCurrentSection(section);
  scrollToSectionUtil(section, behavior);
  history.replaceState(null, '', `#${section}`);
}

function handleNavNavigate(section?: string) {
  if (!section) {
    router.push('/');
    return;
  }
  if (section === 'community') {
    navigateToSection(sectionIds.value[0] || 'events');
    return;
  }
  if (sectionIds.value.includes(section as ModuleId)) {
    navigateToSection(section as ModuleId);
  }
}

function togglePlayers() {
  panelRef.value?.toggle();
}

function enterGameMode() {
  router.push('/game-mode');
}

function handleResize() {
  collectSectionElements();
  updateActiveSection();
}

watch(
  sectionIds,
  () => {
    nextTick(() => {
      collectSectionElements();
      updateActiveSection();
    });
  },
  { flush: 'post' }
);

onMounted(() => {
  if (import.meta.env.SSR) return;

  store.init();

  const hash = window.location.hash ? (window.location.hash.substring(1) as ModuleId) : null;
  if (hash && sectionIds.value.includes(hash)) {
    currentSection.value = hash;
    setTimeout(() => navigateToSection(hash, 'auto'), 120);
  } else {
    currentSection.value = sectionIds.value[0] || 'events';
  }

  nextTick(() => {
    collectSectionElements();
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

useHead({
  title: () =>
    (route.meta.title as string) || 'WiCGATE Community Hub - Events, Streams, and Statistics',
  meta: [
    {
      name: 'description',
      content: () =>
        (route.meta.description as string) ||
        'Explore World in Conflict community events, live streams, leaderboards, and live player data at WICGATE.',
    },
    {
      name: 'keywords',
      content: () =>
        (route.meta.keywords as string) ||
        'world in conflict community, wic events, wic streams, wic players online, wic leaderboards',
    },
    {
      property: 'og:title',
      content: () =>
        (route.meta.title as string) || 'WiCGATE Community Hub - Events, Streams, and Statistics',
    },
    {
      property: 'og:description',
      content: () =>
        (route.meta.description as string) ||
        'Explore World in Conflict community events, live streams, leaderboards, and live player data at WICGATE.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: () => `https://wicgate.com${route.path}`,
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: () => `https://wicgate.com${route.path}`,
    },
  ],
  script: [{ type: 'application/ld+json', children: JSON.stringify(generateOrganizationSchema()) }],
});
</script>

<template>
  <div id="siteWrapper" class="site-wrapper">
    <header>
      <Navigation
        :active-section="currentSection"
        :player-count="playerCount"
        :show-players-button="true"
        @navigate="handleNavNavigate"
        @toggle-players="togglePlayers"
      >
        <template #subnav>
          <nav class="home-subnav" aria-label="Community sections">
            <button
              v-for="module in visibleModules"
              :key="module.id"
              :class="['home-subnav__item', { active: currentSection === module.id }]"
              type="button"
              @click="navigateToSection(module.id)"
            >
              {{ module.label }}
            </button>
          </nav>
        </template>
      </Navigation>
    </header>

    <main class="community-main">
      <section class="com-hub section">
        <div class="container">
          <div class="text-center mb-xl">
            <h2>Community Command Center</h2>
            <p class="section-lead">
              Events, broadcasts, live player intel, and competitive stats for World in Conflict
            </p>
          </div>

          <div class="community-links">
            <a
              href="https://discord.gg/WnxwfMTyBe"
              target="_blank"
              rel="noopener noreferrer"
              class="community-link discord"
            >
              <i class="fa-brands fa-discord" aria-hidden="true"></i>
              Join Discord (287 members)
            </a>
            <a
              href="https://youtube.com/@wicgate"
              target="_blank"
              rel="noopener noreferrer"
              class="community-link youtube"
            >
              <i class="fa-brands fa-youtube" aria-hidden="true"></i>
              Watch Videos (1.2K subs)
            </a>
            <a
              href="https://twitch.tv/directory/game/World%20in%20Conflict"
              target="_blank"
              rel="noopener noreferrer"
              class="community-link twitch"
            >
              <i class="fa-brands fa-twitch" aria-hidden="true"></i>
              Live Streams
            </a>
          </div>

          <div class="module-controls" :class="{ open: customizeOpen }">
            <button class="btn btn-p" type="button" @click="customizeOpen = !customizeOpen">
              {{ customizeOpen ? 'Close Layout Controls' : 'Customize Layout' }}
            </button>
            <Transition name="fade">
              <div v-if="customizeOpen" class="module-controls-panel">
                <h4>Modules</h4>
                <ul>
                  <li v-for="module in modules" :key="module.id">
                    <label>
                      <input
                        type="checkbox"
                        :checked="module.enabled"
                        @change="toggleModule(module.id)"
                      />
                      <span>{{ module.label }}</span>
                    </label>
                    <div class="module-control-buttons">
                      <button
                        class="ctrl"
                        type="button"
                        :disabled="modules[0].id === module.id"
                        @click="moveModule(module.id, 'up')"
                      >
                        <i class="fa-solid fa-chevron-up" aria-hidden="true"></i>
                      </button>
                      <button
                        class="ctrl"
                        type="button"
                        :disabled="modules[modules.length - 1].id === module.id"
                        @click="moveModule(module.id, 'down')"
                      >
                        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
                      </button>
                    </div>
                  </li>
                </ul>
                <button class="btn btn-secondary" type="button" @click="resetModules">
                  Reset to Default Order
                </button>
              </div>
            </Transition>
          </div>

          <TransitionGroup name="module-fade" tag="div" class="community-modules">
            <component
              :is="moduleComponentMap[module.id]"
              v-for="module in visibleModules"
              :key="module.id"
              v-bind="moduleProps[module.id]"
              class="module-wrapper"
              @open-panel="togglePlayers"
            />
          </TransitionGroup>
        </div>
      </section>

      <SiteFooter />
    </main>
  </div>

  <PlayersOnline
    ref="panelRef"
    :players="store.data.value.profiles || []"
    :servers="store.data.value.servers || []"
    @enter-game-mode="enterGameMode"
  />
</template>
<style scoped>
.community-main {
  display: flex;
  flex-direction: column;
}

.module-controls {
  margin: 40px 0;
  text-align: center;
}

.module-controls-panel {
  margin-top: 20px;
  padding: 24px;
  background: linear-gradient(
    180deg,
    rgba(var(--panel-main-rgb), 0.94) 0%,
    rgba(var(--panel-dark-rgb), 0.98) 100%
  );
  border: 1px solid var(--divider-strong);
  border-left: 3px solid rgba(var(--sw-rgb), 0.7);
  box-shadow:
    0 12px 28px rgba(var(--mg-rgb), 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.module-controls-panel h4 {
  margin-bottom: 16px;
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--t);
}

.module-controls-panel ul {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-controls-panel li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.module-controls-panel label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Rajdhani', sans-serif;
}

.module-control-buttons {
  display: flex;
  gap: 8px;
}

.module-control-buttons .ctrl {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(var(--sw-rgb), 0.55);
  background: rgba(var(--panel-main-rgb), 0.9);
  color: var(--t);
  transition: var(--tr);
}

.module-control-buttons .ctrl:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.module-control-buttons .ctrl:not(:disabled):hover {
  background: rgba(var(--sw-rgb), 0.8);
  color: var(--ink);
}

.community-modules {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.module-wrapper {
  width: 100%;
}

.module-fade-enter-active,
.module-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.module-fade-enter-from,
.module-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .module-controls-panel {
    text-align: left;
  }

  .module-controls-panel li {
    flex-direction: column;
    align-items: flex-start;
  }

  .module-controls-panel ul {
    gap: 16px;
  }
}
</style>
