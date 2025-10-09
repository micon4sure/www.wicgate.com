<script setup lang="ts">
import { computed } from 'vue';
import Leaderboards from '../components/Leaderboards.vue';
import LeaderboardSkeleton from '../components/skeletons/LeaderboardSkeleton.vue';
import type { DataResponse } from '../api-types';
import { colorize, parseClanTag, groupPlayersByServer } from '../utils/playerDisplay';

const props = defineProps<{
  data: Partial<DataResponse>;
  loading: boolean;
}>();

// During SSG build or while loading, show placeholder
const isSSR = import.meta.env.SSR;
const showPlaceholder = computed(() => isSSR || props.loading);

// Players and servers data
const players = computed(() => props.data.profiles || []);
const servers = computed(() => props.data.servers || []);
const totalPlayers = computed(() => players.value.length);

// Group players by server and sort by player count (descending)
const serverGroups = computed(() => {
  const groups = groupPlayersByServer(players.value, servers.value);
  // Sort: servers with players first (by count DESC), empty servers last
  return groups.sort((a, b) => {
    const countA = a.players.length;
    const countB = b.players.length;
    if (countA === 0 && countB === 0) return a.serverName.localeCompare(b.serverName);
    if (countA === 0) return 1;
    if (countB === 0) return -1;
    return countB - countA;
  });
});

const activeServerCount = computed(
  () => serverGroups.value.filter((g) => g.players.length > 0).length
);

// Get capacity color based on fill percentage
function getCapacityColor(count: number, max: number = 16): string {
  const pct = (count / max) * 100;
  if (pct >= 90) return 'var(--dl-light)'; // Red
  if (pct >= 50) return 'var(--sw)'; // Orange
  return 'var(--g)'; // Green
}
</script>
<template>
  <section id="multiplayer" class="section">
    <div class="container">
      <div class="text-center mb-xl">
        <h2>Multiplayer</h2>
        <p class="section-lead">Live servers and player rankings</p>
      </div>

      <!-- Players & Servers Online Subsection -->
      <div id="multiplayer-servers" class="subsection mb-xl">
        <div class="subsection-header">
          <h3>Players & Servers Online</h3>
          <p class="subsection-lead">
            {{ totalPlayers }} {{ totalPlayers === 1 ? 'player' : 'players' }} across
            {{ activeServerCount }} {{ activeServerCount === 1 ? 'server' : 'servers' }}
          </p>
        </div>

        <div class="server-cards">
          <!-- Loading state -->
          <div v-if="showPlaceholder" class="server-card-skeleton">
            <div class="skeleton-header"></div>
            <div class="skeleton-content"></div>
          </div>

          <!-- Server cards -->
          <template v-else>
            <div
              v-for="group in serverGroups"
              :key="group.serverId"
              class="server-card"
              :class="{ 'server-empty': group.players.length === 0 }"
            >
              <div class="server-card-header">
                <div class="server-name-row">
                  <div class="server-status">
                    <span class="status-dot" :class="{ active: group.players.length > 0 }"></span>
                    <span class="server-name" v-html="colorize(group.serverName)"></span>
                  </div>
                  <div
                    class="server-capacity"
                    :style="{ color: getCapacityColor(group.players.length) }"
                  >
                    {{ group.players.length }}/16
                  </div>
                </div>
              </div>
              <div class="server-card-body">
                <div v-if="group.players.length === 0" class="no-players">No players online</div>
                <div v-else class="player-grid">
                  <div
                    v-for="player in group.players"
                    :key="(player.profileName || 'Unknown') + String(player.serverId)"
                    class="player-item"
                  >
                    <span class="player-dot"></span
                    ><span v-if="parseClanTag(player).clanTag" class="clan-tag">{{
                      parseClanTag(player).clanTag
                    }}</span
                    ><span class="player-name">{{ parseClanTag(player).playerName }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty state when no servers -->
            <div v-if="serverGroups.length === 0" class="no-servers">
              <p>No servers available</p>
            </div>
          </template>
        </div>
      </div>

      <!-- Statistics Subsection -->
      <div id="multiplayer-statistics" class="subsection">
        <div class="subsection-header">
          <h3>Statistics</h3>
          <p class="subsection-lead">Rankings and leaderboards</p>
        </div>

        <!-- SSG/Loading: Render skeleton placeholder -->
        <LeaderboardSkeleton v-if="showPlaceholder" />

        <!-- Runtime: Render live data -->
        <Leaderboards v-else :data="data" />
      </div>
    </div>
  </section>
</template>
<style scoped>
/* Subsection structure */
.subsection {
  margin-bottom: 60px;
}

.subsection:last-child {
  margin-bottom: 0;
}

.subsection-header {
  text-align: center;
  margin-bottom: 40px;
}

.subsection-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: var(--sw);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.subsection-lead {
  font-size: 14px;
  color: var(--t2);
  margin: 0;
}

/* Server cards grid */
.server-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Two-column layout on desktop */
@media (min-width: 1024px) {
  .server-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

.server-card {
  background: linear-gradient(
    180deg,
    rgba(var(--panel-main-rgb), 0.96) 0%,
    rgba(var(--panel-dark-rgb), 0.98) 100%
  );
  border: 1px solid var(--divider-strong);
  border-radius: 0;
  overflow: hidden;
}

.server-card.server-empty {
  opacity: 0.6;
}

.server-card-header {
  padding: 16px 20px;
  background: linear-gradient(
    180deg,
    rgba(var(--mg-rgb), 0.25) 0%,
    rgba(var(--mg-dark-rgb), 0.4) 100%
  );
  border-bottom: 1px solid var(--divider-strong);
}

.server-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.server-status {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--t3);
  flex-shrink: 0;
  opacity: 0.5;
}

.status-dot.active {
  background: var(--g);
  opacity: 1;
  box-shadow: 0 0 8px rgba(var(--g-rgb), 0.6);
  animation: syncPulse 2s ease-in-out infinite;
}

.server-name {
  font-family: 'Oswald', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--t);
  text-transform: uppercase;
  letter-spacing: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.server-capacity {
  font-size: 15px;
  font-weight: 700;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.server-card-body {
  padding: 16px 20px;
}

.no-players {
  text-align: center;
  color: var(--t3);
  font-size: 13px;
  padding: 12px 0;
}

.player-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
}

/* Denser grid on larger screens */
@media (min-width: 1440px) {
  .player-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}

.player-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: rgba(var(--mg-rgb), 0.15);
  border: 1px solid rgba(var(--mg-rgb), 0.25);
  border-radius: 0;
  transition: all 0.2s;
}

@media (hover: hover) {
  .player-item:hover {
    background: rgba(var(--sw-rgb), 0.15);
    border-color: rgba(var(--sw-rgb), 0.3);
  }
}

.player-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--g);
  flex-shrink: 0;
  opacity: 0.8;
  animation: syncPulse 2s ease-in-out infinite;
  margin-right: 8px;
}

/* Clan tag styling (matches leaderboards) */
.clan-tag {
  font-family: 'Courier New', monospace;
  color: var(--sw);
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: none;
  letter-spacing: 0.3px;
  display: inline;
  vertical-align: middle;
  line-height: 1.2;
  margin: 0;
  padding: 0;
}

/* Player name styling (matches leaderboards) */
.player-name {
  font-family: 'Rajdhani', sans-serif;
  color: var(--t);
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.3px;
  display: inline;
  vertical-align: middle;
  line-height: 1.2;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-servers {
  text-align: center;
  padding: 60px 20px;
  color: var(--t3);
}

.server-card-skeleton {
  background: linear-gradient(
    180deg,
    rgba(var(--panel-main-rgb), 0.96) 0%,
    rgba(var(--panel-dark-rgb), 0.98) 100%
  );
  border: 1px solid var(--divider-strong);
  padding: 20px;
  min-height: 150px;
}

.skeleton-header {
  height: 24px;
  background: rgba(var(--mg-rgb), 0.3);
  margin-bottom: 16px;
  width: 60%;
}

.skeleton-content {
  height: 80px;
  background: rgba(var(--mg-rgb), 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .subsection {
    margin-bottom: 40px;
  }

  .subsection-header {
    margin-bottom: 24px;
  }

  .subsection-header h3 {
    font-size: 20px;
  }

  .player-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 6px;
  }

  .player-item {
    padding: 6px 10px;
  }

  .clan-tag {
    font-size: 0.7rem;
  }

  .player-name {
    font-size: 1rem;
  }

  .server-card-header {
    padding: 12px 16px;
  }

  .server-card-body {
    padding: 12px 16px;
  }

  .server-name {
    font-size: 1.1rem;
  }

  .server-capacity {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .subsection-header h3 {
    font-size: 18px;
  }

  .subsection-lead {
    font-size: 13px;
  }

  .player-grid {
    grid-template-columns: 1fr;
  }

  .player-item {
    padding: 5px 8px;
  }

  .clan-tag {
    font-size: 0.65rem;
  }

  .player-name {
    font-size: 0.95rem;
  }

  .server-name {
    font-size: 1rem;
  }

  .server-name-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .server-status {
    width: 100%;
  }

  .server-capacity {
    align-self: flex-end;
  }
}

/* Inherit deep styles from parent container */
.container :deep(.grid-2) {
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: 768px) {
  .container :deep(.grid-2) {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .container :deep(.lb-cont) {
    margin-bottom: 0;
  }
}

@media (max-width: 480px) {
  .container :deep(.lb-cont) {
    font-size: 14px;
  }

  .container :deep(.lb-table) {
    font-size: 12px;
  }

  .container :deep(.lb-table th) {
    padding: 8px;
    font-size: 11px;
  }

  .container :deep(.lb-table td) {
    padding: 8px;
    font-size: 12px;
  }

  .container :deep(.tabs) {
    flex-wrap: wrap;
    gap: 8px;
  }

  .container :deep(.tab-btn) {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
