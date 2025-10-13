<script setup lang="ts">
import { computed } from 'vue';
import { useYoutube } from '../composables/useYoutube';
import { useEvents } from '../composables/useEvents';
import TwitchFacade from '../components/TwitchFacade.vue';
import EventsSkeleton from '../components/skeletons/EventsSkeleton.vue';
import VideosSkeleton from '../components/skeletons/VideosSkeleton.vue';

// SSR detection
const isSSR = import.meta.env.SSR;

// Get videos data from composable
const {
  videos: videosByChannel,
  videosSorted: ytVideosSorted,
  loading: ytVidsLoading,
} = useYoutube();

// Events integration
const { events, isLoading: eventsLoading, formatDate, getCountdown } = useEvents();

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

const twitchUsernames = ['kickapoo149', 'pontertwitch'];
</script>

<template>
  <section id="community" class="section bg-gradient-to-b from-graphite/30 to-graphite-dark/50">
    <div class="container max-w-7xl">
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

      <!-- Events Section -->
      <div id="community-events" class="mb-20">
        <!-- Subsection Header -->
        <div class="text-center mb-8">
          <h3
            class="text-2xl md:text-3xl font-military font-bold text-t uppercase tracking-wider mb-2"
          >
            Events
          </h3>
          <p class="text-sm md:text-base text-t-secondary font-body m-0">
            Tournaments, community nights, and special operations
          </p>
        </div>

        <!-- Events Content -->
        <EventsSkeleton v-if="isSSR || eventsLoading" />
        <div v-else-if="events.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <component
            :is="e.link ? 'a' : 'div'"
            v-for="e in events"
            :key="e.id"
            :href="e.link"
            target="_blank"
            class="bg-gradient-to-br from-graphite-light/80 to-graphite-dark/90 border-2 border-teal/30 rounded-none overflow-hidden transition-all duration-300 hover:border-teal/75 hover:shadow-[0_0_30px_rgba(0,217,255,0.32)] hover:-translate-y-0.5 active:scale-[0.98] no-underline text-inherit flex flex-col"
          >
            <!-- Event Image -->
            <div
              v-if="e.coverUrl"
              class="relative h-56 bg-cover bg-center bg-graphite-dark flex items-start justify-end p-3 border-b border-teal/20"
              :style="{ backgroundImage: 'url(' + e.coverUrl + ')' }"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-black/10 to-black/40"></div>
              <div
                class="relative z-10 px-4 py-1.5 rounded-none text-xs font-bold tracking-wider uppercase font-military border"
                :class="
                  new Date(e.start).getTime() <= Date.now()
                    ? 'bg-youtube text-white border-youtube-bright shadow-[0_0_20px_rgba(229,57,53,0.6)] animate-pulse'
                    : 'bg-graphite-light/90 text-t border-teal/50'
                "
              >
                {{ new Date(e.start).getTime() <= Date.now() ? 'LIVE NOW' : getCountdown(e.start) }}
              </div>
            </div>

            <!-- Event Content -->
            <div class="flex-1 flex flex-col gap-2 p-4">
              <!-- Status badge for no-image events -->
              <div
                v-if="!e.coverUrl"
                class="self-start px-4 py-1.5 rounded-none text-xs font-bold tracking-wider uppercase font-military border mb-2"
                :class="
                  new Date(e.start).getTime() <= Date.now()
                    ? 'bg-youtube text-white border-youtube-bright shadow-[0_0_20px_rgba(229,57,53,0.6)] animate-pulse'
                    : 'bg-graphite-light/90 text-t border-teal/50'
                "
              >
                {{ new Date(e.start).getTime() <= Date.now() ? 'LIVE NOW' : getCountdown(e.start) }}
              </div>

              <h4
                class="m-0 text-lg md:text-xl font-military font-medium text-t uppercase tracking-wide leading-snug"
              >
                {{ e.name }}
              </h4>
              <p class="m-0 text-sm md:text-base text-t-secondary font-body leading-relaxed flex-1">
                {{ e.description }}
              </p>
              <div class="flex justify-between items-center mt-3 pt-3 border-t border-teal/10">
                <span class="text-xs text-t3 flex items-center gap-2 font-body">
                  <i class="fa-regular fa-calendar" aria-hidden="true"></i>
                  {{ formatDate(e.start) }}
                </span>
                <span v-if="e.link" class="text-teal text-xs">
                  <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </span>
              </div>
            </div>
          </component>
        </div>
        <div
          v-else-if="!eventsLoading"
          class="text-center py-10 text-t3 border border-teal/10 bg-gradient-to-b from-graphite-light/85 to-graphite-dark/90 rounded-none"
        >
          <i
            class="fa-regular fa-calendar-xmark text-4xl mb-4 text-teal/70 opacity-85"
            aria-hidden="true"
          ></i>
          <p class="m-0 text-base font-body">No events scheduled at the moment</p>
        </div>
      </div>

      <!-- Live Streams -->
      <div id="community-streams" class="mb-20">
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
                class="text-teal font-military font-semibold uppercase tracking-wide text-sm md:text-base"
                >{{ u }}</strong
              >
            </div>
          </a>
        </div>
      </div>

      <!-- Latest Videos -->
      <div id="community-videos" class="mb-20">
        <!-- Subsection Header -->
        <div class="text-center mb-8">
          <h3 class="text-2xl md:text-3xl font-military font-bold text-t uppercase tracking-wider">
            Latest Videos
          </h3>
        </div>

        <VideosSkeleton v-if="isSSR || ytVidsLoading" />

        <div v-else class="min-h-[340px]">
          <!-- Latest 6 Videos -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
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

          <!-- By Content Creator -->
          <div v-if="channelsList.length">
            <!-- Subsection Header -->
            <div class="text-center mb-8 mt-12">
              <h3
                class="text-2xl md:text-3xl font-military font-bold text-t uppercase tracking-wider"
              >
                By Content Creator
              </h3>
            </div>

            <div v-for="ch in channelsList" :key="ch.channelId" class="mb-12">
              <!-- Creator Card (KEEP TEAL HOVER) -->
              <div class="flex justify-center mb-5">
                <a
                  :href="`https://www.youtube.com/channel/${ch.channelId}`"
                  target="_blank"
                  class="bg-gradient-to-b from-graphite-light/96 to-graphite-dark/98 border border-teal/40 rounded-none px-6 py-3 no-underline transition-all duration-300 flex items-center justify-center gap-2.5 shadow-[0_12px_28px_rgba(4,9,14,0.55)] min-h-[50px] min-w-[250px] max-w-[350px] w-full hover:bg-gradient-to-b hover:from-teal-bright hover:to-teal hover:border-teal/60 hover:shadow-[0_4px_16px_rgba(0,0,0,0.3),0_0_24px_rgba(0,217,255,0.4)] hover:-translate-y-0.5 active:scale-[0.98] group"
                  :aria-label="`View ${ch.channelTitle} YouTube channel`"
                >
                  <span
                    class="flex-1 text-center text-t-secondary font-military font-bold uppercase tracking-wide text-base whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-graphite-dark"
                  >
                    {{ ch.channelTitle }}
                  </span>
                  <i
                    class="fa-solid fa-external-link text-teal text-sm transition-all duration-300 group-hover:text-graphite-dark group-hover:translate-x-1"
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
          </div>

          <div v-if="ytVideosSorted.length === 0" class="text-t3 text-center py-10">
            No videos available
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
