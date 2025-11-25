<script setup lang="ts">
import { computed } from 'vue';
import { useYoutube } from '../composables/useYoutube';
import TwitchFacade from '../components/TwitchFacade.vue';
import VideosSkeleton from '../components/skeletons/VideosSkeleton.vue';
import TabContainer from '../components/TabContainer.vue';

// SSR detection
const isSSR = import.meta.env.SSR;

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
  <section id="community" class="section bg-community-section">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-20">
        <h2
          class="text-5xl md:text-6xl font-military font-bold text-t uppercase tracking-wider mb-6"
        >
          Community
        </h2>
        <p class="text-lg md:text-xl text-t-secondary max-w-2xl mx-auto font-body leading-relaxed">
          Watch live streams and videos from the WiC community
        </p>
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
          :tab-class="'tab-btn-s'"
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
                <div v-for="v in top6NYTVideos" :key="v.id || v.videoUrl" class="video-card">
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
                      <h4 class="video-card-title">
                        {{ v.title }}
                      </h4>
                      <div class="video-card-meta">
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
                  class="channel-link group"
                  :aria-label="`View ${ch.channelTitle} YouTube channel`"
                >
                  <span class="channel-link-text"> Visit {{ ch.channelTitle }} Channel </span>
                  <i class="channel-link-icon fa-solid fa-external-link" aria-hidden="true"></i>
                </a>
              </div>

              <!-- Creator Videos -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div v-for="v in ch.videos" :key="v.id" class="video-card">
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
                      <h4 class="video-card-title">
                        {{ v.title }}
                      </h4>
                      <div class="video-card-meta">
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
