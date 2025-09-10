<script setup lang="ts">
import Leaderboards from '../components/Leaderboards.vue';
import { useAppData } from '../composables/useAppData';
const { data } = useAppData();
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
<style scoped></style>
