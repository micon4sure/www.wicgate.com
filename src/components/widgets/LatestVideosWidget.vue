<script setup lang="ts">
import { computed } from 'vue';
import WidgetBase from './WidgetBase.vue';
import type { YouTubeVideo } from '../../api-types';

const props = defineProps<{
  videos: YouTubeVideo[];
  isSSR: boolean;
}>();

const emit = defineEmits<{
  navigate: [section: string];
}>();

const latestVideos = computed(() => props.videos.slice(0, 3));

function handleClick() {
  emit('navigate', 'community');
}

function openVideo(url: string) {
  window.open(url, '_blank');
}
</script>

<template>
  <WidgetBase
    title="Latest Videos"
    icon="fa-brands fa-youtube"
    action="Watch More"
    @click="handleClick"
  >
    <div v-if="isSSR" class="widget-skeleton">
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
    </div>
    <template v-else>
      <div v-if="latestVideos.length > 0" class="video-list">
        <div
          v-for="video in latestVideos"
          :key="video.id"
          class="video-item cursor-pointer"
          @click.stop="openVideo(video.videoUrl)"
        >
          <img :src="video.thumbnailUrl" :alt="video.title" loading="lazy" />
          <span class="video-title">{{ video.title }}</span>
        </div>
      </div>
      <div v-else class="widget-empty">No videos yet</div>
    </template>
  </WidgetBase>
</template>
