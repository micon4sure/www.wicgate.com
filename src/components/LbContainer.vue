<script setup lang="ts">
const props = defineProps<{ title: string; subtitle?: string }>();
</script>
<template>
  <div class="lb-cont">
    <div class="lb-hdr">
      <h3>{{ props.title }}</h3>
      <p v-if="props.subtitle" class="leaderboard-subtitle text-sm text-dim">
        {{ props.subtitle }}
      </p>
    </div>
    <slot />
  </div>
</template>
<style scoped>
/* purely structural wrapper; inherits global leaderboard styling */
</style>
