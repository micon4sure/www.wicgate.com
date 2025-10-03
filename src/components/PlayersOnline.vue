<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import type { OnlineProfile as PlayerProfile } from '../api-types';
import type { ServerEntry } from '../api-types';
import { colorize, displayName, groupPlayersByServer } from '../utils/playerDisplay';
import { getItem, setItem } from '../utils/storage';
import { debounce } from '../utils/debounce';
import { DEBOUNCE_RESIZE } from '../constants';

const props = defineProps<{ players: PlayerProfile[]; servers?: ServerEntry[] }>();
const emit = defineEmits<{ enterGameMode: [] }>();

const open = ref(false);
const scrollPos = ref(0);
const PANEL_OFFSET_VAR = '--players-panel-offset';

function lockBodyScroll() {
  if (document.body.classList.contains('panel-open-mobile')) return;

  scrollPos.value = window.pageYOffset;
  document.body.classList.add('panel-open-mobile');
}

function unlockBodyScroll() {
  if (!document.body.classList.contains('panel-open-mobile')) return;

  document.body.classList.remove('panel-open-mobile');
  window.scrollTo(0, scrollPos.value);
}

function updatePanelOffset() {
  const header = document.querySelector<HTMLElement>('header');
  if (!header) {
    document.documentElement.style.removeProperty(PANEL_OFFSET_VAR);
    return;
  }

  const { bottom } = header.getBoundingClientRect();
  document.documentElement.style.setProperty(PANEL_OFFSET_VAR, `${bottom}px`);
}
function applyClasses() {
  const wrapper = document.getElementById('siteWrapper');
  if (!wrapper) return;

  const isMobile = window.innerWidth <= 768;

  if (open.value) {
    wrapper.classList.add('panel-open');
    if (isMobile) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  } else {
    wrapper.classList.remove('panel-open');
    unlockBodyScroll();
  }
}

function handleResize() {
  updatePanelOffset();
  applyClasses();
}

function toggle() {
  open.value = !open.value;
  applyClasses();
  persist();
}
function close() {
  open.value = false;
  applyClasses();
  persist();
}
function persist() {
  setItem('wicgate_panel_open', open.value ? 'true' : 'false');
}

// Debounce resize handler to improve performance
const debouncedResize = debounce(handleResize, DEBOUNCE_RESIZE);

onMounted(() => {
  window.addEventListener('resize', debouncedResize, { passive: true });
  handleResize();

  const stored = getItem('wicgate_panel_open');
  if (stored === 'true') {
    open.value = true;
    applyClasses();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', debouncedResize);
  document.documentElement.style.removeProperty(PANEL_OFFSET_VAR);
  const wrapper = document.getElementById('siteWrapper');
  if (wrapper) wrapper.classList.remove('panel-open');
  unlockBodyScroll();
});

const count = computed(() => props.players?.length || 0);
watch(
  () => props.players,
  () => {
    /* body class handled in composable */
  },
  { deep: true }
);

// Use shared colorize function from utils

const grouped = computed(() => groupPlayersByServer(props.players || [], props.servers || []));

defineExpose({ toggle, close });
</script>
<template>
  <div class="p-panel" :class="{ active: open }">
    <div class="p-panel-hdr">
      <h3>
        <span class="p-panel-title">Players Online</span
        ><span class="p-panel-logo grad-text">WICGATE</span>
      </h3>
      <div class="p-panel-controls">
        <button class="ctrl-btn p-gamemode" title="Game Mode" @click="emit('enterGameMode')">
          <i class="fa-solid fa-gamepad" aria-hidden="true"></i
          ><span class="lock-tooltip">Game Mode</span>
        </button>
        <button class="ctrl-btn p-close" @click="close">×</button>
      </div>
    </div>
    <div class="p-list">
      <template v-if="count === 0">
        <div class="p-empty">No players currently online</div>
      </template>
      <template v-else>
        <div v-for="g in grouped" :key="g.serverId" class="p-server-group">
          <div class="p-server-h" v-html="colorize(g.serverName)"></div>
          <div
            v-for="p in g.players"
            :key="(p.profileName || 'Unknown') + String(p.serverId)"
            class="p-item"
          >
            <span class="p-name-text">{{ displayName(p) }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<style scoped>
.p-server-group {
  margin-bottom: 10px;
}
.p-server-h {
  font-size: 12px;
  color: var(--t2);
  letter-spacing: 0.02em;
  margin: 10px 0 6px;
}
</style>
