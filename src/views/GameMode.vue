<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAppData } from '../composables/useAppData';
import Leaderboards from '../components/Leaderboards.vue';
import SiteFooter from '../components/Footer.vue';

const router = useRouter();
const { data, playerCount } = useAppData();

function goHome() {
  router.push('/');
}
</script>

<template>
  <div class="game-mode active">
    <div class="gm-header">
      <div class="gm-logo grad-text clickable" @click="goHome">WICGATE</div>
      <div class="gm-controls">
        <div class="gm-status">
          <div class="gm-status-dot" />
          <span class="gm-status-count">{{ playerCount }}</span>
          <span class="gm-status-label">Players Online</span>
        </div>
        <button class="gm-exit" @click="goHome">Exit Game Mode</button>
      </div>
    </div>
    <div class="gm-body">
      <div class="gm-players">
        <div class="gm-players-header">
          <h3>Online Players</h3>
          <div class="server-info">Across all servers</div>
        </div>
        <div class="gm-players-list">
          <div v-if="!data.profiles || data.profiles.length === 0" class="p-empty">No players currently online</div>
          <div v-for="p in (data.profiles || [])" :key="p.profileName + String(p.serverId)" class="p-item">
            <span class="p-dot" /><span class="p-name-text">{{ p.profileName || 'Unknown' }}</span><span
              class="p-server">Server {{ p.serverId || '?' }}</span>
          </div>
        </div>
      </div>
      <div class="gm-stats">
        <div class="gm-stats-container">
          <Leaderboards :data="data" />
        </div>
      </div>
    </div>
    <SiteFooter />
  </div>
</template>

<style scoped>
/* Game mode responsive layout */
.gm-stats-container {
  --gm-columns: repeat(2, 1fr);
}

.gm-stats-container :deep(.grid-2) {
  grid-template-columns: var(--gm-columns);
  gap: 20px;
}

@media (max-width: 1024px) {
  .gm-stats-container {
    --gm-columns: 1fr;
  }

  .gm-body {
    grid-template-columns: 300px 1fr;
  }

  .gm-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .gm-controls {
    flex-wrap: wrap;
    gap: 10px;
  }

  .gm-status {
    order: 0;
    width: 100%;
    justify-content: center;
  }

  .gm-body {
    display: flex;
    flex-direction: column;
    height: calc(100% - 60px);
  }

  .gm-players {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    flex: 0 0 auto;
    max-height: 40vh;
  }

  .gm-players-list {
    max-height: 25vh;
    padding: 8px;
  }

  .gm-players-list .p-item {
    padding: 8px 12px;
    margin-bottom: 4px;
    font-size: 14px;
  }

  .gm-stats {
    flex: 1;
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 15px;
    overflow-y: auto;
  }

  .gm-stats-container :deep(.grid-2) {
    gap: 15px;
  }

  .gm-stats-container :deep(.lb-cont) {
    margin-bottom: 0;
  }
}

@media (max-width: 480px) {
  .gm-players {
    max-height: 35vh;
  }

  .gm-players-list {
    max-height: 20vh;
    padding: 6px;
  }

  .gm-players-list .p-item {
    padding: 6px 10px;
    font-size: 13px;
  }

  .gm-players-header {
    padding: 15px;
  }

  .gm-players-header h3 {
    font-size: 14px;
  }

  .gm-stats {
    padding: 10px;
  }

  .gm-stats-container :deep(.lb-cont) {
    font-size: 14px;
  }

  .gm-stats-container :deep(.lb-table) {
    font-size: 12px;
  }

  .gm-stats-container :deep(.tabs) {
    flex-wrap: wrap;
    gap: 8px;
  }

  .gm-stats-container :deep(.tab-btn) {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>