<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps<{
  error: NuxtError;
}>();

const handleError = () => clearError({ redirect: '/' });
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-5 bg-texture-dark">
    <div
      class="w-full max-w-md bg-gradient-to-br from-texture-panel/95 to-texture-dark/95 border-2 border-massgate-red/85 rounded-none p-8 shadow-massgate-glow text-center"
    >
      <!-- Error Code -->
      <h1
        class="font-military text-6xl font-bold text-massgate-red-bright uppercase tracking-[2px] mb-4"
        style="
          text-shadow:
            0 0 20px rgba(229, 53, 53, 0.5),
            0 0 40px rgba(198, 40, 40, 0.3);
        "
      >
        {{ error.statusCode || 'Error' }}
      </h1>

      <!-- Error Message -->
      <p class="font-body text-lg text-t-secondary mb-8">
        {{ error.message || 'An unexpected error occurred' }}
      </p>

      <!-- Back to Home -->
      <button
        class="bg-gradient-to-br from-massgate-red to-massgate-red-dark text-white font-military text-lg uppercase tracking-wider py-3 px-8 border-2 border-massgate-red-bright transition-all duration-300 hover:shadow-massgate-glow hover:-translate-y-0.5 active:translate-y-0"
        @click="handleError"
      >
        <i class="fa-solid fa-arrow-left mr-2"></i>
        Back to Home
      </button>
    </div>
  </div>
</template>
