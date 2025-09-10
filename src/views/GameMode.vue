<script setup lang="ts">
import { useAppData } from '../composables/useAppData';
import Scores from '../components/Scores.vue';
import Footer from '../components/Footer.vue';
import { useRouter } from 'vue-router';

const { data, playerCount } = useAppData();
const router = useRouter();
</script>
<template>
  <div class="game-mode active" style="display:block">
    <div class="gm-header">
      <div class="gm-logo grad-text" style="cursor:pointer" @click="router.push('/')">WICGATE</div>
      <div class="gm-controls">
        <div class="gm-status">
          <div class="gm-status-dot" />
          <span class="gm-status-count">{{ playerCount }}</span>
          <span class="gm-status-label">Players Online</span>
        </div>
        <button class="gm-exit" @click="router.push('/')">Exit Game Mode</button>
      </div>
    </div>
    <div class="gm-body">
      <div class="gm-players">
        <div class="gm-players-header"><h3>Online Players</h3><div class="server-info">Across all servers</div></div>
        <div class="gm-players-list">
          <div v-if="!data.profiles || data.profiles.length===0" class="p-empty">No players currently online</div>
          <div v-for="p in (data.profiles || [])" :key="p.profileName + String(p.serverId)" class="p-item">
            <span class="p-dot" /><span class="p-name-text">{{ p.profileName || 'Unknown' }}</span><span class="p-server">Server {{ p.serverId || '?' }}</span>
          </div>
        </div>
      </div>
      <div class="gm-stats">
        <Scores title="High Scores - Overall" :entries="data.lb_high" best />
        <Scores title="High Scores - Infantry" :entries="data.lb_highinf" best />
        <Scores title="High Scores - Armor" :entries="data.lb_higharm" best />
        <Scores title="High Scores - Air" :entries="data.lb_highair" best />
        <Scores title="High Scores - Support" :entries="data.lb_highsup" best />
        <Scores title="Total Scores - Overall" :entries="data.lb_total" />
        <Scores title="Player Ladder" :entries="data.ladder" />
      </div>
    </div>
    <Footer />
  </div>
</template>
<style scoped>
/* Game mode view uses global styles */
</style>
