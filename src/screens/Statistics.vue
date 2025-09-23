<script setup lang="ts">
import Leaderboards from '../components/Leaderboards.vue';
import { useAppDataStore } from '../stores/appDataStore';
const store = useAppDataStore();
const { data } = store;

// Statistics is used as a component, store should already be initialized
// but check just in case
if (!store.isInitialized.value) {
  store.init();
}
</script>
<template>
  <section id="statistics" class="section">
    <div class="container">
      <div class="text-center mb-xl">
        <h2>Statistics</h2>
        <p class="section-lead">Rankings and leaderboards</p>
      </div>
      <Leaderboards :data="data" />
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
