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
    <div
      class="flex items-center gap-3 py-5 px-6 pb-4 border-b border-mg/30 max-[900px]:py-4 max-[900px]:px-5 max-[900px]:pb-3 max-[480px]:py-3.5 max-[480px]:px-4 max-[480px]:pb-2.5 max-[480px]:gap-2.5"
    >
      <div
        :class="[iconClass || 'text-ink']"
        class="w-10 h-10 rounded-full bg-gradient-to-b from-massgate-orange-light to-massgate-orange border-2 border-massgate-orange flex items-center justify-center text-xl flex-shrink-0 max-[480px]:w-9 max-[480px]:h-9 max-[480px]:text-lg"
      >
        <i :class="icon" aria-hidden="true"></i>
      </div>
      <h3
        class="m-0 text-xl font-bold text-t font-military uppercase tracking-[0.5px] max-[768px]:text-lg max-[480px]:text-base"
      >
        {{ title }}
      </h3>
    </div>

    <!-- Widget Body (Content Slot) -->
    <div
      class="flex-1 py-5 px-6 flex flex-col gap-4 max-[900px]:py-4 max-[900px]:px-5 max-[480px]:py-3.5 max-[480px]:px-4 max-[480px]:gap-3"
    >
      <slot />
    </div>

    <!-- Widget Footer -->
    <div
      class="py-4 px-6 border-t border-mg/30 bg-gradient-to-b from-mg/10 to-mg-dark/20 max-[900px]:py-3 max-[900px]:px-5 max-[480px]:py-2.5 max-[480px]:px-4"
    >
      <span
        class="flex items-center justify-between text-battlefield-teal font-military text-sm font-semibold uppercase tracking-[0.5px] transition-all duration-200 group-hover:text-battlefield-cyan group-hover:translate-x-1"
      >
        <slot name="action"> {{ action }} <i class="fa-solid fa-arrow-right ml-2"></i> </slot>
      </span>
    </div>
  </div>
</template>
