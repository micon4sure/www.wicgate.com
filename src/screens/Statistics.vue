<script setup lang="ts">
import { computed } from 'vue';
import Leaderboards from '../components/Leaderboards.vue';
import LeaderboardSkeleton from '../components/skeletons/LeaderboardSkeleton.vue';
import type { DataResponse } from '../api-types';

const props = defineProps<{
  data: Partial<DataResponse>;
  loading: boolean;
}>();

// During SSG build or while loading, show placeholder
const isSSR = import.meta.env.SSR;
const showPlaceholder = computed(() => isSSR || props.loading);
</script>
<template>
  <section id="statistics" class="section">
    <div class="container">
      <div class="text-center mb-xl">
        <h2>Statistics</h2>
        <p class="section-lead">Rankings and leaderboards</p>
      </div>

      <!-- SSG/Loading: Render skeleton placeholder -->
      <LeaderboardSkeleton v-if="showPlaceholder" />

      <!-- Runtime: Render live data -->
      <Leaderboards v-else :data="data" />
    </div>
  </section>
</template>
<style scoped>
@media (max-width: 768px) {
  .container :deep(.grid-2) {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .container :deep(.lb-cont) {
    margin-bottom: 0;
  }
}

@media (max-width: 480px) {
  .container :deep(.lb-cont) {
    font-size: 14px;
  }

  .container :deep(.lb-table) {
    font-size: 12px;
  }

  .container :deep(.lb-table th) {
    padding: 8px;
    font-size: 11px;
  }

  .container :deep(.lb-table td) {
    padding: 8px;
    font-size: 12px;
  }

  .container :deep(.tabs) {
    flex-wrap: wrap;
    gap: 8px;
  }

  .container :deep(.tab-btn) {
    font-size: 12px;
    padding: 6px 12px;
  }

  /* Player cell alignment now handled by leaderboards.css globally */
}
</style>
