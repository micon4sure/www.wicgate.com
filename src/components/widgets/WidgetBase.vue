<script setup lang="ts">
/**
 * Base Widget Component
 *
 * Provides consistent structure for all dashboard widgets:
 * - Header with icon and title
 * - Body content (slot)
 * - Footer with action label
 * - Click handling for navigation
 */

defineProps<{
  /**
   * Widget title displayed in header
   */
  title: string;

  /**
   * Font Awesome icon class (e.g., 'fa-solid fa-rocket')
   */
  icon: string;

  /**
   * Footer action label (e.g., 'View More')
   */
  action: string;

  /**
   * Additional CSS class for widget container
   */
  widgetClass?: string;

  /**
   * Additional CSS class for icon
   */
  iconClass?: string;
}>();

const emit = defineEmits<{
  click: [];
}>();

function handleClick() {
  emit('click');
}
</script>

<template>
  <div :class="widgetClass" class="widget" @click="handleClick">
    <!-- Widget Header -->
    <div class="widget-header">
      <div :class="[iconClass || 'text-ink']" class="widget-header-icon">
        <i :class="icon" aria-hidden="true"></i>
      </div>
      <h3 class="widget-header-title">
        {{ title }}
      </h3>
    </div>

    <!-- Widget Body (Content Slot) -->
    <div class="widget-body">
      <slot />
    </div>

    <!-- Widget Footer -->
    <div class="widget-footer">
      <span class="widget-footer-action">
        <slot name="action"> {{ action }} <i class="fa-solid fa-arrow-right ml-2"></i> </slot>
      </span>
    </div>
  </div>
</template>
