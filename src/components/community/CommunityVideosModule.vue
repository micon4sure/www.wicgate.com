<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useYoutube } from '../../composables/useYoutube';
import VideosSkeleton from '../skeletons/VideosSkeleton.vue';

const EXPAND_KEY = 'community_videos_expanded';
const isSSR = import.meta.env.SSR;

const { videos: videosByChannel, videosSorted, loading } = useYoutube();

const stored = !isSSR && typeof window !== 'undefined' ? localStorage.getItem(EXPAND_KEY) : null;
const expanded = ref(stored === '1');

watch(expanded, (val: boolean) => {
  if (isSSR || typeof window === 'undefined') return;
  localStorage.setItem(EXPAND_KEY, val ? '1' : '0');
});

const topVideos = computed(() => videosSorted.value.slice(0, 6));

const channelsList = computed(() =>
  Object.entries(videosByChannel.value)
    .map(([channelId, group]) => ({
      channelId,
      channelTitle: group.channelTitle || 'Unknown Channel',
      videos: group.videos.slice(0, 6),
    }))
    .sort((a, b) => a.channelTitle.localeCompare(b.channelTitle))
);
</script>

<template>
  <section id="videos" class="community-module mb-xl vid-section">
    <div class="vid-hdr">
      <h3>Latest Videos</h3>
      <label class="toggle">
        <input v-model="expanded" type="checkbox" />
        <span class="slider"></span>
        <span class="lbl">Expand</span>
      </label>
    </div>

    <VideosSkeleton v-if="isSSR || loading.value" />
    <template v-else>
      <div class="latest-videos-section">
        <div class="videos-grid">
          <div v-for="video in topVideos" :key="video.id || video.videoUrl" class="card vid-card">
            <a :href="video.videoUrl" target="_blank" class="vid-link" rel="noopener noreferrer">
              <div class="vid-thumb">
                <img :src="video.thumbnailUrl" :alt="`${video.title} - ${video.author || 'WiCGATE'} video thumbnail`"
                  loading="lazy" />
                <div class="play-over">
                  <i class="fa-solid fa-play" aria-hidden="true"></i>
                </div>
              </div>
              <div class="vid-info">
                <h4 class="vid-title">{{ video.title }}</h4>
                <div class="vid-meta">
                  <span v-if="video.author">{{ video.author }}</span>
                  <span v-if="video.views != null">
                    • {{ video.views.toLocaleString() }} views</span>
                  <span v-if="video.publishedAt">
                    • {{ new Date(video.publishedAt).toLocaleDateString() }}</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <Transition name="expand-y">
        <div v-if="expanded" class="by-channel">
          <div class="vid-hdr by-channel-hdr">
            <h3>By Content Creator</h3>
          </div>
          <div v-for="channel in channelsList" :key="channel.channelId" class="channel-section">
            <div class="creator-card-container">
              <a :href="`https://www.youtube.com/channel/${channel.channelId}`" target="_blank"
                class="card creator-card" :aria-label="`View ${channel.channelTitle} YouTube channel`">
                <div class="creator-info">
                  <h4 class="creator-name">{{ channel.channelTitle }}</h4>
                  <div class="creator-badge-icon">
                    <i class="fa-solid fa-external-link" aria-hidden="true"></i>
                  </div>
                </div>
              </a>
            </div>
            <div class="videos-grid">
              <div v-for="video in channel.videos" :key="video.id" class="card vid-card">
                <a :href="video.videoUrl" target="_blank" class="vid-link" rel="noopener noreferrer">
                  <div class="vid-thumb">
                    <img :src="video.thumbnailUrl" :alt="`${video.title} - ${channel.channelTitle} video thumbnail`"
                      loading="lazy" />
                    <div class="play-over">
                      <i class="fa-solid fa-play" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div class="vid-info">
                    <h4 class="vid-title">{{ video.title }}</h4>
                    <div class="vid-meta">
                      <span v-if="video.views != null">{{ video.views.toLocaleString() }} views</span>
                      <span v-if="video.publishedAt">
                        • {{ new Date(video.publishedAt).toLocaleDateString() }}</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <div v-if="videosSorted.length === 0" class="text-muted">No videos available</div>
    </template>
  </section>
</template>
