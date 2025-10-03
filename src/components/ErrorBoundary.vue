<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';
import { AnalyticsEvents } from '../utils/analytics';
import * as Sentry from '@sentry/vue';

const hasError = ref(false);
const errorMessage = ref('');
const errorStack = ref('');

// Capture errors from child components
onErrorCaptured((err, instance, info) => {
  hasError.value = true;
  errorMessage.value = err.message || 'An unexpected error occurred';
  errorStack.value = err.stack || '';

  // Track error in analytics
  AnalyticsEvents.errorBoundary(errorMessage.value);

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('[ErrorBoundary] Caught error:', {
      message: err.message,
      stack: err.stack,
      component: instance,
      info,
    });
  }

  // Send to Sentry in production
  if (import.meta.env.PROD) {
    Sentry.captureException(err, {
      contexts: {
        vue: {
          componentName: instance?.$options.name || 'Unknown',
          propsData: instance?.$props,
          lifecycleHook: info,
        },
      },
    });
  }

  // Prevent error from propagating
  return false;
});

function retry() {
  hasError.value = false;
  errorMessage.value = '';
  errorStack.value = '';
  // Force re-render by key change in parent
  window.location.reload();
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
        <a
          href="https://discord.gg/WnxwfMTyBe"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-d"
        >
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

<style scoped>
.error-boundary {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, rgba(var(--dl-rgb), 0.05) 0%, rgba(var(--bg-rgb), 0.95) 100%);
}

.error-content {
  max-width: 600px;
  text-align: center;
  background: var(--grad-card);
  padding: 40px;
  border-radius: 8px;
  border: 1px solid rgba(var(--dl-rgb), 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.error-icon {
  font-size: 64px;
  color: var(--dl);
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.error-content h2 {
  font-family: 'Oswald', sans-serif;
  font-size: 32px;
  color: var(--t);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.error-message {
  color: var(--t2);
  font-size: 16px;
  margin-bottom: 32px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.error-details {
  margin-top: 24px;
  text-align: left;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(var(--mg-rgb), 0.3);
  border-radius: 4px;
  padding: 16px;
}

.error-details summary {
  cursor: pointer;
  color: var(--t2);
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  margin-bottom: 12px;
}

.error-details pre {
  color: var(--t3);
  font-size: 12px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

@media (max-width: 768px) {
  .error-content {
    padding: 32px 24px;
  }

  .error-content h2 {
    font-size: 24px;
  }

  .error-actions {
    flex-direction: column;
  }

  .error-actions .btn {
    width: 100%;
  }
}
</style>
