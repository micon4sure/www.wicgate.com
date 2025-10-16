<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{ channel: string; muted?: boolean }>();

const isVisible = ref(false);
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
    <iframe
      v-if="isVisible"
      :src="`https://player.twitch.tv/?channel=${props.channel}&parent=${host}&muted=${props.muted !== false}`"
      class="absolute inset-0 w-full h-full border-0"
      allowfullscreen
      loading="lazy"
      title="Twitch stream"
      referrerpolicy="strict-origin-when-cross-origin"
    />
    <div v-else class="absolute inset-0 flex items-center justify-center text-muted text-[0.85rem]">
      Loading…
    </div>
  </div>
</template>
