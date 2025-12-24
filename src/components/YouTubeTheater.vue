<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue';
import { useOverlayState } from '../composables/useOverlayState';
import { useViewportMode } from '../composables/useViewportMode';

const { setOverlayActive } = useOverlayState();
const { isMobileMode } = useViewportMode();

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

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close');
  }
}

function handleBackdropClick() {
  if (isMobileMode.value) {
    emit('close');
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  setOverlayActive(true);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  setOverlayActive(false);
});
</script>

<template>
  <Teleport to="body">
    <div class="first-visit-overlay">
      <div class="overlay-backdrop" @click="handleBackdropClick"></div>
      <div
        class="overlay-card youtube-theater"
        role="dialog"
        aria-modal="true"
        aria-labelledby="youtube-theater-title"
      >
        <div class="overlay-header">
          <h2 id="youtube-theater-title" class="slide-title truncate">{{ title }}</h2>
          <button class="overlay-close" title="Close" @click="emit('close')">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
        <div class="bg-black">
          <div class="relative w-full pb-[56.25%]">
            <iframe
              :src="embedUrl"
              class="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              :title="title"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
