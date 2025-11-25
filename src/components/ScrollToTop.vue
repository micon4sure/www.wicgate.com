<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isVisible = ref(false);
const SCROLL_THRESHOLD = 400;

function handleScroll() {
  isVisible.value = window.scrollY > SCROLL_THRESHOLD;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

onMounted(() => {
  // SSR guard - only add listener on client
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll);
  }
});
</script>

<template>
  <Transition name="scroll-top">
    <button
      v-show="isVisible"
      type="button"
      aria-label="Scroll to top"
      class="scroll-to-top"
      @click="scrollToTop"
    >
      <i class="fas fa-chevron-up text-teal text-lg transition-colors duration-300"></i>
    </button>
  </Transition>
</template>
