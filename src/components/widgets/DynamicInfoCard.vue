<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePlayerDisplay } from '../../composables/usePlayerDisplay';
import { useMobileTabs } from '../../composables/useMobileTabs';
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
const { isMobile, dropdownOpen, dropdownRef, triggerRef, toggleDropdown, closeDropdown } =
  useMobileTabs();

// Refs used in template via ref="..." bindings
void dropdownRef;
void triggerRef;

// Tab configuration for mobile dropdown
const tabs = [
  { id: 'players', label: 'Online', icon: 'fa-solid fa-users' },
  { id: 'leaderboard', label: 'Top Players', icon: 'fa-solid fa-trophy' },
];

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

// Mobile dropdown helpers
const activeTabId = computed(() => (shouldShowPlayers.value ? 'players' : 'leaderboard'));

const activeTab = computed(() => tabs.find((t) => t.id === activeTabId.value) ?? tabs[0]!);

function selectTab(tabId: string) {
  if (tabId === 'players') {
    showPlayers();
  } else {
    showLeaderboard();
  }
  closeDropdown();
}
</script>

<template>
  <div class="dashboard-card">
    <!-- MOBILE: Hamburger Dropdown -->
    <div v-if="isMobile" class="tab-mobile-wrapper relative">
      <button
        ref="triggerRef"
        class="tab-mobile-trigger-sub"
        :class="{ 'tab-mobile-trigger-sub-open': dropdownOpen }"
        :aria-expanded="dropdownOpen"
        aria-haspopup="listbox"
        @click="toggleDropdown"
      >
        <div class="flex items-center gap-3">
          <i class="fa-solid fa-bars" aria-hidden="true"></i>
          <i :class="activeTab.icon" aria-hidden="true"></i>
          <span class="tab-mobile-trigger-label">{{ activeTab.label }}</span>
          <span v-if="shouldShowPlayers && playerCount > 0" class="widget-badge-count">{{
            playerCount
          }}</span>
        </div>
        <i
          class="fa-solid fa-chevron-down tab-mobile-chevron"
          :class="{ 'rotate-180': dropdownOpen }"
          aria-hidden="true"
        ></i>
      </button>

      <Transition name="tab-dropdown">
        <div
          v-if="dropdownOpen"
          ref="dropdownRef"
          class="tab-mobile-dropdown-sub"
          role="listbox"
          aria-label="View selection"
        >
          <button
            v-for="tab in tabs.filter((t) => t.id !== activeTabId)"
            :key="tab.id"
            role="option"
            :aria-selected="false"
            class="tab-mobile-option-sub"
            @click="selectTab(tab.id)"
          >
            <i :class="tab.icon" class="mr-3" aria-hidden="true"></i>
            {{ tab.label }}
            <span v-if="tab.id === 'players' && playerCount > 0" class="widget-badge-count ml-2">{{
              playerCount
            }}</span>
          </button>
        </div>
      </Transition>
    </div>

    <!-- DESKTOP: Horizontal Tabs -->
    <div v-else class="tab-nav-sub relative">
      <button
        class="tab-btn-sub flex items-center justify-center gap-2"
        :class="{ 'tab-btn-sub-active': shouldShowPlayers }"
        @click="showPlayers"
      >
        <i class="fa-solid fa-users" aria-hidden="true"></i>
        Online
        <span v-if="playerCount > 0" class="widget-badge-count">{{ playerCount }}</span>
        <i
          v-if="playerCount > 0 && !isSSR"
          class="fa-solid fa-expand ml-1 text-xs opacity-60 hover:opacity-100 transition-opacity"
          title="Expand to full view"
          @click.stop="openPlayersModal"
        ></i>
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
        <div class="dashboard-card-body custom-scrollbar">
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
                      class="text-lg font-body font-semibold text-t overflow-hidden text-ellipsis whitespace-nowrap"
                      v-html="colorize(server.serverName)"
                    ></span>
                  </div>
                  <span
                    v-if="!server.isLobby"
                    class="text-sm font-military font-bold text-online flex-shrink-0"
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
            <div v-else class="h-full flex items-center justify-center text-t3 font-body text-base">
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
            <div v-else class="h-full flex items-center justify-center text-t3 font-body text-base">
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
