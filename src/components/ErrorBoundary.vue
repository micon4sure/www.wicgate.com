<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';
import { DISCORD_URL } from '../constants';

const hasError = ref(false);
const errorMessage = ref('');
const errorStack = ref('');

// Capture errors from child components
onErrorCaptured((err, instance, info) => {
  hasError.value = true;
  errorMessage.value = err.message || 'An unexpected error occurred';
  errorStack.value = err.stack || '';

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('[ErrorBoundary] Caught error:', {
      message: err.message,
      stack: err.stack,
      component: instance,
      info,
    });
  }

  // Prevent error from propagating
  return false;
});

function retry() {
  hasError.value = false;
  errorMessage.value = '';
  errorStack.value = '';
  // Force full page reload to reset all state (SSR guard for consistency)
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}
</script>

<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <div class="error-icon">
        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
      </div>
      <h2>Something went wrong</h2>
      <p class="error-message">{{ errorMessage }}</p>
      <div class="error-actions">
        <button class="btn btn-p" @click="retry">
          <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
          Reload Page
        </button>
        <a :href="DISCORD_URL" target="_blank" rel="noopener noreferrer" class="btn btn-d">
          <i class="fa-brands fa-discord" aria-hidden="true"></i>
          Get Help on Discord
        </a>
      </div>
      <details v-if="import.meta.env.DEV && errorStack" class="error-details">
        <summary>Technical Details (Dev Mode)</summary>
        <pre>{{ errorStack }}</pre>
      </details>
    </div>
  </div>
  <slot v-else />
</template>
