<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppDataStore } from '../stores/appDataStore';
import Leaderboards from '../components/Leaderboards.vue';
import SiteFooter from '../components/Footer.vue';
import { colorize, displayName, groupPlayersByServer } from '../utils/playerDisplay';

const router = useRouter();
const store = useAppDataStore();
const { data, playerCount } = store;

// Initialize store if needed (GameMode can be accessed directly)
if (!store.isInitialized.value) {
  store.init();
}
// Shape leaderboards prop to expected Record<string, LeaderboardEntry[] | undefined>
const leaderboardData = computed(() => ({
  lb_high: data.value.lb_high,
  lb_highinf: data.value.lb_highinf,
  lb_higharm: data.value.lb_higharm,
  lb_highair: data.value.lb_highair,
  lb_highsup: data.value.lb_highsup,
  lb_total: data.value.lb_total,
  lb_totinf: data.value.lb_totinf,
  lb_totarm: data.value.lb_totarm,
  lb_totair: data.value.lb_totair,
  lb_totsup: data.value.lb_totsup,
  ladder: data.value.ladder?.map((l, idx) => ({
    rank: l.rank != null ? l.rank : idx + 1,
    high: l.high,
    profileName: l.profileName,
    shortName: l.shortName,
    tagFormat: l.tagFormat,
  })),
}));
const gmGroups = computed(() =>
  groupPlayersByServer(data.value.profiles || [], data.value.servers || [])
);

function goHome() {
  router.push('/');
}
</script>

<template>
  <div class="game-mode active">
    <div class="gm-header">
      <div class="gm-logo clickable" @click="goHome">WICGATE</div>
      <div class="gm-controls">
        <div class="gm-status">
          <span class="gm-status-count">{{ playerCount }}</span>
          <span class="gm-status-divider" />
          <span class="gm-status-label">Players Online</span>
        </div>
        <button class="gm-btn-base gm-exit" @click="goHome">
          <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
          Exit Game Mode
        </button>
      </div>
    </div>
    <div class="gm-body">
      <div class="gm-players">
        <div class="gm-players-header">
          <h3>Online Players</h3>
          <div class="server-info">Across all servers</div>
        </div>
        <div class="gm-players-list">
          <div v-if="!data.profiles || data.profiles.length === 0" class="p-empty">
            No players currently online
          </div>
          <template v-else>
            <div v-for="g in gmGroups" :key="g.serverId" class="p-server-group">
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
      <div class="gm-stats">
        <div class="gm-stats-container">
          <Leaderboards :data="leaderboardData" />
        </div>
      </div>
    </div>
    <SiteFooter />
  </div>
</template>

<style scoped>
/* Game mode responsive layout */
.p-server-group {
  margin-bottom: 10px;
}
.p-server-h {
  font-size: 14px;
  color: var(--t2);
  letter-spacing: 0.02em;
  margin: 10px 0 6px;
  font-weight: 600;
}

/* Make player names bigger on all screen sizes */
.gm-players-list .p-item {
  font-size: 16px;
}
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
    flex-wrap: nowrap;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
  }

  /* Make players online button compact */
  .gm-status {
    order: 0;
    width: auto;
    justify-content: flex-start;
    padding: 0 12px;
    gap: 6px;
    min-width: fit-content;
    height: 44px;
  }

  .gm-status-count {
    font-size: 14px;
  }

  .gm-status-label {
    display: none; /* Hide "Players Online" text to save space */
  }

  .gm-status-divider {
    display: none; /* Hide divider when label is hidden */
  }

  .gm-exit {
    height: 44px;
    padding: 0 14px;
    font-size: 12px;
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
    min-height: 25vh;
    max-height: 60vh; /* Allow expansion up to 60vh */
  }

  .gm-players-list {
    min-height: 15vh;
    max-height: 50vh; /* Dynamic expansion */
    padding: 8px;
  }

  /* Make player names and server names bigger */
  .gm-players-list .p-item {
    padding: 10px 12px;
    margin-bottom: 4px;
    font-size: 16px; /* Increased from 14px */
  }

  .p-server-h {
    font-size: 14px !important; /* Increased from 12px */
    font-weight: 600;
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
    min-height: 20vh;
    max-height: 55vh; /* Allow expansion on small mobile too */
  }

  .gm-players-list {
    min-height: 12vh;
    max-height: 40vh; /* Dynamic expansion */
    padding: 6px;
  }

  /* Keep player names big on small mobile too */
  .gm-players-list .p-item {
    padding: 8px 10px;
    font-size: 15px; /* Increased from 13px */
  }

  .p-server-h {
    font-size: 13px !important; /* Increased from default */
    font-weight: 600;
  }

  .gm-players-header {
    padding: 15px;
  }

  .gm-players-header h3 {
    font-size: 14px;
  }

  /* Make status button even more compact on small mobile */
  .gm-status {
    padding: 0 10px;
    height: 40px;
  }

  .gm-status-count {
    font-size: 13px;
  }

  .gm-exit {
    height: 40px;
    padding: 0 12px;
    font-size: 11px;
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
