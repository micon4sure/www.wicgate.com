<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePlayerDisplay } from '../../composables/usePlayerDisplay';
import RankInsignia from '../RankInsignia.vue';
import OnlinePlayersModal from '../OnlinePlayersModal.vue';
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

// Manual override for view switching
const manualView = ref<'auto' | 'players' | 'leaderboard'>('auto');

// Modal state for expanded players view
const showModal = ref(false);

function openPlayersModal() {
  showModal.value = true;
}

function closePlayersModal() {
  showModal.value = false;
}

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
      ...(profile.rank !== undefined && { rank: profile.rank }),
      ...(profile.shortName !== undefined && { shortName: profile.shortName }),
      ...(profile.tagFormat !== undefined && { tagFormat: profile.tagFormat }),
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

// Smart switching: show players when there's ANY activity (unless manually overridden)
const shouldShowPlayers = computed(() => {
  if (manualView.value === 'leaderboard') return false;
  if (manualView.value === 'players') return true;
  return props.playerCount > 0;
});

// Switch to players view
function showPlayers() {
  manualView.value = 'players';
}

// Switch to leaderboard view
function showLeaderboard() {
  manualView.value = 'leaderboard';
}

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
  emit('navigate', 'statistics');
}
</script>

<template>
  <div class="dashboard-card">
    <!-- Tab Navigation -->
    <div class="tab-nav-sub relative">
      <button
        class="tab-btn-sub flex items-center justify-center gap-2"
        :class="{ 'tab-btn-sub-active': shouldShowPlayers }"
        @click="showPlayers"
      >
        <i class="fa-solid fa-users" aria-hidden="true"></i>
        Online
        <span v-if="playerCount > 0" class="widget-badge-count">{{ playerCount }}</span>
      </button>
      <button
        class="tab-btn-sub flex items-center justify-center gap-2"
        :class="{ 'tab-btn-sub-active': !shouldShowPlayers }"
        @click="showLeaderboard"
      >
        <i class="fa-solid fa-trophy" aria-hidden="true"></i>
        Top Players
      </button>
    </div>

    <div class="relative h-[360px] sm:h-[410px]">
      <!-- Players Online View -->
      <div
        class="absolute inset-0 transition-opacity duration-500 flex flex-col"
        :class="shouldShowPlayers ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
        <div class="dashboard-card-body custom-scrollbar relative">
          <!-- Expand button - top right of content -->
          <button
            v-if="playerCount > 0 && !isSSR"
            class="absolute top-2 right-2 z-20 widget-expand-btn"
            title="Expand to full view"
            @click="openPlayersModal"
          >
            <i class="fa-solid fa-expand" aria-hidden="true"></i>
          </button>

          <div v-if="isSSR || loading" class="space-y-4">
            <div class="skeleton-placeholder h-24"></div>
            <div class="skeleton-placeholder h-24"></div>
          </div>

          <template v-else>
            <!-- Server Groups with Players -->
            <div v-if="serverGroups.length > 0" class="space-y-4">
              <div v-for="server in serverGroups" :key="server.serverId" class="server-group-card">
                <!-- Server Header -->
                <div class="server-group-header">
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
                    class="flex items-center gap-1 py-1 leading-none"
                  >
                    <div class="w-4 h-4 rounded-sm flex-shrink-0 overflow-hidden">
                      <img
                        :src="`https://www.wicgate.com/pcc/${player.profileId}.webp`"
                        :alt="player.profileName"
                        class="w-full h-full object-cover"
                        loading="lazy"
                        @error="($event.target as HTMLImageElement).style.display = 'none'"
                      />
                    </div>
                    <RankInsignia
                      :rank="player.rank || 0"
                      :size="18"
                      class="inline-block flex-shrink-0 align-middle mr-1.5"
                    /><!--
                 --><span
                      class="inline align-middle leading-none overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      <span v-if="formatPlayerClanTag(player)" class="widget-clan-tag-sm">{{
                        formatPlayerClanTag(player)
                      }}</span
                      ><span class="widget-player-name-sm">{{ player.profileName }}</span>
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
        <div class="dashboard-card-body custom-scrollbar">
          <div v-if="isSSR || loading" class="space-y-3">
            <div class="skeleton-placeholder h-16"></div>
            <div class="skeleton-placeholder h-16"></div>
            <div class="skeleton-placeholder h-16"></div>
            <div class="skeleton-placeholder h-16"></div>
            <div class="skeleton-placeholder h-16"></div>
          </div>

          <template v-else>
            <div v-if="topLadderPlayers.length > 0" class="space-y-3">
              <div
                v-for="(player, i) in topLadderPlayers"
                :key="player.profileId"
                class="ladder-player-item"
              >
                <span class="ladder-rank" :class="`rank-${i + 1}`">
                  {{ i + 1 }}
                </span>
                <div class="flex items-center flex-1 overflow-hidden leading-none gap-0">
                  <RankInsignia
                    :rank="player.rank || 0"
                    :size="20"
                    class="inline-block flex-shrink-0 mr-1.5"
                  /><!--
               --><span v-if="formatClanTag(player)" class="widget-clan-tag">{{
                    formatClanTag(player)
                  }}</span
                  ><span class="widget-player-name">{{ player.profileName }}</span>
                </div>
                <span class="ladder-score" :class="`rank-${i + 1}`">
                  {{ player.high }}
                </span>
              </div>
            </div>
            <div v-else class="h-full flex items-center justify-center text-t3 font-body text-sm">
              No rankings yet
            </div>
          </template>
        </div>
        <!-- Footer with link -->
        <div class="px-5 pb-4">
          <button class="dashboard-card-header-action" @click="handleTopPlayersClick">
            Leaderboards →
          </button>
        </div>
      </div>
    </div>

    <!-- Expanded Players Modal -->
    <OnlinePlayersModal
      v-if="showModal && !isSSR"
      :server-groups="serverGroups"
      :player-count="playerCount"
      @close="closePlayersModal"
    />
  </div>
</template>
