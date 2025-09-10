<script setup lang="ts">
const year = new Date().getFullYear();
</script>
<template>
  <footer>
    <div><span class="status-dot status-indicator always-animate" /> WICGATE Servers Online • © {{ year }} WICGATE Community • Not affiliated with Ubisoft or Massive Entertainment</div>
  </footer>
</template>
<style scoped>
footer{background:var(--bg);padding:40px 20px 20px;border-top:1px solid var(--bd);text-align:center;color:var(--t3);font-size:0.9rem}
.status-dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:5px;background:var(--g)}
</style>
