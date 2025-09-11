<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import type { PlayerProfile } from '../composables/useAppData';
import type { ServerEntry } from '../api-types';
import { colorize, displayName, groupPlayersByServer } from '../utils/playerDisplay';

const props = defineProps<{ players: PlayerProfile[]; servers?: ServerEntry[] }>();
const emit = defineEmits<{ enterGameMode: [] }>();

const open = ref(false);
const scrollPos = ref(0);

function applyClasses() {
  const wrapper = document.getElementById('siteWrapper');
  if (!wrapper) return;
  if (open.value) { wrapper.classList.add('panel-open'); if (window.innerWidth <= 768) { scrollPos.value = window.pageYOffset; document.body.classList.add('panel-open-mobile'); } }
  else { wrapper.classList.remove('panel-open'); if (window.innerWidth <= 768) { document.body.classList.remove('panel-open-mobile'); window.scrollTo(0, scrollPos.value); } }
}
function toggle() { open.value = !open.value; applyClasses(); persist(); }
function close() { open.value = false; applyClasses(); persist(); }
function persist() { localStorage.setItem('wicgate_panel_open', open.value ? 'true' : 'false'); }

onMounted(() => {
  try { 
    const stored = localStorage.getItem('wicgate_panel_open');
    if (stored === 'true') {
      open.value = true;
      applyClasses();
    }
  } catch { }
});

const count = computed(() => props.players?.length || 0);
watch(() => props.players, () => {/* body class handled in composable */ }, { deep: true });

// Group players by server using shared utility

// HTML-based colorizer compatible with <#hex>... </> markers
function colorize(name: string): string {
  let out = '<span style="color:#ddd">';
  let last = 0;
  let open = false;
  const regex = /<#([\da-f]{3,6})>|<\/>/gi;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(name)) !== null) {
    out += name.slice(last, m.index);
    last = regex.lastIndex;

    if (m[1]) {
      if (open) out += '</span>';
      out += `<span style="color:#${m[1]}">`;
      open = true;
    } else if (open) {
      out += '</span>';
      open = false;
    }
  }

  out += name.slice(last);
  if (open) out += '</span>';
  return out + '</span>';
}

const grouped = computed(() => groupPlayersByServer(props.players || [], props.servers || []));

defineExpose({ toggle, close });
</script>
<template>
  <div class="p-panel" :class="{ active: open }">
    <div class="p-panel-hdr">
      <h3>
        <div class="p-panel-status" /><span class="p-panel-title">Players Online</span><span
          class="p-panel-logo grad-text">WICGATE</span>
      </h3>
      <div class="p-panel-controls">
        <button class="ctrl-btn p-gamemode" title="Game Mode" @click="emit('enterGameMode')">🎮<span
            class="lock-tooltip">Game Mode</span></button>
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
          <div v-for="p in g.players" :key="(p.profileName || 'Unknown') + String(p.serverId)" class="p-item">
            <span class="p-dot" />
            <span class="p-name-text" v-html="colorize(displayName(p))"></span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<style scoped>
.p-server-group { margin-bottom: 10px; }
.p-server-h {
  font-size: 12px;
  color: var(--t2);
  letter-spacing: 0.02em;
  margin: 10px 0 6px;
}
</style>
