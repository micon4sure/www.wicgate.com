<script setup lang="ts">
import { computed } from 'vue';
import { useYoutube } from '../composables/useYoutube';
import { useAppDataStore } from '../stores/appDataStore';
import { useServerCapacity } from '../composables/useServerCapacity';
import { usePlayerDisplay } from '../composables/usePlayerDisplay';
import TwitchFacade from '../components/TwitchFacade.vue';
import VideosSkeleton from '../components/skeletons/VideosSkeleton.vue';
import TabContainer from '../components/TabContainer.vue';
import { SERVER_MAX_CAPACITY } from '../constants';

// SSR detection
const isSSR = import.meta.env.SSR;

// App data store for server/player data
const store = useAppDataStore();

// Server and player data
const players = computed(() => store.data.profiles || []);
const servers = computed(() => store.data.servers || []);
const totalPlayers = computed(() => players.value.length);

// Utility composables
const { getCapacityColor } = useServerCapacity();
const { colorize, parseClanTag, groupPlayersByServer } = usePlayerDisplay();

// Group players by server and sort by player count
const serverGroups = computed(() => {
  const groups = groupPlayersByServer(players.value, servers.value);
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

// Get videos data from composable
const {
  videos: videosByChannel,
  videosSorted: ytVideosSorted,
  loading: ytVidsLoading,
} = useYoutube();

// Show top 6 latest videos
const top6NYTVideos = computed(() => ytVideosSorted.value.slice(0, 6));

// Flatten grouped channels into an array for v-for and sort by channel title
const channelsList = computed(() => {
  return Object.entries(videosByChannel.value)
    .map(([channelId, group]) => ({
      channelId,
      channelTitle: group.channelTitle || 'Unknown Channel',
      videos: group.videos.slice(0, 6),
    }))
    .sort((a, b) => a.channelTitle.localeCompare(b.channelTitle));
});

// Video tabs configuration
const videoTabs = computed(() => {
  const tabs = [
    {
      id: 'community-videos-latest',
      label: 'Latest Videos',
      icon: 'fa-solid fa-fire',
    },
  ];

  // Add one tab per content creator
  channelsList.value.forEach((channel) => {
    tabs.push({
      id: `community-videos-${channel.channelId}`,
      label: channel.channelTitle,
      icon: 'fa-brands fa-youtube',
    });
  });

  return tabs;
});

const twitchUsernames = ['kickapoo149', 'pontertwitch'];
</script>

<template>
  <section id="community" class="section bg-gradient-to-b from-graphite/30 to-graphite-dark/50">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-20">
        <h2
          class="text-5xl md:text-6xl font-military font-bold text-t uppercase tracking-wider mb-6"
        >
          Community
        </h2>
        <p class="text-lg md:text-xl text-t-secondary max-w-2xl mx-auto font-body leading-relaxed">
          Join the conversation across all platforms
        </p>

        <!-- Community links (keep existing) -->
        <div class="community-links">
          <a
            href="https://discord.gg/WnxwfMTyBe"
            target="_blank"
            rel="noopener noreferrer"
            class="community-link discord"
          >
            <i class="fa-brands fa-discord" aria-hidden="true"></i>
            Join Discord (287 members)
          </a>
          <a
            href="https://youtube.com/@wicgate"
            target="_blank"
            rel="noopener noreferrer"
            class="community-link youtube"
          >
            <i class="fa-brands fa-youtube" aria-hidden="true"></i>
            Watch Videos (1.2K subs)
          </a>
          <a
            href="https://twitch.tv/directory/game/World%20in%20Conflict"
            target="_blank"
            rel="noopener noreferrer"
            class="community-link twitch"
          >
            <i class="fa-brands fa-twitch" aria-hidden="true"></i>
            Live Streams
          </a>
        </div>
      </div>

      <!-- Live Activity (Servers & Players Online) -->
      <div id="live-activity" class="mb-20">
        <!-- Subsection Header -->
        <div class="text-center mb-8">
          <h3
            class="text-2xl md:text-3xl font-military font-bold text-t uppercase tracking-wider mb-2"
          >
            Servers & Players Online
          </h3>
          <p class="text-sm md:text-base text-t-secondary font-body">
            {{ totalPlayers }} {{ totalPlayers === 1 ? 'player' : 'players' }} across
            {{ activeServerCount }} {{ activeServerCount === 1 ? 'server' : 'servers' }}
          </p>
        </div>

        <!-- Server Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <!-- Skeleton Loading State -->
          <div
            v-if="isSSR || store.loading"
            class="bg-gradient-to-b from-panel/90 to-panel-dark/95 border border-teal/20 rounded-none p-5 min-h-[180px]"
          >
            <div class="h-6 bg-graphite/30 mb-4 w-2/3"></div>
            <div class="space-y-2">
              <div class="h-4 bg-graphite/20 w-full"></div>
              <div class="h-4 bg-graphite/20 w-4/5"></div>
              <div class="h-4 bg-graphite/20 w-3/5"></div>
            </div>
          </div>

          <!-- Server Cards -->
          <template v-else>
            <div
              v-for="group in serverGroups"
              :key="group.serverId"
              class="bg-gradient-to-b from-panel/90 to-panel-dark/95 border border-teal/20 border-l-2 border-l-massgate-orange rounded-none overflow-hidden transition-all duration-300 hover:border-teal/40"
              :class="{ 'opacity-60': group.players.length === 0 }"
            >
              <!-- Server Header -->
              <div class="p-4 md:p-5 border-b border-teal/10">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5 flex-1 min-w-0">
                    <span
                      class="w-2 h-2 rounded-full flex-shrink-0"
                      :class="
                        group.players.length > 0
                          ? 'bg-green shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse'
                          : 'bg-graphite opacity-40'
                      "
                    ></span>
                    <h4
                      class="m-0 font-military text-lg md:text-xl font-bold text-t uppercase tracking-wide truncate"
                      v-html="colorize(group.serverName)"
                    ></h4>
                  </div>
                  <div
                    class="text-base md:text-lg font-military font-bold tracking-wide flex-shrink-0"
                    :style="{ color: getCapacityColor(group.players.length) }"
                  >
                    {{ group.players.length }}/{{ SERVER_MAX_CAPACITY }}
                  </div>
                </div>
              </div>

              <!-- Player List (Vertical) -->
              <div class="p-4 md:p-5">
                <div
                  v-if="group.players.length === 0"
                  class="text-center text-t3 text-sm py-3 font-body"
                >
                  No players online
                </div>
                <div v-else class="space-y-1.5">
                  <div
                    v-for="player in group.players"
                    :key="(player.profileName || 'Unknown') + String(player.serverId)"
                    class="flex items-center gap-2.5 px-3 py-2 bg-graphite/10 border-l-2 border-graphite/20 transition-all duration-200 hover:bg-graphite/20 hover:border-l-teal/50"
                  >
                    <span
                      v-if="parseClanTag(player).clanTag"
                      class="font-mono text-massgate-orange font-semibold text-xs flex-shrink-0"
                    >
                      {{ parseClanTag(player).clanTag }}
                    </span>
                    <span class="font-body text-t text-sm md:text-base tracking-wide truncate">
                      {{ parseClanTag(player).playerName }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-if="serverGroups.length === 0"
              class="col-span-full text-center py-12 text-t3 border border-teal/10 bg-gradient-to-b from-graphite/20 to-graphite-dark/30 rounded-none"
            >
              <i
                class="fa-solid fa-server text-3xl mb-3 text-teal/50 opacity-70"
                aria-hidden="true"
              ></i>
              <p class="m-0 text-sm md:text-base font-body">No servers available</p>
            </div>
          </template>
        </div>
      </div>

      <!-- Live Streams -->
      <div id="streams" class="mb-20">
        <!-- Subsection Header -->
        <div class="text-center mb-8">
          <h3 class="text-2xl md:text-3xl font-military font-bold text-t uppercase tracking-wider">
            Live Streams
          </h3>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <a
            v-for="u in twitchUsernames"
            :key="u"
            :href="`https://twitch.tv/${u}`"
            target="_blank"
            class="card p-0 overflow-hidden no-underline text-inherit"
            :aria-label="`Watch ${u} live on Twitch`"
          >
            <TwitchFacade :channel="u" muted />
            <div class="p-3 md:p-4 flex justify-center items-center border-t border-teal/10">
              <strong
                class="text-massgate-orange font-military font-semibold uppercase tracking-wide text-sm md:text-base"
                >{{ u }}</strong
              >
            </div>
          </a>
        </div>
      </div>

      <!-- Latest Videos -->
      <div id="videos" class="mb-20">
        <!-- Subsection Header -->
        <div class="text-center mb-8">
          <h3 class="text-2xl md:text-3xl font-military font-bold text-t uppercase tracking-wider">
            Latest Videos
          </h3>
        </div>

        <VideosSkeleton v-if="isSSR || ytVidsLoading" />

        <!-- Tab Container for Videos -->
        <TabContainer
          v-else
          :tabs="videoTabs"
          analytics-category="Community Videos"
          aria-label="Video categories"
        >
          <!-- Tab: Latest Videos -->
          <template #videos-latest>
            <div class="py-8 md:py-10">
              <div v-if="ytVideosSorted.length === 0" class="text-t3 text-center py-10">
                No videos available
              </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div
                  v-for="v in top6NYTVideos"
                  :key="v.id || v.videoUrl"
                  class="card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(4,9,14,0.6)] active:scale-[0.98]"
                >
                  <a
                    :href="v.videoUrl"
                    target="_blank"
                    class="no-underline text-inherit block"
                    rel="noopener noreferrer"
                  >
                    <div class="relative w-full pb-[56.25%] bg-graphite-dark overflow-hidden">
                      <img
                        :src="v.thumbnailUrl"
                        :alt="`${v.title} - ${v.author || 'WiCGATE'} video thumbnail`"
                        loading="lazy"
                        class="absolute inset-0 w-full h-full object-cover"
                      />
                      <div class="play-over">
                        <i class="fa-solid fa-play" aria-hidden="true"></i>
                      </div>
                    </div>
                    <div class="p-3 md:p-4">
                      <h4
                        class="m-0 mb-1.5 text-sm md:text-base leading-snug text-t font-body font-semibold line-clamp-2"
                      >
                        {{ v.title }}
                      </h4>
                      <div class="text-xs text-t3 font-body">
                        <span v-if="v.author">{{ v.author }}</span>
                        <span v-if="v.views != null"> • {{ v.views.toLocaleString() }} views</span>
                        <span v-if="v.publishedAt">
                          • {{ new Date(v.publishedAt).toLocaleDateString() }}</span
                        >
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </template>

          <!-- Tabs: Content Creators -->
          <template v-for="ch in channelsList" :key="ch.channelId" #[`videos-${ch.channelId}`]>
            <div class="py-8 md:py-10">
              <!-- Creator Channel Link -->
              <div class="flex justify-center mb-6">
                <a
                  :href="`https://www.youtube.com/channel/${ch.channelId}`"
                  target="_blank"
                  class="bg-gradient-to-b from-graphite-light/96 to-graphite-dark/98 border-2 border-teal/30 rounded-none px-6 py-3 no-underline transition-all duration-300 flex items-center justify-center gap-2.5 shadow-[0_12px_28px_rgba(4,9,14,0.55)] min-h-[50px] min-w-[250px] max-w-[350px] w-full hover:bg-gradient-to-b hover:from-massgate-orange-light hover:to-massgate-orange hover:border-massgate-orange/70 hover:shadow-[0_4px_16px_rgba(0,0,0,0.3),0_0_24px_rgba(255,102,0,0.45)] hover:-translate-y-0.5 active:scale-[0.98] group"
                  :aria-label="`View ${ch.channelTitle} YouTube channel`"
                >
                  <span
                    class="flex-1 text-center text-t-secondary font-military font-bold uppercase tracking-wide text-base whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-ink"
                  >
                    Visit {{ ch.channelTitle }} Channel
                  </span>
                  <i
                    class="fa-solid fa-external-link text-t-secondary text-sm transition-all duration-300 group-hover:text-ink group-hover:translate-x-1"
                    aria-hidden="true"
                  ></i>
                </a>
              </div>

              <!-- Creator Videos -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div
                  v-for="v in ch.videos"
                  :key="v.id"
                  class="card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(4,9,14,0.6)] active:scale-[0.98]"
                >
                  <a
                    :href="v.videoUrl"
                    target="_blank"
                    class="no-underline text-inherit block"
                    rel="noopener noreferrer"
                  >
                    <div class="relative w-full pb-[56.25%] bg-graphite-dark overflow-hidden">
                      <img
                        :src="v.thumbnailUrl"
                        :alt="`${v.title} - ${ch.channelTitle} video thumbnail`"
                        loading="lazy"
                        class="absolute inset-0 w-full h-full object-cover"
                      />
                      <div class="play-over">
                        <i class="fa-solid fa-play" aria-hidden="true"></i>
                      </div>
                    </div>
                    <div class="p-3 md:p-4">
                      <h4
                        class="m-0 mb-1.5 text-sm md:text-base leading-snug text-t font-body font-semibold line-clamp-2"
                      >
                        {{ v.title }}
                      </h4>
                      <div class="text-xs text-t3 font-body">
                        <span v-if="v.views != null">{{ v.views.toLocaleString() }} views</span>
                        <span v-if="v.publishedAt">
                          • {{ new Date(v.publishedAt).toLocaleDateString() }}</span
                        >
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </template>
        </TabContainer>
      </div>
    </div>
  </section>
</template>
