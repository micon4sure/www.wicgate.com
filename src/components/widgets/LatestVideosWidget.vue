<script setup lang="ts">
import { computed, ref } from 'vue';
import WidgetBase from './WidgetBase.vue';
import YouTubeTheater from '../YouTubeTheater.vue';
import type { YouTubeVideo } from '../../api-types';

const props = defineProps<{
  videos: YouTubeVideo[];
  isSSR: boolean;
}>();

const emit = defineEmits<{
  navigate: [section: string];
}>();

const latestVideos = computed(() => props.videos.slice(0, 3));
const selectedVideo = ref<YouTubeVideo | null>(null);

function handleClick() {
  emit('navigate', 'community');
}

function openVideo(video: YouTubeVideo) {
  selectedVideo.value = video;
}
</script>

<template>
  <WidgetBase
    title="Latest Videos"
    icon="fa-brands fa-youtube"
    action="Watch More"
    @click="handleClick"
  >
    <div v-if="isSSR" class="space-y-3">
      <div class="flex gap-3">
        <div class="skeleton-placeholder w-20 h-[45px] flex-shrink-0"></div>
        <div class="skeleton-placeholder flex-1 h-10"></div>
      </div>
      <div class="flex gap-3">
        <div class="skeleton-placeholder w-20 h-[45px] flex-shrink-0"></div>
        <div class="skeleton-placeholder flex-1 h-10"></div>
      </div>
      <div class="flex gap-3">
        <div class="skeleton-placeholder w-20 h-[45px] flex-shrink-0"></div>
        <div class="skeleton-placeholder flex-1 h-10"></div>
      </div>
    </div>
    <template v-else>
      <div v-if="latestVideos.length > 0" class="video-list">
        <div
          v-for="video in latestVideos"
          :key="video.id"
          class="video-item cursor-pointer"
          @click.stop="openVideo(video)"
        >
          <div class="relative flex-shrink-0">
            <img :src="video.thumbnailUrl" :alt="video.title" loading="lazy" />
            <div class="play-over-sm">
              <i class="fa-solid fa-play" aria-hidden="true"></i>
            </div>
          </div>
          <span class="video-title">{{ video.title }}</span>
        </div>
      </div>
      <div v-else class="widget-empty">No videos yet</div>
    </template>

    <YouTubeTheater
      v-if="selectedVideo"
      :video-id="selectedVideo.id"
      :title="selectedVideo.title"
      @close="selectedVideo = null"
    />
  </WidgetBase>
</template>
