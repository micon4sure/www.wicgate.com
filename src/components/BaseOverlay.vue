<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, useSlots } from 'vue';
import { useOverlayState } from '../composables/useOverlayState';
import { useViewportMode } from '../composables/useViewportMode';

const props = withDefaults(
  defineProps<{
    title?: string;
    maxWidth?: '2xl' | '4xl' | '5xl';
    useTeleport?: boolean;
    ariaLabelledby?: string;
    contentClass?: string;
  }>(),
  {
    title: '',
    maxWidth: '2xl',
    useTeleport: true,
    ariaLabelledby: 'overlay-title',
    contentClass: 'overlay-content custom-scrollbar',
  }
);

const emit = defineEmits<{
  close: [];
}>();

const slots = useSlots();
const { setOverlayActive } = useOverlayState();
const { isMobileMode } = useViewportMode();

const maxWidthClass = computed(() => {
  const widthMap: Record<string, string> = {
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  };
  return widthMap[props.maxWidth] || 'max-w-2xl';
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

function handleClose() {
  emit('close');
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
  <Teleport v-if="useTeleport" to="body">
    <div class="first-visit-overlay">
      <div class="overlay-backdrop" @click="handleBackdropClick"></div>
      <div
        class="overlay-card"
        :class="maxWidthClass"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="ariaLabelledby"
      >
        <div class="overlay-header">
          <h2 :id="ariaLabelledby" class="slide-title">
            <slot name="header">{{ title }}</slot>
          </h2>
          <button class="overlay-close" title="Close" @click="handleClose">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
        <div :class="contentClass">
          <slot></slot>
        </div>
        <div v-if="slots.actions" class="overlay-actions">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </Teleport>

  <div v-else class="first-visit-overlay">
    <div class="overlay-backdrop" @click="handleBackdropClick"></div>
    <div
      class="overlay-card"
      :class="maxWidthClass"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="ariaLabelledby"
    >
      <div class="overlay-header">
        <h2 :id="ariaLabelledby" class="slide-title">
          <slot name="header">{{ title }}</slot>
        </h2>
        <button class="overlay-close" title="Close" @click="handleClose">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </div>
      <div :class="contentClass">
        <slot></slot>
      </div>
      <div v-if="slots.actions" class="overlay-actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>
