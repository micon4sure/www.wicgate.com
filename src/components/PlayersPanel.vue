<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { PlayerProfile } from '../composables/useAppData';

const props = defineProps<{ players: PlayerProfile[] }>();
const open = ref(false);
const locked = ref(false);

function toggle() {
  open.value = !open.value;
  syncBody();
}
function close() { open.value = false; syncBody(); }
function toggleLock() { locked.value = !locked.value; if (!locked.value) close(); }
function syncBody() {
  const wrapper = document.getElementById('siteWrapper');
  if (!wrapper) return;
  if (open.value) wrapper.classList.add('panel-open'); else wrapper.classList.remove('panel-open');
  if (window.innerWidth <= 768) {
    if (open.value) document.body.classList.add('panel-open-mobile'); else document.body.classList.remove('panel-open-mobile');
  }
}
const count = computed(() => props.players?.length || 0);
watch(() => props.players, () => { /* ensure body online class set by composable already */ }, { deep: true });
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
    <button class="ctrl-btn p-gamemode" title="Game Mode" @click="$router.push('/gamemode')"><i class="fa-solid fa-gamepad" aria-hidden="true"></i><span
            class="lock-tooltip">Game Mode</span></button>
        <button class="ctrl-btn p-lock" :class="{ locked }" @click="toggleLock" title="Lock panel open">
          <span><i :class="locked ? 'fa-solid fa-lock' : 'fa-solid fa-unlock'" aria-hidden="true"></i></span>
          <span class="lock-tooltip">{{ locked ? 'Panel locked open' : 'Keep panel open' }}</span>
        </button>
        <button class="ctrl-btn p-close" @click="close">×</button>
      </div>
    </div>
    <div class="p-list">
      <template v-if="count === 0">
        <div class="p-empty">No players currently online</div>
      </template>
      <template v-else>
        <div v-for="p in players" :key="p.profileName + String(p.serverId)" class="p-item">
          <span class="p-dot" />
          <span class="p-name-text">{{ p.profileName || 'Unknown' }}</span>
          <span class="p-server">Server {{ p.serverId || '?' }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
<style scoped>
/* Panel inherits global styles */
</style>
