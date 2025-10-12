<script setup lang="ts">
import WidgetBase from './WidgetBase.vue';

const emit = defineEmits<{
  navigate: [section: string];
}>();

function handleClick() {
  emit('navigate', 'getting-started');
}
</script>

<template>
  <WidgetBase
    title="Quick Start"
    icon="fa-solid fa-rocket"
    action="Install WICGATE"
    widget-class="widget-primary"
    @click="handleClick"
  >
    <template #default>
      <div class="widget-stat-large">Ready in 5 minutes</div>
      <p class="widget-desc">Install WICGATE and join the battlefield</p>
    </template>
    <template #action>
      <i class="fa-solid fa-download text-massgate-red-bright" aria-hidden="true"></i> Install
      WICGATE
    </template>
  </WidgetBase>
</template>
