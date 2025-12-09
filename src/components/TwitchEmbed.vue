<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{ channel: string; muted?: boolean }>();

const isVisible = ref(false); // IntersectionObserver triggered
const isLoaded = ref(false); // iframe onload fired
const host = typeof window !== 'undefined' ? window.location.hostname : 'wicgate.com';

let observer: IntersectionObserver | null = null;
const embedContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  if (typeof window === 'undefined' || !embedContainer.value) return;

  // Use Intersection Observer to only load when in viewport
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isVisible.value) {
          isVisible.value = true;
          observer?.disconnect();
        }
      });
    },
    { rootMargin: '100px' } // Start loading 100px before entering viewport
  );

  observer.observe(embedContainer.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<template>
  <div
    ref="embedContainer"
    class="relative w-full pb-[56.25%] bg-graphite-light border border-mg rounded-none overflow-hidden"
  >
    <!-- Iframe: render when visible, but hidden (opacity-0) until loaded -->
    <iframe
      v-if="isVisible"
      :src="`https://player.twitch.tv/?channel=${props.channel}&parent=${host}&muted=${props.muted !== false}`"
      :class="[
        'absolute inset-0 w-full h-full border-0 transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0',
      ]"
      allowfullscreen
      loading="lazy"
      title="Twitch stream"
      referrerpolicy="strict-origin-when-cross-origin"
      @load="isLoaded = true"
    />
    <!-- Skeleton: stays on top until iframe is fully loaded -->
    <div v-if="!isLoaded" class="absolute inset-0 z-10 transition-opacity duration-300">
      <div class="absolute inset-0 skeleton-shimmer"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-12 h-12 rounded-full bg-twitch/20 flex items-center justify-center">
          <i class="fa-brands fa-twitch text-twitch/40 text-2xl"></i>
        </div>
      </div>
    </div>
  </div>
</template>
