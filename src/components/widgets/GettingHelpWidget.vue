<script setup lang="ts">
import WidgetBase from './WidgetBase.vue';

const emit = defineEmits<{
  navigate: [section: string];
}>();

function handleClick() {
  emit('navigate', 'faq');
}
</script>

<template>
  <WidgetBase
    title="Getting Help"
    icon="fa-solid fa-circle-question"
    action="View FAQ"
    @click="handleClick"
  >
    <div class="help-list">
      <div class="help-item">
        <i class="fa-solid fa-book" aria-hidden="true"></i>
        <span>Installation Guide</span>
      </div>
      <div class="help-item">
        <i class="fa-solid fa-wrench" aria-hidden="true"></i>
        <span>Troubleshooting</span>
      </div>
      <div class="help-item">
        <i class="fa-brands fa-discord" aria-hidden="true"></i>
        <span>Community Support</span>
      </div>
    </div>
  </WidgetBase>
</template>
