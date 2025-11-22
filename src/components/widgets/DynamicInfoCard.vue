<script setup lang="ts">
import { computed } from 'vue';
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

const { colorize } = usePlayerDisplay();

// Group players by server
const serverGroups = computed(() => {
  if (!props.data.servers || !props.data.profiles) return [];

  type PlayerInfo = {
    profileId: number | string;
    profileName: string;
    rank?: number;
    shortName?: string | null;
    tagFormat?: string | null;
  };

  // Create a map of serverId -> { serverName, players[] }
  const serverMap = new Map<
    number,
    { serverName: string; players: PlayerInfo[]; isLobby: boolean }
  >();

  props.data.profiles.forEach((profile) => {
    const serverId = Number(profile.serverId);
    const server = props.data.servers?.find((s) => s.serverId === serverId);
    const serverName = server?.serverName || 'Lobby';
    const isLobby = !server?.serverName;

    if (!serverMap.has(serverId)) {
      serverMap.set(serverId, {
        serverName,
        players: [],
        isLobby,
      });
    }

    serverMap.get(serverId)?.players.push({
      profileId: profile.profileId,
      profileName: profile.profileName,
      rank: profile.rank,
      shortName: profile.shortName,
      tagFormat: profile.tagFormat,
    });
  });

  // Convert to array and sort: actual servers by player count (desc), then lobby at the end
  return Array.from(serverMap.entries())
    .map(([serverId, data]) => ({
      serverId,
      serverName: data.serverName,
      players: data.players,
      playerCount: data.players.length,
      isLobby: data.isLobby,
    }))
    .sort((a, b) => {
      // Lobby always goes to the bottom
      if (a.isLobby && !b.isLobby) return 1;
      if (!a.isLobby && b.isLobby) return -1;
      // Otherwise sort by player count (descending)
      return b.playerCount - a.playerCount;
    });
});

// Top ladder players
const topLadderPlayers = computed(() => {
  if (!props.data.ladder) return [];
  return props.data.ladder.slice(0, 5);
});

// Smart switching: show players when there's ANY activity
const shouldShowPlayers = computed(() => {
  return props.playerCount > 0;
});

// Format clan tag for ladder entries
function formatClanTag(entry: LadderEntry): string {
  if (entry.tagFormat && entry.shortName) {
    return entry.tagFormat.replace('C', entry.shortName).replace('P', '');
  }
  return '';
}

// Format clan tag for online players
function formatPlayerClanTag(player: {
  tagFormat?: string | null;
  shortName?: string | null;
}): string {
  if (player.tagFormat && player.shortName) {
    return player.tagFormat.replace('C', player.shortName).replace('P', '');
  }
  return '';
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
      <!-- Players Online View -->
      <div
        class="absolute inset-0 transition-opacity duration-500 flex flex-col"
        :class="shouldShowPlayers ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
        <div class="flex items-center justify-between p-5 border-b border-teal/20">
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-users text-online text-xl" aria-hidden="true"></i>
            <h3 class="text-xl font-military font-bold text-t uppercase tracking-wide m-0">
              Players Online
            </h3>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-5 custom-scrollbar">
          <div v-if="isSSR || loading" class="space-y-4">
            <div class="h-24 bg-mg/15 border border-mg/25 animate-pulse"></div>
            <div class="h-24 bg-mg/15 border border-mg/25 animate-pulse"></div>
          </div>

          <template v-else>
            <!-- Server Groups with Players -->
            <div v-if="serverGroups.length > 0" class="space-y-4">
              <div
                v-for="server in serverGroups"
                :key="server.serverId"
                class="bg-mg/15 border border-mg/25 overflow-hidden transition-all duration-200 hover:border-teal/40 hover:shadow-[0_0_15px_rgba(0,217,255,0.1)]"
              >
                <!-- Server Header -->
                <div
                  class="flex items-center justify-between gap-2 px-3 py-2 bg-mg/25 border-b border-mg/30"
                >
                  <div class="flex items-center gap-2 flex-1 overflow-hidden">
                    <span
                      class="text-base font-body font-semibold text-t overflow-hidden text-ellipsis whitespace-nowrap"
                      v-html="colorize(server.serverName)"
                    ></span>
                  </div>
                  <span
                    v-if="!server.isLobby"
                    class="text-xs font-military font-bold text-online flex-shrink-0"
                  >
                    {{ server.playerCount }}/16
                  </span>
                </div>

                <!-- Players List -->
                <div class="px-3 py-2 space-y-1">
                  <div
                    v-for="player in server.players"
                    :key="player.profileId"
                    class="flex items-center gap-0 py-1 leading-none"
                  >
                    <RankInsignia
                      :rank="player.rank || 0"
                      :size="18"
                      class="inline-block flex-shrink-0 align-middle"
                    /><!--
                 --><span
                      class="inline align-middle leading-none overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      <span
                        v-if="formatPlayerClanTag(player)"
                        class="font-mono text-soviet font-semibold text-[0.75rem] tracking-[0.2px] align-middle"
                        >{{ formatPlayerClanTag(player) }}</span
                      ><span
                        class="font-body text-t text-[0.875rem] tracking-[0.2px] align-middle"
                        >{{ player.profileName }}</span
                      >
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="h-full flex items-center justify-center text-t3 font-body text-sm">
              No players online
            </div>
          </template>
        </div>
      </div>

      <!-- Top Players View -->
      <div
        class="absolute inset-0 transition-opacity duration-500 flex flex-col"
        :class="!shouldShowPlayers ? 'opacity-100 z-10' : 'opacity-0 z-0'"
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

        <div class="flex-1 overflow-y-auto p-5 custom-scrollbar">
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
              >
                <span
                  class="ladder-rank w-8 h-8 flex items-center justify-center bg-mg/40 text-sm font-bold font-military flex-shrink-0 text-white"
                >
                  {{ i + 1 }}
                </span>
                <div class="flex items-center flex-1 overflow-hidden leading-none gap-0">
                  <RankInsignia
                    :rank="player.rank || 0"
                    :size="20"
                    class="inline-block flex-shrink-0"
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
                <span class="ladder-score text-sm font-military font-bold flex-shrink-0 text-white">
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
