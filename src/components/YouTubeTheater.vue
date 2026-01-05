<script setup lang="ts">
import { computed } from 'vue';
import BaseOverlay from './BaseOverlay.vue';

const props = defineProps<{
  videoId: string;
  title: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const embedUrl = computed(() => {
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    modestbranding: '1',
  });
  return `https://www.youtube-nocookie.com/embed/${props.videoId}?${params}`;
});
</script>

<template>
  <BaseOverlay
    :title="title"
    max-width="5xl"
    aria-labelledby="youtube-theater-title"
    content-class="bg-black"
    @close="emit('close')"
  >
    <template #header>
      <span class="truncate text-base xs:text-lg md:text-xl">{{ title }}</span>
    </template>

    <div class="relative w-full pb-[56.25%]">
      <iframe
        :src="embedUrl"
        class="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        :title="title"
      />
    </div>
  </BaseOverlay>
</template>
