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
  <div class="widget" :class="widgetClass" @click="handleClick">
    <div class="widget-header">
      <div class="widget-icon" :class="iconClass">
        <i :class="icon" aria-hidden="true"></i>
      </div>
      <h3>{{ title }}</h3>
    </div>
    <div class="widget-body">
      <slot />
    </div>
    <div class="widget-footer">
      <span class="widget-action">
        <slot name="action"> {{ action }} <i class="fa-solid fa-arrow-right"></i> </slot>
      </span>
    </div>
  </div>
</template>

<style scoped>
.widget {
  cursor: pointer;
}
</style>
