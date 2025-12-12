<script setup lang="ts">
import { ref, computed, onActivated } from 'vue';
import TwitchEmbed from './TwitchEmbed.vue';
import { useTwitchStreams, getThumbnailUrl } from '../composables/useTwitchStreams';

const props = defineProps<{ channel: string; muted?: boolean }>();

// Get stream status from composable (shared state, fetches all channels once)
const { getStream, isLoading } = useTwitchStreams();

// User clicked to load iframe
const isActivated = ref(false);

// Stream data for this channel
const stream = computed(() => getStream(props.channel));
const isLive = computed(() => stream.value !== null);

// Thumbnail with proper dimensions (16:9 aspect ratio)
const thumbnailUrl = computed(() => {
  if (!stream.value?.thumbnail_url) return null;
  return getThumbnailUrl(stream.value.thumbnail_url, 440, 248);
});

function activate() {
  isActivated.value = true;
}

// Reset to preview on KeepAlive reactivation
onActivated(() => {
  isActivated.value = false;
});
</script>

<template>
  <div
    class="relative w-full pb-[56.25%] bg-graphite-dark border border-mg rounded-none overflow-hidden"
  >
    <!-- Activated: Show TwitchEmbed iframe -->
    <TwitchEmbed v-if="isActivated" :channel="props.channel" :muted="props.muted" />

    <!-- Not activated: Show preview based on stream status -->
    <template v-else>
      <!-- Click overlay -->
      <button
        type="button"
        class="absolute inset-0 z-20 w-full h-full cursor-pointer bg-transparent border-0 p-0 group"
        :aria-label="`Watch ${props.channel} on Twitch`"
        @click="activate"
      >
        <span class="sr-only">Click to load Twitch stream</span>
      </button>

      <!-- Loading state -->
      <div v-if="isLoading" class="absolute inset-0 skeleton-shimmer"></div>

      <!-- LIVE state -->
      <template v-else-if="isLive && stream">
        <!-- Thumbnail background -->
        <img
          v-if="thumbnailUrl"
          :src="thumbnailUrl"
          :alt="`${stream.user_name} streaming ${stream.game_name}`"
          class="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div v-else class="absolute inset-0 bg-graphite-dark"></div>

        <!-- Dark overlay for better text readability -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
        ></div>

        <!-- LIVE badge -->
        <div
          class="absolute top-3 left-3 z-10 px-2 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wide rounded flex items-center gap-1.5"
        >
          <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          LIVE
        </div>

        <!-- Stream info (bottom) -->
        <div class="absolute bottom-0 left-0 right-0 z-10 p-3 md:p-4">
          <p class="text-white font-semibold text-sm md:text-base line-clamp-1 mb-1">
            {{ stream.title }}
          </p>
          <div class="flex items-center gap-3 text-white/80 text-xs md:text-sm">
            <span class="flex items-center gap-1">
              <i class="fa-solid fa-eye"></i>
              {{ stream.viewer_count.toLocaleString() }}
            </span>
            <span>{{ stream.game_name }}</span>
          </div>
        </div>

        <!-- Play button -->
        <div class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div
            class="w-16 h-12 bg-twitch/90 text-white rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:bg-twitch shadow-lg"
          >
            <i class="fa-solid fa-play text-xl ml-1"></i>
          </div>
        </div>
      </template>

      <!-- OFFLINE state -->
      <template v-else>
        <div class="absolute inset-0 flex flex-col items-center justify-center bg-graphite-dark">
          <i class="fa-brands fa-twitch text-twitch/30 text-5xl mb-3"></i>
          <p class="text-t-tertiary text-sm font-medium">Stream offline</p>
        </div>

        <!-- Subtle play button for offline (still clickable to check) -->
        <div class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div
            class="w-14 h-10 bg-twitch/50 text-white/70 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:bg-twitch/70"
          >
            <i class="fa-solid fa-play text-lg ml-0.5"></i>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
