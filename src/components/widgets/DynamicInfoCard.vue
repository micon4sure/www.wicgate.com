<script setup lang="ts">
import { computed } from 'vue';
import { useServerCapacity } from '../../composables/useServerCapacity';
import { usePlayerDisplay } from '../../composables/usePlayerDisplay';
import RankInsignia from '../RankInsignia.vue';
import type { DataResponse, LadderEntry } from '../../api-types';

const props = defineProps<{
  data: Partial<DataResponse>;
  playerCount: number;
  loading: boolean;
  isSSR: boolean;
}>();

const emit = defineEmits<{
  navigate: [section: string];
}>();

const { getCapacityColor } = useServerCapacity();
const { colorize } = usePlayerDisplay();

// Active servers with player counts
const activeServers = computed(() => {
  if (!props.data.servers || !props.data.profiles) return [];

  const serverMap = new Map<number, { name: string; count: number }>();

  props.data.profiles.forEach((profile) => {
    const serverId = Number(profile.serverId);
    const server = props.data.servers?.find((s) => s.serverId === serverId);
    if (server) {
      const existing = serverMap.get(serverId);
      if (existing) {
        existing.count++;
      } else {
        serverMap.set(serverId, { name: server.serverName, count: 1 });
      }
    }
  });

  return Array.from(serverMap.entries())
    .map(([id, info]) => ({ id, ...info }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
});

const activeServerCount = computed(() => activeServers.value.length);

// Top ladder players
const topLadderPlayers = computed(() => {
  if (!props.data.ladder) return [];
  return props.data.ladder.slice(0, 5);
});

// Smart switching: show servers when there's ANY activity
const shouldShowServers = computed(() => {
  return props.playerCount > 0 || activeServerCount.value > 0;
});

// Format clan tag
function formatClanTag(entry: LadderEntry): string {
  if (entry.tagFormat && entry.shortName) {
    return entry.tagFormat.replace('C', entry.shortName).replace('P', '');
  }
  return '';
}

function handleLiveServersClick() {
  emit('navigate', 'community');
}

function handleTopPlayersClick() {
  emit('navigate', 'statistics-leaderboards');
}
</script>

<template>
  <div
    class="relative bg-gradient-to-br from-panel/95 to-panel-dark/98 border-2 border-teal/30 overflow-hidden transition-all duration-300 hover:border-teal/50 hover:shadow-[0_0_30px_rgba(0,217,255,0.25)]"
  >
    <div class="relative h-[400px] sm:h-[450px]">
      <!-- Live Servers View -->
      <div
        class="absolute inset-0 transition-opacity duration-500 flex flex-col"
        :class="shouldShowServers ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
        <div class="flex items-center justify-between p-5 border-b border-teal/20">
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-server text-online text-xl" aria-hidden="true"></i>
            <h3 class="text-xl font-military font-bold text-t uppercase tracking-wide m-0">
              Live Servers
            </h3>
          </div>
          <button
            class="text-sm text-teal hover:text-teal-bright font-body font-semibold transition-colors"
            @click="handleLiveServersClick"
          >
            View All →
          </button>
        </div>

        <div class="flex-1 flex flex-col p-5">
          <div v-if="isSSR || loading" class="space-y-4 flex-1">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="h-16 bg-mg/15 border border-mg/25 animate-pulse"></div>
              <div class="h-16 bg-mg/15 border border-mg/25 animate-pulse"></div>
            </div>
            <div class="h-20 bg-mg/15 border border-mg/25 animate-pulse"></div>
            <div class="h-20 bg-mg/15 border border-mg/25 animate-pulse"></div>
          </div>

          <template v-else>
            <!-- Stats Row -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div
                class="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-mg/25 to-mg-dark/30 border-2 border-online/40 shadow-[0_0_15px_rgba(0,217,255,0.1)]"
              >
                <div class="text-3xl font-military font-bold text-online mb-1">
                  {{ playerCount }}
                </div>
                <div class="text-xs text-t-secondary font-body uppercase tracking-wide">
                  Players Online
                </div>
              </div>

              <div
                class="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-mg/25 to-mg-dark/30 border-2 border-teal/40 shadow-[0_0_15px_rgba(0,217,255,0.1)]"
              >
                <div class="text-3xl font-military font-bold text-teal mb-1">
                  {{ activeServerCount }}
                </div>
                <div class="text-xs text-t-secondary font-body uppercase tracking-wide">
                  Active Servers
                </div>
              </div>
            </div>

            <!-- Server List -->
            <div v-if="activeServers.length > 0" class="space-y-3 flex-1 overflow-y-auto">
              <div
                v-for="server in activeServers"
                :key="server.id"
                class="flex items-center justify-between gap-3 p-3 bg-mg/15 border border-mg/25 transition-all duration-200 hover:bg-mg/25 hover:border-teal/40 hover:shadow-[0_0_15px_rgba(0,217,255,0.1)]"
              >
                <div class="flex items-center gap-2 flex-1 overflow-hidden">
                  <span
                    class="w-2 h-2 bg-online shadow-[0_0_8px_rgba(0,217,255,0.8)] flex-shrink-0"
                  ></span>
                  <span
                    class="text-sm font-body font-semibold text-t overflow-hidden text-ellipsis whitespace-nowrap"
                    v-html="colorize(server.name)"
                  ></span>
                </div>
                <span
                  class="text-sm font-military font-bold flex-shrink-0 min-w-[3rem] text-right"
                  :style="{ color: getCapacityColor(server.count) }"
                >
                  {{ server.count }}/16
                </span>
              </div>
            </div>
            <div v-else class="flex-1 flex items-center justify-center text-t3 font-body text-sm">
              No active servers
            </div>
          </template>
        </div>
      </div>

      <!-- Top Players View -->
      <div
        class="absolute inset-0 transition-opacity duration-500 flex flex-col"
        :class="!shouldShowServers ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
        <div class="flex items-center justify-between p-5 border-b border-teal/20">
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-trophy text-massgate-gold text-xl" aria-hidden="true"></i>
            <h3 class="text-xl font-military font-bold text-t uppercase tracking-wide m-0">
              Top Players
            </h3>
          </div>
          <button
            class="text-sm text-teal hover:text-teal-bright font-body font-semibold transition-colors"
            @click="handleTopPlayersClick"
          >
            Leaderboards →
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-5">
          <div v-if="isSSR || loading" class="space-y-3">
            <div class="h-16 bg-mg/15 border border-mg/25 animate-pulse"></div>
            <div class="h-16 bg-mg/15 border border-mg/25 animate-pulse"></div>
            <div class="h-16 bg-mg/15 border border-mg/25 animate-pulse"></div>
            <div class="h-16 bg-mg/15 border border-mg/25 animate-pulse"></div>
            <div class="h-16 bg-mg/15 border border-mg/25 animate-pulse"></div>
          </div>

          <template v-else>
            <div v-if="topLadderPlayers.length > 0" class="space-y-3">
              <div
                v-for="(player, i) in topLadderPlayers"
                :key="player.profileId"
                class="flex items-center gap-3 p-3 bg-mg/15 border border-mg/25 transition-all duration-200 hover:bg-mg/25 hover:border-teal/40 hover:shadow-[0_0_15px_rgba(0,217,255,0.1)]"
                :class="{
                  '[&_.ladder-rank]:text-medal-gold [&_.ladder-rank]:text-shadow-sm [&_.ladder-score]:text-medal-gold':
                    i === 0,
                  '[&_.ladder-rank]:text-medal-silver [&_.ladder-rank]:text-shadow-sm [&_.ladder-score]:text-medal-silver':
                    i === 1,
                  '[&_.ladder-rank]:text-medal-bronze [&_.ladder-rank]:text-shadow-sm [&_.ladder-score]:text-medal-bronze':
                    i === 2,
                }"
              >
                <span
                  class="ladder-rank w-8 h-8 flex items-center justify-center bg-mg/40 text-sm font-bold font-military flex-shrink-0"
                  :class="{
                    'text-base': i === 0,
                    'text-[0.9375rem]': i === 1,
                    'text-[0.875rem]': i === 2,
                  }"
                >
                  {{ i + 1 }}
                </span>
                <div class="flex items-center flex-1 overflow-hidden leading-none gap-0">
                  <RankInsignia
                    :rank="player.rank || 0"
                    :size="20"
                    class="inline-block flex-shrink-0 mr-1.5"
                  />
                  <span
                    v-if="formatClanTag(player)"
                    class="font-mono text-soviet font-semibold text-[0.75rem] tracking-[0.3px] flex-shrink-0"
                  >
                    {{ formatClanTag(player) }}
                  </span>
                  <span
                    class="font-body text-t font-semibold text-[0.9rem] tracking-[0.3px] overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {{ player.profileName }}
                  </span>
                </div>
                <span class="ladder-score text-sm font-military font-bold flex-shrink-0">
                  {{ player.high }}
                </span>
              </div>
            </div>
            <div v-else class="h-full flex items-center justify-center text-t3 font-body text-sm">
              No rankings yet
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
