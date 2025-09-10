<script setup lang="ts">
import Leaderboards from '../components/Leaderboards.vue';
import { useAppData } from '../composables/useAppData';
const { data } = useAppData();
</script>
<template>
  <section id="statistics" class="sec">
    <div class="c">
      <div class="tc mb6"><h2>Statistics</h2><p style="font-size:1.125rem;color:var(--t2);max-width:600px;margin:0 auto">Rankings and leaderboards</p></div>
      <Leaderboards :data="data" />
    </div>
  </section>
</template>
<style scoped></style>
