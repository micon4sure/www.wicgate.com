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
      class="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center bg-gradient-to-b from-graphite-light to-graphite border-2 border-teal/50 rounded-none cursor-pointer transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.4),0_0_15px_rgba(0,217,255,0.2)] hover:border-soviet/70 hover:shadow-[0_6px_20px_rgba(0,0,0,0.5),0_0_25px_rgba(255,102,0,0.4)] hover:-translate-y-1 hover:scale-105 active:scale-100 active:translate-y-0"
      @click="scrollToTop"
    >
      <i class="fas fa-chevron-up text-teal text-lg transition-colors duration-300"></i>
    </button>
  </Transition>
</template>
